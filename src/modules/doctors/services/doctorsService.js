import { instance } from '../../shared/api/axiosInstance';

export const getDoctors = async ({
  pageIndex = 1,
  pageSize = 10,
  name = '',
  specialtyId = '',
} = {}) => {
  const response = await instance.get('api/doctors', {
    params: {
      pageIndex,
      pageSize,
      name: name.trim() || undefined,
      specialtyId: specialtyId || undefined,
    },
  });

  return response.data;
};

export const createDoctor = async (doctor) => {
  const response = await instance.post('api/doctors', doctor);

  return response.data;
};

export const deleteDoctor = async (id) => {
  await instance.delete(`api/doctors/${id}`);
};

export const getAvailableSlots = async (
  doctorId,
  { fromDate, toDate } = {}
) => {
  const response = await instance.get(`api/doctors/${doctorId}/slots`, {
    params: { fromDate, toDate },
  });

  return response.data;
};
