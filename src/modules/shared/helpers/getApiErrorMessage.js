function getApiErrorMessage(
  error,
  fallback = 'No se pudo completar la operación.'
) {
  const response = error?.response;

  if (!response) {
    return 'No se pudo conectar con el backend. Comprobá que esté ejecutándose.';
  }

  if (response.status >= 500) {
    return 'Ocurrió un error en el servidor. Intentá nuevamente más tarde.';
  }

  const details = response.data?.details;
  const issues = Array.isArray(details)
    ? details.map((detail) => detail?.issue).filter(Boolean)
    : [];

  return (
    [response.data?.message, ...issues].filter(Boolean).join(' ') || fallback
  );
}

export default getApiErrorMessage;
