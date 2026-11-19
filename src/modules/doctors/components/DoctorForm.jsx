import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';

function DoctorForm({ specialties = [], onSave, onCancel, isSaving = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      specialtyId: '',
      licenseNumber: '',
    },
  });

  const onValid = async (data) => {
    await onSave({
      name: data.name.trim(),
      specialtyId: data.specialtyId,
      licenseNumber: data.licenseNumber.trim() || null,
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onValid)}>
      <fieldset disabled={isSaving} className="flex flex-col gap-5">
        <legend className="sr-only">Datos del médico</legend>

        {specialties.length === 0 && (
          <Alert
            variant="info"
            message="Para registrar un médico, primero debe existir una especialidad."
          />
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="doctor-name"
            className="text-xs font-semibold text-med-text-main"
          >
            Nombre completo del médico
          </label>

          <Input
            id="doctor-name"
            type="text"
            placeholder="Ej.: Alejandro Martínez"
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            error={errors.name?.message}
            {...register('name', {
              required: 'El nombre es obligatorio',
              validate: (value) => {
                const name = value.trim();

                return (
                  (name.length >= 3 && name.length <= 100) ||
                  'El nombre debe tener entre 3 y 100 caracteres.'
                );
              },
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="doctor-specialty"
              className="text-xs font-semibold text-med-text-main"
            >
              Especialidad
            </label>

            <select
              id="doctor-specialty"
              aria-invalid={Boolean(errors.specialtyId)}
              aria-describedby={
                errors.specialtyId ? 'doctor-specialty-error' : undefined
              }
              className={`w-full text-sm ${
                errors.specialtyId ? 'border-red-400' : 'border-med-border'
              }`}
              {...register('specialtyId', {
                required: 'Seleccioná una especialidad',
                validate: (value) =>
                  specialties.some((specialty) => specialty.id === value) ||
                  'Seleccioná una especialidad disponible.',
              })}
            >
              <option value="">Seleccioná una especialidad</option>

              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                  {specialty.isActive ? '' : ' (inactiva)'}
                </option>
              ))}
            </select>

            {errors.specialtyId && (
              <p
                id="doctor-specialty-error"
                className="text-xs text-red-500 font-medium"
              >
                {errors.specialtyId.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="doctor-license"
              className="text-xs font-semibold text-med-text-main"
            >
              Matrícula médica (opcional)
            </label>

            <Input
              id="doctor-license"
              type="text"
              placeholder="Ej.: MP12345"
              maxLength={50}
              aria-invalid={Boolean(errors.licenseNumber)}
              error={errors.licenseNumber?.message}
              {...register('licenseNumber', {
                maxLength: {
                  value: 50,
                  message: 'La matrícula no puede superar los 50 caracteres.',
                },
              })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-med-border pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={isSaving || specialties.length === 0}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Guardar Médico'}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

export default DoctorForm;
