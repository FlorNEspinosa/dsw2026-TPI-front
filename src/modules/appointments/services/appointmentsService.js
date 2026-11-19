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
