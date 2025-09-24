'use client';

import { useState, forwardRef, InputHTMLAttributes } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSubmit'> {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  loading?: boolean;
  className?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  placeholder = 'Search...', 
  value = '', 
  onChange, 
  onClear,
  onSubmit,
  loading = false,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange?.('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
    props.onKeyDown?.(e);
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <div className={cn(
        'relative flex items-center w-full rounded-lg border transition-all duration-200',
        'bg-surface hover:bg-surface-secondary',
        isFocused 
          ? 'border-ring ring-2 ring-ring ring-offset-2' 
          : 'border-border hover:border-border-secondary',
        loading && 'pointer-events-none opacity-70'
      )}>
        <div className="absolute left-3 flex items-center">
          {loading ? (
            <Loader2 className="h-4 w-4 text-text-secondary animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-text-secondary" />
          )}
        </div>
        
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full pl-10 pr-10 py-3 bg-transparent',
            'text-foreground placeholder:text-text-tertiary',
            'focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          disabled={loading}
          {...props}
        />
        
        {value && !loading && (
          <button
            onClick={handleClear}
            type="button"
            className={cn(
              'absolute right-3 p-1 rounded-md',
              'text-text-secondary hover:text-text',
              'hover:bg-surface-tertiary',
              'transition-all duration-200',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
