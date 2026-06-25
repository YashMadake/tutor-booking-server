import api from './axios';
export const createBooking = (slotId) => api.post('/bookings', { slotId }).then(r => r.data);
export const myStudentBookings = () => api.get('/bookings/me/student').then(r => r.data);
export const myTutorBookings = () => api.get('/bookings/me/tutor').then(r => r.data);
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`).then(r => r.data);