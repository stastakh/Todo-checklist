const fs = require('fs');

const uuidv4 = require('uuid/v4');

const Todo = require('../models/Todo');
const todoSchema = require('../validation/todo');

const FILE_PATH = './data/todos.json';

const getDataFromFile = filePath => {
  // get data from the file
  const data = fs.readFileSync(filePath, 'utf8');
  if (data) {
    const parsedData = JSON.parse(data);
    return parsedData;
  } else {
    return [];
  }
};

const rewriteFile = (filePath, data) => {
  const stringifiedData = JSON.stringify(data);
  // write data to the file
  fs.writeFileSync(filePath, stringifiedData);
};

const getTodos = (req, res, next) => {
  const todos = getDataFromFile(FILE_PATH);
  if (todos.length === 0) {
    const error = {
      status: 404,
      message: 'There is no data in the database.'
    };
    next(error);
  } else {
    res.status(200).send(todos);
  }
};

const addTodo = (req, res, next) => {
  const todos = getDataFromFile(FILE_PATH);
  // Check if data is valid
  const { error, value } = todoSchema.validate(req.body);
  if (!error) {
    // data is valid -> create new todo
    const newTodo = new Todo({
      id: uuidv4(),
      name: value.name,
      description: value.description
    });
    // add new todo to the todos array
    const newTodos = todos.concat(newTodo);
    rewriteFile(FILE_PATH, newTodos);
    res.status(200).send(newTodo);
  } else {
    const err = {
      status: 400,
      message: error.details[0].message
    };
    next(err);
  }
};

const removeTodo = (req, res, next) => {
  const todos = getDataFromFile(FILE_PATH);
  // check if there is todo with this id
  const index = todos.findIndex(todo => todo.id === req.params.id);
  if (index >= 0) {
    // delete todo from todos
    const deletedTodo = todos[index];
    todos.splice(index, 1);
    rewriteFile(FILE_PATH, todos);
    res.status(200).send(deletedTodo);
  } else {
    const err = {
      status: 400,
      message: `Todo with this id: ${req.params.id} doesn't exist.`
    };
    next(err);
  }
};

const toggleTodoCompletion = (req, res, next) => {
  const todos = getDataFromFile(FILE_PATH);
  // check if there is todo with this id
  const index = todos.findIndex(todo => todo.id === req.params.id);
  if (index >= 0) {
    // done/undone todo
    todos[index].done = !todos[index].done;
    rewriteFile(FILE_PATH, todos);
    res.status(200).send(todos[index]);
  } else {
    const err = {
      status: 400,
      message: `Todo with this id: ${req.params.id} doesn't exist.`
    };
    next(err);
  }
};

module.exports = {
  getDataFromFile: getDataFromFile,
  rewriteFile: rewriteFile,
  getTodos: getTodos,
  addTodo: addTodo,
  removeTodo: removeTodo,
  toggleTodoCompletion: toggleTodoCompletion
};
