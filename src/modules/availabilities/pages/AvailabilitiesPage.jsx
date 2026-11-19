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

      <Card>
        {isLoadingDoctors ? (
          <p role="status" className="py-6 text-center text-med-text-sub">
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
            message="Primero registrá un médico para poder configurar su disponibilidad."
          />
        ) : (
          <div className="flex max-w-2xl flex-col gap-2">
            <label
              htmlFor="availability-doctor"
              className="text-xs font-semibold text-med-text-main"
            >
              Médico
            </label>

            <select
              id="availability-doctor"
              value={doctorId}
              onChange={handleDoctorChange}
              disabled={isSaving}
              className="w-full rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:opacity-50"
            >
              <option value="">Seleccioná un médico</option>

              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} · {doctor.specialty?.name || 'Sin especialidad'}
                  {doctor.isActive ? '' : ' (inactivo)'}
                </option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {!isLoadingDoctors && !doctorsError && selectedDoctor && (
        <Card>
          <h2 className="mb-5 text-lg font-bold text-med-primary-900">
            Horarios de {selectedDoctor.name}
          </h2>

          {isLoadingAvailabilities ? (
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
      )}
    </div>
  );
}

export default AvailabilitiesPage;
