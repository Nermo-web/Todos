const expires = require('express');

const auth = require('./../middleware/auth');
const controller = require('../controllers/userController');

const router = expires.Router();

router.get('/', auth, controller.userList);
router.get('/:id', auth, controller.userDetails);
router.post('/', controller.userCreate);
router.patch('/:id', auth, controller.userUpdate);
router.delete('/:id', auth, controller.userDelete);
router.post('/login', controller.userLogin);
router.post('/logout', auth, controller.userLogout);

module.exports = router;