import { Piece }from "./Piece"
import BoardSquare from "../board/BoardSquare"

export class Pawn extends Piece { 

    static IMAGE: string = "../images/pieces/pawn.png"

    hasMoved: boolean;
    direction: number;

    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(Pawn.IMAGE, iswhite), iswhite, currentX, currentY);
        this.hasMoved = false;
        this.direction = this.isWhite ? -1 : 1
    }

    private isWithinBoard(move: number[]) {
        return move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8;
    }

    private isAttack(move: number[]) {
        return move[1] != this.currentY;
    }

    checkMove(board: BoardSquare[][], move: number[]){
        if(this.isWithinBoard(move)){
            if(this.isAttack(move)){
                if(board[move[0]][move[1]].piece != null && board[move[0]][move[1]].piece?.isWhite != this.isWhite){
                    return true;
                } else{
                    return false;
                }
            }else{
                if(Math.abs(move[0] - this.currentX +1*this.direction) > 1 ){
                    if(board[this.currentX+1*this.direction][this.currentY].piece == null){
                        if(board[move[0]][move[1]].piece == null){
                            return true;
                        } else{
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    if(board[move[0]][move[1]].piece == null){
                        return true;
                    } else{
                        return false;
                    }
                }
            }
        }
        return false;
    }

    getValidMoves(board: BoardSquare[][]): number[][] {
        let validMoves = [] as number[][]
        let possibleMoves = [] as number[][]
        possibleMoves.push([this.currentX+1*this.direction, this.currentY+1]);
        possibleMoves.push([this.currentX+1*this.direction, this.currentY-1]);
        possibleMoves.push([this.currentX+1*this.direction, this.currentY]);
        if(!this.hasMoved){
            possibleMoves.push([this.currentX+2*this.direction, this.currentY]);
        }
        possibleMoves.forEach(move => {
            if(this.checkMove(board, move)){
                validMoves.push(move);
            }
        });
        return validMoves
    }

    setXY(x: number, y: number){
        super.setXY(x, y);
        this.hasMoved = true;
    }
}