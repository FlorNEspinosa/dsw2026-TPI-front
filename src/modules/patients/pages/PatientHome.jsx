import { useState } from 'react';
import Card from '../../shared/components/Card';
import PatientDoctorSelect from '../components/PatientDoctorSelect';
import Alert from '../../shared/components/Alert';
import useSpecialtyOptions from '../../specialties/hooks/useSpecialtyOptions';
import Button from '../../shared/components/Button';
import PatientAvailableSlots from '../components/PatientAvailableSlots';
import PatientBookingForm from '../components/PatientBookingForm';
import useCreateAppointment from '../../appointments/hooks/useCreateAppointment';
import Snackbar from '../../shared/components/Snackbar';

function PatientHome() {
  // Estados de selección de filtros
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const {
    specialties,
    isLoading: loadingSpecialties,
    errorMessage: specialtiesError,
  } = useSpecialtyOptions();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showSlots, setShowSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsVersion, setSlotsVersion] = useState(0);
  const { saveAppointment, isSaving, errorMessage, clearError } =
    useCreateAppointment(() => {
      setSelectedSlot(null);
      setSlotsVersion((version) => version + 1);
    });
  const [notification, setNotification] = useState(null);

  function closeSnackbar() {
    setNotification(null);
  }

  async function handleConfirm({ reason }) {
    const appointment = await saveAppointment({
      doctorId: selectedDoctor.id,
      availabilitySlotId: selectedSlot.id,
      reason,
    });

    if (appointment) {
      setSelectedSlot(null);
      setShowSlots(false);
      setNotification({ message: 'Tu turno quedó reservado.' });
    }
  }

  function handleSlotChange(slot) {
    clearError();
    setSelectedSlot(slot);
  }

  function handleDoctorChange(doctor) {
    setSelectedDoctor(doctor);
    setShowSlots(false);
    handleSlotChange(null);
  }

  const showEmptySpecialties =
    !loadingSpecialties && !specialtiesError && specialties.length === 0;

  return (
    <fieldset
      disabled={isSaving}
      aria-label="Reserva de turno"
      className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-6"
    >
      {/* 1. Card Superior: Selector de Especialidad y Doctor */}
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Seleccione la especialidad y el profesional para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1  items-end gap-4 md:grid-cols-12">
          {/* Especialidad */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label
              htmlFor="patient-specialty"
              className="text-xs font-semibold text-med-text-sub"
            >
              Seleccionar Especialidad
            </label>
            <div className="relative">
              <select
                id="patient-specialty"
                value={selectedSpecialtyId}
                onChange={(e) => {
                  setSelectedSpecialtyId(e.target.value);
                  handleDoctorChange(null);
                }}
                disabled={loadingSpecialties || specialties.length === 0}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
              >
                <option value="">
                  {loadingSpecialties
                    ? 'Cargando especialidades…'
                    : 'Elegí una especialidad'}
                </option>{' '}
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
              <Alert message={specialtiesError} />
              {showEmptySpecialties && (
                <p className="text-sm text-med-text-sub">
                  Sin especialidades disponibles.
                </p>
              )}
            </div>
          </div>
          {selectedSpecialtyId && (
            <PatientDoctorSelect
              key={selectedSpecialtyId}
              specialtyId={selectedSpecialtyId}
              selectedDoctorId={selectedDoctor?.id ?? ''}
              onDoctorChange={handleDoctorChange}
            />
          )}
          <div className="md:col-span-3 md:col-start-10">
            <Button
              disabled={!selectedDoctor || isSaving}
              className="flex w-full items-center justify-center gap-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                handleSlotChange(null);
                setSlotsVersion((version) => version + 1);
                setShowSlots(true);
              }}
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="10" cy="10" r="6" />
                <path strokeLinecap="round" d="m15 15 5 5" />
              </svg>
              Buscar Disponibilidad
            </Button>
          </div>
        </div>
      </Card>
      {selectedDoctor && (
        <Card className="flex items-center gap-4 p-5 sm:p-6">
          <div className="relative shrink-0" aria-hidden="true">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-med-primary-200 bg-med-primary-100 text-3xl sm:h-16 sm:w-16">
              👨‍⚕️
            </div>

            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1 break-words">
            <h2 className="text-base font-bold text-med-primary-900 sm:text-lg">
              {selectedDoctor.name}
            </h2>
            <p className="text-sm text-med-text-sub">
              {selectedDoctor.specialty?.name}
            </p>
            {selectedDoctor.licenseNumber && (
              <p className="text-sm text-med-text-sub">
                Matrícula: {selectedDoctor.licenseNumber}
              </p>
            )}
          </div>
        </Card>
      )}
      {selectedDoctor && showSlots && (
        <PatientAvailableSlots
          key={`${selectedDoctor.id}-${slotsVersion}`}
          doctorId={selectedDoctor.id}
          selectedSlotId={selectedSlot?.id}
          onSlotChange={handleSlotChange}
        />
      )}
      {showSlots && !selectedSlot && <Alert message={errorMessage} />}
      {selectedDoctor && selectedSlot && (
        <PatientBookingForm
          key={selectedSlot.id}
          doctor={selectedDoctor}
          slot={selectedSlot}
          onConfirm={handleConfirm}
          isSaving={isSaving}
          errorMessage={errorMessage}
        />
      )}
      <Snackbar notification={notification} onClose={closeSnackbar} />
    </fieldset>
  );
}

export default PatientHome;
