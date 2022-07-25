const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const routers = require('./controllers/routes')

// const oAuth2client = new google.auth.OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   process.env.REDIRECT_URL,
// )

// oAuth2client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

// async function sendMail() {
//   try {
//     const accessToken = await oAuth2client.getAccessToken()
//     const transport = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         type: 'OAuth2',
//         user: 'uwavalens2003@gmail.com',
//         clientId: CLIENT_ID,
//         clientSecret: CLIENT_SECRET,
//         refreshToken: REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//     })
//     const mailOptions = {
//       from: 'uwavalens2003@gmail.com',
//       to: 'uwavalens2003@gmail.com',
//       subject: 'hello vava valens',
//       text: 'hello we are backend devs',
//       html: '<h1 style="color:red;">hello we we are glad to meet you</h1>',
//     }

//     const result = await transport.sendMail(mailOptions)
//     return result
//   } catch (error) {
//     return error
//   }
// }
// sendMail()
//   .then((result) => console.log('email is sent', result))
//   .catch((error) => console.log('err', error))

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routers)
const PORT = 4000 || process.env.PORT

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`)
})
