const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');
const uuidv4 = require('uuid/v4');

const app = express();
const port = 3000;

const Todo = require('./models/Todo');

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
      const newTodo = new Todo({
        id: uuidv4(),
        name: req.body.name,
        description: req.body.description
      });
      todos.push(newTodo);
      fs.writeFile(FILE_PATH, JSON.stringify(todos), err => {
        if (err) {
          throw err;
        }
      });
    }
  });
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));
