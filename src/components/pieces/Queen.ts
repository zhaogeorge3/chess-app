import { Piece }from "./Piece"

export class Queen extends Piece { 

    static IMAGE: string = "../images/pieces/queen.png"


    constructor(iswhite: boolean, currentX: number, currentY: number) { 
        super(Piece.getWhiteElseBlackImage(Queen.IMAGE, iswhite), iswhite, currentX, currentY);
    }

}