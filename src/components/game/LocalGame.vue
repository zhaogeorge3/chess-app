<template id='game'>
  <div class="chessboard" v-bind:class="!chessEngine.isWhitesTurn ? 'rotated' : 'not-rotated'">
    <div class="row" v-bind:class="!chessEngine.isWhitesTurn ? 'rotated' : 'not-rotated'" v-for="(row, index) in chessEngine.board" v-bind:key="index">
        <button class="square" v-for="(col, index) in row" v-bind:key="index" v-bind:style="{ backgroundColor: col.background}"
          @click="move(col)"
        >
          <img v-if="col.piece != null" v-bind:src="col.piece.image">
        </button>
    </div>
  </div>
  <br>
  <footer>
    {{chessEngine.message}}
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ChessEngine } from '../board/ChessEngine'
import BoardSquare from '../board/BoardSquare'


export default defineComponent({
  name: 'LocalGame',
  data: function () {
    return {
      chessEngine: null as unknown as ChessEngine,
    }
  },
  created() {
    this.chessEngine = new ChessEngine();
  },
  methods: {
    move(boardSquare: BoardSquare) {
        let move = this.chessEngine.move(boardSquare);
    },
  }
})
</script>

<style scoped>
.square {
  height: 90px;
  width: 90px;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: top;
}
.row{
  margin: 0;
  height: 90px;
  line-height: 0;
  font-size: 0;
  vertical-align:bottom;
}

.footer {
  height: 50px;
  margin-top: -50px;
}

.rotated {
  transform: rotate(180deg);

}
</style>

