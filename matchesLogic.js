const fetch = require('node-fetch')
const Subscription = require('./Subscription')
const webPush = require('web-push')

let matches = []
let oldMatches = []
const liveStatuses = ['LIVE', 'IN_PLAY', 'PAUSED']

function pollForMatches () {
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
      console.log('Got matches!', result.matches.length)
      oldMatches = matches
      matches = result.matches
      if (matches.length === oldMatches.length) {
        runNotificationChecks(matches, oldMatches)
      }
    })
    .catch((err) => {
      console.error('Something went wrong getting the matches!', err)
    })
}

function runNotificationChecks (matches, oldMatches) {
  const currentMatch = matches.find((f) => liveStatuses.includes(f.status))

  const upcomingMatch = matches
    .filter((f) => f.status === 'SCHEDULED')
    .sort((a, b) => (a.utcDate < b.utcDate ? -1 : 1))[0]

  // Goal scored check
  if (currentMatch) {
    // Lets check for goals
    const oldCurrentMatch = oldMatches.find((om) => om.id === currentMatch.id)

    if (oldCurrentMatch) {
      let homeTeamGoals, awayTeamGoals
      // Check for first minute goals when the old match was not "live"
      if (!liveStatuses.includes(oldCurrentMatch.status)) {
        homeTeamGoals = currentMatch.score.fullTime.homeTeam
        awayTeamGoals = currentMatch.score.fullTime.awayTeam
      } else {
        // Note that a team can potentially score more than 1 goal in a minute.
        homeTeamGoals = currentMatch.score.fullTime.homeTeam - oldCurrentMatch.score.fullTime.homeTeam
        awayTeamGoals = currentMatch.score.fullTime.awayTeam - oldCurrentMatch.score.fullTime.awayTeam
      }

      if (
        (currentMatch.homeTeam.id === 102 && homeTeamGoals > 0) ||
        (currentMatch.awayTeam.id === 102 && awayTeamGoals > 0)
      ) {
        sendNotifications('JAAAA Atalanta heeft gescoord!!!')
      }
      if (
        (currentMatch.homeTeam.id !== 102 && homeTeamGoals > 0) ||
        (currentMatch.awayTeam.id !== 102 && awayTeamGoals > 0)
      ) {
        sendNotifications('Potverdorie, we hebben een tegengoal.')
      }
    }
  }

  // Match started
  if (matches.find(m => liveStatuses.includes(m.status) &&
        !liveStatuses.includes(oldMatches.find((om) => om.id === m.id).status))) {
    sendNotifications('De bal rolt!')
  }

  // Match finished
  if (matches.find(m => m.status === 'FINISHED' &&
        liveStatuses.includes(oldMatches.find((om) => om.id === m.id).status))) {
    sendNotifications('Klaaaaarrrrr')
  }

  // Match in 10 hours
  if (upcomingMatch) {
    const upcomingMatchDate = new Date(upcomingMatch.utcDate)
    const minutesToNextMatch =
      Math.round(upcomingMatchDate.getTime() / 60000) -
      Math.round(Date.now() / 60000)

    console.log('Minutes to next match: ', minutesToNextMatch)
    if (minutesToNextMatch === 600) {
      sendNotifications('Wedstrijd over 10 uur!!!!')
    }
    if (minutesToNextMatch === 180) {
      sendNotifications('Wedstrijd over 3 uur!!!!')
    }
    if (minutesToNextMatch === 60) {
      sendNotifications('Wedstrijd over 1 uur!!!!')
    }
    if (minutesToNextMatch === 5) {
      sendNotifications('Zit je er al klaar voor??? Nog 5 minuutjes!!!')
    }
  }
}

function sendNotifications (payload) {
  // Get all subs from the DB
  return Subscription.find({})
    .then((subs) => {
      subs.forEach(sub => {
        webPush.sendNotification(sub, payload)
      })
    })
    .catch(err => { console.error(err) })
}

function getMatches () {
  return matches
}

module.exports = { getMatches, pollForMatches, runNotificationChecks }
