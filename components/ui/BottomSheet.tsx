'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: 'default';
}

export function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  variant = 'default' 
}: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        role="button"
        aria-label="Close bottom sheet"
        tabIndex={-1}
      />
      
      {/* Sheet */}
      <div className={cn(
        'relative w-full bg-surface rounded-t-2xl shadow-xl animate-slide-up',
        'max-h-[90vh] overflow-hidden border-t border-border',
        'before:absolute before:top-2 before:left-1/2 before:-translate-x-1/2',
        'before:w-8 before:h-1 before:bg-border before:rounded-full'
      )}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 pt-6 border-b border-border">
            <h3 className="heading">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 text-secondary-text hover:text-text transition-all duration-200 rounded-lg hover:bg-border/50 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
