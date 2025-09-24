'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

export function SearchBar({ 
  placeholder = 'Search...', 
  value = '', 
  onChange, 
  onClear,
  className 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange?.('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={cn(
      'relative flex items-center',
      className
    )}>
      <div className={cn(
        'relative flex items-center w-full bg-surface rounded-lg border transition-all duration-200',
        'hover:border-border-muted',
        isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-border'
      )}>
        <Search className={cn(
          'absolute left-3 h-4 w-4 transition-colors duration-200',
          isFocused ? 'text-primary' : 'text-secondary-text'
        )} />
        
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          aria-label={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3 bg-transparent text-text placeholder-secondary-text',
            'focus:outline-none transition-all duration-200',
            'text-base md:text-sm' // Prevent zoom on iOS
          )}
        />
        
        {value && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              'absolute right-3 p-1 text-secondary-text hover:text-text',
              'transition-all duration-200 rounded hover:bg-border/50',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Search suggestions or results could go here */}
    </div>
  );
}
