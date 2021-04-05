import { Piece }from "./Piece"

export class Rook extends Piece { 

    static IMAGE: string = "../images/pieces/rook.png"


    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(Rook.IMAGE, iswhite), iswhite, currentX, currentY);
    }
}