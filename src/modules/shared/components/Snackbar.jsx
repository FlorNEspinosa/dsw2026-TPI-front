import { useEffect } from 'react';

function Snackbar({ notification, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!notification?.message || duration <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notification, onClose, duration]);

  if (!notification?.message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-between gap-4 rounded-lg bg-med-primary-900 px-4 py-3 text-sm text-white shadow-lg sm:left-auto sm:right-6 sm:max-w-md"
    >
      <p className="min-w-0 break-words">{notification.message}</p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="shrink-0 rounded px-2 py-1 text-xl leading-none hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        ×
      </button>
    </div>
  );
}

export default Snackbar;
