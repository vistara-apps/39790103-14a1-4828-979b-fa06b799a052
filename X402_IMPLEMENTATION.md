# X402 Payment Flow Implementation

This document describes the complete X402 payment flow implementation for HealthConnect.

## Overview

The X402 payment protocol enables automatic USDC payments on the Base network for premium content access. When a user attempts to access premium content, the system automatically detects the payment requirement, prompts for wallet connection, processes the payment, and grants access upon successful transaction confirmation.

## Architecture

### Core Components

1. **Wagmi Configuration** (`lib/wagmi-config.ts`)
   - Configures wallet connection for Base network
   - Uses Coinbase Wallet connector
   - Enables seamless Web3 integration

2. **X402 Client** (`lib/x402-client.ts`)
   - Handles HTTP requests with automatic payment processing
   - Detects 402 Payment Required responses
   - Executes USDC transfers and retries requests with payment proof
   - Manages transaction confirmations

3. **Premium Data API** (`app/api/premium-data/route.ts`)
   - Protected endpoint requiring USDC payment
   - Returns 402 with payment details when no valid proof provided
   - Validates payment proofs on-chain
   - Serves premium health data upon successful verification

4. **Payment Modal** (`components/PaymentModal.tsx`)
   - User interface for wallet connection and payment
   - Real-time payment status updates
   - Error handling and user feedback

5. **Updated Providers** (`app/providers.tsx`)
   - Replaced MiniKit with Wagmi + React Query
   - Provides Web3 context throughout the application

## Payment Flow

### 1. Initial Request
```
User -> API Request -> 402 Payment Required
```

The API endpoint returns a 402 status with payment details:
```json
{
  "to": "0x742d35Cc6634C0532925a3b8D45DB7F99E1c2c99",
  "amount": "5.00",
  "token": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "chainId": 8453
}
```

### 2. Payment Processing
```
X402 Client -> Check Allowance -> Approve (if needed) -> Transfer USDC -> Wait for Confirmation
```

The X402 client automatically:
- Checks current USDC allowance
- Requests approval if insufficient
- Executes the USDC transfer
- Waits for transaction confirmation

### 3. Request Retry
```
X402 Client -> Retry Request with Payment Proof -> API Validates -> Returns Premium Data
```

After successful payment, the client retries the original request with proof:
```json
{
  "txHash": "0xabc123...",
  "amount": "5.00",
  "token": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  "from": "0xuser123...",
  "to": "0x742d35Cc6634C0532925a3b8D45DB7F99E1c2c99",
  "chainId": 8453
}
```

## Network Configuration

- **Blockchain**: Base (Chain ID: 8453)
- **Token**: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
- **Price**: 5 USDC per premium access
- **Recipient**: 0x742d35Cc6634C0532925a3b8D45DB7F99E1c2c99

## Security Features

### Payment Verification
- On-chain transaction verification
- Amount validation (minimum 5 USDC)
- Token contract validation (USDC only)
- Chain ID verification (Base only)
- Recipient address validation

### Error Handling
- Invalid payment proof rejection
- Malformed request handling
- Transaction failure recovery
- Network error management

## Testing

### Automated Tests
Run the test suite:
```bash
node test-x402.js
```

The test verifies:
- ✅ 402 Payment Required responses
- ✅ Payment detail formatting
- ✅ Invalid payment proof rejection
- ✅ Malformed request handling

### Manual Testing
1. Start the development server: `npm run dev`
2. Navigate to the dashboard
3. Click "Unlock Premium Content"
4. Connect your wallet (Coinbase Wallet recommended)
5. Approve and confirm the USDC payment
6. Verify premium content is displayed

## Integration Points

### Frontend Integration
```typescript
import { x402Client } from '@/lib/x402-client'
import { useWalletClient } from 'wagmi'

// Set wallet client
const { data: walletClient } = useWalletClient()
x402Client.setWalletClient(walletClient)

// Make protected request
const response = await x402Client.get('/api/premium-data')
```

### API Protection
```typescript
// Protect any endpoint with X402
export async function GET(request: NextRequest) {
  const paymentProof = request.headers.get('X-Payment-Proof')
  
  if (!paymentProof) {
    return new NextResponse('Payment Required', {
      status: 402,
      headers: { 'X-Payment-Required': JSON.stringify(paymentDetails) }
    })
  }
  
  // Validate payment and serve content
}
```

## Premium Content

The premium health data includes:
- **Specialist Recommendations**: Curated list of healthcare providers
- **Advanced Analytics**: Risk factor analysis and health trends
- **Personalized Plans**: Custom diet, exercise, and wellness recommendations

## Error Scenarios

### Common Errors and Solutions

1. **Wallet Not Connected**
   - Error: "Wallet client not set"
   - Solution: Connect wallet before attempting payment

2. **Insufficient USDC Balance**
   - Error: Transaction fails during transfer
   - Solution: Ensure sufficient USDC balance (>5 USDC + gas)

3. **Network Mismatch**
   - Error: "Payment required on unsupported chain"
   - Solution: Switch to Base network in wallet

4. **Transaction Failure**
   - Error: "Transaction failed"
   - Solution: Check gas fees and network congestion

## Deployment Considerations

### Environment Variables
```env
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
PAYMENT_RECIPIENT_ADDRESS=0x742d35Cc6634C0532925a3b8D45DB7F99E1c2c99
```

### Production Setup
1. Configure proper RPC endpoints
2. Set up monitoring for payment transactions
3. Implement payment proof caching to prevent replay attacks
4. Add rate limiting for API endpoints
5. Set up alerts for payment failures

## Future Enhancements

- [ ] Multiple payment token support
- [ ] Subscription-based payments
- [ ] Payment proof caching/database
- [ ] Analytics dashboard for payments
- [ ] Automated refund system
- [ ] Multi-chain support

## Conclusion

The X402 implementation provides a seamless, secure payment flow for premium content access. Users can unlock premium health insights with a simple wallet connection and USDC payment, while the system automatically handles all payment processing and verification.