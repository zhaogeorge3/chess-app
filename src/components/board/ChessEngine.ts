import { Piece } from "../pieces/Piece"
import BoardSquare from '../board/BoardSquare'
import { Pawn } from '../pieces/Pawn'
import { Rook } from '../pieces/Rook'
import { Queen } from '../pieces/Queen'
import { King } from '../pieces/King'
import { Bishop } from '../pieces/Bishop'
import { Knight } from '../pieces/Knight'
import _ from "lodash";

export class ChessEngine{ 

    board: BoardSquare[][];
    message: string;
    isWhitesTurn: boolean;
    pieceSelected?: Piece | null;
    validMoves: number[][] | null | undefined;

    constructor() { 
        this.board = this.initializeBoard();
        this.isWhitesTurn = true;
        this.message = this.getMessage();
        this.validMoves = [];
    }

  initializeBoard() {
    let board = [];
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
      board.push(row);
    }
    this.board = board;
    this.initializePieces(board);
    return this.board;
  }

    setBackgroudColor(){
        this.board.forEach(row => {
        row.forEach(col => {
            this.validMoves?.forEach(move => {
            if(move[0] == col.x && move[1] == col.y){
                col.background = '#3E880C';
            }
            });
        });
        });
    }

    resetBackGroundColor(){
        this.validMoves?.forEach(move => {
        this.board[move[0]][move[1]].background = this.board[move[0]][move[1]].originalBackground;
        })  
    }

    initializePieces(board: BoardSquare[][]){
        this.initializePawns(board);
        this.board[0][0].setPiece(new Rook(false, 0, 0));
        this.board[0][7].setPiece(new Rook(false, 0, 7));
        this.board[7][0].setPiece(new Rook(true, 7, 0));
        this.board[7][7].setPiece(new Rook(true, 7, 7));

        this.board[0][2].setPiece(new Bishop(false, 0, 2));
        this.board[0][5].setPiece(new Bishop(false, 0, 5));
        this.board[7][2].setPiece(new Bishop(true, 7, 2));
        this.board[7][5].setPiece(new Bishop(true, 7, 5));

        this.board[0][1].setPiece(new Knight(false, 0, 1));
        this.board[0][6].setPiece(new Knight(false, 0, 6));
        this.board[7][1].setPiece(new Knight(true, 7, 1));
        this.board[7][6].setPiece(new Knight(true, 7, 6));

        this.board[0][3].setPiece(new Queen(false, 0, 3));
        this.board[7][3].setPiece(new Queen(true, 7, 3));

        this.board[0][4].setPiece(new King(false, 0, 4));
        this.board[7][4].setPiece(new King(true, 7, 4));


    }

    initializePawns(board: BoardSquare[][]){
        for(let i = 0; i < 8; i++){
        board[1][i].setPiece(new Pawn(false, 1, i));
        }
        for(let i = 0; i < 8; i++){
        board[6][i].setPiece(new Pawn(true, 6, i));
        }
    }

    getMessage(){
        if(this.isWhitesTurn){
        return "White's Turn";
        } else {
        return "Black's Turn";
        }
    }

    selectPiece(boardSquare: BoardSquare, fake: boolean = false){
        if(boardSquare.piece?.isWhite == this.isWhitesTurn || fake){
            this.validMoves = [];
            this.pieceSelected = boardSquare.piece;
            this.validMoves = boardSquare.piece?.getValidMoves(this.board);
            this.setBackgroudColor();
        }

    }

    move(boardSquare: BoardSquare, fake: boolean = false): any[] | null {
        let ps = null;
        let bs = null;
        if(this.pieceSelected != null){
        let valid = false;
        this.validMoves?.forEach(move => {
            if(move[0] == boardSquare.x && move[1] == boardSquare.y){
                valid = true;
            }
        });
        this.resetBackGroundColor();
        if(valid){
            ps = _.cloneDeep(this.pieceSelected);
            bs = _.cloneDeep(boardSquare);
            if(!fake){
                this.isWhitesTurn = !this.isWhitesTurn;
            }
            this.message = this.getMessage();
            this.board[boardSquare.x][boardSquare.y].setPiece(this.pieceSelected);
            this.board[this.pieceSelected.currentX][this.pieceSelected.currentY].setPiece(null);
            this.pieceSelected.setXY(boardSquare.x, boardSquare.y);
            this.validMoves = [];
            this.pieceSelected = null;
            return[ps, bs];
        }
        this.validMoves = [];
        this.pieceSelected = null;
        } else {
        this.selectPiece(boardSquare, fake);
        }
        return null;
    }

}