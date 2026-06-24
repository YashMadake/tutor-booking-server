const router = require('express').Router();
const ctrl = require('../controllers/tutor.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');
const schemas = require('../validators/tutor.validator');

// Public browse
router.get('/', ctrl.listTutors);

// Tutor self-management (must come before /:userId)
router.get('/me/profile', auth, role('tutor'), ctrl.getMyProfile);
router.put(
  '/me/profile',
  auth,
  role('tutor'),
  validate(schemas.upsertProfile),
  ctrl.upsertMyProfile
);

// Public single tutor
router.get('/:userId', ctrl.getTutor);

module.exports = router;