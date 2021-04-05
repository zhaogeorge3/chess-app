import { Piece }from "./Piece"
import BoardSquare from "../board/BoardSquare"

export class Knight extends Piece { 

    static IMAGE: string = "../images/pieces/knight.png"


    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(Knight.IMAGE, iswhite), iswhite, currentX, currentY);
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
    }
}