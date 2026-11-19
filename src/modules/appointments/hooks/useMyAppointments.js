import { useEffect, useState } from 'react';
import {
  cancelAppointment,
  getMyAppointments,
} from '../services/appointmentsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useMyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadAppointments() {
      try {
        const data = await getMyAppointments();

        if (active) {
          setAppointments(data);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            getApiErrorMessage(error, 'No se pudieron cargar tus turnos.')
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadAppointments();

    return () => {
      active = false;
    };
  }, []);

  async function cancelMyAppointment(id) {
    if (cancelingId !== null) {
      return false;
    }

    setCancelingId(id);
    setErrorMessage('');

    try {
      await cancelAppointment(id);
      setAppointments((current) => current.filter((item) => item.id !== id));

      return true;
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'No se pudo cancelar el turno.')
      );

      return false;
    } finally {
      setCancelingId(null);
    }
  }

  return {
    appointments,
    isLoading,
    errorMessage,
    cancelingId,
    cancelMyAppointment,
  };
}

export default useMyAppointments;
