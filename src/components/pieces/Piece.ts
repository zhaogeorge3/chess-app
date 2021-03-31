import BoardSquare from "../board/BoardSquare";

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
    abstract getValidMoves(board: BoardSquare[][]): number[][];
}