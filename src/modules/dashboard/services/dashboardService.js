import { instance } from '../../shared/api/axiosInstance';

export const getDashboardSummary = async () => {
  const response = await instance.get('api/dashboard');

  return response.data;
};
