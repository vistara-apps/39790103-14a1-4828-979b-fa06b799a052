'use client';

import { useState, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function SearchBar({ 
  placeholder = 'Search...', 
  value = '', 
  onChange, 
  onClear,
  onSubmit,
  className,
  autoFocus = false,
  disabled = false 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onChange?.('');
    onClear?.();
    inputRef.current?.focus();
  }, [onChange, onClear]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
    inputRef.current?.blur();
  }, [onSubmit, value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      if (value) {
        handleClear();
      }
    }
  }, [value, handleClear]);

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex items-center', className)}>
      <div className={cn(
        'relative flex items-center w-full bg-surface rounded-lg border transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-accent/20',
        isFocused 
          ? 'border-accent shadow-sm' 
          : 'border-border hover:border-border/60',
        disabled && 'opacity-60 cursor-not-allowed'
      )}>
        <Search className={cn(
          'absolute left-3 h-4 w-4 transition-colors duration-200',
          isFocused ? 'text-accent' : 'text-secondary-text'
        )} />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          disabled={disabled}
          className={cn(
            'w-full pl-10 py-3 bg-transparent text-text placeholder-secondary-text',
            'focus:outline-none focus-visible:outline-none',
            'text-base leading-none', // Prevents zoom on iOS
            value ? 'pr-10' : 'pr-4'
          )}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute right-3 p-1 text-secondary-text hover:text-text',
              'transition-all duration-200 rounded-full',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20',
              'active:scale-90 hover:bg-muted/50'
            )}
            aria-label="Clear search"
            tabIndex={-1} // Prevent tab focus, only click
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
