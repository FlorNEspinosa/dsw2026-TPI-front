import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import useDashboardSummary from '../hooks/useDashboardSummary';
import { useEffect, useState } from 'react';
import NameFilter from '../../shared/components/NameFilter';
import TablePagination from '../../shared/components/TablePagination';
import DoctorsTable from '../../doctors/components/DoctorsTable';
import useDoctors from '../../doctors/hooks/useDoctors';

function OverviewPage() {
  const navigate = useNavigate();
  const { summary, isLoading, errorMessage } = useDashboardSummary();

  const [query, setQuery] = useState({ pageIndex: 1, name: '' });
  const pageSize = 3;

  const {
    doctors,
    total,
    isLoading: loadingDoctors,
    errorMessage: doctorsError,
    reload: reloadDoctors,
    loadedQuery,
  } = useDoctors({
    pageIndex: query.pageIndex,
    pageSize,
    name: query.name,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const hasCurrentResult =
    loadedQuery?.pageIndex === query.pageIndex &&
    loadedQuery?.pageSize === pageSize &&
    loadedQuery?.name === query.name;

  const needsPageCorrection =
    !loadingDoctors &&
    !doctorsError &&
    hasCurrentResult &&
    query.pageIndex > totalPages;

  const showDoctorsLoading =
    !doctorsError &&
    (loadingDoctors || !hasCurrentResult || needsPageCorrection);

  useEffect(() => {
    if (!needsPageCorrection) {
      return;
    }

    setQuery((current) => ({
      ...current,
      pageIndex: totalPages,
    }));
  }, [needsPageCorrection, totalPages]);

  function handleSearch(name) {
    if (showDoctorsLoading) {
      return;
    }

    if (query.pageIndex === 1 && query.name === name) {
      reloadDoctors();

      return;
    }

    setQuery({ pageIndex: 1, name });
  }

  function handlePageChange(pageIndex) {
    if (showDoctorsLoading || pageIndex < 1 || pageIndex > totalPages) {
      return;
    }

    setQuery((current) => ({ ...current, pageIndex }));
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header con Título y Acciones Principales */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Vista General de Gestión
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Configure el personal médico y las especialidades del departamento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => navigate('/admin/doctors/new')}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Agregar Nuevo Doctor</span>
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/admin/specialties/new')}
            className="flex items-center gap-2"
          >
            <span>+</span>
            <span>Agregar Nueva Especialidad</span>
          </Button>
        </div>
      </div>

      {isLoading && <p role="status">Cargando métricas del tablero…</p>}
      <Alert message={errorMessage} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Doctores Activos */}
        <Card className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>

          <div className="mt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
              Doctores Activos
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1">
              {summary?.activeDoctors ?? '—'}
            </p>
          </div>
        </Card>

        {/* Especialidades Activas */}
        <Card className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
          </div>

          <div className="mt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
              Especialidades Activas
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1">
              {summary?.activeSpecialties ?? '—'}
            </p>
          </div>
        </Card>

        {/* Turnos Confirmados para Hoy */}
        <Card className="flex flex-col justify-between p-6">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-med-primary-100 text-med-primary-700">
              Hoy
            </span>
          </div>

          <div className="mt-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
              Turnos Confirmados Para Hoy
            </span>
            <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1">
              {summary?.bookedAppointmentsToday ?? '—'}
            </p>
          </div>
        </Card>
      </div>

      {/* Directorio de Profesionales Médicos */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="flex items-start justify-between gap-4 p-5">
          <h2 className="pt-1 text-base font-bold text-med-primary-900">
            Directorio de Profesionales Médicos
          </h2>

          <NameFilter
            onSearch={handleSearch}
            isLoading={showDoctorsLoading}
            placeholder="Buscar por nombre..."
            inputId="dashboard-doctor-name"
            compact
          />
        </div>

        {showDoctorsLoading ? (
          <p role="status" className="p-6 text-center text-med-text-sub">
            Cargando médicos…
          </p>
        ) : doctorsError ? (
          <div className="flex flex-col items-start gap-3 p-5">
            <Alert message={doctorsError} />
            <Button variant="secondary" onClick={reloadDoctors}>
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <DoctorsTable
              doctors={doctors}
              onView={() => navigate('/admin/doctors')}
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

export default OverviewPage;
