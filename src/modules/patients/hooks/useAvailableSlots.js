import { useEffect, useState } from 'react';
import { getAvailableSlots } from '../../doctors/services/doctorsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useAvailableSlots(doctorId) {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSlots() {
      setIsLoading(true);
      setSlots([]);
      setErrorMessage('');

      try {
        const availableSlots = await getAvailableSlots(doctorId);

        if (active) {
          setSlots(availableSlots);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            getApiErrorMessage(error, 'No se pudieron cargar los horarios.')
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [doctorId]);

  return { slots, isLoading, errorMessage };
}

export default useAvailableSlots;
