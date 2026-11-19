import { useEffect, useState } from 'react';
import { getSpecialties } from '../services/specialtiesService';

function useSpecialties({ pageIndex = 1, pageSize = 10, name = '' } = {}) {
  const [specialties, setSpecialties] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadSpecialties = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getSpecialties({ pageIndex, pageSize, name });

        if (active) {
          setSpecialties(response.data);
          setTotal(response.total);
        }
      } catch (error) {
        if (active) {
          setSpecialties([]);
          setTotal(0);
          setErrorMessage(
            error.response?.data?.message ||
              'No se pudieron cargar las especialidades.'
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
  }, [pageIndex, pageSize, name, reloadKey]);

  const reload = () => {
    setReloadKey((current) => current + 1);
  };

  return { specialties, total, isLoading, errorMessage, reload };
}

export default useSpecialties;
