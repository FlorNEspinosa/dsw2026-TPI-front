import { useState } from 'react';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import useAvailableSlots from '../hooks/useAvailableSlots';

function getWeekDates(referenceDate, offset) {
  const monday = new Date(referenceDate + 'T12:00:00');
  const daysFromMonday = (monday.getDay() + 6) % 7;

  monday.setDate(monday.getDate() - daysFromMonday + offset * 7);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);

    day.setDate(monday.getDate() + index);

    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const date = String(day.getDate()).padStart(2, '0');

    return [year, month, date].join('-');
  });
}

function PatientAvailableSlots({ doctorId, selectedSlotId, onSlotChange }) {
  const { slots, isLoading, errorMessage } = useAvailableSlots(doctorId);
  const [chosenDate, setChosenDate] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  if (isLoading) {
    return <p role="status">Buscando horarios disponibles…</p>;
  }

  if (errorMessage) {
    return <Alert message={errorMessage} />;
  }

  if (slots.length === 0) {
    return <p role="status">Sin disponibilidad para este médico.</p>;
  }

  const availableDates = [...new Set(slots.map((slot) => slot.date))].sort();
  const weekDates = getWeekDates(availableDates[0], weekOffset);

  const hasWeekendSlots = slots.some((slot) =>
    weekDates.slice(5).includes(slot.date)
  );

  const dates = hasWeekendSlots ? weekDates : weekDates.slice(0, 5);

  const firstDateWithSlots = dates.find((day) =>
    slots.some((slot) => slot.date === day)
  );

  const date = dates.includes(chosenDate)
    ? chosenDate
    : (firstDateWithSlots ?? dates[0]);

  const dailySlots = slots.filter((slot) => slot.date === date);

  const hasNextWeek = availableDates[availableDates.length - 1] > weekDates[6];

  const weekLabel = [dates[0], dates[dates.length - 1]]
    .map((day) =>
      new Date(day + 'T12:00:00').toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
      })
    )
    .join(' – ');

  function changeDate(nextDate) {
    if (nextDate !== date) {
      setChosenDate(nextDate);
      onSlotChange(null);
    }
  }
  function selectSlot(slot) {
    setChosenDate(slot.date);
    onSlotChange(slot);
  }

  function changeWeek(direction) {
    setWeekOffset((current) => current + direction);
    setChosenDate('');
    onSlotChange(null);
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="sr-only">Disponibilidad semanal</h2>

      <div className="flex flex-col gap-3 border-b border-med-border-subtle pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            aria-label="Semana anterior"
            disabled={weekOffset === 0}
            onClick={() => changeWeek(-1)}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </Button>

          <span className="text-xs font-bold text-med-primary-900 md:text-sm">
            {weekLabel}
          </span>

          <Button
            variant="ghost"
            aria-label="Semana siguiente"
            disabled={!hasNextWeek}
            onClick={() => changeWeek(1)}
            className="disabled:cursor-not-allowed disabled:opacity-40"
          >
            ›
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-med-text-sub">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-med-primary-900" />
            Disponible
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Seleccionado
          </span>
        </div>
      </div>
      <h3 className="mt-5 text-xs font-semibold md:hidden">Próximos turnos</h3>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
        {dates.map((day) => (
          <Button
            key={day}
            className="shrink-0"
            variant={day === date ? 'default' : 'outline'}
            aria-pressed={day === date}
            onClick={() => changeDate(day)}
          >
            {new Date(day + 'T12:00:00').toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'short',
            })}
          </Button>
        ))}
      </div>

      <h3 className="mt-5 text-xs font-semibold md:hidden">
        Horarios disponibles
      </h3>
      <div className="mt-2 grid grid-cols-3 gap-2 md:hidden">
        {dailySlots.map((slot) => (
          <Button
            key={slot.id}
            variant={slot.id === selectedSlotId ? 'default' : 'outline'}
            aria-pressed={slot.id === selectedSlotId}
            onClick={() => selectSlot(slot)}
          >
            {slot.startTime}
          </Button>
        ))}
      </div>
      {dailySlots.length === 0 && (
        <p className="mt-3 text-xs text-med-text-muted md:hidden">
          No hay turnos disponibles para este día.
        </p>
      )}

      <div
        className={
          hasWeekendSlots
            ? 'hidden gap-3 pt-5 md:grid md:grid-cols-7'
            : 'hidden gap-3 pt-5 md:grid md:grid-cols-5'
        }
      >
        {dates.map((day) => {
          const daySlots = slots.filter((slot) => slot.date === day);

          return (
            <div key={day} className="min-w-0 text-center">
              <p className="text-xs font-bold uppercase text-med-text-sub">
                {new Date(day + 'T12:00:00').toLocaleDateString('es-AR', {
                  weekday: 'short',
                })}
              </p>

              <p className="text-xl font-bold text-med-primary-900">
                {new Date(day + 'T12:00:00').getDate()}
              </p>

              <div className="mt-3 flex flex-col gap-2">
                {daySlots.length === 0 ? (
                  <p className="py-8 text-xs text-med-text-muted">
                    No hay turnos disponibles para este día.
                  </p>
                ) : (
                  daySlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      aria-pressed={slot.id === selectedSlotId}
                      aria-label={
                        'Seleccionar ' + day + ' a las ' + slot.startTime
                      }
                      onClick={() => selectSlot(slot)}
                      className={
                        'w-full rounded-lg border px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-med-primary-600 ' +
                        (slot.id === selectedSlotId
                          ? 'border-emerald-400 bg-emerald-400 text-white'
                          : 'border-med-border bg-white text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50')
                      }
                    >
                      {slot.startTime}
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default PatientAvailableSlots;
