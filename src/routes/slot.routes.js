const router = require('express').Router();
const ctrl = require('../controllers/slot.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const role = require('../middleware/role');
const schemas = require('../validators/slot.validator');

router.post(
    '/',
    auth,
    role('tutor'),
    validate(schemas.createSlot),
    ctrl.createSlot
);

router.get('/me', auth, role('tutor'), ctrl.listMySlots);
router.delete('/:id', auth, role('tutor'), ctrl.cancelSlot);

// Public: browse a tutor's open slots
router.get('/tutor/:userId/open', ctrl.listTutorOpenSlots);

module.exports = router;