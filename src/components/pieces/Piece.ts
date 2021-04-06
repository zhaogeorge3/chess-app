import BoardSquare from "../board/BoardSquare";
import Coordinates from "../board/Coordinates";

export abstract class Piece {
    image: string;
    isWhite: boolean;
    currentX: number;
    currentY: number;

    constructor(image: string, iswhite: boolean, currentX: number, currentY: number) { 
        this.image = image;
        this.isWhite = iswhite;
        this.currentX = currentX;
        this.currentY = currentY;
     }

    static getWhiteElseBlackImage(image: string, white: boolean) : string {
        return white ? image.replace(".png", "-w.png") : image.replace(".png", "-b.png")
    }

    setXY(x: number, y: number){
        this.currentX = x;
        this.currentY = y;
    }
    getValidMovesFromEngine(engine: any, board: BoardSquare[][]): Coordinates[] {
        let validMoves = [] as Coordinates[];
        board.forEach(boardRow => {
            boardRow.forEach(boardSquare => {
                const m = engine.move({
                    from: board[this.currentX][this.currentY].boardIndex,
                    to: boardSquare.boardIndex,
                    promotion: 'q'
                  });
                  if(m){
                    validMoves.push(new Coordinates(boardSquare.x, boardSquare.y));
                    engine.undo();
                }
            });
        })
        return validMoves;
    }
}