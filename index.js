const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const tasks = require('./controllers/tasks');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('tiny'));

app.use('/tasks', tasks);

app.get('/', (req, res) => {
  res.send('Szia');
});

app.listen(process.env.PORT);
