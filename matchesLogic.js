const fetch = require('node-fetch')
const Subscription = require('./Subscription')
const webPush = require('web-push')

let matches = []
let oldMatches = []

function getMatches () {
  const url = 'https://api.football-data.org/v2/teams/102/matches'
  return fetch(url, {
    headers: {
      'X-Auth-Token': '27e4e6f686464cba84940a336a6b7295',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(response => {
      return response.json()
    })
    .then((result) => {
      console.log(matches.length, oldMatches.length)
      oldMatches = matches
      matches = result.matches
      if (matches.length === oldMatches.length) {
        runNotificationChecks()
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

function runNotificationChecks () {
  const currentMatches = matches.filter(
    f => f.status !== 'SCHEDULED' && f.status !== 'FINISHED'
  )

  if (currentMatches.filter(
    cm => Object.values(cm.score.fullTime) !== Object.values(
      this.oldMatches.find(om => om.id === cm.id).score.fullTime
    )).length > 0) {
    alert('goal scored!')
    // run goal notification
  }

  sendNotifications(JSON.stringify({ title: 'test', body: 'ets' }))
    .then(() => {
      console.log('Everyone should get notified!')
    })
    .catch(err => console.error(err))
    // run match start notification
}

function sendNotifications (payload) {
  // Get all subs from the DB
  return Subscription.find({})
    .then((subs) => {
      subs.forEach(sub => {
        webPush.sendNotification(sub, payload)
          .catch(err => { console.error(err) })
      })
    })
    .catch(err => { console.error(err) })
}

module.exports = { getMatches }
