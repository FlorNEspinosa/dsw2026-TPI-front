import { useState } from 'react';
import { createAppointment } from '../services/appointmentsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';
import { getMyProfile } from '../../patients/services/patientsService';

function useCreateAppointment(onSlotUnavailable) {
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const saveAppointment = async (appointment) => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      const profile = await getMyProfile();
      const createdAppointment = await createAppointment({
        ...appointment,
        dni: profile.dni,
      });

      return createdAppointment;
    } catch (error) {
      const response = error.response;
      const slotUnavailable =
        response?.status === 409 &&
        response.data?.details?.some(
          (detail) => detail.field?.toLowerCase() === 'availabilityslotid'
        );

      if (slotUnavailable) {
        setErrorMessage('Ese horario ya no está disponible. Elegí otro.');
        onSlotUnavailable?.();

        return null;
      }

      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo reservar el turno.')
      );

      return null;
    } finally {
      setIsSaving(false);
    }
  };

  function clearError() {
    setErrorMessage('');
  }

  return { saveAppointment, isSaving, errorMessage, clearError };
}

export default useCreateAppointment;
