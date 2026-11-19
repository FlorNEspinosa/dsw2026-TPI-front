import { useEffect, useState } from 'react';
import { getDoctorAvailabilities } from '../services/availabilitiesService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useDoctorAvailabilities(doctorId = '') {
  const [availabilities, setAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadedDoctorId, setLoadedDoctorId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!doctorId) {
      return;
    }

    let active = true;

    const loadAvailabilities = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getDoctorAvailabilities(doctorId);

        if (active) {
          setAvailabilities(response);
        }
      } catch (error) {
        if (active) {
          setAvailabilities([]);
          setErrorMessage(
            getApiErrorMessage(
              error,
              'No se pudo cargar la disponibilidad del médico.'
            )
          );
        }
      } finally {
        if (active) {
          setLoadedDoctorId(doctorId);
          setIsLoading(false);
        }
      }
    };

    loadAvailabilities();

    return () => {
      active = false;
    };
  }, [doctorId, reloadKey]);

  const reload = () => {
    setReloadKey((current) => current + 1);
  };

  const hasCurrentResult = Boolean(doctorId) && loadedDoctorId === doctorId;

  return {
    availabilities: hasCurrentResult ? availabilities : [],
    isLoading: Boolean(doctorId) && (isLoading || !hasCurrentResult),
    errorMessage: hasCurrentResult ? errorMessage : '',
    reload,
  };
}

export default useDoctorAvailabilities;
