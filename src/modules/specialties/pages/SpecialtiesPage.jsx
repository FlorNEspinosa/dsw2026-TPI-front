import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import TablePagination from '../../shared/components/TablePagination';
import SpecialtiesFilters from '../components/SpecialtiesFilters';
import SpecialtiesTable from '../components/SpecialtiesTable';
import useSpecialties from '../hooks/useSpecialties';
import useDeleteSpecialty from '../hooks/useDeleteSpecialty';

function SpecialtiesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({ pageIndex: 1, name: '' });

  const [successMessage, setSuccessMessage] = useState('');
  const pageSize = 10;

  const { specialties, total, isLoading, errorMessage, reload } =
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
  const isBusy = isLoading || deletingId !== null;

  const handleSearch = (name) => {
    setSuccessMessage('');
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

    setSuccessMessage('');
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

    setSuccessMessage('');

    const removed = await removeSpecialty(specialty.id);

    if (!removed) {
      return;
    }

    setSuccessMessage('La especialidad se eliminó correctamente.');

    if (specialties.length === 1 && query.pageIndex > 1) {
      setQuery((current) => ({
        ...current,
        pageIndex: current.pageIndex - 1,
      }));
    } else {
      reload();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera con Título, Buscador y Botón */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Especialidades
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Administre las categorías médicas y sus descripciones.
          </p>
        </div>

        {/* Botón Nueva Especialidad */}
        <Button
          onClick={() => navigate('/admin/specialties/new')}
          disabled={isBusy}
          className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Nueva Especialidad
        </Button>
      </div>

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          {successMessage}
        </div>
      )}

      {deleteError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {deleteError}
        </div>
      )}

      <SpecialtiesFilters onSearch={handleSearch} isLoading={isBusy} />

      <Card className="overflow-hidden">
        <div className="mb-4 border-b border-med-border pb-4">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Especialidades
          </h2>
        </div>

        {isLoading ? (
          <p role="status" className="py-6 text-center text-med-text-sub">
            Cargando especialidades...
          </p>
        ) : errorMessage ? (
          <div className="flex flex-col items-start gap-3 py-4">
            <p role="alert" className="text-sm text-red-600">
              {errorMessage}
            </p>

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
