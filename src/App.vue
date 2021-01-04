<template>
  <div id="app" v-bind:class="{cursor: cursor}">
    <component :is="'DropScreen'"/>
  </div>
</template>

<script>
import DropScreen from './components/DropScreen.vue'

export default {
  name: 'App',
  data() {
    return {
      cursor: false,
    }
  },
  components: {
    DropScreen,
  },
  created: function() {
      window.addEventListener('keypress', (e) => {
          if (e.code == 'KeyM') {
              this.cursor = !this.cursor
          }
      });
  },
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

.cursor {
    cursor: url("assets/cursor.png") 16 16, auto;
}

</style>
