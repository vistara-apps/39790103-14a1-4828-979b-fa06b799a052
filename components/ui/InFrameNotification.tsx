'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NotificationProps } from '@/lib/types';

export function InFrameNotification({ 
  type, 
  message, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      'fixed top-4 left-4 right-4 z-50 flex items-center p-4 border rounded-lg shadow-modal animate-slide-up',
      colors[type]
    )}>
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity duration-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
