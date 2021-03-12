<template>
<div class="match">
  <div class="match__header">
    <span class="match__league">{{ match.competition.name }}</span>
    <span class="match__day">{{ getMatchDay(match) }}</span>
  </div>
  <div class="match__main">
    <div class="match__time">{{ getMatchTime(match) }}</div>
    <div class="match__teams">
      <div class="match__team match__team--home">{{ match.homeTeam.name }}<span class="match__score match__score--home" :class="getScoreClass(match)">{{ getTeamScore(match, 'homeTeam') }}</span></div>
      <div class="match__team match__team--away">{{ match.awayTeam.name }}<span class="match__score match__score--away" :class="getScoreClass(match)">{{ getTeamScore(match, 'awayTeam') }}</span></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'MatchDisplay',

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
      if (status === 'PAUSED') {
        return 'HT'
      }
      if (status === 'LIVE' || status === 'IN_PLAY') {
        const matchDate = new Date(utcDate)
        const matchDateMs = matchDate.getTime()
        const nowDateMs = Date.now()

        let minutesSinceKickoff = (nowDateMs - matchDateMs) / 1000 / 60

        if (minutesSinceKickoff > 60) {
          minutesSinceKickoff = minutesSinceKickoff - 15
        }
        return `${Math.ceil(minutesSinceKickoff)}'`
      }
      if (status !== 'SCHEDULED') {
        return 'FT'
      }
      const matchDate = new Date(utcDate)
      return matchDate.toTimeString().slice(0, 5)
    },
    getTeamScore ({ score }, team) {
      if (score.fullTime.homeTeam === null) {
        return '?'
      }
      return score.fullTime[team]
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
    background-image: linear-gradient(to right, $color-primary, $color-primary-dark);
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

    @include respond(tab-port) {
      padding: .5rem 0;
    }
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

    @include respond(tab-port) {
      flex-direction: row;
      justify-content: center;
    }
  }

  &__team {
    display: flex;
    justify-content: space-between;

    @include respond(tab-port) {
      flex: 1;
      justify-content: flex-end;
    }

    &--home {
      @include respond(tab-port) {
        position: relative;
        &::after {
          content: "-";
          position: absolute;
          font-weight: 700;
          right: -4px;
        }
      }
    }

    &--away {
      @include respond(tab-port) {
        flex-direction: row-reverse;
      }
    }

  }

  &__score {
    color: $color-white;
    font-weight: 700;
    padding-right: .5rem;

    @include respond(tab-port) {
      padding: 0 1rem;
    }

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
