import { instance } from '../../shared/api/axiosInstance';

export const logout = async () => {
  await instance.post('api/auth/logout');
};
