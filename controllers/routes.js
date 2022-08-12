const express = require('express')
const router = express.Router()
const { google } = require('googleapis')
const nodemailer = require('nodemailer')
const emailExistence = require('email-existence')
const Users = require('../models/schemas/userSchema')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

require('dotenv').config()

const CLIENT_ID =
  '164158156225-ekbbjd3chi0imc1sh9f5cqr9ibmlcjg3.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URL = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN =
  '1//044wIeQVvfU3pCgYIARAAGAQSNwF-L9Ir9n0dhHZyVeOr_T0eFzcESQOu1_eDBxy3Prhl7_hC9hBqiG6nRtg_vcziC8SefBR8jW0'
const oauth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
)
oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN })
console.log(CLIENT_SECRET)
router.get('/', (req, res) => {
  res.status(200).send('hello, wellcome here')
})

router.post('/email', async (req, res) => {
  try {
    const { email, subject, text } = req.body
    if (
      !email ||
      !subject ||
      !text ||
      email == '' ||
      subject == '' ||
      text == ''
    ) {
      return res.status(400).send('please fill out all the fields are required')
    }

    emailExistence.check(email, (err, data) => {
      if (!data) {
        return res.status(400).send('Email not exist')
      }
    })
    const accessToken = await oauth2client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'uwavalens2003@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    })
    const mailOptions = {
      from: email,
      to: 'ntwaliosee2@gmail.com',
      subject: subject,
      text: text,
    }

    const result = await transport
      .sendMail(mailOptions)
      .then((result) =>
        res.status(200).send(' your message  is sent successfully'),
      )
      .catch((error) =>
        res
          .status(500)
          .send('Some thing went wrong while sending your message'),
      )
  } catch (error) {
    console.log(error)
  }
})

router.post('/register', async (req, res) => {
  var { FullName, userName, Email, Password } = req.body
  console.log(req.body)
  if (
    !FullName ||
    !userName ||
    !Email ||
    !Password ||
    FullName == '' ||
    userName == '' ||
    Email == '' ||
    Password == ''
  ) {
    return res
      .status(400)
      .send('Invalid inputs! please all the fields are required')
  }
  try {
    emailExistence.check(Email, (err, data) => {
      if (!data) {
        return res.status(400).send('Email not exist in gmail')
      }
    })
    const availableUser = await Users.findOne({ Email })
    if (availableUser) {
      return res
        .status(400)
        .send(`user with email ${Email} is already registered ! please Login`)
    }

    req.body.Password = await bcrypt.hash(req.body.Password, 10)
    const newUser = await Users.create(req.body)
    if (!newUser) {
      return res.status(500).send('some thing went wrong')
    } else {
      const Accesstoken = jwt.sign(
        { id: newUser._id, email: newUser._email },
        process.env.privateKey,
        { expiresIn: '1d' },
      )
      res.cookie('AccessToken', Accesstoken)
      res.send('Your are registred successfully')
    }
  } catch (err) {
    console.log(err)
  }
})

router.delete('/delete', async (req, res) => {
  try {
    await Users.deleteMany({ Email: 'uwavalens2003@gmail.com' })
    console.log('deleted')
  } catch (err) {
    console.log(err)
  }
})

router.post('/login', async (req, res) => {
  const { Email, Password } = req.body
  console.log(req.body)
  if (!Email || !Password || Email == '' || Password == '') {
    return res
      .status(400)
      .send('Invalid inputs! please fill out all fields are required')
  }
  const isAvalable = await Users.findOne({ Email })
  if (!isAvalable) {
    return res.status(400).send('Invalid Email or Password')
  }
  console.log(isAvalable.Password)
  const isAuthenthicated = await bcrypt.compare(Password, isAvalable.Password)
  if (!isAuthenthicated) {
    return res.status(400).send('Invalid Emal or Password')
  }
  const AccessToken = jwt.sign(
    { id: isAvalable._id, email: isAvalable.Email },
    process.env.privateKey,
    { expiresIn: '10d' },
  )
  res.cookie('AccesToken', AccessToken)
  res.send(AccessToken)
})

module.exports = router
