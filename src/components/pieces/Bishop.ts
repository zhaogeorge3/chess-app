import { Piece }from "./Piece"
import BoardSquare from "../board/BoardSquare"

export class Bishop extends Piece { 

    static IMAGE: string = "./images/pieces/bishop.png"


    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(Bishop.IMAGE, iswhite), iswhite, currentX, currentY);
    }

    private isWithinBoard(move: number[]) {
        return move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8;
    }

    getUpRightMoves(board: BoardSquare[][]){
        let validMoves = [] as number[][];
        for(let i = 1; i < 8; i++){
            let x = this.currentX + i;
            let y = this.currentY + i;
            let move = [x, y];
            if(this.isWithinBoard(move)){
                if(board[x][y].piece != null){
                    if(board[x][y].piece?.isWhite == this.isWhite){
                        break;
                    } else{
                        validMoves.push(move);
                        break;
                    }
                } else{
                    validMoves.push(move);
                }
            } else{
                break;
            }
        }
        return validMoves;
    }

    getUpLeftMoves(board: BoardSquare[][]){
        let validMoves = [] as number[][];
        for(let i = 1; i < 8; i++){
            let x = this.currentX + i;
            let y = this.currentY - i;
            let move = [x, y];
            if(this.isWithinBoard(move)){
                if(board[x][y].piece != null){
                    if(board[x][y].piece?.isWhite == this.isWhite){
                        break;
                    } else{
                        validMoves.push(move);
                        break;
                    }
                } else{
                    validMoves.push(move);
                }
            } else{
                break;
            }
        }
        return validMoves;
    }

    getDownRightMoves(board: BoardSquare[][]){
        let validMoves = [] as number[][];
        for(let i = 1; i < 8; i++){
            let x = this.currentX - i;
            let y = this.currentY + i;
            let move = [x, y];
            if(this.isWithinBoard(move)){
                if(board[x][y].piece != null){
                    if(board[x][y].piece?.isWhite == this.isWhite){
                        break;
                    } else{
                        validMoves.push(move);
                        break;
                    }
                } else{
                    validMoves.push(move);
                }
            } else{
                break;
            }
        }
        return validMoves;
    }

    getDownLeftMoves(board: BoardSquare[][]){
        let validMoves = [] as number[][];
        for(let i = 1; i < 8; i++){
            let x = this.currentX - i;
            let y = this.currentY - i;
            let move = [x, y];
            if(this.isWithinBoard(move)){
                if(board[x][y].piece != null){
                    if(board[x][y].piece?.isWhite == this.isWhite){
                        break;
                    } else{
                        validMoves.push(move);
                        break;
                    }
                } else{
                    validMoves.push(move);
                }
            } else{
                break;
            }
        }
        return validMoves;
    }

    getValidMoves(board: BoardSquare[][]): number[][] {
        let validMoves = [] as number[][];
        validMoves.push(...this.getUpLeftMoves(board));
        validMoves.push(...this.getUpRightMoves(board));
        validMoves.push(...this.getDownLeftMoves(board));
        validMoves.push(...this.getDownRightMoves(board));
        return validMoves;
    }

    setXY(x: number, y: number){
        super.setXY(x, y);
    }
}