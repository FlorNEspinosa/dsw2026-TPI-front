function Alert({ message, variant = 'error', className = '' }) {
  const variantStyles = {
    error: 'border-red-200 bg-red-50 text-red-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-sky-200 bg-sky-50 text-sky-800',
  };

  if (!message) {
    return null;
  }

  const style = variantStyles[variant] || variantStyles.error;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border p-3 text-sm break-words ${style} ${className}`}
    >
      {message}
    </div>
  );
}

export default Alert;
