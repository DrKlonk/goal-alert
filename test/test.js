const assert = require('chai').assert

const matchesLogic = require('../matchesLogic')

const matches = [
  {
    id: 200282,
    status: 'FINISHED',
    score: {
      winner: 'HOME_TEAM',
      duration: 'REGULAR',
      fullTime: {
        homeTeam: 3,
        awayTeam: 1
      }
    }
  }
]

const oldMatches = [
  {
    id: 200282,
    status: 'IN_PLAY',
    score: {
      winner: 'HOME_TEAM',
      duration: 'REGULAR',
      fullTime: {
        homeTeam: 3,
        awayTeam: 1
      }
    }
  }
]

describe('App', () => {
  // Used for some semi-automated testing
  // TODO: automate this!
  it('app should return hello', () => {
    assert.equal(
      matchesLogic.runNotificationChecks(matches, oldMatches),
      'hello'
    )
  })
})
