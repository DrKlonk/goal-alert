<template>
  <div id="app">
    <div class="bg-container"/>
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

</style>
