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

  return (
    <div className={cn(
      'relative flex items-center',
      className
    )}>
      <div className={cn(
        'relative flex items-center w-full bg-surface rounded-lg border transition-all duration-200',
        isFocused ? 'border-accent shadow-md ring-2 ring-accent/20' : 'border-gray-200 hover:border-gray-300'
      )}>
        <Search className={cn(
          'absolute left-3 h-4 w-4 transition-colors duration-200',
          isFocused ? 'text-accent' : 'text-secondary-text'
        )} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-10 pr-10 py-3 bg-transparent text-text placeholder-secondary-text focus:outline-none touch-manipulation"
          aria-label={placeholder}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 text-secondary-text hover:text-text transition-all duration-200 rounded-full hover:bg-muted touch-manipulation"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
