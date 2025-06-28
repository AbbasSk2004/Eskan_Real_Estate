import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  helper,
  prefix,
  suffix,
  size = 'md',
  fullWidth = false,
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseInputClasses = 'block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  const statusClasses = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  const widthClasses = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`
            ${baseInputClasses}
            ${sizeClasses[size]}
            ${statusClasses}
            ${widthClasses}
            ${disabledClasses}
            ${prefix ? 'pl-7' : ''}
            ${suffix ? 'pr-7' : ''}
            ${className}
          `}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>

      {(error || helper) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  helper: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  id: PropTypes.string
};

export default Input; 