const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const todos = require('./routes/todos');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/todos', todos);

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

const port = 3000;

module.exports = app;

app.listen(port, () => console.log(`Server is running on port ${port}!`));
