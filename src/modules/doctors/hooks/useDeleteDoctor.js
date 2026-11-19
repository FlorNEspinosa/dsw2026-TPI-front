import { useState } from 'react';
import { deleteDoctor } from '../services/doctorsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useDeleteDoctor() {
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const removeDoctor = async (id) => {
    if (deletingId !== null) {
      return false;
    }

    setDeletingId(id);
    setErrorMessage('');

    try {
      await deleteDoctor(id);

      return true;
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo eliminar el médico.')
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
    removeDoctor,
    deletingId,
    errorMessage,
    clearError,
  };
}

export default useDeleteDoctor;
