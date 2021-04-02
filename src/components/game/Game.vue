<template id='game'>
  <div class="chessboard" v-if="chessEngine" v-bind:class="playerNum == 2 ? 'rotated' : 'not-rotated'">
    <div class="row" v-bind:class="playerNum == 2 ? 'rotated' : 'not-rotated'" v-for="(row, index) in chessEngine.board" v-bind:key="index">
        <button class="square" v-for="(col, index) in row" v-bind:key="index" v-bind:style="{ backgroundColor: col.background}"
          @click="move(col)"
        >
          <img v-if="col.piece != null" v-bind:src="col.piece.image">
        </button>
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
      }

    },
    isMyTurn(playerNum: number, turn: string) {
      return (playerNum === 1 && turn === 'w') || (playerNum === 2 && turn === 'b');
    },
    updateBoard(id: string, game: any) {

      this.playerNum = this.figurePlayer(this.token, game);
      if(game.turn != "not started"){
        if (!this.chessEngine) {
          this.chessEngine = new ChessEngine();
        }
      } else {
        if(this.playerNum ==  2){
          const newGame = {
            p1_token: game.p1_token,
            p2_token: game.p2_token,
            white: game.p1_token,
            turn: "w"
          };
          console.log(newGame);
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

