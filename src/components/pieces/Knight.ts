import { Piece }from "./Piece"

export class Knight extends Piece { 

    static IMAGE: string = "../images/pieces/knight.png"


    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(Knight.IMAGE, iswhite), iswhite, currentX, currentY);
    }
}