import { instance } from '../../shared/api/axiosInstance';

export const getSpecialties = async ({
  pageIndex = 1,
  pageSize = 10,
  name = '',
} = {}) => {
  const response = await instance.get('api/specialties', {
    params: { pageIndex, pageSize, name: name.trim() || undefined },
  });

  return response.data;
};

export const createSpecialty = async (specialty) => {
  const response = await instance.post('api/specialties', specialty);

  return response.data;
};

export const deleteSpecialty = async (id) => {
  await instance.delete(`api/specialties/${id}`);
};
