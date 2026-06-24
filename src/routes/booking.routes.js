const router = require('express').Router();
const ctrl = require('../controllers/booking.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const schemas = require('../validators/booking.validator');

router.post(
  '/',
  auth,
  role('student'),
  validate(schemas.createBooking),
  ctrl.createBooking
);
router.get('/me/student', auth, role('student'), ctrl.listMyStudentBookings);
router.get('/me/tutor', auth, role('tutor'), ctrl.listMyTutorBookings);
router.patch('/:id/cancel', auth, ctrl.cancelBooking);

module.exports = router;