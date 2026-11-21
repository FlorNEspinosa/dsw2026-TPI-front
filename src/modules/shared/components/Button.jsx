function Button({
  children,
  type = 'button',
  variant = 'default',
  className = '',
  ...restProps
}) {
  if (!['button', 'reset', 'submit'].includes(type)) {
    console.warn('type prop not supported');
  }

  const variantStyle = {
    default:
      'bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition',
    secondary:
      'border border-med-primary-900 text-med-primary-900 bg-white hover:bg-med-primary-50 font-medium px-4 py-2 rounded-lg transition',
    outline:
      'border border-med-border text-med-text-main bg-white hover:bg-gray-50 font-medium px-4 py-2 rounded-lg transition',
    ghost:
      'text-med-text-sub hover:bg-med-primary-50 hover:text-med-primary-900 font-medium px-3 py-2 rounded-lg transition',
    dangerGhost:
      'text-med-text-sub hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed',
    danger:
      'bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition',
  };

  const appliedClass =
    `${variantStyle[variant] || variantStyle.default} ${className}`.trim();

  return (
    <button {...restProps} className={appliedClass} type={type}>
      {children}
    </button>
  );
}

export default Button;
