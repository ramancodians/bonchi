import React, { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, variant, className = '', ...props }, ref) => {
    const variantClass = variant ? `checkbox-${variant}` : '';
    
    return (
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            ref={ref}
            type="checkbox"
            className={`checkbox ${variantClass} ${error ? 'checkbox-error' : ''} ${className}`}
            {...props}
          />
          {label && <span className="label-text">{label}</span>}
        </label>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
