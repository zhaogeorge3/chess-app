<template id='game'>
<div v-if="chessEngine">
  <div v-if="getShuffle()" class="chessboard">
    <transition-group name="cell" tag="div" class="container">
      <div class="row" v-for="(boardSquare) in chessEngine.getBoardList()" v-bind:key="boardSquare.id">
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
  <div v-if="!getShuffle()" class="chessboard" v-bind:class="playerNum == 2 ? 'rotated' : 'not-rotated'">
    <div class="container">
      <div class="row" v-bind:class="playerNum == 2 ? 'piece-rotated' : 'piece-not-rotated'" v-for="(boardSquare) in chessEngine.getBoardList()" v-bind:key="boardSquare.id">
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
    {{message}}
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ChessEngine } from '../board/ChessEngine'
import BoardSquare from '../board/BoardSquare'
import firebase from "firebase/app";
import 'firebase/auth'
import 'firebase/database'
import { inject } from 'vue'

export default defineComponent({
  name: 'Game',
  data: function () {
    return {
      message: "Waiting for Player 2" as string,
      chessEngine: null as unknown as ChessEngine,
      token: "" as string,
      id: null as unknown as string,
      playerNum: null as unknown as number,
      game: null as unknown as any,
      toastTrigger: null as any,
      firebaseConfig: {
        apiKey: "AIzaSyA20nb9TOGBG6oVXIlxQYxXfz1vV-GcWR4",
        authDomain: "chess-cb086.firebaseapp.com",
        projectId: "chess-cb086",
        storageBucket: "chess-cb086.appspot.com",
        messagingSenderId: "1084426781021",
        appId: "1:1084426781021:web:44b03423c77b5b9885a8b4",
        measurementId: "G-M1W5RX8G78"
      }
    }
  },
  created() {
    this.toastTrigger = inject('toast') as any;
    this.token = this.$router.currentRoute.value.params.token.toString();

    firebase.initializeApp(this.firebaseConfig);
    this.listenForUpdates(this.token, (id: string, game: any) => {
      this.id = id;
      this.message = this.getMessage(game);
      this.updateBoard(id, game);
      this.updateInfo(game);
    });
  },
  methods: {
    sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    getShuffle() {
      return this.message == "Setting Up Your Board!"; 
    },
    getMessage(game: any){
      if(game.turn === 'w'){
        return "White's Turn";
      } else if(game.turn === 'b'){
        return "Black's Turn";
      } else {
        return "Waiting For Player 2";
      }
    },
    move(boardSquare: BoardSquare) {
      if(this.isMyTurn(this.playerNum, this.game.turn)){
        this.chessEngine.isWhitesTurn = this.game.turn === 'w'? true : false;
        let move = this.chessEngine.move(boardSquare);
        if(move != null){
          const game = {
            p1_token: this.game.p1_token,
            p2_token: this.game.p2_token,
            white: this.game.white,
            turn: (this.game.turn === "w" ? 'b' : 'w'),
            ps: move[0],
            bs: move[1]
            }
            this.games().set(game);
          }
        }
    },
    fakeMove(boardSquare: BoardSquare){
      this.chessEngine.move(boardSquare, true);
    },
    updateInfo(game: any) {
      if(this.isMyTurn(this.playerNum, game.turn) && game.ps != null){
        this.fakeMove(this.chessEngine.board[game.ps.currentX][game.ps.currentY]);
        this.fakeMove(this.chessEngine.board[game.bs.x][game.bs.y]);
        if(this.chessEngine.gameOver){
          this.message = "Game Over " + (this.playerNum == 1 ? "Black" : "White") + " Won!";
          this.toastTrigger.error(this.message, {position: "top-right", duration: 3773});  
        } else if(this.chessEngine.engine.in_check()){
          this.toastTrigger.error("Check!", {position: "top-right", duration: 1773});
        }
      } else {
        if(this.chessEngine?.gameOver){
          this.message = "You Won!";
          this.toastTrigger.success(this.message, {position: "top-right", duration: 3773}); 
        }
      }

    },
    isMyTurn(playerNum: number, turn: string) {
      return (playerNum === 1 && turn === 'w') || (playerNum === 2 && turn === 'b');
    },
    async loadChessBoard(){
      this.chessEngine = new ChessEngine();
      let playerNum = this.playerNum;
      this.playerNum = 1;
      this.toastTrigger.info('Setting Up Your Board!', {position: "top-right", duration: 7000}); 
      this.message = "Setting Up Your Board!";
      await this.sleep(73);
      this.chessEngine.shuffle();
      await this.sleep(4300);
      this.chessEngine.unShuffle();
      await this.sleep(3737);
      this.playerNum = playerNum;
      this.message = "White's Turn";
    },
    updateBoard(id: string, game: any) {

      this.playerNum = this.figurePlayer(this.token, game);
      if(game.turn != "not started"){
        if (!this.chessEngine) {
          this.loadChessBoard();
        }
      } else {
        if(this.playerNum ==  2){
          const newGame = {
            p1_token: game.p1_token,
            p2_token: game.p2_token,
            white: game.p1_token,
            turn: "w"
          };
          this.games().set(newGame);
        }  
      }

    },
    figurePlayer(token: string, game: any) {
      if (token === game.p1_token) {
        return 1;
      } else if (token === game.p2_token) {
        return 2;
      } else {
        return 0;
      }
    },
    listenForUpdates(token: string, cb: any) {
      const db = firebase.database().ref("/games");
      ["p1_token", "p2_token"].forEach((name) => {
        const ref = db.orderByChild(name).equalTo(token);
        ref.on('value', (ref) => {
          const [id, game] = this.parse(ref.val());
          if (!id) return;
          this.game = game;
          cb(id, game);
        });
      });
    },
    parse(tree: any) {
      if (!tree) return [];
      const keys = Object.keys(tree);
      const id = keys[0];
      const game = tree[id];
      return [id, game];
    },
    games() {
      return firebase
        .database()
        .ref(`/games/${this.id}`);
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

