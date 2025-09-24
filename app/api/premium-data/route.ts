import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const paymentProof = request.headers.get('x-payment-proof');
  
  // If no payment proof, return 402 Payment Required
  if (!paymentProof) {
    const paymentRequest = {
      amount: '10.00',
      currency: 'USDC',
      recipient: '0x742A4d0aEE69C00FF8F03085566F3E4B2ad68E21',
      description: 'Premium Health Data Access',
      metadata: {
        service: 'health-data-premium',
        duration: '1-month'
      }
    };

    return NextResponse.json(
      { 
        error: 'Payment required to access premium health data',
        paymentRequired: true 
      },
      { 
        status: 402,
        headers: {
          'X-Payment-Required': JSON.stringify(paymentRequest),
          'Content-Type': 'application/json'
        }
      }
    );
  }

  // Validate payment proof (in a real app, you'd verify the transaction on-chain)
  if (!isValidTransactionHash(paymentProof)) {
    return NextResponse.json(
      { error: 'Invalid payment proof' },
      { status: 400 }
    );
  }

  // Return premium data
  return NextResponse.json({
    success: true,
    data: {
      premiumHealthData: {
        globalHealthMetrics: {
          maternalMortality: {
            global: 211,
            developed: 12,
            developing: 239,
            unit: 'per 100,000 live births'
          },
          childMortality: {
            under5: 38,
            neonatal: 17,
            unit: 'per 1,000 live births'
          },
          lifeExpectancy: {
            global: 72.8,
            male: 70.4,
            female: 75.0,
            unit: 'years'
          }
        },
        diseaseOutbreaks: [
          {
            disease: 'COVID-19',
            location: 'Global',
            status: 'Ongoing',
            cases: 700000000,
            deaths: 6900000
          },
          {
            disease: 'Mpox',
            location: 'Africa',
            status: 'Active',
            cases: 35000,
            deaths: 1000
          }
        ],
        vaccinationRates: {
          measles: 86,
          dtp3: 84,
          polio: 86,
          unit: 'percentage coverage'
        },
        accessDate: new Date().toISOString(),
        paymentHash: paymentProof
      }
    }
  });
}

function isValidTransactionHash(hash: string): boolean {
  // Basic validation for Ethereum transaction hash format
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}