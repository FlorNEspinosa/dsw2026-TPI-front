import useDoctorOptions from '../../doctors/hooks/useDoctorOptions';
import Alert from '../../shared/components/Alert';

function PatientDoctorSelect({
  specialtyId,
  selectedDoctorId,
  onDoctorChange,
}) {
  const { doctors, isLoading, errorMessage } = useDoctorOptions(specialtyId);

  function handleChange(event) {
    const doctor = doctors.find((item) => item.id === event.target.value);

    onDoctorChange(doctor ?? null);
  }

  return (
    <div className="md:col-span-4 flex flex-col gap-1.5">
      <label
        htmlFor="patient-doctor"
        className="text-xs font-semibold text-med-text-sub"
      >
        Seleccionar médico
      </label>
      <select
        id="patient-doctor"
        value={selectedDoctorId}
        onChange={handleChange}
        disabled={isLoading || doctors.length === 0}
        className="w-full px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600"
      >
        <option value="">
          {isLoading ? 'Cargando médicos…' : 'Elegí un médico'}
        </option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </select>

      <Alert message={errorMessage} />
      {!isLoading && !errorMessage && doctors.length === 0 && (
        <p className="text-sm text-med-text-sub">
          Sin médicos disponibles para esta especialidad.
        </p>
      )}
    </div>
  );
}

export default PatientDoctorSelect;
