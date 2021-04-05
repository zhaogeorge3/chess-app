import { Pawn } from '../pieces/Pawn'
import { Rook } from '../pieces/Rook'
import { Queen } from '../pieces/Queen'
import { King } from '../pieces/King'
import { Bishop } from '../pieces/Bishop'
import { Knight } from '../pieces/Knight'

export default class PieceFactory {
    static getPieceFromFenCode(letterPiece: string, x: number,  y: number) { 
        let isWhite = false;
        if(letterPiece === letterPiece.toUpperCase()){
            isWhite = true
        }
        letterPiece = letterPiece.toLowerCase();
        switch(letterPiece) {
            case "r":
                return new Rook(isWhite, x, y);
            case "n":
                return new Knight(isWhite, x, y);
            case "b":
                return new Bishop(isWhite, x, y);
            case "q":
                return new Queen(isWhite, x, y);
            case "k":
                return new King(isWhite, x, y);
            case "p":
                return new Pawn(isWhite, x, y);
            default:
              return null;
          }

     }
}