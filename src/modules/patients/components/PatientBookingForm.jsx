import { useForm } from 'react-hook-form';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';

function PatientBookingForm({
  doctor,
  slot,
  onConfirm,
  isSaving,
  errorMessage,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { reason: '' } });

  const dateLabel = new Date(slot.date + 'T12:00:00').toLocaleDateString(
    'es-AR',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <Card>
      <h2 className="font-bold">Resumen de selección</h2>
      <p className="mt-2 font-semibold">{doctor.name}</p>
      <p className="text-sm">
        {dateLabel}, de {slot.startTime} a {slot.endTime}
      </p>

      <form
        className="mt-4 flex flex-col gap-4"
        onSubmit={handleSubmit(onConfirm)}
      >
        <Input
          label="Motivo de consulta"
          aria-label="Motivo de consulta"
          maxLength={300}
          error={errors.reason?.message}
          {...register('reason', {
            setValueAs: (value) => value.trim(),
            required: 'Ingresá el motivo de la consulta.',
            minLength: {
              value: 5,
              message: 'Escribí al menos 5 caracteres.',
            },
          })}
        />
        <Alert message={errorMessage} />
        <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? 'Confirmando…' : 'Confirmar turno'}
        </Button>
      </form>
    </Card>
  );
}

export default PatientBookingForm;
