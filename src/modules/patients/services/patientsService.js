import { instance } from '../../shared/api/axiosInstance';

export const getMyProfile = async () => {
  const response = await instance.get('api/patients/me');

  return response.data;
};
