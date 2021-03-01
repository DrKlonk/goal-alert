<template>
<div>
  <h1 v-if="isLoading">Aan het laden...</h1>
  <template v-else>
    <template v-if="isAMatchGoingOn">
      <h2>We zijn LIVE!</h2>
      <match-display  :match="currentMatch"/>
    </template>
    <h2 v-else>Op dit moment is er geen wedstrijd bezig</h2>

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
  name: 'Container',
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
  },
  methods: {
    getMatches () {
      fetch('https://buttercup-artistic-utahceratops.glitch.me/matches', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }).then(matches => {
        return matches.json()
      }).then(result => {
        this.matches = result
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

</style>
