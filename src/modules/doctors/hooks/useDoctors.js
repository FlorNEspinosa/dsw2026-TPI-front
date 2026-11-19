import { useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useDoctors({
  pageIndex = 1,
  pageSize = 10,
  name = '',
  specialtyId = '',
} = {}) {
  const [doctors, setDoctors] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedQuery, setLoadedQuery] = useState(null);

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setLoadedQuery(null);

      try {
        const response = await getDoctors({
          pageIndex,
          pageSize,
          name,
          specialtyId,
        });

        if (active) {
          setDoctors(response.data);
          setTotal(response.total);
          setLoadedQuery({
            pageIndex,
            pageSize,
            name,
            specialtyId,
          });
        }
      } catch (error) {
        if (active) {
          setDoctors([]);
          setTotal(0);
          setLoadedQuery(null);
          setErrorMessage(
            getApiErrorMessage(error, 'No se pudieron cargar los médicos.')
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
  }, [pageIndex, pageSize, name, specialtyId, reloadKey]);

  const reload = () => {
    setReloadKey((current) => current + 1);
  };

  return {
    doctors,
    total,
    isLoading,
    errorMessage,
    reload,
    loadedQuery,
  };
}

export default useDoctors;
