<template id='game'>
  <div class="chessboard">
    <div class="row" v-for="(row, index) in board" v-bind:key="index">
        <button class="square" v-for="(col, index) in row" v-bind:key="index" v-bind:style="{ backgroundColor: col.background}"
          @click="move(col)"
        >
          <img v-bind:src="col.piece != null ? col.piece.image : ''">
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
import BoardSquare from '../board/BoardSquare'
import { Pawn } from '../pieces/Pawn'
import { Piece } from '../pieces/Piece'

export default defineComponent({
  name: 'Game',
  data: function () {
    return {
      board: [] as BoardSquare[][],
      message: "White's Turn" as string,
      isWhitesTurn: true,
      pieceSelected: null as unknown as Piece | null,
      validMoves: [] as number[][]
    }
  },
  created() {
    this.board = [];
    for(let i = 0; i < 8; i++){
      let row : BoardSquare[] = []
      for(let j = 0; j < 8; j++){
        if(i%2 == 0){
          if(j%2 == 0){
            row.push(new BoardSquare('#AD721A', i, j));
            } else {
              row.push(new BoardSquare('#D9AB66', i, j));
            }
        } else {
          if(j%2 == 0){
            row.push(new BoardSquare('#D9AB66', i, j));
            } else{
              row.push(new BoardSquare('#AD721A', i, j));
            }
        }
      }
      this.board.push(row);
    }
    this.initializePieces(this.board);
  },
  methods: {
    setBackgroudColor(){
      this.board.forEach(row => {
        row.forEach(col => {
          this.validMoves.forEach(move => {
            if(move[0] == col.x && move[1] == col.y){
              col.background = '#3E880C';
            }
          });
        });
      });
    },
    resetBackGroundColor(){
      this.board.forEach(row => {
        row.forEach(col => {
            col.background = col.originalBackground;
          });
      })  
    },
    initializePieces(board: BoardSquare[][]){
      this.initializePawns(board);
    },
    initializePawns(board: BoardSquare[][]){
      for(let i = 0; i < 8; i++){
        board[1][i].setPiece(new Pawn(false, 1, i));
      }
      for(let i = 0; i < 8; i++){
        board[6][i].setPiece(new Pawn(true, 6, i));
      }
    },
    getMessage(){
      if(this.isWhitesTurn){
        return "White's Turn";
      } else {
        return "Black' Turn";
      }
    },
    selectPiece(boardSquare: BoardSquare){
      if(boardSquare.piece?.isWhite == this.isWhitesTurn){
        this.validMoves = [];
        this.pieceSelected = boardSquare.piece;
        this.validMoves = boardSquare.piece.getValidMoves(this.board);
        this.setBackgroudColor();
      }

    },
    move(boardSquare: BoardSquare) {
      if(this.pieceSelected != null){
        let valid = false;
        this.validMoves.forEach(move => {
            if(move[0] == boardSquare.x && move[1] == boardSquare.y){
              valid = true;
            }
        });
        this.resetBackGroundColor();
        if(valid){
          this.isWhitesTurn = !this.isWhitesTurn;
          this.message = this.getMessage();
          this.board[boardSquare.x][boardSquare.y].setPiece(this.pieceSelected);
          this.board[this.pieceSelected.currentX][this.pieceSelected.currentY].setPiece(null);
          this.pieceSelected.setXY(boardSquare.x, boardSquare.y);
        }
        this.validMoves = [];
        this.pieceSelected = null;
      } else {
        this.selectPiece(boardSquare);
      }
      
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
</style>

