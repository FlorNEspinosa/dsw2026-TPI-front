import { useState } from 'react';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import Alert from '../../shared/components/Alert';

const WEEK_DAYS = [
  { value: 'LUNES', label: 'Lunes' },
  { value: 'MARTES', label: 'Martes' },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES', label: 'Jueves' },
  { value: 'VIERNES', label: 'Viernes' },
  { value: 'SABADO', label: 'Sábado' },
  { value: 'DOMINGO', label: 'Domingo' },
];

function createEmptyDay() {
  return {
    rowKey: crypto.randomUUID(),
    day: 'LUNES',
    startTime: '',
    endTime: '',
  };
}

function AvailabilityForm({
  initialAvailabilities = [],
  isEditing = false,
  isSaving = false,
  onSave,
  onCancel,
}) {
  const [days, setDays] = useState(() => {
    if (initialAvailabilities.length === 0) {
      return [createEmptyDay()];
    }

    return initialAvailabilities.map((availability) => ({
      rowKey: availability.id,
      day: availability.day,
      startTime: availability.startTime.slice(0, 5),
      endTime: availability.endTime.slice(0, 5),
    }));
  });

  const [errorMessage, setErrorMessage] = useState('');

  const updateDay = (rowKey, field, value) => {
    setErrorMessage('');

    setDays((current) =>
      current.map((entry) =>
        entry.rowKey === rowKey ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addDay = () => {
    setErrorMessage('');
    const newDay = createEmptyDay();

    setDays((current) => [...current, newDay]);
  };

  const removeDay = (rowKey) => {
    setErrorMessage('');

    setDays((current) => current.filter((entry) => entry.rowKey !== rowKey));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setErrorMessage('');

    if (days.length === 0 && !isEditing) {
      setErrorMessage('Agregá al menos una franja horaria.');

      return;
    }

    const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

    for (const [index, entry] of days.entries()) {
      const rowNumber = index + 1;

      if (!WEEK_DAYS.some((day) => day.value === entry.day)) {
        setErrorMessage(`Franja ${rowNumber}: seleccioná un día válido.`);

        return;
      }

      if (
        !timePattern.test(entry.startTime) ||
        !timePattern.test(entry.endTime)
      ) {
        setErrorMessage(
          `Franja ${rowNumber}: completá la hora de inicio y de fin.`
        );

        return;
      }

      if (entry.startTime >= entry.endTime) {
        setErrorMessage(
          `Franja ${rowNumber}: el inicio debe ser anterior al fin.`
        );

        return;
      }

      const [startHour, startMinute] = entry.startTime.split(':').map(Number);
      const [endHour, endMinute] = entry.endTime.split(':').map(Number);

      const duration =
        endHour * 60 + endMinute - (startHour * 60 + startMinute);

      if (duration < 30) {
        setErrorMessage(
          `Franja ${rowNumber}: la duración mínima es de 30 minutos.`
        );

        return;
      }

      const hasOverlap = days
        .slice(0, index)
        .some(
          (other) =>
            other.day === entry.day &&
            entry.startTime < other.endTime &&
            entry.endTime > other.startTime
        );

      if (hasOverlap) {
        setErrorMessage(
          `Franja ${rowNumber}: el horario se superpone con otra franja del mismo día.`
        );

        return;
      }
    }

    if (
      isEditing &&
      days.length === 0 &&
      !window.confirm(
        '¿Querés quitar todas las franjas de disponibilidad del mes actual?'
      )
    ) {
      return;
    }

    await onSave(
      days.map((entry) => ({
        day: entry.day,
        startTime: `${entry.startTime}:00`,
        endTime: `${entry.endTime}:00`,
      }))
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <fieldset disabled={isSaving} className="flex flex-col gap-5">
        <legend className="sr-only">Franjas de disponibilidad</legend>

        <p className="text-sm text-med-text-sub">
          Configurá los días y horarios del mes actual. Podés agregar más de una
          franja por día, siempre que no se superpongan.
        </p>

        <Alert message={errorMessage} />

        {days.length === 0 && (
          <Alert
            variant="info"
            message="No hay franjas cargadas en el formulario."
          />
        )}

        {days.map((entry, index) => (
          <div
            key={entry.rowKey}
            className="grid grid-cols-[minmax(180px,1fr)_160px_160px_auto] items-start gap-4 rounded-lg border border-med-border p-4"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`day-${entry.rowKey}`}
                className="text-xs font-semibold text-med-text-main"
              >
                Día · Franja {index + 1}
              </label>

              <select
                id={`day-${entry.rowKey}`}
                value={entry.day}
                onChange={(event) =>
                  updateDay(entry.rowKey, 'day', event.target.value)
                }
                className="w-full rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-med-primary-600"
              >
                {WEEK_DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`start-${entry.rowKey}`}
                className="text-xs font-semibold text-med-text-main"
              >
                Hora de inicio
              </label>

              <Input
                id={`start-${entry.rowKey}`}
                type="time"
                step={60}
                value={entry.startTime}
                onChange={(event) =>
                  updateDay(entry.rowKey, 'startTime', event.target.value)
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`end-${entry.rowKey}`}
                className="text-xs font-semibold text-med-text-main"
              >
                Hora de fin
              </label>

              <Input
                id={`end-${entry.rowKey}`}
                type="time"
                step={60}
                value={entry.endTime}
                onChange={(event) =>
                  updateDay(entry.rowKey, 'endTime', event.target.value)
                }
              />
            </div>

            <Button
              variant="danger"
              onClick={() => removeDay(entry.rowKey)}
              aria-label={`Quitar franja ${index + 1}`}
              className="mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quitar
            </Button>
          </div>
        ))}

        <div>
          <Button
            variant="secondary"
            onClick={addDay}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Agregar franja
          </Button>
        </div>

        <div className="flex justify-end gap-3 border-t border-med-border pt-4">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Guardando...' : 'Guardar disponibilidad'}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

export default AvailabilityForm;
