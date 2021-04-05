import { Piece }from "./Piece"

export class Pawn extends Piece { 

    static IMAGE: string = "../images/pieces/pawn.png"

    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(Pawn.IMAGE, iswhite), iswhite, currentX, currentY);
    }

}