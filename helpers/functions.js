const nodemailer = require('nodemailer')
const google = require('googleapis')
require('dotenv').config()

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'uwavalens2003@gmail.com',
    clientId: process.env.CLIENT_ID,
    client_secret: process.env.SECRET_ID,
    refreshToken: process.env.REFRESH_TOKEN,
  },
})
module.exports = transport
