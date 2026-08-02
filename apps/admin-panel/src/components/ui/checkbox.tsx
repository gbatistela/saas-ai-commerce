import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked, onCheckedChange, className, disabled }, ref) => (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary shadow disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary text-primary-foreground' : 'bg-transparent',
        className,
      )}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  ),
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
