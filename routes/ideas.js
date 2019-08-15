const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const {Idea} = require('../models/Idea');

router.get('/add', (req, res) => {
  res.render('ideas/add');
});

router.post('/', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  } 
  if(!req.body.details){
    errors.push({text: 'Please add details'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    })
  } else{
    var idea = new Idea({
      title: req.body.title,
      details: req.body.details
    });
  
    idea.save().then((idea) => {
      req.flash('success_msg', 'Idea is successfully added');
      res.redirect('/ideas');
    }).catch((e) => {
      res.status(400).send();
    });
  }
});

router.get('/', (req, res) => {
  Idea.find()
    .sort({date: 'desc'})
    .then((ideas) => {
    res.render('ideas/index', {ideas});
  }).catch((e) => {
    res.status(400).send(e);
  })
});

router.get('/edit/:id', (req, res) => {
  Idea.findById(req.params.id).then((idea) => {
    res.render('ideas/edit', {idea});
  })
});

router.put('/:id', (req, res) => {
  let errors = [];

  if(!req.body.title){
    errors.push({text: 'Please add a title'});
  } 
  if(!req.body.details){
    errors.push({text: 'Please add details'});
  }

  if(errors.length > 0){
    res.render('ideas/edit', {
      errors,
      title: req.body.title,
      details: req.body.details
    })
  } else{
    Idea.findByIdAndUpdate(req.params.id, {
      $set: {
        title: req.body.title,
        details: req.body.details
      }
    }).then((idea) => {
      req.flash('success_msg', 'Idea is updated');
      res.redirect('/ideas');
    })
  }
});

router.delete('/:id', (req, res) => {
  Idea.findByIdAndDelete(req.params.id).then(() => {
    req.flash('success_msg', 'Idea is removed');
    res.redirect('/ideas');
  })
});

module.exports = router;