import { cn } from '@/lib/utils';
import { TagProps } from '@/lib/types';

export function Tag({ 
  label, 
  variant = 'default', 
  selected = false, 
  onClick 
}: TagProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-accent/10 text-accent border border-accent/20',
    filter: selected 
      ? 'bg-accent text-white border border-accent shadow-sm' 
      : 'bg-surface text-secondary-text border border-border hover:bg-border/50 hover:border-primary/30',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        onClick && 'cursor-pointer hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
      )}
      disabled={!onClick}
      aria-pressed={variant === 'filter' ? selected : undefined}
    >
      {label}
    </button>
  );
}
