<template>
  <header>
    <h1>Chess</h1>
  </header>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Game from './components/game/Game.vue'

export default defineComponent({


  name: 'App',

})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 33px;
}
</style>