import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../services/dashboardService';
import getApiErrorMessage from '../../shared/helpers/getApiErrorMessage';

function useDashboardSummary() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    const loadSummary = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await getDashboardSummary();

        if (active) {
          setSummary(response);
        }
      } catch (error) {
        if (active) {
          setSummary(null);
          setErrorMessage(
            getApiErrorMessage(
              error,
              'No se pudieron cargar las métricas del tablero.'
            )
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      active = false;
    };
  }, []);

  return { summary, isLoading, errorMessage };
}

export default useDashboardSummary;
