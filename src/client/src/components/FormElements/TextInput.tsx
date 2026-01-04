import React, { forwardRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          ref={ref}
          className={`input input-bordered w-full ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
        {(error || helperText) && (
          <label className="label">
            {error && <span className="label-text-alt text-error">{error}</span>}
            {!error && helperText && <span className="label-text-alt">{helperText}</span>}
          </label>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;
