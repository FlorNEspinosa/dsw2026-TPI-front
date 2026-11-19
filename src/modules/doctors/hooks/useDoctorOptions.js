import { useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useDoctorOptions() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        let pageIndex = 1;
        let doctorsList = [];
        let hasMore = true;

        while (hasMore) {
          const response = await getDoctors({
            pageIndex,
            pageSize: 100,
          });

          if (!active) {
            return;
          }

          doctorsList = [...doctorsList, ...response.data];

          hasMore =
            response.data.length > 0 && doctorsList.length < response.total;

          pageIndex += 1;
        }

        if (active) {
          setDoctors(doctorsList);
        }
      } catch (error) {
        if (active) {
          setDoctors([]);
          setErrorMessage(
            getApiErrorMessage(
              error,
              'No se pudieron cargar los médicos del selector.'
            )
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => {
    setReloadKey((current) => current + 1);
  };

  return {
    doctors,
    isLoading,
    errorMessage,
    reload,
  };
}

export default useDoctorOptions;
