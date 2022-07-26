const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const routers = require('./controllers/routes')
const cors = require('cors')
const connection = require('./models/database/connection')

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'DELETE'],
  }),
)
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routers)
const PORT = 4000 || process.env.PORT
connection()

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`)
})
