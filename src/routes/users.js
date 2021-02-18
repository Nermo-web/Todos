const expires = require('express');
const controller = require('../controllers/userController');

const router = expires.Router();


router.get('/', controller.userList);
router.get('/:id', controller.userDetails);
router.post('/', controller.userCreate);
router.patch('/:id', controller.userUpdate);
router.delete('/:id', controller.userDelete);
router.post('/login', controller.userLogin);
router.post('/logout', controller.userLogout);

module.exports = router;