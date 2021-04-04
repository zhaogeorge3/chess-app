<template id='game'>
    <div class="chessboard" >
        <div v-bind:class="!chessEngine.isWhitesTurn ? 'rotated' : 'not-rotated'">
            <transition-group v-if="getShuffle()" name="cell" tag="div" class="container">
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
            <div v-if="!getShuffle()" class="container">
                <div class="row" v-bind:class="!chessEngine.isWhitesTurn ? 'piece-rotated' : 'piece-not-rotated'" v-for="(boardSquare) in chessEngine.getBoardList()" v-bind:key="boardSquare.id">
                    <div class="cell" v-bind:key="boardSquare.id">
                        <button class="square" v-bind:style="{ backgroundColor: boardSquare.background}"
                        @click="move(boardSquare)"
                        >
                            <img v-if="boardSquare.piece != null" v-bind:src="boardSquare.piece.image">
                        </button>
                    </div>
                </div>
            </div>
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
import _ from "lodash";

export default defineComponent({
  name: 'LocalGame',
  data: function () {
    return {
      chessEngine: null as unknown as ChessEngine,
    }
  },
  async created() {
    this.chessEngine = new ChessEngine();
    this.chessEngine.message = "Setting Up Your Board!";
    await this.sleep(137);
    this.chessEngine.shuffle();
    await this.sleep(4300);
    this.chessEngine.unShuffle();
    await this.sleep(3333);
    this.chessEngine.message = "White's Turn";
  },
  methods: {
        move(boardSquare: BoardSquare) {
            let move = this.chessEngine.move(boardSquare);
        },
        sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        getShuffle() {
            return this.chessEngine.message == "Setting Up Your Board!"; 
        }
    }
})
</script>

<style scoped>

.square{
    height: 100%;
    width: 100%;
    }

.footer {
  height: 50px;
  margin-top: -50px;
}

.piece-rotated{
    transform: rotate(180deg);    
}

.piece-not-rotated{
    transform: rotate(0deg);    
}

.rotated {
    width: 100%;
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
    width: 100%;
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
  transition: transform 3.7s;
}
.chessboard{
    align-content: center; 
    display: flex;
    justify-content: center;   
}

.container {
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  max-width: 852px;
  margin: auto;
}

.row {
  display: flex;
  flex-basis: 12.5%;
  margin: 0;
  height: calc((100vw) / 10.159);
  max-height: 107px;
  justify-content: stretch;
  border: 0px solid black;
}

img {
    height: 77%;
    width: 77%;    
}

.row > div{
    width: 100%;
    align-self: stretch;
}
</style>

