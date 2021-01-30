const express = require('express')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv/config')
const Subscription = require('./Subscription')

const privateKey = process.env.VAPID_PRIVATE_KEY
const publicKey = 'BNyoiU3hiaZIehXTmGaR5b-TznoGbqQZoG9uMaJ-0JNZIto-EHPeu-WN1TX2Wqj4HjuIduxm6QoxZZJimTmRjKo'
webPush.setVapidDetails('mailto:joranminjon@gmail.com', publicKey, privateKey)

const app = express()
app.use(bodyParser.json())
app.use(serveStatic(path.join(__dirname, 'dist')))

// Connect to db
mongoose.connect(
  process.env.MONGOLAB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => console.log('Connected to Mongo DB!'))

app.post('/subscribe', (req, res) => {
  const subscription = new Subscription({
    ...req.body
  })
  subscription.save()
    .then(data => {
      console.log('Subscription saved!')
      return res.json(data)
    })
    .catch(err => console.error(err))

  // res.status(201).json({})
  console.log('Subscribed!')
})

const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log('Listening on port ' + port)
})
