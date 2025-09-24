'use client'

import { useState } from 'react'
import { useWalletClient, useAccount, useConnect, useDisconnect } from 'wagmi'
import { coinbaseWallet } from 'wagmi/connectors'
import { x402Client } from '../lib/x402-client'
import { X, Wallet, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (data: any) => void
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'connecting' | 'paying' | 'success' | 'error'>('idle')
  
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  const handleConnect = async () => {
    try {
      setPaymentStatus('connecting')
      setError(null)
      await connect({ connector: coinbaseWallet() })
    } catch (err) {
      setError('Failed to connect wallet')
      setPaymentStatus('error')
    }
  }

  const handlePayment = async () => {
    if (!walletClient || !isConnected) {
      setError('Please connect your wallet first')
      return
    }

    try {
      setIsLoading(true)
      setPaymentStatus('paying')
      setError(null)

      // Set the wallet client in x402Client
      x402Client.setWalletClient(walletClient)

      // Make request to premium data endpoint
      // This will trigger the X402 payment flow automatically
      const response = await x402Client.get('/api/premium-data')
      
      setPaymentStatus('success')
      onSuccess(response.data)
      
      // Close modal after a brief delay to show success state
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (err: any) {
      console.error('Payment failed:', err)
      setError(err.response?.data?.error || err.message || 'Payment failed')
      setPaymentStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'connecting':
        return <Wallet className="w-8 h-8 text-blue-500 animate-pulse" />
      case 'paying':
        return <CreditCard className="w-8 h-8 text-yellow-500 animate-pulse" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />
      default:
        return <CreditCard className="w-8 h-8 text-gray-500" />
    }
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'connecting':
        return 'Connecting to wallet...'
      case 'paying':
        return 'Processing payment...'
      case 'success':
        return 'Payment successful!'
      case 'error':
        return error || 'Payment failed'
      default:
        return 'Access premium health insights for 5 USDC'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Premium Health Data
          </h2>
          <p className="text-gray-600">
            {getStatusMessage()}
          </p>
        </div>

        {paymentStatus === 'idle' && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What you'll get:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Specialist recommendations</li>
                <li>• Advanced health analytics</li>
                <li>• Personalized wellness plan</li>
                <li>• Risk factor analysis</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Price:</span>
                <span className="font-bold text-gray-900">5 USDC</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-gray-700">Network:</span>
                <span className="text-gray-900">Base</span>
              </div>
            </div>

            {!isConnected ? (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Connect Wallet
              </button>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 text-center">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  {isLoading ? 'Processing...' : 'Pay 5 USDC'}
                </button>
                <button
                  onClick={() => disconnect()}
                  disabled={isLoading}
                  className="w-full text-gray-600 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        )}

        {(paymentStatus === 'connecting' || paymentStatus === 'paying') && (
          <div className="text-center py-8">
            <div className="text-gray-600 mb-4">
              {paymentStatus === 'connecting' ? 'Please approve the connection in your wallet...' : 'Please confirm the transaction in your wallet...'}
            </div>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center py-8">
            <div className="text-green-600 font-semibold">
              Payment completed successfully!
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Premium content is now available.
            </div>
          </div>
        )}

        {paymentStatus === 'error' && error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-red-800 font-semibold mb-2">Payment Failed</div>
            <div className="text-red-700 text-sm mb-4">{error}</div>
            <button
              onClick={() => {
                setPaymentStatus('idle')
                setError(null)
              }}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}