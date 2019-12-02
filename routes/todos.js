const express = require('express');
const router = express.Router();

const {
  getTodos,
  addTodo,
  removeTodo,
  toggleTodoCompletion
} = require('../services/todos');

const authMiddleware = require('../middleware/auth');

// get all todos - GET /todos
// public
router.get('/', getTodos);

// add todo - POST /todos
// private
router.post('/', authMiddleware, addTodo);

// remove todo - DELETE /todo/:id
// private
router.delete('/:id', authMiddleware, removeTodo);

// done/undone todo - PATCH /todo/:id
// private
router.patch('/:id', authMiddleware, toggleTodoCompletion);

module.exports = router;
