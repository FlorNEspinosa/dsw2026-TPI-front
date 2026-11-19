import { useState } from 'react';
import { createSpecialty } from '../services/specialtiesService';

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
          response.data?.message || 'No se pudo crear la especialidad.'
        );
      }

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
