import { useState } from 'react';
import { createSpecialty } from '../services/specialtiesService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useCreateSpecialty() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const saveSpecialty = async (specialty) => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      const createdSpecialty = await createSpecialty(specialty);

      return createdSpecialty;
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo crear la especialidad.')
      );

      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveSpecialty,
    isSaving,
    errorMessage,
  };
}

export default useCreateSpecialty;
