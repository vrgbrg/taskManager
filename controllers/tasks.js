const express = require('express');
const tasks = express();
const models = require('../models');

tasks.get('/', (req, res) => {
  models.Task.findAll().then(tasks => {
    res.json(tasks);
  });
});

tasks.get('/:id', (req, res) => {
  models.Task.findById(req.params.id).then(task => {
    if (!task) {
      return res.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'ID not found'
      });
    }
    res.json(task);
  });
});

tasks.post('/', (req, res) => {
  models.Task.findOne({
    where: {
      name: req.body.name
    }
  }).then(preResult => {
    if (preResult) {
      return res.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'This task already exists.'
      });
    } else {
      models.Task.create(req.body).then(task => {
        res.json(task);
      });
    }
  });
});

tasks.put('/:id', (req, res) => {
  models.Task.findById(req.params.id).then(task => {
    if (!task) {
      return res.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'ID not found'
      });
    } else {
      models.Task.findOne({
        where: {
          name: req.body.name
        }
      }).then(preResult => {
        if (preResult) {
          return res.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'This task already exists.'
          });
        } else {
          models.Task.update({
            name: req.body.name,
            message: req.body.message
          }, {
            where: {
              id: req.params.id
            }
          }).then(task => {
            res.json(task);
          });
        }
      });
    }
  });
});

tasks.delete('/:id', (req, res) => {
  models.Task.destroy({
    where: {
      id: req.params.id
    }
  }).then(task => {
    if (!task) {
      return res.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'ID not found'
      });
    }
    res.json(task);
  });
});

module.exports = tasks;
