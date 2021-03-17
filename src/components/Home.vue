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
    <template v-if="scheduledMatches.length">
    <match-display
      v-for="match in scheduledMatches"
      :match=match
      :key="match.id"
    />
    </template>
    <h3 v-else>Geen wedstrijden gevonden</h3>

    <h2>Gespeelde wedstrijden</h2>
    <template v-if="finishedMatches.length">
    <match-display
      v-for="match in finishedMatches"
      :match=match
      :key="match.id"
    />
    </template>
    <h3 v-else>Geen wedstrijden gevonden</h3>
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
    // Get the matches from the Back end
    getMatches () {
      fetch('/matches', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }).then(matches => {
        return matches
      }).then(result => {
        return result.json()
      }).then(data => {
        this.matches = data || []
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
      return this.matches.find(match => match.status === 'IN_PLAY' || match.status === 'PAUSED')
    },
    nextMatch () {
      return this.scheduledMatches[0] || {}
    },
    timeUntilNextMatch () {
      if (!Object.keys(this.nextMatch).length) {
        return 'We hebben geen eerstvolgende wedstrijd kunnen vinden'
      }
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
        .slice(0, 5) || []
    },
    scheduledMatches (status) {
      return this.matches
        .filter(match => match.status === 'SCHEDULED')
        .sort((a, b) => a.utcDate - b.utcDate ? -1 : 1)
        .slice(0, 5) || []
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
