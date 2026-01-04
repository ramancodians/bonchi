import React, { forwardRef } from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  options: RadioOption[];
  error?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  direction?: 'horizontal' | 'vertical';
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ label, options, error, variant, direction = 'vertical', className = '', name, ...props }, ref) => {
    const variantClass = variant ? `radio-${variant}` : '';
    const flexDirection = direction === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2';
    
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <div className={`flex ${flexDirection}`}>
          {options.map((option, index) => (
            <label key={option.value} className="label cursor-pointer justify-start gap-2">
              <input
                ref={index === 0 ? ref : undefined}
                type="radio"
                name={name}
                value={option.value}
                className={`radio ${variantClass} ${error ? 'radio-error' : ''} ${className}`}
                {...props}
              />
              <span className="label-text">{option.label}</span>
            </label>
          ))}
        </div>
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

RadioButton.displayName = 'RadioButton';

export default RadioButton;
