import api from './axios';
export const createSlot = (data) => api.post('/slots', data).then(r => r.data);
export const listMySlots = () => api.get('/slots/me').then(r => r.data);
export const listTutorOpenSlots = (userId) => api.get(`/slots/tutor/${userId}/open`).then(r => r.data);
export const cancelSlot = (id) => api.delete(`/slots/${id}`).then(r => r.data);