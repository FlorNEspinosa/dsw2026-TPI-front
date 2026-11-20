import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';
import useSpecialtyOptions from '../../specialties/hooks/useSpecialtyOptions';
import useDoctorOptions from '../../doctors/hooks/useDoctorOptions';

function AppointmentsFilters({ onSearch, isLoading = false }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      patientQuery: '',
      specialtyId: '',
      doctorId: '',
      date: '',
    },
  });

  const {
    specialties,
    isLoading: loadingSpecialties,
    errorMessage: specialtiesError,
  } = useSpecialtyOptions();

  const {
    doctors,
    isLoading: loadingDoctors,
    errorMessage: doctorsError,
  } = useDoctorOptions();

  const specialtyId = watch('specialtyId');
  const filteredDoctors = specialtyId
    ? doctors.filter((doctor) => doctor.specialty?.id === specialtyId)
    : doctors;

  function onValid(data) {
    const patientQuery = data.patientQuery.trim();
    const isDni = /^\d+$/.test(patientQuery);

    onSearch({
      specialtyId: data.specialtyId,
      doctorId: data.doctorId,
      date: data.date,
      dni: isDni ? patientQuery : '',
      patientName: isDni ? '' : patientQuery,
    });
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onValid)}
      className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 items-start"
    >
      <div>
        <label htmlFor="appointment-patient" className="text-xs font-semibold">
          Nombre o DNI del Paciente
        </label>
        <Input
          id="appointment-patient"
          placeholder="Nombre o DNI..."
          maxLength={150}
          error={errors.patientQuery?.message}
          {...register('patientQuery', {
            validate: (value) => {
              const text = value.trim();

              if (/^\d+$/.test(text)) {
                return (
                  (/^\d{7,8}$/.test(text) && Number(text) >= 1000000) ||
                  'Ingresá un DNI de 7 u 8 dígitos, sin puntos.'
                );
              }

              return text.length <= 150 || 'Ingresá hasta 150 caracteres.';
            },
          })}
        />
      </div>

      <div>
        <label
          htmlFor="appointment-specialty"
          className="text-xs font-semibold"
        >
          Especialidad
        </label>
        <select
          id="appointment-specialty"
          disabled={loadingSpecialties}
          className="w-full rounded-lg border border-med-border bg-white px-3 py-2.5 text-sm"
          {...register('specialtyId', {
            onChange: () => setValue('doctorId', ''),
          })}
        >
          <option value="">
            {loadingSpecialties ? 'Cargando…' : 'Todas las especialidades'}
          </option>
          {specialties.map((specialty) => (
            <option key={specialty.id} value={specialty.id}>
              {specialty.name}
            </option>
          ))}
        </select>
        <Alert message={specialtiesError} />
      </div>

      <div>
        <label htmlFor="appointment-doctor" className="text-xs font-semibold">
          Doctor
        </label>
        <select
          id="appointment-doctor"
          disabled={loadingDoctors}
          className="w-full rounded-lg border border-med-border bg-white px-3 py-2.5 text-sm"
          {...register('doctorId')}
        >
          <option value="">
            {loadingDoctors ? 'Cargando…' : 'Todos los doctores'}
          </option>
          {filteredDoctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
        <Alert message={doctorsError} />
      </div>

      <div>
        <label htmlFor="appointment-date" className="text-xs font-semibold">
          Fecha
        </label>
        <Input id="appointment-date" type="date" {...register('date')} />
      </div>

      <div className="pt-5">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Buscando…' : 'Aplicar Filtros'}
        </Button>
      </div>
    </form>
  );
}

export default AppointmentsFilters;
