const expires = require('express');

const auth = require('./../middleware/auth');
const controller = require('../controllers/todoController');

const router = expires.Router();

router.get('/', auth, controller.list);
router.get('/:id', auth, controller.details);
router.post('/', auth, controller.create);
router.patch('/:id', auth, controller.update);
router.delete('/:id', auth, controller.delete);
router.post('/share/:id', auth, controller.share);

module.exports = router;