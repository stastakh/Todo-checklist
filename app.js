const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');
const uuidv4 = require('uuid/v4');
const Joi = require('@hapi/joi');

const app = express();
const port = 3000;

const Todo = require('./models/Todo');
const todoSchema = require('./validation/todo');

const FILE_PATH = './data/todos.json';

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/todos', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    res.status(200).send(JSON.parse(data));
  });
});

app.post('/todos', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    if (data) {
      const todos = JSON.parse(data);
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
        todos.push(newTodo);
        fs.writeFile(FILE_PATH, JSON.stringify(todos), err => {
          if (err) {
            throw err;
          }
          res.status(200).send(newTodo);
        });
      } else {
        const err = {
          status: 400,
          message: error.details[0].message
        };
        res.status(err.status).send(err.message);
      }
    }
  });
});

app.delete('/todos/:id', (req, res) => {
  fs.readFile(FILE_PATH, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    if (data) {
      const todos = JSON.parse(data);
      const index = todos.findIndex(todo => todo.id === req.params.id);
      if (index >= 0) {
        // delete todo from todos
        console.log(todos);
        const [deletedTodo] = todos.splice(index, 1);

        fs.writeFile(FILE_PATH, JSON.stringify(todos), err => {
          if (err) {
            throw err;
          }
        });
        console.log(deletedTodo);
        res.status(200).send(deletedTodo);
      } else {
        const err = {
          status: 400,
          message: `Todo with this id: ${req.params.id} doesn't exist.`
        };
        res.status(err.status).send(err.message);
      }
    }
  });
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));
