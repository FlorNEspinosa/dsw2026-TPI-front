import { useState } from 'react';
import { createAppointment } from '../services/appointmentsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';
import { getMyProfile } from '../../patients/services/patientsService';

function useCreateAppointment() {
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
      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo reservar el turno.')
      );

      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveAppointment, isSaving, errorMessage };
}

export default useCreateAppointment;
