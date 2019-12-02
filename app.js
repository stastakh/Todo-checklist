const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');

const app = express();
const port = 3000;

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

app.listen(port, () => console.log(`Server is running on port ${port}!`));
