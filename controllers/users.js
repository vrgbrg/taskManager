const express = require('express');
const users = express();
const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

users.post('/', (req, res) => {
  models.User.findOne({ where: { username: req.body.username } }).then(user => {
    if (user) {
      return res.status(400).send('Van már ilyen felhasználónév, kérem adjon meg újat!');
    }
    bcrypt.hash(req.body.password, 10).then(hash => {
      req.body.encryptedPassword = hash;
      models.User.create(req.body).then(user => {
        res.json(user);
      });
    });
  });
});

users.post('/login', (req, res) => {
  models.User.findOne({ where: { username: req.body.username } }).then(user => {
    if (!user) {
      return res.status(400).send('Hibás felhasználónév');
    }
    bcrypt.compare(req.body.password, user.encryptedPassword).then(isValid => {
      if (!isValid) {
        return res.status(401).send('Hibás jelszó!');
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' }).toString();
      res.json({ token: token });
    });
  });
});

users.get('/me', (req, res) => {
  res.json(req.user);
});

users.put('/me', (req, res) => {
  req.user.update(req.body).then(user => {
    res.json(user);
  });
});

module.exports = users;
