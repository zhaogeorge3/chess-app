import { Piece } from "../pieces/Piece"
import BoardSquare from '../board/BoardSquare'
import _ from "lodash";
import * as ChessJS from "chess.js"
import PieceFactory from "./PieceFactory"
import Coordinates from "./Coordinates";


export class ChessEngine{ 

    gameOver: boolean = false;
    board: BoardSquare[][];
    message: string;
    isWhitesTurn: boolean;
    pieceSelected?: Piece | null;
    validMoves: Coordinates[] | null | undefined;
    letterGrid: Map<number, string> = new Map().set(0, 'a').set(1, 'b').set(2, 'c').set(3, 'd').set(4, 'e').set(5, 'f').set(6, 'g').set(7, 'h');
    numberGrid: Map<number, string> = new Map().set(0, '8').set(1, '7').set(2, '6').set(3, '5').set(4, '4').set(5, '3').set(6, '2').set(7, '1');
    engine: any;
    
    private readonly initialFenCode = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

    constructor() { 
        const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
        this.engine = new Chess();
        this.board = this.initializeBoard();
        this.isWhitesTurn = true;
        this.message = this.getMessage();
        this.validMoves = [];
    }

    shuffle(){
        let shuffledBoardList = _.shuffle(this.getBoardList());
        let board = [] as any;
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
                this.validMoves?.forEach(coordinate => {
                if(coordinate.x == col.x && coordinate.y == col.y){
                    col.background = '#3E880C';
                }
                });
            });
        });
    }

    resetBackGroundColor(){
        this.validMoves?.forEach(coordinate => {
            this.board[coordinate.x][coordinate.y].resetBackGroundColor();
        })  
    }

    initializePieces(board: BoardSquare[][]){
        this.loadWithFen();
    }

    loadWithFen(){
        let fen = this.engine.fen().split(" ")[0] as string;
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
            this.validMoves?.forEach(coordinate => {
                if(coordinate.x == boardSquare.x && coordinate.y == boardSquare.y){
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
            this.loadWithFen();
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