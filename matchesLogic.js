const fetch = require('node-fetch')
const Subscription = require('./Subscription')
const webPush = require('web-push')

let matches = []
let oldMatches = []
const defaultOptions = {
  title: 'test',
  body: 'test',
  icon: './dist/img/icons/apple-touc-icon.png'
}

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
  const upcomingMatch = matches
    .filter(f => f.status === 'SCHEDULED')
    .sort((a, b) => (a.utcDate < b.utcDate ? -1 : 1))[0]

  // Goal scored
  if (currentMatches.filter(
    cm => Object.values(cm.score.fullTime) !== Object.values(
      oldMatches.find(om => om.id === cm.id).score.fullTime
    )).length > 0) {
    sendNotifications('Er is gescoord!')
  }

  // Match started
  if (matches.filter(m => m.status === 'IN_PLAY' && oldMatches.find(om => om.id === m.id).status === 'SCHEDULED').length > 0) {
    sendNotifications('De bal rolt!')
  }

  // Match finished
  if (matches.filter(m => m.status === 'FINISHED' && oldMatches.find(om => om.id === m.id).status === 'IN_PLAY').length > 0) {
    sendNotifications('Klaaaaarrrrr')
  }

  // Match in 10 hours
  if (upcomingMatch) {
    const derp = new Date(upcomingMatch.utcDate)
    const minutesToNextMatch = Math.round(derp.getTime() / 60000) - Math.round(Date.now() / 60000)
    console.log(minutesToNextMatch)
    if (minutesToNextMatch === 600) {
      sendNotifications('Wedstrijd over 10 uur!!!!')
    }
    if (minutesToNextMatch === 200) {
      sendNotifications('test!!!!')
    }
    if (minutesToNextMatch === 180) {
      sendNotifications('Wedstrijd over 3 uur!!!!')
    }
    if (minutesToNextMatch === 60) {
      sendNotifications('Wedstrijd over 1 uur!!!!')
    }
    if (minutesToNextMatch === 5) {
      sendNotifications('Zit je er klaar voorrroor?????')
    }
  }
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
