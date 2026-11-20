import { useEffect, useState } from 'react';
import TablePagination from '../../shared/components/TablePagination';
import Card from '../../shared/components/Card';
import AppointmentsFilters from '../components/AppointmentsFilters';
import AppointmentsTable from '../components/AppointmentsTable';
import useAppointmentsSearch from '../hooks/useAppointmentsSearch';
import Alert from '../../shared/components/Alert';
import AppointmentDetail from '../components/AppointmentDetail';

function AppointmentsSearchPage() {
  const [filters, setFilters] = useState({
    patientName: '',
    dni: '',
    specialtyId: '',
    doctorId: '',
    date: '',
    pageIndex: 1,
  });

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { appointments, total, reload, isLoading, errorMessage, loadedQuery } =
    useAppointmentsSearch(filters);

  const hasCurrentResult =
    loadedQuery &&
    Object.entries(filters).every(
      ([field, value]) => loadedQuery[field] === value
    );

  const totalPages = Math.max(1, Math.ceil(total / 10));
  const needsPageCorrection =
    !isLoading &&
    !errorMessage &&
    hasCurrentResult &&
    filters.pageIndex > totalPages;

  const showLoading =
    !errorMessage && (isLoading || !hasCurrentResult || needsPageCorrection);

  useEffect(() => {
    if (!needsPageCorrection) {
      return;
    }

    setFilters((current) => ({ ...current, pageIndex: totalPages }));
  }, [needsPageCorrection, totalPages]);

  function handleSearch(nextFilters) {
    setSelectedAppointment(null);
    setFilters({ ...nextFilters, pageIndex: 1 });
    reload();
  }

  function handlePageChange(pageIndex) {
    if (showLoading || pageIndex < 1 || pageIndex > totalPages) {
      return;
    }

    setSelectedAppointment(null);
    setFilters((current) => ({ ...current, pageIndex }));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Título de la página */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
          Búsqueda y Filtrado de Citas
        </h1>
        <p className="text-sm text-med-text-sub mt-1">
          Gestione y supervise el flujo de pacientes del departamento.
        </p>
      </div>

      {/* Card Superior: Criterios de Búsqueda */}
      <Card className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-med-border-subtle">
          <h2 className="text-base font-bold text-med-primary-900">
            Criterios de Búsqueda
          </h2>
        </div>

        <AppointmentsFilters onSearch={handleSearch} isLoading={showLoading} />

        {(filters.patientName || filters.dni || filters.date) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-med-border-subtle">
            {filters.patientName && (
              <span className="rounded-full px-3 py-1 text-xs bg-sky-100/70 text-sky-800">
                Paciente: {filters.patientName}
              </span>
            )}
            {filters.dni && (
              <span className="rounded-full px-3 py-1 text-xs bg-sky-100/70 text-sky-800">
                DNI: {filters.dni}
              </span>
            )}
            {filters.date && (
              <span className="rounded-full px-3 py-1 text-xs bg-emerald-50 text-emerald-700">
                Fecha: {filters.date}
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Card Inferior: Registros de Citas */}
      <Card className="p-0 overflow-hidden border-med-border">
        <div className="p-5 border-b border-med-border">
          <h2 className="text-base font-bold text-med-primary-900">
            Registros de Citas
          </h2>
        </div>

        {showLoading ? (
          <p role="status" className="p-6 text-center text-med-text-sub">
            Consultando citas…
          </p>
        ) : errorMessage ? (
          <div className="p-5">
            <Alert message={errorMessage} />
          </div>
        ) : (
          <>
            <AppointmentsTable
              appointments={appointments}
              onView={setSelectedAppointment}
            />
            <TablePagination
              currentPage={filters.pageIndex}
              totalPages={totalPages}
              totalItems={total}
              pageSize={10}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </Card>

      <AppointmentDetail
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}

export default AppointmentsSearchPage;
