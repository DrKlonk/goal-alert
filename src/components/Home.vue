<template>
<div class="container">
  <h1 v-if="isLoading">Aan het laden...</h1>
  <template v-else>
    <template v-if="isAMatchGoingOn">
      <h2>We zijn LIVE!</h2>
      <match-display  :match="currentMatch"/>
    </template>
    <template v-else>
      <h2>
        Spannend!!!
      </h2>
      <h1>
         {{ timeUntilNextMatch }}
      </h1>
    </template>

    <h2>Komende wedstrijden</h2>
    <match-display
      v-for="match in scheduledMatches"
      :match=match
      :key="match.id"
    />

    <h2>Gespeelde wedstrijden</h2>
    <match-display
      v-for="match in finishedMatches"
      :match=match
      :key="match.id"
    />
  </template>
</div>
</template>

<script>
import MatchDisplay from './MatchDisplay.vue'
export default {
  name: 'Home',

  data () {
    return {
      isLoading: true,
      matches: []
    }
  },

  components: {
    MatchDisplay
  },

  created () {
    this.getMatches()
    // Set the title in a not-so pretty fashion
    document.title = 'Atalanta goal alert'
  },

  methods: {
    getMatches () {
      fetch('/matches', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }).then(matches => {
        // Or return matches if we do get a result from our server
        return matches
      }).then(result => {
        return result.json()
      }).then(data => {
        if (data.length === 0) {
          // Get the matches ourselves when our server is not awake yet
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
              this.matches = result
            })
        } else {
          // Everything is fine!
          this.matches = data
        }
      }).catch(err => {
        console.log('Something went wrong getting the matches', err)
      }).finally(() => {
        this.isLoading = false
      })
    }
  },

  computed: {
    isAMatchGoingOn () {
      return !!this.currentMatch
    },
    currentMatch () {
      return this.matches.find(match => match.status === 'IN_PLAY')
    },
    nextMatch () {
      return this.scheduledMatches[0]
    },
    timeUntilNextMatch () {
      const upcomingMatchDate = new Date(this.nextMatch.utcDate)
      const totalMinutesToNextMatch =
        Math.round(upcomingMatchDate.getTime() / 60000) -
        Math.round(Date.now() / 60000)

      const hoursToNextMatch = Math.floor(totalMinutesToNextMatch / 60)
      const minutesToNextMatch = totalMinutesToNextMatch % 60
      if (hoursToNextMatch < 1) {
        if (minutesToNextMatch < 2) {
          return 'We gaan bijna beginnen!'
        }
        return `Nog ${minutesToNextMatch} minuten tot de volgende pot!`
      }
      return `Nog ${hoursToNextMatch} uur en ${minutesToNextMatch} minuten tot de volgende pot!`
    },
    finishedMatches () {
      return this.matches
        .filter(match => match.status === 'FINISHED')
        .sort((a, b) => a.utcDate - b.utcDate ? 1 : -1)
        .slice(0, 5)
    },
    scheduledMatches (status) {
      return this.matches
        .filter(match => match.status === 'SCHEDULED')
        .sort((a, b) => a.utcDate - b.utcDate ? -1 : 1)
        .slice(0, 5)
    }
  }
}
</script>

<style lang="scss">
.container {
  max-width: 60rem;
  width: 100%;
}

</style>
