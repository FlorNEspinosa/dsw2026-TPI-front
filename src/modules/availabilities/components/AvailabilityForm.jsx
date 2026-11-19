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
      return [];
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

  const addDay = (day) => {
    setErrorMessage('');
    const newDay = { ...createEmptyDay(), day };

    setDays((current) => [...current, newDay]);
  };

  const removeDay = (rowKey) => {
    setErrorMessage('');

    setDays((current) => current.filter((entry) => entry.rowKey !== rowKey));
  };

  const toggleDay = (day, isActive) => {
    if (isActive) {
      addDay(day);

      return;
    }

    setErrorMessage('');
    setDays((current) => current.filter((entry) => entry.day !== day));
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

        <Alert message={errorMessage} />

        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Días y horarios de atención del mes actual
          </caption>

          <thead className="bg-med-primary-50 text-xs uppercase text-med-text-sub">
            <tr>
              <th scope="col" className="p-3">
                Día
              </th>
              <th scope="col" className="p-3">
                Estado
              </th>
              <th scope="col" className="p-3">
                Entrada
              </th>
              <th scope="col" className="p-3">
                Salida
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-med-border">
            {WEEK_DAYS.map((weekDay) => {
              const entries = days.filter(
                (entry) => entry.day === weekDay.value
              );
              const isActive = entries.length > 0;

              return (
                <tr key={weekDay.value}>
                  <th scope="row" className="p-3 align-top font-medium">
                    <div className="flex flex-col items-start gap-2">
                      <span>{weekDay.label}</span>

                      {isActive && (
                        <Button
                          variant="ghost"
                          onClick={() => addDay(weekDay.value)}
                          aria-label={`Agregar franja para ${weekDay.label}`}
                          className="text-xs"
                        >
                          + Franja
                        </Button>
                      )}
                    </div>
                  </th>

                  <td className="p-3 align-top">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isActive}
                      aria-label={`Atención del ${weekDay.label}`}
                      onClick={() => toggleDay(weekDay.value, !isActive)}
                      className="inline-flex items-center gap-2 py-2"
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-9 items-center rounded-full px-0.5 ${isActive ? 'bg-med-primary-900' : 'bg-gray-200'}`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`}
                        />
                      </span>

                      <span className="text-xs">
                        {isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </button>
                  </td>

                  <td className="p-3 align-top">
                    <div className="flex flex-col gap-3">
                      {isActive ? (
                        entries.map((entry, index) => (
                          <Input
                            key={entry.rowKey}
                            type="time"
                            step={60}
                            value={entry.startTime}
                            aria-label={`${weekDay.label}, entrada, franja ${index + 1}`}
                            onChange={(event) =>
                              updateDay(
                                entry.rowKey,
                                'startTime',
                                event.target.value
                              )
                            }
                          />
                        ))
                      ) : (
                        <Input
                          type="time"
                          value=""
                          disabled
                          readOnly
                          aria-label={`Entrada del ${weekDay.label}`}
                        />
                      )}
                    </div>
                  </td>

                  <td className="p-3 align-top">
                    <div className="flex flex-col gap-3">
                      {isActive ? (
                        entries.map((entry, index) => (
                          <div
                            key={entry.rowKey}
                            className="flex items-center gap-2"
                          >
                            <Input
                              type="time"
                              step={60}
                              value={entry.endTime}
                              aria-label={`${weekDay.label}, salida, franja ${index + 1}`}
                              onChange={(event) =>
                                updateDay(
                                  entry.rowKey,
                                  'endTime',
                                  event.target.value
                                )
                              }
                            />

                            {entries.length > 1 && (
                              <Button
                                variant="ghost"
                                onClick={() => removeDay(entry.rowKey)}
                                aria-label={`Quitar franja ${index + 1} del ${weekDay.label}`}
                                className="text-xs"
                              >
                                Quitar
                              </Button>
                            )}
                          </div>
                        ))
                      ) : (
                        <Input
                          type="time"
                          value=""
                          disabled
                          readOnly
                          aria-label={`Salida del ${weekDay.label}`}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-end gap-3 border-t border-med-border pt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>

          <Button type="submit">
            {isSaving ? 'Guardando...' : 'Guardar disponibilidad'}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

export default AvailabilityForm;
