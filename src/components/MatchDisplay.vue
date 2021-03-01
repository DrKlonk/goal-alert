<template>
<div class="match">
  <div class="match__header">
    <span class="match__league">{{ match.competition.name }}</span>
    <span class="match__day">{{ getMatchDay(match) }}</span>
  </div>
  <div class="match__main">
    <div class="match__time">{{ getMatchTime(match) }}</div>
    <div class="match__teams">
      <div class="match__team">{{ match.homeTeam.name }}<span class="match__score" :class="getScoreClass(match)">{{ getTeamScore(match, 'homeTeam') }}</span></div>
      <div class="match__team">{{ match.awayTeam.name }}<span class="match__score" :class="getScoreClass(match)">{{ getTeamScore(match, 'awayTeam') }}</span></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      required: true
    }
  },
  methods: {
    getMatchDay ({ utcDate }) {
      const matchDate = new Date(utcDate)
      return matchDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })
    },
    getMatchTime ({ status, utcDate }) {
      if (status !== 'SCHEDULED') {
        return 'FT'
      }
      const matchDate = new Date(utcDate)
      return matchDate.toTimeString().slice(0, 5)
    },
    getTeamScore ({ score }, team) {
      if (score && score.fullTime && score.fullTime.homeTeam !== null) {
        return score.fullTime[team]
      }
      return '?'
    },
    getScoreClass ({ homeTeam, score }) {
      if (score.fullTime.homeTeam === null) {
        return
      }
      let result = 'draw'
      if (score.winner === 'HOME_TEAM') {
        result = homeTeam.id === 102 ? 'win' : 'loss'
      } else if (score.winner === 'AWAY_TEAM') {
        result = homeTeam.id === 102 ? 'loss' : 'win'
      }
      return `match__score--${result}`
    }
  }

}
</script>

<style lang="scss">
.match {
  margin-bottom: 1rem;
  border: solid 1px $color-grey-dark;
  border-radius: 3px;
    box-shadow: 0 1rem 1rem rgba($color-black, .2);
    background-color: $color-grey-dark;

  &__header {
    background-color: $color-primary;
    padding: .5rem 1rem;
    color: $color-white;
    font-size: 1.4rem;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 .2rem 1rem rgba($color-black, .8);
    position: relative;
    border-radius: 3px;
  }

  &__league {

  }

  &__day {
  }

  &__main {
    background-color: $color-grey-dark;
    color: $color-grey-light;
    font-size: 1.6rem;
    display: flex;
  }

  &__time {
    flex: 0 0 7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: $color-white;
    padding: .5rem 1rem;
  }

  &__teams {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: .5rem;
  }

  &__team {
    display: flex;
    justify-content: space-between;

  }

  &__score {
    color: $color-white;
    font-weight: 700;
    &--win {
      color: $color-score--win;
    }
    &--draw {
      color: $color-score--draw;
    }
    &--loss {
      color: $color-score--loss;
    }
  }

}
</style>
