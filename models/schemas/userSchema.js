const mongoose = require('mongoose')
const express = require('express')

const UsersSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
})

const Users = mongoose.model('Users', UsersSchema)
module.exports = Users
