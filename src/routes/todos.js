const expires = require('express');
const controller = require('../controllers/todoController');

const router = expires.Router();


router.get('/', controller.todoList);
router.get('/:id', controller.todoDetails);
router.post('/', controller.todoCreate);
router.post('/share', controller.todoShare);
router.patch('/:id', controller.todoUpdate);
router.delete('/:id', controller.todoDelete);

module.exports = router;