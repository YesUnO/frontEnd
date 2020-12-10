<template>
  <div>
    <h1 class="header">Sarah's Sudoku</h1>
    <vue-headful title="Sarahs's Sudoku" />
    <div>
      <div v-if="downloaded">
        <v-btn @click="newGame">
          New Game
        </v-btn>
        <div :id="containerId"></div>
      </div>
      <div class="text" v-else>
        Downloading...
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import emmiter from '../../helpers/eventDispatcher.js'
  export default {
    name: "SudokuGrid",
    data() {
      return {
        downloaded: false,
        gameInstance: null,
        emmiter: null,
        containerId: 'sudoku'
      }
    },
    async mounted() {
      let self = this;

      self.emmiter = emmiter.getInstance()

      const game = await import('./sudoku.js')
      self.downloaded = true
      self.$nextTick(() => {
        self.gameInstance = game.launch(self.containerId)
      })
    },
    destroyed() {
      let self = this;
      self.gameInstance.destroy(false)
    },
    methods: {
      //eslint config
      /*eslint-disable no-console*/
      /*eslint-disable no-unused-vars*/
      newGame() {
        let self = this;

        self.emmiter.emit('newGame');
      }
    }
  }
</script>

<style scoped>
  .header {
    font: Grizzly;
    font-size: 64px;
    color: hotpink;
    font-weight: normal;
  }

  .text {
    font: Avenir;
  }
</style>
