import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Snackbar from '../../shared/components/Snackbar';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import NameFilter from '../../shared/components/NameFilter';
import TablePagination from '../../shared/components/TablePagination';
import DoctorsTable from '../components/DoctorsTable';
import useDoctors from '../hooks/useDoctors';
import useDeleteDoctor from '../hooks/useDeleteDoctor';

function DoctorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(
    () => location.state?.notification ?? null
  );

  const [query, setQuery] = useState({
    pageIndex: 1,
    name: '',
  });

  const pageSize = 10;

  const { doctors, total, isLoading, errorMessage, reload, loadedQuery } =
    useDoctors({
      pageIndex: query.pageIndex,
      pageSize,
      name: query.name,
    });

  const {
    removeDoctor,
    deletingId,
    errorMessage: deleteError,
    clearError,
  } = useDeleteDoctor();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const hasCurrentResult =
    loadedQuery?.pageIndex === query.pageIndex &&
    loadedQuery?.pageSize === pageSize &&
    loadedQuery?.name === query.name;

  const needsPageCorrection =
    !isLoading &&
    !errorMessage &&
    hasCurrentResult &&
    query.pageIndex > totalPages;

  const showLoading =
    !errorMessage && (isLoading || !hasCurrentResult || needsPageCorrection);

  const isBusy = showLoading || deletingId !== null;
  const closeSnackbar = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    if (!location.state?.notification) {
      return;
    }

    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: null,
    });
  }, [
    location.pathname,
    location.search,
    location.hash,
    location.state,
    navigate,
  ]);

  useEffect(() => {
    if (!needsPageCorrection) {
      return;
    }

    setQuery((current) => {
      if (current.pageIndex <= totalPages) {
        return current;
      }

      return {
        ...current,
        pageIndex: totalPages,
      };
    });
  }, [needsPageCorrection, totalPages]);

  const handleSearch = (name) => {
    if (isBusy) {
      return;
    }

    setNotification(null);
    clearError();

    if (query.pageIndex === 1 && query.name === name) {
      reload();

      return;
    }

    setQuery({ pageIndex: 1, name });
  };

  const handlePageChange = (pageIndex) => {
    if (isBusy || pageIndex < 1 || pageIndex > totalPages) {
      return;
    }

    setNotification(null);
    clearError();

    setQuery((current) => ({
      ...current,
      pageIndex,
    }));
  };

  const handleDelete = async (doctor) => {
    if (isBusy) {
      return;
    }

    const confirmed = window.confirm(
      `¿Querés eliminar al médico "${doctor.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setNotification(null);

    const wasDeleted = await removeDoctor(doctor.id);

    if (wasDeleted) {
      setNotification({
        id: crypto.randomUUID(),
        message: 'El médico se eliminó correctamente.',
      });

      reload();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>

          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y sus horarios de atención.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/availabilities')}
            disabled={isBusy}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agregar Disponibilidad Horaria
          </Button>

          <Button
            onClick={() => navigate('/admin/doctors/new')}
            disabled={isBusy}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Nuevo Doctor
          </Button>
        </div>
      </div>

      <Snackbar notification={notification} onClose={closeSnackbar} />
      <Alert message={deleteError} />
      <NameFilter
        onSearch={handleSearch}
        isLoading={isBusy}
        placeholder="Ej.: Alejandro"
        inputId="doctor-name-filter"
      />

      <Card className="overflow-hidden">
        <div className="mb-4 border-b border-med-border pb-4">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Doctores
          </h2>
        </div>

        {showLoading ? (
          <p role="status" className="py-6 text-center text-med-text-sub">
            Cargando médicos...
          </p>
        ) : errorMessage ? (
          <div className="flex flex-col items-start gap-3 py-4">
            <Alert message={errorMessage} />

            <Button variant="secondary" onClick={reload}>
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <DoctorsTable
              doctors={doctors}
              onDelete={handleDelete}
              deletingId={deletingId}
            />

            <TablePagination
              currentPage={query.pageIndex}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default DoctorsPage;
