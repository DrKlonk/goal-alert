const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
require('dotenv/config')
const cors = require('cors')

// Database import and model
const mongoose = require('mongoose')
const Subscription = require('./Subscription')

// Web push
const webPush = require('web-push')
const privateKey = process.env.VAPID_PRIVATE_KEY
const publicKey =
  'BNyoiU3hiaZIehXTmGaR5b-TznoGbqQZoG9uMaJ-0JNZIto-EHPeu-WN1TX2Wqj4HjuIduxm6QoxZZJimTmRjKo'
webPush.setVapidDetails('mailto:joranminjon@gmail.com', publicKey, privateKey)

// Local matches polling file
const matchesLogic = require('./matchesLogic')

const app = express()
app.use(cors())
app.use(express.json())
app.use(serveStatic(path.join(__dirname, 'dist')))

// Connect to db to register subscriptions
mongoose.connect(
  process.env.MONGOLAB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log('Connected to Mongo DB!')
)

app.post('/subscribe', (req, res) => {
  const subscription = new Subscription({
    ...req.body
  })
  subscription
    .save()
    .then((data) => {
      console.log('Subscription saved!')
      return res.json(data)
    })
    .catch((err) => console.error(err))
})

app.get('/matches', (req, res) => {
  res.send(matchesLogic.getMatches())
})

app.get('/wakemeup', (req, res) => {
  console.log('Woke up!')
  res.send({ message: 'Server is awake!' })
})

// Query for matches every minute at API football-data
// setInterval(matchesLogic.pollForMatches, 60000)

const port = process.env.PORT || 4444
app.listen(port, () => {
  console.log('Listening on port ' + port)
})
