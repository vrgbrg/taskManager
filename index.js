const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const tasks = require('./controllers/tasks');
const users = require('./controllers/users');
const jwt = require('jsonwebtoken');
const models = require('./models');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  if (req.header('x-auth')) {
    let token = req.header('x-auth');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      return res.status(401).send(err);
    }
    models.User.findById(decoded.id).then(user => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

app.use(morgan('tiny'));

app.use('/tasks', tasks);
app.use('/users', users);

app.get('/', (req, res) => {
  res.send('Szia');
});

app.listen(process.env.PORT);
