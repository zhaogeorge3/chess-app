<template>
  <header>
    <h1>Welcome To Chess</h1>
  </header>
  <div>
  <Game/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Game from './components/game/Game.vue'

export default defineComponent({
  name: 'App',
  components: {
    Game,
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>