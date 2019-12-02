const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const todos = require('./routes/todos');

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/todos', todos);

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.message);
});

app.listen(port, () => console.log(`Server is running on port ${port}!`));
