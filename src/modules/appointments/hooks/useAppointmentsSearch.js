import { useEffect, useState } from 'react';
import { searchAppointments } from '../services/appointmentsService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useAppointmentsSearch({
  specialtyId = '',
  doctorId = '',
  dni = '',
  date = '',
  patientName = '',
  pageIndex = 1,
  pageSize = 10,
} = {}) {
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadedQuery, setLoadedQuery] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadAppointments = async () => {
      setIsLoading(true);
      setErrorMessage('');
      setLoadedQuery(null);

      const query = {
        specialtyId,
        doctorId,
        dni,
        date,
        patientName,
        pageIndex,
        pageSize,
      };

      try {
        const response = await searchAppointments(query);

        if (active) {
          setAppointments(response.data);
          setTotal(response.total);
          setLoadedQuery(query);
        }
      } catch (error) {
        if (active) {
          setAppointments([]);
          setTotal(0);
          setErrorMessage(
            getApiErrorMessage(error, 'No se pudieron consultar las citas.')
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      active = false;
    };
  }, [
    specialtyId,
    doctorId,
    dni,
    date,
    patientName,
    pageIndex,
    pageSize,
    reloadKey,
  ]);

  const reload = () => {
    setReloadKey((current) => current + 1);
  };

  return {
    appointments,
    total,
    isLoading,
    errorMessage,
    loadedQuery,
    reload,
  };
}

export default useAppointmentsSearch;
