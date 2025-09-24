import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'HealthConnect',
      appLogoUrl: 'https://3979010314a14828979bfa06b799a052-h4lx.vercel.app/image.png',
    }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo' }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
})

// USDC contract addresses on Base networks
export const USDC_ADDRESSES = {
  [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  [baseSepolia.id]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
} as const

// Payment amount in USDC (6 decimals)
export const PAYMENT_AMOUNT = BigInt(1000000) // 1 USDC = 1,000,000 smallest units

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}