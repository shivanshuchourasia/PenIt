const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
  res.render('users/login');
})

router.post('/login', (req, res) => {
  let errors = [];

  if(!req.body.email){
    errors.push({text: 'Please enter your email'});
  }
  if(!req.body.password){
    errors.push({text: 'Please enter the password'});
  }

  if(errors.length > 0){
    res.render('users/login', {
      errors,
      email: req.body.email,
      password: req.body.password
    });
  } else{
    res.render('index');
  }
})

router.get('/register', (req, res) => {
  res.render('users/register');
})

router.post('/register', (req, res) => {
  let errors = [];

  if(!req.body.name){
    errors.push({text: 'Please enter your name'});
  }
  if(!req.body.email){
    errors.push({text: 'Please enter your email'});
  }
  if(!req.body.password){
    errors.push({text: 'Please enter your password'});
  }
  if(!req.body.password2){
    errors.push({text: 'Please confirm your password'});
  }
  if(req.body.password !== req.body.password2){
    errors.push({text: 'Passwords do not match'});
  }
  if(req.body.password.length < 4){
    errors.push({text: 'Password length should be atleast 4'});
  }

  if(errors.length > 0){
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {
    res.send('passed');
  }
})

module.exports = router;