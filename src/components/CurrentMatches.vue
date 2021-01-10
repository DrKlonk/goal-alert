<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Live scores</h1>
      </md-table-toolbar>
      <div v-if="!matches.length">
        <h1>Op dit moment is er geen wedstrijd bezig</h1>
      </div>

      <md-table-row v-for="match in matches" :key="match.id">
        <md-table-cell class='minutesCol'>{{ getNoOfMinutesPlayed(match) }}</md-table-cell>
        <md-table-cell class="homeTeamCol">{{ match.homeTeam.name }}</md-table-cell>
        <md-table-cell class="scoreCol">{{ `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}` }}</md-table-cell>
        <md-table-cell class="awayTeamCol">{{ match.awayTeam.name }}</md-table-cell>
        <md-table-cell class="competitionCol">{{ match.competition.name }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: 'CurrentMatches',
  props: {
    matches: {
      type: Array,
      required: true
    },
    teamId: {
      type: Number,
      required: true
    }
  },
  methods: {
    getNoOfMinutesPlayed (match) {
      const startDate = new Date(match.utcDate)
      const lastUpdated = new Date(match.lastUpdated)
      const minutesSinceStart =
        Math.round(Math.abs(lastUpdated - startDate) / 1000 / 60) + 1 // + 1 To skip minute 0
      if (
        minutesSinceStart > 45 &&
        minutesSinceStart < 60 &&
        match.score.halfTime.homeTeam
      ) {
        return 'HT'
      }
      if (minutesSinceStart >= 60) {
        return `'${minutesSinceStart - 15}`
      }
      return `'${minutesSinceStart}`
    }
  }
}
</script>

<style>
.root {
  padding: 40px;
}
.score-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.no-matches {
  width: 100%;
  text-align: center;
}
</style>
