<template>
  <div id="app">
    <home />
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style lang="scss">
@import "scss/main.scss";
#app {
  display: flex;
  justify-content: center;
}

</style>
