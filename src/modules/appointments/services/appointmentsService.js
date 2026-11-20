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

export const searchAppointments = async ({
  specialtyId = '',
  doctorId = '',
  dni = '',
  date = '',
  patientName = '',
  pageIndex = 1,
  pageSize = 10,
} = {}) => {
  const response = await instance.get('api/appointments/search', {
    params: {
      specialtyId: specialtyId || undefined,
      doctorId: doctorId || undefined,
      dni: String(dni).trim() || undefined,
      date: date || undefined,
      patientName: patientName.trim() || undefined,
      pageIndex,
      pageSize,
    },
  });

  return response.data;
};
