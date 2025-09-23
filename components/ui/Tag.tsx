import { cn } from '@/lib/utils';
import { TagProps } from '@/lib/types';

export function Tag({ 
  label, 
  variant = 'default', 
  selected = false, 
  onClick 
}: TagProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200';
  
  const variantClasses = {
    default: 'bg-accent/10 text-accent',
    filter: selected 
      ? 'bg-accent text-white' 
      : 'bg-gray-100 text-secondary-text hover:bg-gray-200',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses[variant],
        onClick && 'cursor-pointer hover:scale-105'
      )}
      disabled={!onClick}
    >
      {label}
    </button>
  );
}
