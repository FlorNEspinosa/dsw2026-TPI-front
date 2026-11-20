import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';

function AppointmentDetail({ appointment, onClose }) {
  if (!appointment) {
    return null;
  }

  const statusLabels = {
    BOOKED: 'Confirmado',
    CANCELLED: 'Cancelado',
    ATTENDED: 'Atendido',
    NO_SHOW: 'Ausente',
  };

  const dateLabel = new Date(`${appointment.date}T12:00:00`).toLocaleDateString(
    'es-AR'
  );

  const fields = [
    ['Paciente', appointment.patient?.fullName || 'Sin nombre informado'],
    ['DNI', appointment.patient?.dni ?? 'Sin informar'],
    ['Médico', appointment.doctor?.name || 'Sin médico informado'],
    ['Especialidad', appointment.doctor?.specialty?.name || 'Sin especialidad'],
    ['Fecha', dateLabel],
    ['Horario', `${appointment.startTime} a ${appointment.endTime} hs`],
    [
      'Estado',
      statusLabels[appointment.appointmentsStatus] ??
        appointment.appointmentsStatus,
    ],
  ];

  return (
    <section aria-labelledby="appointment-detail-title">
      <Card>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            id="appointment-detail-title"
            className="text-base font-bold text-med-primary-900"
          >
            Detalle de la cita
          </h2>
          <Button variant="secondary" onClick={onClose}>
            Cerrar detalle
          </Button>
        </div>

        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold text-med-text-sub">
                {label}
              </dt>
              <dd className="mt-1 break-words text-sm text-med-text-main">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </section>
  );
}

export default AppointmentDetail;
