const expires = require('express');

const error = require('./../middleware/error');
const upload = require('./../middleware/upload');
const auth = require('./../middleware/auth');

const controller = require('../controllers/userController');

const router = expires.Router();

router.get('/friends', auth, controller.friends, error);
router.post('/friends', auth, controller.addFriends, error);
router.delete('/friends', auth, controller.removeFriends, error);

router.get('/:id', auth, controller.details, error);
router.post('/', controller.create, error);
router.patch('/:id', auth, controller.update, error);
router.delete('/:id', auth, controller.details, error);
router.post('/login', controller.login, error);
router.post('/logout', auth, controller.logout, error);

router.post('/avatar', auth, upload.single('file'), controller.setAvatar, error);
router.get('/avatar/:id', controller.getAvatar, error);

module.exports = router;