import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import useMyAppointments from '../../appointments/hooks/useMyAppointments';
import { useCallback, useState } from 'react';
import Snackbar from '../../shared/components/Snackbar';
import { useNavigate } from 'react-router-dom';

function AppointmentsPage() {
  const navigate = useNavigate();
  const {
    appointments,
    isLoading,
    errorMessage,
    cancelingId,
    cancelMyAppointment,
  } = useMyAppointments();
  const [notification, setNotification] = useState(null);

  const closeSnackbar = useCallback(() => {
    setNotification(null);
  }, []);

  async function handleCancel(appt) {
    const confirmed = window.confirm(
      `¿Querés cancelar el turno con ${appt.doctor} del ${appt.date} a las ${appt.time}?`
    );

    if (!confirmed) {
      return;
    }

    setNotification(null);
    const canceled = await cancelMyAppointment(appt.id);

    if (canceled) {
      setNotification({ message: 'Tu turno fue cancelado.' });
    }
  }

  const appointmentCards = appointments.map((appointment) => ({
    id: appointment.id,
    doctor: appointment.doctor?.name ?? 'Médico sin informar',
    specialty: appointment.doctor?.specialty?.name ?? 'Sin especialidad',
    date: appointment.date,
    time: `${appointment.startTime} hs`,
    status: appointment.status === 'BOOKED' ? 'Confirmado' : appointment.status,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Mis Turnos Médicos
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Consulta y gestiona las citas médicas programadas.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>+ Solicitar Nuevo Turno</Button>
      </div>

      {isLoading && <p role="status">Cargando tus turnos…</p>}
      <Alert message={errorMessage} />
      <Snackbar notification={notification} onClose={closeSnackbar} />
      {!isLoading && !errorMessage && appointments.length === 0 && (
        <p>Todavía no tenés turnos próximos.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {appointmentCards.map((appt) => (
          <Card
            key={appt.id}
            className="flex flex-col justify-between gap-4 p-6"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-med-primary-100 text-med-primary-700">
                  {appt.specialty}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    appt.status === 'Confirmado'
                      ? 'bg-med-active-bg text-med-active-text'
                      : 'bg-med-leave-bg text-med-leave-text'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {appt.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-med-primary-900">
                {appt.doctor}
              </h3>
              <p className="text-sm text-med-text-sub mt-2">
                Fecha:{' '}
                <strong className="text-med-text-main font-semibold">
                  {appt.date}
                </strong>{' '}
                a las{' '}
                <strong className="text-med-text-main font-semibold">
                  {appt.time}
                </strong>
              </p>
            </div>
            <div className="flex gap-2 pt-3 border-t border-med-border">
              <Button
                variant="outline"
                className="w-full text-xs"
                disabled={cancelingId !== null}
                onClick={() => handleCancel(appt)}
              >
                {cancelingId === appt.id ? 'Cancelando…' : 'Cancelar Turno'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AppointmentsPage;
