import { Piece } from "../pieces/Piece"
import BoardSquare from '../board/BoardSquare'
import { Pawn } from '../pieces/Pawn'
import { Rook } from '../pieces/Rook'
import { Queen } from '../pieces/Queen'
import { King } from '../pieces/King'
import { Bishop } from '../pieces/Bishop'
import { Knight } from '../pieces/Knight'
import _ from "lodash";
import * as ChessJS from "chess.js"
import PieceFactory from "./PieceFactory"


export class ChessEngine{ 

    gameOver: boolean = false;
    board: BoardSquare[][];
    message: string;
    isWhitesTurn: boolean;
    pieceSelected?: Piece | null;
    validMoves: number[][] | null | undefined;
    letterGrid: Map<number, string> = new Map().set(0, 'a').set(1, 'b').set(2, 'c').set(3, 'd').set(4, 'e').set(5, 'f').set(6, 'g').set(7, 'h');
    numberGrid: Map<number, string> = new Map().set(0, '8').set(1, '7').set(2, '6').set(3, '5').set(4, '4').set(5, '3').set(6, '2').set(7, '1');
    engine: any;
    
    constructor() { 
        this.board = this.initializeBoard();
        const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
        this.engine = new Chess();
        this.isWhitesTurn = true;
        this.message = this.getMessage();
        this.validMoves = [];
    }

    shuffle(){
        let shuffledBoardList = _.shuffle(this.getBoardList());
        let board = [] as any;
        let count = 0 as number;
        for(let i = 0; i < 8; i++){
            let row = [] as any
            for(let j = 0; j < 8; j++){
                row.push(shuffledBoardList.pop());
            };
            board.push(row);
        };
        this.board = board as BoardSquare[][];

    }

    unShuffle(){
        let shuffledBoardList = _.orderBy(this.getBoardList(), ['id'], ['desc']);
        let board = [] as any;
        let count = 0 as number;
        for(let i = 0; i < 8; i++){
            let row = [] as any
            for(let j = 0; j < 8; j++){
                row.push(shuffledBoardList.pop());
            };
            board.push(row);
        };
        this.board = board as BoardSquare[][];

    }

    initializeBoard() {
        let board = [] as any;
        let count = 0 as number;
        for(let i = 0; i < 8; i++){
            let row : BoardSquare[] = [] as any
            for(let j = 0; j < 8; j++){
                if(i%2 == 0){
                    if(j%2 == 0){
                        row.push(new BoardSquare('#AD721A', i, j).setBoardIndex(this.generateId(i, j)).setId(count));
                        } else {
                        row.push(new BoardSquare('#D9AB66', i, j).setBoardIndex(this.generateId(i, j)).setId(count));
                        }
                    } else {
                if(j%2 == 0){
                    row.push(new BoardSquare('#D9AB66', i, j).setBoardIndex(this.generateId(i, j)).setId(count));
                } else{
                    row.push(new BoardSquare('#AD721A', i, j).setBoardIndex(this.generateId(i, j)).setId(count));
                    }
                }
                count++;
            }
        board.push(row);
        }
        this.board = board;
        this.initializePieces(board);
        return this.board;
    }
    generateId(x: number, y: number){
        let id = "";
        id += this.letterGrid.get(y)
        id += this.numberGrid.get(x)
        return id;
    }

    getBoardList(){
        let listBoard = [] as BoardSquare[];
        this.board.forEach(row => {
            row.forEach(col => {
                listBoard.push(col);
            });
        });
        return listBoard;
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
        this.loadWithFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    }

    loadWithFen(fen: string){
        let rows = fen.split("/");
        let rowIndex = 0;
        rows.forEach(row => {
            let colIndex = 0;
            for (let i = 0; i < row.length; i++) {
                let letterPiece = row[i];
                if(Number.isInteger(parseInt(letterPiece, 10))){
                    for(let j = colIndex; j < colIndex + parseInt(letterPiece, 10); j++){
                        this.board[rowIndex][j].piece = null;
                    }
                    colIndex += parseInt(letterPiece, 10);
                } else {
                    this.board[rowIndex][colIndex].piece = PieceFactory.getPieceFromFenCode(letterPiece, rowIndex, colIndex);
                    colIndex++;
                }
              }
            rowIndex++;
        });
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
        if(this.gameOver){
            if(this.isWhitesTurn){
                return "CheckMate Black Won!"
            } else {
                return "CheckMate White Won!"
            }
        }
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
            this.validMoves = boardSquare.piece?.getValidMovesFromEngine(this.engine, this.board);
            this.setBackgroudColor();
        }

    }

    move(boardSquare: BoardSquare, fake: boolean = false): any[] | null {
        let ps = null as any;
        let bs = null as any;
        if(this.pieceSelected != null){
            let valid = false;
            this.validMoves?.forEach(move => {
                if(move[0] == boardSquare.x && move[1] == boardSquare.y){
                    valid = true;
                }
        });
        this.resetBackGroundColor();
        if(valid){

            this.engine.move({
                from: this.board[this.pieceSelected.currentX][this.pieceSelected.currentY].boardIndex,
                to: boardSquare.boardIndex,
                promotion: 'q'
              });
            ps = _.cloneDeep(this.pieceSelected);
            bs = _.cloneDeep(boardSquare);
            this.loadWithFen(this.engine.fen().split(" ")[0]);
            if(!fake){
                this.isWhitesTurn = !this.isWhitesTurn;
            }
            this.message = this.getMessage();
            this.validMoves = [];
            this.pieceSelected = null;
            if(this.engine.game_over()){
                this.gameOver = true;
                this.message = this.getMessage();
            }
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