<template>
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">{{ title }}</h1>
      </md-table-toolbar>
      <md-table-row>
        <md-table-head>Thuis</md-table-head>
        <md-table-head v-if="finished">Score</md-table-head>
        <md-table-head>Uit</md-table-head>
        <md-table-head v-if="finished" />
        <md-table-head>Datum</md-table-head>
        <md-table-head>Tijd</md-table-head>
        <md-table-head>Competitie</md-table-head>
      </md-table-row>
      <md-table-row v-for="match in matches" :key="match.id">
        <md-table-cell class="homeTeamCol">{{
          match.homeTeam.name
        }}</md-table-cell>
        <md-table-cell v-if="finished" class="scoreCol">
          {{
            `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
          }}
        </md-table-cell>
        <md-table-cell class="awayTeamCol">{{
          match.awayTeam.name
        }}</md-table-cell>
        <md-table-cell v-if="finished" class="resultCol">
          <div
            class="result-ball"
            :class="result(match.score, match.homeTeam)"
          />
        </md-table-cell>
        <md-table-cell class="dateCol">{{
          formatDate(match.utcDate)
        }}</md-table-cell>
        <md-table-cell class="timeCol">{{
          formatTime(match.utcDate)
        }}</md-table-cell>
        <md-table-cell class="competitionCol">{{
          match.competition.name
        }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
export default {
  name: 'MatchTable',
  props: {
    matches: {
      required: true,
      type: Array
    },
    finished: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: 'Wedstrijden'
    },
    teamId: {
      type: Number,
      required: true
    }
  },
  methods: {
    formatDate (date) {
      const matchDate = new Date(date)
      return matchDate.toLocaleDateString()
    },
    formatTime (date) {
      const matchDate = new Date(date)
      return matchDate.toLocaleTimeString().substring(0, 5)
    },
    result (score, homeTeam) {
      if (score.winner === 'DRAW') {
        return 'draw'
      }
      if (
        (score.winner === 'HOME_TEAM' && homeTeam.id === this.teamId) ||
        (score.winner === 'AWAY_TEAM' && homeTeam.id !== this.teamId)
      ) {
        return 'won'
      }
      return 'lost'
    }
  }
}
</script>

<style>
.md-table {
  margin: 40px 0;
}
.md-table-cell {
  text-align: left;
}
.md-table-toolbar {
  background-color: #0071bc;
  color: white;
}
.result-ball {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.result-ball.won {
  background-color: green;
}
.result-ball.draw {
  background-color: darkkhaki;
}
.result-ball.lost {
  background-color: maroon;
}
</style>
