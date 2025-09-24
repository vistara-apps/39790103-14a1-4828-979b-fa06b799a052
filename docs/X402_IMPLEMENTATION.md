# X402 Payment Flow Implementation

This document describes the implementation of the X402 payment protocol for HealthConnect, enabling seamless USDC payments on the Base network.

## Overview

The X402 payment flow allows the application to handle HTTP 402 "Payment Required" responses by automatically processing cryptocurrency payments through connected wallets. This implementation specifically supports USDC payments on the Base network.

## Architecture

### Core Components

1. **WagmiProvider** (`app/providers.tsx`): Manages wallet connections and blockchain interactions
2. **X402AxiosClient** (`lib/x402-axios.ts`): Handles HTTP 402 responses and payment processing
3. **useX402Payment Hook** (`lib/hooks/useX402Payment.ts`): React hook for payment operations
4. **PaymentFlow Component** (`components/PaymentFlow.tsx`): User interface for payment flows
5. **WalletConnect Component** (`components/WalletConnect.tsx`): Wallet connection interface

### Key Features

- **Automatic Payment Processing**: Intercepts 402 responses and initiates payments
- **USDC on Base Support**: Native integration with USDC on Base network
- **Transaction Monitoring**: Real-time status tracking and confirmations
- **Error Handling**: Comprehensive error handling for various failure scenarios
- **Multi-Wallet Support**: Works with Coinbase Wallet, MetaMask, and WalletConnect

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# API Base URL for payment endpoints
NEXT_PUBLIC_API_BASE_URL=https://api.healthconnect.app

# Default recipient address for payments
NEXT_PUBLIC_DEFAULT_RECIPIENT_ADDRESS=0x742d35Cc6635C0532925a3b8D50f142a9dF8e5d6
```

### Wagmi Configuration (`lib/wagmi-config.ts`)

The configuration supports:
- **Base Mainnet**: Production USDC transactions
- **Base Sepolia**: Testnet for development
- **Multiple Connectors**: Coinbase Wallet, MetaMask, WalletConnect

## Usage

### Basic Payment Flow

```typescript
import { useX402Payment } from '@/lib/hooks/useX402Payment';

function PaymentComponent() {
  const {
    executePayment,
    isLoading,
    error,
    usdcBalance,
    isConnected
  } = useX402Payment();

  const handlePayment = async () => {
    try {
      const response = await executePayment({
        amount: '10.00',
        recipient: '0x742d35Cc6635C0532925a3b8D50f142a9dF8e5d6',
        paymentId: 'payment-123',
        description: 'Premium Feature Access'
      });
      
      console.log('Payment initiated:', response.transactionHash);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div>
      <p>Balance: {usdcBalance} USDC</p>
      <button onClick={handlePayment} disabled={!isConnected || isLoading}>
        Pay 10 USDC
      </button>
    </div>
  );
}
```

### X402 HTTP Interceptor

The X402AxiosClient automatically handles 402 responses:

```typescript
import { x402Client } from '@/lib/x402-axios';

// This request will automatically handle 402 payment requirements
const response = await x402Client.get('/premium-endpoint');
```

## Payment Protocol

### X402 Response Format

When a server returns a 402 status, it should include payment information in the `payment-required` header:

```json
{
  "amount": "10.00",
  "recipient": "0x742d35Cc6635C0532925a3b8D50f142a9dF8e5d6",
  "paymentId": "unique-payment-id",
  "description": "Premium Feature Access"
}
```

### Payment Proof

After successful payment, the client includes proof in subsequent requests:

```json
{
  "transactionHash": "0x...",
  "status": "pending",
  "amount": "10.00",
  "recipient": "0x742d35Cc6635C0532925a3b8D50f142a9dF8e5d6",
  "paymentId": "unique-payment-id"
}
```

## USDC on Base Integration

### Contract Details

- **Contract Address**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Network**: Base (Chain ID: 8453)
- **Decimals**: 6
- **Symbol**: USDC

### Transaction Flow

1. **Amount Conversion**: Convert human-readable amounts to wei (6 decimals for USDC)
2. **Contract Interaction**: Call USDC `transfer` function
3. **Transaction Submission**: Submit to Base network via connected wallet
4. **Confirmation Tracking**: Monitor transaction status on-chain

## Error Handling

### Common Error Scenarios

1. **Wallet Not Connected**: Prompt user to connect wallet
2. **Insufficient Balance**: Display balance and required amount
3. **Network Issues**: Retry mechanisms and user feedback
4. **Transaction Failures**: Parse error messages and provide guidance
5. **Invalid Addresses**: Validate recipient addresses before submission

### Error Types

```typescript
interface PaymentError {
  code: 'WALLET_NOT_CONNECTED' | 'INSUFFICIENT_BALANCE' | 'PAYMENT_FAILED';
  message: string;
  details?: any;
}
```

## Testing

### Test Suite

The application includes comprehensive testing utilities accessible via the test tube icon in the header:

1. **USDC Contract Verification**: Tests contract name, symbol, decimals
2. **Balance Retrieval**: Compares different balance query methods
3. **Small Payment Test**: Executes 0.01 USDC test transaction
4. **Error Handling Test**: Validates error scenarios
5. **Transaction Status**: Checks payment confirmation status

### Manual Testing

1. Connect a wallet with USDC on Base
2. Navigate to the premium features section
3. Attempt to purchase a feature
4. Verify the payment flow completes successfully
5. Check transaction on BaseScan

## Security Considerations

### Best Practices

1. **Address Validation**: Always validate recipient addresses
2. **Amount Verification**: Display clear amount information to users
3. **Transaction Confirmation**: Wait for blockchain confirmations
4. **Error Boundaries**: Implement comprehensive error handling
5. **Rate Limiting**: Prevent rapid repeated transactions

### User Safety

- Clear payment confirmation dialogs
- Balance checks before transactions
- Transaction status feedback
- Error message clarity
- Secure wallet integration

## Performance Optimization

### Optimization Strategies

1. **Parallel Queries**: Execute balance and contract queries simultaneously
2. **Caching**: Cache wallet and contract information
3. **Lazy Loading**: Load payment components only when needed
4. **Background Processing**: Monitor transactions without blocking UI

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] WalletConnect project ID set
- [ ] Recipient addresses verified
- [ ] Network configuration tested
- [ ] Error handling verified
- [ ] Payment flows tested end-to-end

### Monitoring

Monitor the following metrics in production:
- Payment success rate
- Transaction confirmation times
- Error rates by type
- User wallet connection patterns
- USDC balance distribution

## Support and Troubleshooting

### Common Issues

1. **MetaMask Warnings**: The MetaMask SDK warnings in build output are non-critical
2. **Balance Display**: Ensure wallet is connected to Base network
3. **Transaction Delays**: Base network congestion may cause delays
4. **Wallet Switching**: Users may need to manually switch to Base network

### Debug Information

Enable debug mode by accessing the test utilities through the header test icon. This provides:
- Connection status details
- Balance verification across methods
- Contract interaction testing
- Error scenario simulation

## Future Enhancements

### Planned Features

1. **Multi-Token Support**: Support for other ERC-20 tokens
2. **Gas Estimation**: Dynamic gas fee calculation
3. **Subscription Management**: Recurring payment handling
4. **Payment History**: Transaction history and receipt generation
5. **Advanced Error Recovery**: Automatic retry mechanisms

### Integration Opportunities

- Integration with other Base ecosystem projects
- Cross-chain payment support
- Fiat on-ramp integration
- Payment analytics dashboard