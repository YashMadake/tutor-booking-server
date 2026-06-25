import api from './axios';

export const listTutors = (params) =>
  api.get('/tutors', { params }).then((r) => r.data);

export const getTutor = (userId) =>
  api.get(`/tutors/${userId}`).then((r) => r.data);

export const getMyProfile = () =>
  api.get('/tutors/me/profile').then((r) => r.data);

export const upsertMyProfile = (data) =>
  api.put('/tutors/me/profile', data).then((r) => r.data);