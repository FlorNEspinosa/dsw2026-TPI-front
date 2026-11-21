import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import SpecialtiesFilters from '../components/SpecialtiesFilters';
import SpecialtiesTable from '../components/SpecialtiesTable';
import useSpecialties from '../hooks/useSpecialties';
import useDeleteSpecialty from '../hooks/useDeleteSpecialty';
import Alert from '../../shared/components/Alert';
import Snackbar from '../../shared/components/Snackbar';

function SpecialtiesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState({ pageIndex: 1, name: '' });

  const [notification, setNotification] = useState(() => {
    return location.state?.notification ?? null;
  });

  const pageSize = 10;

  const { specialties, total, isLoading, errorMessage, reload, loadedQuery } =
    useSpecialties({
      pageIndex: query.pageIndex,
      pageSize,
      name: query.name,
    });

  const {
    removeSpecialty,
    deletingId,
    errorMessage: deleteError,
    clearError,
  } = useDeleteSpecialty();

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

  const handleCloseSnackbar = useCallback(() => {
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
    setNotification(null);
    clearError();

    if (query.pageIndex === 1 && query.name === name) {
      reload();

      return;
    }

    setQuery({
      pageIndex: 1,
      name,
    });
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

  const handleDelete = async (specialty) => {
    if (isBusy) {
      return;
    }

    const confirmed = window.confirm(
      `¿Querés eliminar la especialidad "${specialty.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setNotification(null);

    const removed = await removeSpecialty(specialty.id);

    if (!removed) {
      return;
    }

    setNotification({
      id: crypto.randomUUID(),
      message: 'La especialidad se eliminó correctamente.',
    });
    reload();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera con Título, Buscador y Botón */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="mt-1 text-xs text-med-text-sub">
            Administre las categorías médicas y sus descripciones.
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-2">
          <SpecialtiesFilters onSearch={handleSearch} isLoading={isBusy} />

          <Button
            onClick={() => navigate('/admin/specialties/new')}
            disabled={isBusy}
            className="whitespace-nowrap text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Nueva Especialidad
          </Button>
        </div>
      </div>

      <Snackbar notification={notification} onClose={handleCloseSnackbar} />

      <Alert message={deleteError} />

      <Card className="overflow-hidden">
        <div className="mb-5">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>

        {showLoading ? (
          <p role="status" className="py-6 text-center text-med-text-sub">
            Cargando especialidades...
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
            <SpecialtiesTable
              specialties={specialties}
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

export default SpecialtiesPage;
