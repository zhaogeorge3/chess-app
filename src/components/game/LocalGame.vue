<template id='game'>
    <div class="chessboard" >
        <div v-bind:class="!chessEngine.isWhitesTurn ? 'rotated' : 'not-rotated'">
            <transition-group name="cell" tag="div" class="container">
                <div class="row" v-bind:class="!chessEngine.isWhitesTurn ? 'piece-rotated' : 'piece-not-rotated'" v-for="(boardSquare) in chessEngine.getBoardList()" v-bind:key="boardSquare.id">
                    <div class="cell" v-bind:key="boardSquare.id">
                        <button class="square" v-bind:style="{ backgroundColor: boardSquare.background}"
                        @click="move(boardSquare)"
                        >
                            <img v-if="boardSquare.piece != null" v-bind:src="boardSquare.piece.image">
                        </button>
                    </div>
                </div>
            </transition-group>

        </div>
    </div>
  <br>
  <footer>
    {{chessEngine.message}}
  </footer>
  <button @click="shuffle()">shuffle</button>
  <button @click="unShuffle()">unShuffle</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ChessEngine } from '../board/ChessEngine'
import BoardSquare from '../board/BoardSquare'
import _ from "lodash";

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
    shuffle(){
        this.chessEngine.shuffle();    
    },
    unShuffle(){
        this.chessEngine.unShuffle();    
    }
  }
})
</script>

<style scoped>
.square {
  height: 90px;
  width: 90px;
}

.footer {
  height: 50px;
  margin-top: -50px;
}

.piece-rotated{
    transform: rotate(180deg);    
}

.rotated {
    animation: animationFrames 1s ease 0s 1 normal forwards running;
}
@keyframes animationFrames {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  100% {
    transform: translate(0px, 0px) rotate(180deg);
  }
}

.not-rotated {
    animation: animationFramesReversed 1s ease 0s 1 normal forwards running;
}
@keyframes animationFramesReversed {
  0% {
    transform: translate(0px, 0px) rotate(180deg);
  }
  100% {
    transform: translate(0px, 0px) rotate(0deg);
  }
}
.cell-move {
  transition: transform 1.3s;
}
.chessboard{
    align-content: center; 
    display: flex;
    justify-content: center;   
}

.container {
  display: flex;
  flex-wrap: wrap;
  width: 720px;
}

.cell {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 90px;
  height: 90px;
}
</style>

