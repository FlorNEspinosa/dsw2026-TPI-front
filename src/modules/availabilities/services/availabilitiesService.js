import { instance } from '../../shared/api/axiosInstance';

export const getDoctorAvailabilities = async (doctorId) => {
  const response = await instance.get(`api/doctors/${doctorId}/availabilities`);

  return response.data;
};

export const createAvailabilities = async (availability) => {
  const response = await instance.post('api/availabilities', availability);

  return response.data;
};

export const updateAvailabilities = async (availability) => {
  const response = await instance.put('api/availabilities', availability);

  return response.data;
};
