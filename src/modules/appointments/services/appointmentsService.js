import { instance } from '../../shared/api/axiosInstance';

export const createAppointment = async ({
  doctorId,
  availabilitySlotId,
  dni,
  reason,
}) => {
  const response = await instance.post('api/appointments', {
    doctorId,
    availabilitySlotId,
    patient: { dni },
    reason,
  });

  return response.data;
};

export const getMyAppointments = async () => {
  const response = await instance.get('api/appointments/patient');

  return response.data;
};

export const cancelAppointment = async (appointmentId) => {
  await instance.delete(`api/appointments/${appointmentId}`);
};
