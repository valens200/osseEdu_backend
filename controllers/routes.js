const express = require('express')
const router = express.Router()
const { google } = require('googleapis')
const nodemailer = require('nodemailer')
const emailExistence = require('email-existence')

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
      from: 'uwavalens2003@gmail.com',
      to: email,
      subject: 'hello vava valens',
      text: 'hello we are backend devs',
      html: '<h1 style="color:red;">hello we we are glad to meet you</h1>',
    }

    const result = await transport
      .sendMail(mailOptions)
      .then((result) => console.log('email is sent', result))
      .catch((error) => console.log('err', error))
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
