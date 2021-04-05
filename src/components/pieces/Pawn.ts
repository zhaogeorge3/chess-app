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


    getValidMovesFromEngine(engine: any, board: BoardSquare[][]): number[][] {
        let validMoves = [] as number[][];
        board.forEach(boardRow => {
            boardRow.forEach(boardSquare => {
                const m = engine.move({
                    from: board[this.currentX][this.currentY].boardIndex,
                    to: boardSquare.boardIndex,
                    promotion: 'q'
                  });
                  if(m){
                    validMoves.push([boardSquare.x, boardSquare.y]);
                    engine.undo();
                }
            });
        })
        console.log(validMoves);
        return validMoves;
    }

    setXY(x: number, y: number){
        super.setXY(x, y);
        this.hasMoved = true;
    }
}