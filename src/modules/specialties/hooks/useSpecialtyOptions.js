import { useEffect, useState } from 'react';
import { getSpecialties } from '../services/specialtiesService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useSpecialtyOptions() {
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadSpecialties = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        let pageIndex = 1;
        let specialtiesList = [];
        let hasMore = true;

        while (hasMore) {
          const response = await getSpecialties({
            pageIndex,
            pageSize: 100,
          });

          if (!active) {
            return;
          }

          specialtiesList = [...specialtiesList, ...response.data];

          hasMore =
            response.data.length > 0 && specialtiesList.length < response.total;

          pageIndex += 1;
        }

        if (active) {
          setSpecialties(specialtiesList);
        }
      } catch (error) {
        if (active) {
          setSpecialties([]);
          setErrorMessage(
            getApiErrorMessage(
              error,
              'No se pudieron cargar las especialidades del selector.'
            )
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadSpecialties();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => {
    setReloadKey((current) => current + 1);
  };

  return {
    specialties,
    isLoading,
    errorMessage,
    reload,
  };
}

export default useSpecialtyOptions;
