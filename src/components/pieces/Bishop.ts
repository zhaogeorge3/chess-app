import { Piece }from "./Piece"

export class Bishop extends Piece { 

    static IMAGE: string = "../images/pieces/bishop.png"


    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(Bishop.IMAGE, iswhite), iswhite, currentX, currentY);
    }
}