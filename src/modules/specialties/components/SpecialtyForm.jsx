import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';

function SpecialtyForm({ onSave, onCancel, isSaving = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      isActive: 'true',
    },
  });

  const onValid = async (data) => {
    await onSave({
      name: data.name.trim(),
      description: data.description.trim(),
      isActive: data.isActive === 'true',
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit(onValid)}>
      <fieldset disabled={isSaving} className="flex flex-col gap-5">
        <legend className="sr-only">Datos de la especialidad</legend>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="specialty-name"
            className="text-xs font-semibold text-med-text-main"
          >
            Nombre de la especialidad
          </label>

          <Input
            id="specialty-name"
            type="text"
            placeholder="Ej.: Cardiología"
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

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="specialty-description"
            className="text-xs font-semibold text-med-text-main"
          >
            Descripción
          </label>

          <textarea
            id="specialty-description"
            rows={4}
            maxLength={100}
            placeholder="Describí el alcance de la especialidad."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? 'specialty-description-error' : undefined
            }
            className={`w-full resize-y rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
              errors.description ? 'border-red-400' : 'border-med-border'
            }`}
            {...register('description', {
              required: 'La descripción es obligatoria',
              validate: (value) => {
                const description = value.trim();

                return (
                  (description.length >= 10 && description.length <= 100) ||
                  'La descripción debe tener entre 10 y 100 caracteres.'
                );
              },
            })}
          />

          {errors.description && (
            <p
              id="specialty-description-error"
              className="text-xs text-red-500 font-medium"
            >
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="specialty-active"
            className="text-xs font-semibold text-med-text-main"
          >
            Estado inicial
          </label>

          <select
            id="specialty-active"
            className="w-full text-sm"
            {...register('isActive')}
          >
            <option value="true">Activa</option>
            <option value="false">Inactiva</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 border-t border-med-border pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Guardar Especialidad'}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

export default SpecialtyForm;
