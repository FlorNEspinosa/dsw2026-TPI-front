import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import useDoctorOptions from '../../doctors/hooks/useDoctorOptions';
import AvailabilityForm from '../components/AvailabilityForm';
import useDoctorAvailabilities from '../hooks/useDoctorAvailabilities';
import useSaveAvailabilities from '../hooks/useSaveAvailabilities';

function AvailabilitiesPage() {
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState('');

  const {
    doctors,
    isLoading: isLoadingDoctors,
    errorMessage: doctorsError,
    reload: reloadDoctors,
  } = useDoctorOptions();

  const {
    availabilities,
    isLoading: isLoadingAvailabilities,
    errorMessage: availabilitiesError,
    reload: reloadAvailabilities,
  } = useDoctorAvailabilities(doctorId);

  const {
    saveAvailabilities,
    isSaving,
    errorMessage: saveError,
    clearError,
  } = useSaveAvailabilities();

  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId);
  const isEditing = availabilities.length > 0;

  const handleDoctorChange = (event) => {
    clearError();
    setDoctorId(event.target.value);
  };

  const handleCancel = () => {
    navigate('/admin/doctors');
  };

  const handleSave = async (days) => {
    if (
      !selectedDoctor ||
      isSaving ||
      isLoadingAvailabilities ||
      availabilitiesError
    ) {
      return;
    }

    const wasSaved = await saveAvailabilities(
      {
        doctorId,
        days,
      },
      isEditing
    );

    if (wasSaved) {
      navigate('/admin/doctors', {
        replace: true,
        state: {
          notification: {
            id: crypto.randomUUID(),
            message: 'La disponibilidad se guardó correctamente.',
          },
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-med-text-main">
            Disponibilidad Horaria
          </h1>

          <p className="mt-1 text-sm text-med-text-sub">
            Seleccioná un médico para gestionar sus horarios del mes actual.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={handleCancel}
          disabled={isSaving}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volver al listado
        </Button>
      </div>

      <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start gap-6">
        <Card>
          <h2 className="mb-4 font-semibold text-med-primary-900">
            Seleccionar Profesional
          </h2>

          {isLoadingDoctors ? (
            <p role="status" className="text-med-text-sub">
              Cargando médicos...
            </p>
          ) : doctorsError ? (
            <div className="flex flex-col items-start gap-3">
              <Alert message={doctorsError} />

              <Button variant="secondary" onClick={reloadDoctors}>
                Reintentar
              </Button>
            </div>
          ) : doctors.length === 0 ? (
            <Alert
              variant="info"
              message="Primero registrá un médico para configurar su disponibilidad."
            />
          ) : (
            <div className="flex flex-col gap-4">
              <label htmlFor="availability-doctor" className="sr-only">
                Médico
              </label>

              <select
                id="availability-doctor"
                value={doctorId}
                onChange={handleDoctorChange}
                disabled={isSaving}
                className="w-full rounded-lg border border-med-border bg-white px-3 py-2.5 text-sm disabled:opacity-50"
              >
                <option value="">Seleccioná un médico</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                    {doctor.isActive ? '' : ' (inactivo)'}
                  </option>
                ))}
              </select>

              {selectedDoctor && (
                <div className="rounded-lg bg-med-primary-50 p-4">
                  <p className="font-semibold">{selectedDoctor.name}</p>

                  <p className="mt-1 text-sm text-med-text-sub">
                    {selectedDoctor.specialty?.name || 'Sin especialidad'}
                  </p>

                  <p className="mt-1 text-xs text-med-text-sub">
                    Matrícula: {selectedDoctor.licenseNumber || 'Sin informar'}
                  </p>
                </div>
              )}

              <p className="text-xs text-med-text-sub">
                La configuración corresponde al mes actual.
              </p>
            </div>
          )}
        </Card>

        <Card className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-semibold text-med-primary-900">
              Configuración de Horarios
            </h2>

            <span className="text-xs text-med-text-sub">
              Turnos de 30 minutos
            </span>
          </div>

          {!selectedDoctor || isLoadingDoctors || doctorsError ? (
            <Alert
              variant="info"
              message="Seleccioná un profesional para configurar sus horarios."
            />
          ) : isLoadingAvailabilities ? (
            <p role="status" className="py-6 text-center text-med-text-sub">
              Cargando disponibilidad...
            </p>
          ) : availabilitiesError ? (
            <div className="flex flex-col items-start gap-3">
              <Alert message={availabilitiesError} />

              <Button variant="secondary" onClick={reloadAvailabilities}>
                Reintentar
              </Button>
            </div>
          ) : (
            <>
              <Alert message={saveError} className="mb-5" />

              <AvailabilityForm
                key={doctorId}
                initialAvailabilities={availabilities}
                isEditing={isEditing}
                isSaving={isSaving}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AvailabilitiesPage;
