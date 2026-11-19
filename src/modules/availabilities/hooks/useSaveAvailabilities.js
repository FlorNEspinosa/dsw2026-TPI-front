import { useState } from 'react';
import {
  createAvailabilities,
  updateAvailabilities,
} from '../services/availabilitiesService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useSaveAvailabilities() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const saveAvailabilities = async (availability, isEditing = false) => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      if (isEditing) {
        await updateAvailabilities(availability);
      } else {
        await createAvailabilities(availability);
      }

      return true;
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          'No se pudo guardar la disponibilidad del médico.'
        )
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const clearError = () => {
    setErrorMessage('');
  };

  return {
    saveAvailabilities,
    isSaving,
    errorMessage,
    clearError,
  };
}

export default useSaveAvailabilities;
