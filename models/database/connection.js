const mongoose = require('mongoose')
const express = require('express')
require('dotenv').config()
const url = process.env.URL
const connection = async () => {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    console.log('connected to mongodb')
  } catch (err) {
    console.log(err)
  }
}
module.exports = connection
