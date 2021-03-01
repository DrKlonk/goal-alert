<template>
<div>
  <h1 v-if="isLoading">Aan het laden...</h1>
  <template v-else>
    <template v-if="isAMatchGoingOn">
      <h2>We zijn live!</h2>
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
      isLoading: false,
      matches: [
        {
          id: 310775,
          competition: {
            id: 2017,
            name: 'Primeira Liga',
            area: {
              name: 'Portugal',
              code: 'PRT',
              ensignUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg'
            }
          },
          season: {
            id: 644,
            startDate: '2020-09-20',
            endDate: '2021-05-19',
            currentMatchday: 21,
            winner: null
          },
          utcDate: '2021-03-01T18:00:00Z',
          status: 'IN_PLAY',
          matchday: 21,
          stage: 'REGULAR_SEASON',
          group: 'Regular Season',
          lastUpdated: '2021-03-01T18:20:44Z',
          odds: {
            msg: 'Activate Odds-Package in User-Panel to retrieve odds.'
          },
          score: {
            winner: null,
            duration: 'REGULAR',
            fullTime: {
              homeTeam: null,
              awayTeam: null
            },
            halfTime: {
              homeTeam: null,
              awayTeam: null
            },
            extraTime: {
              homeTeam: null,
              awayTeam: null
            },
            penalties: {
              homeTeam: null,
              awayTeam: null
            }
          },
          homeTeam: {
            id: 1903,
            name: 'Sport Lisboa e Benfica'
          },
          awayTeam: {
            id: 496,
            name: 'Rio Ave FC'
          },
          referees: [
            {
              id: 39354,
              name: 'Nuno Almeida',
              role: 'MAIN_REFEREE',
              nationality: 'Portugal'
            },
            {
              id: 37509,
              name: 'André Campos',
              role: 'ASSISTANT_N1',
              nationality: 'Portugal'
            },
            {
              id: 37781,
              name: 'Pedro Felisberto',
              role: 'ASSISTANT_N2',
              nationality: 'Portugal'
            },
            {
              id: 98857,
              name: 'Marcos Roberto Viegas Brazão',
              role: 'FOURTH_OFFICIAL',
              nationality: 'Portugal'
            },
            {
              id: 37386,
              name: 'António Nobre',
              role: 'VIDEO_ASSISTANT_REFEREE',
              nationality: 'Portugal'
            }
          ]
        },
        {
          id: 308565,
          competition: {
            id: 2014,
            name: 'Primera Division',
            area: {
              name: 'Spain',
              code: 'ESP',
              ensignUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg'
            }
          },
          season: {
            id: 635,
            startDate: '2020-09-13',
            endDate: '2021-05-23',
            currentMatchday: 25,
            winner: null
          },
          utcDate: '2021-03-01T20:00:00Z',
          status: 'SCHEDULED',
          matchday: 25,
          stage: 'REGULAR_SEASON',
          group: 'Regular Season',
          lastUpdated: '2021-03-01T14:34:27Z',
          odds: {
            msg: 'Activate Odds-Package in User-Panel to retrieve odds.'
          },
          score: {
            winner: null,
            duration: 'REGULAR',
            fullTime: {
              homeTeam: null,
              awayTeam: null
            },
            halfTime: {
              homeTeam: null,
              awayTeam: null
            },
            extraTime: {
              homeTeam: null,
              awayTeam: null
            },
            penalties: {
              homeTeam: null,
              awayTeam: null
            }
          },
          homeTeam: {
            id: 86,
            name: 'Real Madrid CF'
          },
          awayTeam: {
            id: 92,
            name: 'Real Sociedad de Fútbol'
          },
          referees: []
        }]
    }
  },
  components: {
    MatchDisplay
  },
  created () {
    // this.getMatches()
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
