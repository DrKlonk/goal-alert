const express = require('express')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv/config')
const Subscription = require('./Subscription')
const cors = require('cors')
const matchesLogic = require('./matchesLogic')

const privateKey = process.env.VAPID_PRIVATE_KEY
const publicKey = 'BNyoiU3hiaZIehXTmGaR5b-TznoGbqQZoG9uMaJ-0JNZIto-EHPeu-WN1TX2Wqj4HjuIduxm6QoxZZJimTmRjKo'
webPush.setVapidDetails('mailto:joranminjon@gmail.com', publicKey, privateKey)

const app = express()
app.use(cors())
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

// app.post('/notify', (req, res) => {
//   // Create payload for the notification
//   const payload = JSON.stringify({
//     title: req.body.title
//   })
//   // Get all subs from the DB
//   Subscription.find({})
//     .then((subs) => {
//       subs.forEach(sub => {
//         webPush.sendNotification(sub, payload)
//       })
//     })
//     .then(() => {
//       res.status(201)
//       res.send()
//     })
//     .catch(err => { console.error(err) })
// })

// Query for notifications every minute
setInterval(matchesLogic.getMatches, 5000)

const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log('Listening on port ' + port)
})
