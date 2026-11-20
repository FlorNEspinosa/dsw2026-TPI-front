import Button from '../../shared/components/Button';

function AppointmentsTable({ appointments = [], onView }) {
  const statuses = {
    BOOKED: {
      label: 'Confirmado',
      style: 'bg-med-active-bg text-med-active-text',
    },
    ATTENDED: {
      label: 'Atendido',
      style: 'bg-gray-100 text-gray-600',
    },
    CANCELLED: {
      label: 'Cancelado',
      style: 'bg-red-50 text-red-700',
    },
    NO_SHOW: {
      label: 'Ausente',
      style: 'bg-amber-50 text-amber-800',
    },
  };

  if (appointments.length === 0) {
    return (
      <p role="status" className="p-6 text-center text-med-text-sub">
        No se encontraron citas con esos filtros.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Registros de citas</caption>
        <thead className="bg-med-primary-50 text-xs uppercase text-med-text-sub">
          <tr>
            <th scope="col" className="px-6 py-3">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3">
              Departamento
            </th>
            <th scope="col" className="px-6 py-3">
              Paciente
            </th>
            <th scope="col" className="px-6 py-3">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-med-border-subtle">
          {appointments.map((appointment) => {
            const status = statuses[appointment.appointmentsStatus];
            const dateLabel = new Date(
              `${appointment.date}T12:00:00`
            ).toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <tr key={appointment.appointmentsId} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold text-med-primary-900">
                    {dateLabel}
                  </p>
                  <p className="mt-1 text-xs text-med-text-sub">
                    {appointment.startTime} hs
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-med-primary-100 text-med-primary-700"
                    >
                      ✚
                    </span>
                    <div>
                      <p className="font-semibold text-med-primary-900">
                        {appointment.doctor?.specialty?.name ||
                          'Sin especialidad'}
                      </p>
                      <p className="mt-1 text-xs text-med-text-sub">
                        {appointment.doctor?.name || 'Sin médico informado'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-med-primary-900">
                    {appointment.patient?.fullName || 'Sin nombre informado'}
                  </p>
                  <p className="mt-1 text-xs text-med-text-sub">
                    DNI: {appointment.patient?.dni ?? 'Sin informar'}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      status?.style || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-current"
                    />
                    {status?.label || appointment.appointmentsStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    className="text-xs whitespace-nowrap"
                    disabled={!onView}
                    onClick={() => onView?.(appointment)}
                    aria-label={`Ver detalle de la cita de ${appointment.patient?.fullName || 'paciente'}`}
                  >
                    Ver detalle
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentsTable;
