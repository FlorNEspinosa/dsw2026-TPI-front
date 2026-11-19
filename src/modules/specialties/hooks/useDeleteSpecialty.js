import { useState } from 'react';
import { deleteSpecialty } from '../services/specialtiesService';

function useDeleteSpecialty() {
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const removeSpecialty = async (id) => {
    if (deletingId !== null) {
      return false;
    }

    setDeletingId(id);
    setErrorMessage('');

    try {
      await deleteSpecialty(id);

      return true;
    } catch (error) {
      const response = error.response;

      if (!response) {
        setErrorMessage(
          'No se pudo conectar con el backend. Comprobá que esté ejecutándose.'
        );
      } else if (response.status >= 500) {
        setErrorMessage(
          'Ocurrió un error en el servidor. Intentá nuevamente más tarde.'
        );
      } else {
        setErrorMessage(
          response.data?.message || 'No se pudo eliminar la especialidad.'
        );
      }

      return false;
    } finally {
      setDeletingId(null);
    }
  };

  const clearError = () => {
    setErrorMessage('');
  };

  return {
    removeSpecialty,
    deletingId,
    errorMessage,
    clearError,
  };
}

export default useDeleteSpecialty;
