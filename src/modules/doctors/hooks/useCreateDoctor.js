import { useState } from 'react';
import { createDoctor } from '../services/doctorsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useCreateDoctor() {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const saveDoctor = async (doctor) => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      const createdDoctor = await createDoctor(doctor);

      return createdDoctor;
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo registrar el médico.')
      );

      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveDoctor,
    isSaving,
    errorMessage,
  };
}

export default useCreateDoctor;
