import { Piece }from "./Piece"

export class King extends Piece { 

    static IMAGE: string = "../images/pieces/king.png"

    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(King.IMAGE, iswhite), iswhite, currentX, currentY);
    }
}