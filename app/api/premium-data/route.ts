import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http, Address, Hash } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { PaymentProof } from '@/lib/x402-client'

// Premium data that requires payment
const PREMIUM_DATA = {
  advancedHealthMetrics: [
    {
      id: 'ahm_001',
      title: 'Global Disease Burden Analytics',
      description: 'Comprehensive analysis of disease burden across 195 countries with predictive modeling',
      data: {
        cardiovascularDiseases: {
          prevalence: '523M globally',
          mortalityRate: '17.9M deaths/year',
          trend: '+2.1% annually',
          topRiskFactors: ['hypertension', 'diabetes', 'smoking']
        },
        mentalHealth: {
          prevalence: '792M globally',
          economiImpact: '$1.03T annually',
          accessToTreatment: '27% globally',
          emergingTrends: ['digital therapy adoption', 'workplace mental health']
        }
      },
      insights: [
        'Sub-Saharan Africa shows 34% higher cardiovascular risk due to urbanization',
        'Mental health investments yield 4:1 ROI in productivity gains',
        'AI-driven early detection could prevent 2.3M deaths annually'
      ]
    }
  ],
  exclusiveResearch: [
    {
      id: 'er_001',
      title: 'Emerging Infectious Disease Prediction Model',
      description: 'Machine learning model predicting outbreak probability with 94% accuracy',
      methodology: 'Combined climate data, population density, and pathogen evolution patterns',
      keyFindings: {
        highRiskRegions: ['Southeast Asia', 'Central Africa', 'Amazon Basin'],
        timeframe: 'Next 18-24 months',
        confidenceLevel: '94.2%'
      },
      preventionStrategies: [
        'Enhanced surveillance in high-risk areas',
        'Rapid response team deployment protocols',
        'Cross-border data sharing agreements'
      ]
    }
  ]
}

// Payment verification settings
const REQUIRED_PAYMENT_AMOUNT = '1.0' // 1 USDC
const PAYMENT_RECIPIENT = process.env.PAYMENT_RECIPIENT_ADDRESS as Address || '0x742d35Cc8b4a6480D2d5f27b5BF0b8d4C2a71B79'

export async function GET(request: NextRequest) {
  try {
    // Check for payment proof in headers
    const paymentProofHeader = request.headers.get('X-Payment-Proof')
    
    if (!paymentProofHeader) {
      // Return 402 Payment Required with payment details
      return NextResponse.json(
        {
          paymentAddress: PAYMENT_RECIPIENT,
          paymentAmount: REQUIRED_PAYMENT_AMOUNT,
          chainId: base.id,
          currency: 'USDC',
          description: 'Payment required to access premium health data and research insights'
        },
        { status: 402 }
      )
    }

    // Parse and verify payment proof
    let paymentProof: PaymentProof
    try {
      paymentProof = JSON.parse(paymentProofHeader)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid payment proof format' },
        { status: 400 }
      )
    }

    // Verify payment on blockchain
    const isValidPayment = await verifyPaymentOnChain(paymentProof)
    
    if (!isValidPayment) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 403 }
      )
    }

    // Return premium data
    return NextResponse.json({
      success: true,
      data: PREMIUM_DATA,
      paymentVerified: true,
      accessGrantedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Premium data API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function verifyPaymentOnChain(paymentProof: PaymentProof): Promise<boolean> {
  try {
    // Create public client for the appropriate chain
    const chain = paymentProof.chainId === base.id ? base : baseSepolia
    const publicClient = createPublicClient({
      chain,
      transport: http()
    })

    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({
      hash: paymentProof.txHash as Hash
    })

    // Verify transaction succeeded
    if (receipt.status !== 'success') {
      return false
    }

    // Verify payment amount and recipient
    // Note: In a production system, you'd parse the transfer event logs
    // to verify the exact amount and recipient
    const isRecentPayment = Date.now() - paymentProof.timestamp < 3600000 // 1 hour
    const isCorrectRecipient = paymentProof.to.toLowerCase() === PAYMENT_RECIPIENT.toLowerCase()
    const isCorrectAmount = paymentProof.amount === REQUIRED_PAYMENT_AMOUNT

    return isRecentPayment && isCorrectRecipient && isCorrectAmount

  } catch (error) {
    console.error('Payment verification error:', error)
    return false
  }
}