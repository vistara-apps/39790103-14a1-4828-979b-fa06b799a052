import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, isAddress } from 'viem'
import { base } from 'viem/chains'

// USDC contract address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const PAYMENT_RECIPIENT = '0x742d35Cc6634C0532925a3b8D45DB7F99E1c2c99' // Replace with actual recipient
const REQUIRED_PAYMENT = '5.00' // 5 USDC

interface PaymentProof {
  txHash: string
  amount: string
  token: string
  from: string
  to: string
  chainId: number
}

// Premium health data that requires payment
const PREMIUM_DATA = {
  specialistRecommendations: [
    {
      id: 'spec-1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.9,
      availability: 'Next week',
      cost: '$200-300',
      location: 'New York Medical Center'
    },
    {
      id: 'spec-2', 
      name: 'Dr. Michael Chen',
      specialty: 'Endocrinology',
      rating: 4.8,
      availability: 'This week',
      cost: '$150-250',
      location: 'Downtown Health Clinic'
    }
  ],
  advancedAnalytics: {
    riskFactors: [
      { factor: 'Cardiovascular Risk', level: 'Low', score: 15 },
      { factor: 'Diabetes Risk', level: 'Moderate', score: 45 },
      { factor: 'Mental Health', level: 'Good', score: 20 }
    ],
    trends: {
      bloodPressure: 'Improving over last 3 months',
      weight: 'Stable within healthy range',
      activity: 'Above average for age group'
    }
  },
  personalizedPlan: {
    diet: 'Mediterranean diet with reduced sodium',
    exercise: '150 minutes moderate cardio + 2 strength sessions weekly',
    supplements: ['Vitamin D3', 'Omega-3', 'Magnesium'],
    checkups: 'Quarterly blood work, annual comprehensive exam'
  }
}

async function verifyPayment(paymentProof: PaymentProof): Promise<boolean> {
  try {
    // Verify the payment proof structure
    if (!paymentProof.txHash || !paymentProof.amount || !paymentProof.token) {
      return false
    }

    // Check if the payment is for the correct token (USDC)
    if (paymentProof.token.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
      return false
    }

    // Check if the payment is for the correct chain (Base)
    if (paymentProof.chainId !== base.id) {
      return false
    }

    // Check if the payment amount is sufficient
    const paidAmount = parseFloat(paymentProof.amount)
    const requiredAmount = parseFloat(REQUIRED_PAYMENT)
    if (paidAmount < requiredAmount) {
      return false
    }

    // Check if the payment recipient is correct
    if (paymentProof.to.toLowerCase() !== PAYMENT_RECIPIENT.toLowerCase()) {
      return false
    }

    // Verify the transaction on-chain
    const publicClient = createPublicClient({
      chain: base,
      transport: http()
    })

    const receipt = await publicClient.getTransactionReceipt({
      hash: paymentProof.txHash as `0x${string}`
    })

    // Verify transaction was successful
    if (receipt.status !== 'success') {
      return false
    }

    // Additional verification could include:
    // - Check transaction logs for USDC transfer events
    // - Verify the transaction is recent (within last hour)
    // - Check if this payment proof hasn't been used before (store in database)

    return true
  } catch (error) {
    console.error('Payment verification failed:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    const paymentProofHeader = request.headers.get('X-Payment-Proof')
    
    if (!paymentProofHeader) {
      // No payment proof provided, return 402 Payment Required
      return new NextResponse('Payment Required', {
        status: 402,
        headers: {
          'X-Payment-Required': JSON.stringify({
            to: PAYMENT_RECIPIENT,
            amount: REQUIRED_PAYMENT,
            token: USDC_ADDRESS,
            chainId: base.id
          })
        }
      })
    }

    // Parse payment proof
    let paymentProof: PaymentProof
    try {
      paymentProof = JSON.parse(paymentProofHeader)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid payment proof format' },
        { status: 400 }
      )
    }

    // Verify the payment
    const isValid = await verifyPayment(paymentProof)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment proof' },
        { status: 403 }
      )
    }

    // Payment verified, return premium data
    return NextResponse.json({
      success: true,
      data: PREMIUM_DATA,
      paymentVerified: true,
      paymentDetails: {
        amount: paymentProof.amount,
        txHash: paymentProof.txHash
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}