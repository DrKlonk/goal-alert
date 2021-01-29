<template>
  <div class="root">
    <h1 v-if=isLoading>Aan het laden...</h1>
    <template v-else>
      <img alt="Vue logo" src=".././assets/logo.png" />
      <h2>De {{ teamName }} goal alert app</h2>
      <current-matches :matches="currentMatches" :team-id="teamId"/>
      <match-table
        :matches="scheduledMatches"
        :team-id="teamId"
        :title="'Komende wedstrijden'"
      />
      <match-table
        :matches="finishedMatches"
        :team-id="teamId"
        :title="'Gespeeld'"
        :finished="true"
      />
    </template>
  </div>
</template>

<script>
import CurrentMatches from './CurrentMatches.vue'
import MatchTable from './MatchTable.vue'
// import testmatches from '../testmatches.json'
// import oldmatches from '../oldmatches.json'

export default {
  name: 'Container',

  components: {
    MatchTable,
    CurrentMatches
  },

  data () {
    return {
      matches: [],
      oldMatches: [],
      showNoOfMatches: 5,
      teamId: 102, // atalanta = 102, fc utrecht = 676
      teamName: '',
      token: '27e4e6f686464cba84940a336a6b7295',
      isLoading: true
    }
  },

  computed: {
    currentMatches () {
      return this.matches.filter(
        f => f.status !== 'SCHEDULED' && f.status !== 'FINISHED'
      )
    },
    scheduledMatches () {
      return this.matches
        .filter(f => f.status === 'SCHEDULED')
        .sort((a, b) => (a.utcDate < b.utcDate ? -1 : 1))
        .slice(0, this.showNoOfMatches)
    },
    finishedMatches () {
      return this.matches
        .filter(f => f.status === 'FINISHED')
        .sort((a, b) => (a.utcDate > b.utcDate ? -1 : 1))
        .slice(0, this.showNoOfMatches)
    },
    isMatchStarting () {
      return this.matches.filter(m => m.status === 'IN_PLAY' && this.oldMatches.find(om => om.id === m.id).status === 'SCHEDULED').length > 0
    },
    isMatchFinished () {
      return this.matches.filter(m => m.status === 'FINISHED' && this.oldMatches.find(om => om.id === m.id).status === 'IN_PLAY').length > 0
    },
    hasAGoalBeenScored () {
      return this.currentMatches.filter(cm => Object.values(cm.score.fullTime) !== Object.values(this.oldMatches.find(om => om.id === cm.id).score.fullTime)).length > 0
    }
  },

  created () {
    Promise.all([
      this.getMatchesOfTeam(),
      this.getTeamName()
    ])
      .then(() => {
        this.isLoading = false
        // this.startPolling();
      })
  },

  beforeDestroy () {
    clearInterval(this.startPolling)
  },

  methods: {
    startPolling () {
      // Poll for match results every 10 seconds
      setInterval(this.getMatchesOfTeam, 10000)
    },
    getMatchesOfTeam () {
      const url = `https://api.football-data.org/v2/teams/${this.teamId.toString()}/matches`
      return fetch(url, {
        headers: {
          'X-Auth-Token': this.token
        }
      })
        .then(response => {
          return response.json()
        })
        .then((result) => {
          this.oldMatches = this.matches
          this.matches = result.matches
          // this.oldMatches = oldmatches
          // this.matches = testmatches
          if (this.matches.length === this.oldMatches.length) {
            this.runNotificationChecks()
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getTeamName () {
      const url = `https://api.football-data.org/v2/teams/${this.teamId.toString()}`
      return fetch(url, {
        headers: {
          'X-Auth-Token': this.token
        }
      })
        .then(response => {
          return response.json()
        })
        .then(result => {
          this.teamName = result.name
        })
        .catch((err) => {
          console.log(err)
        })
    },
    runNotificationChecks () {
      if (this.hasAGoalBeenScored) {
        alert('goal scored!')
        // run goal notification
      }
      if (this.isMatchStarting) {
        alert('match starting')
        // run match start notification
      }
      if (this.isMatchFinished) {
        alert('match finished')
        // run match finished notification
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito&display=swap');

div .root {
  font-family: 'Nunito';
  max-width: 800px;
  margin: 0 auto;
}
</style>
