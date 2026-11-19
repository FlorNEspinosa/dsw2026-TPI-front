import { useState } from 'react';
import { deleteSpecialty } from '../services/specialtiesService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

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
      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo eliminar la especialidad.')
      );

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
