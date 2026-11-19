import { useState } from 'react';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import useAvailableSlots from '../hooks/useAvailableSlots';

function PatientAvailableSlots({ doctorId, selectedSlotId, onSlotChange }) {
  const { slots, isLoading, errorMessage } = useAvailableSlots(doctorId);
  const [chosenDate, setChosenDate] = useState('');

  if (isLoading) {
    return <p role="status">Buscando horarios disponibles…</p>;
  }

  if (errorMessage) {
    return <Alert message={errorMessage} />;
  }

  if (slots.length === 0) {
    return <p role="status">Sin disponibilidad para este médico.</p>;
  }

  const dates = [...new Set(slots.map((slot) => slot.date))];
  const date = dates.includes(chosenDate) ? chosenDate : dates[0];
  const dailySlots = slots.filter((slot) => slot.date === date);

  function changeDate(nextDate) {
    if (nextDate !== date) {
      setChosenDate(nextDate);
      onSlotChange(null);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-bold">Próximos turnos</h2>
      <div className="mt-3 flex gap-2 overflow-x-auto">
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

      <h3 className="mt-5 font-semibold">Horarios disponibles</h3>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {dailySlots.map((slot) => (
          <Button
            key={slot.id}
            variant={slot.id === selectedSlotId ? 'default' : 'outline'}
            aria-pressed={slot.id === selectedSlotId}
            onClick={() => onSlotChange(slot)}
          >
            {slot.startTime}
          </Button>
        ))}
      </div>
    </Card>
  );
}

export default PatientAvailableSlots;
