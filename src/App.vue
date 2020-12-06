<template>
  <div id="app">
    <component :is="'DropScreen'"/>
  </div>
</template>

<script>
import DropScreen from './components/DropScreen.vue'

export default {
  name: 'App',
  components: {
    DropScreen,
  }
}
</script>

<style>
html, body, #app {
  background-color:rgb(241, 237, 212);
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  position:absolute;
}

</style>
