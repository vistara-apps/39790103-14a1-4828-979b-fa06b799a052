import { cn } from '@/lib/utils';
import { TagProps } from '@/lib/types';
import { X } from 'lucide-react';

export function Tag({ 
  label, 
  variant = 'default', 
  selected = false, 
  onClick,
  onRemove 
}: TagProps) {
  const baseClasses = cn(
    'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
    'border border-transparent',
    onClick && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 active:scale-95'
  );
  
  const variantClasses = {
    default: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
    filter: selected 
      ? 'bg-accent text-white border-accent shadow-sm hover:bg-accent/90' 
      : 'bg-muted text-secondary-text border-border hover:bg-muted/80 hover:text-text',
  };

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(baseClasses, variantClasses[variant])}
        aria-pressed={variant === 'filter' ? selected : undefined}
        aria-label={variant === 'filter' ? `${selected ? 'Remove' : 'Apply'} ${label} filter` : `Tag: ${label}`}
      >
        {label}
        {onRemove && (
          <X 
            className="ml-1 h-3 w-3 hover:text-destructive transition-colors" 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          />
        )}
      </button>
    );
  }

  return (
    <span className={cn(baseClasses, variantClasses[variant], 'cursor-default')}>
      {label}
    </span>
  );
}
