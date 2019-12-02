const fs = require('fs');

const uuidv4 = require('uuid/v4');

const Todo = require('../models/Todo');
const todoSchema = require('../validation/todo');

const FILE_PATH = './data/todos.json';

const getDataFromFile = filePath => {
  const readFileProm = new Promise((resolve, reject) => {
    // get data from the file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject('Incorrect path to the file');
      } else {
        if (data) {
          resolve(JSON.parse(data));
        } else {
          resolve([]);
        }
      }
    });
  });
  return readFileProm;
};

const rewriteFile = (filePath, data) => {
  const stringifiedData = JSON.stringify(data);
  // write data to the file
  fs.writeFile(filePath, stringifiedData, err => {
    if (err) {
      throw err;
    }
  });
  return true;
};

const getTodos = (req, res) => {
  getDataFromFile(FILE_PATH)
    .then(result => {
      if (result.length === 0) {
        const error = {
          status: 404,
          message: 'There is no data in database.'
        };
        throw error;
      } else {
        res.status(200).send(result);
      }
    })
    // if path to the file is wrong - catch this error
    .catch(err => res.send(err))
    .catch(err => res.status(err.status).send(err.message));
};

const addTodo = (req, res) => {
  getDataFromFile(FILE_PATH)
    .then(todos => {
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
        throw err;
      }
    })
    .catch(err => res.send(err))
    .catch(err => res.status(err.status).send(err.message));
};

const removeTodo = (req, res) => {
  getDataFromFile(FILE_PATH)
    .then(todos => {
      // check if there is todo with this id
      const index = todos.findIndex(todo => todo.id === req.params.id);
      if (index >= 0) {
        // delete todo from todos
        const deletedTodo = { ...todos[index] };
        todos.splice(index, 1);
        rewriteFile(FILE_PATH, todos);
        res.status(200).send(deletedTodo);
      } else {
        const err = {
          status: 400,
          message: `Todo with this id: ${req.params.id} doesn't exist.`
        };
        throw err;
      }
    })
    .catch(err => res.send(err))
    .catch(err => res.status(err.status).send(err.message));
};

const toggleTodoCompletion = (req, res) => {
  getDataFromFile(FILE_PATH)
    .then(todos => {
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
        throw err;
      }
    })
    .catch(err => res.send(err))
    .catch(err => res.status(err.status).send(err.message));
};

module.exports = {
  getDataFromFile: getDataFromFile,
  getTodos: getTodos,
  addTodo: addTodo,
  removeTodo: removeTodo,
  toggleTodoCompletion: toggleTodoCompletion
};
