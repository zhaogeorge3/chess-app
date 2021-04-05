import { Piece } from "../pieces/Piece"

export default class BoardSquare {
    id?: number;
    boardIndex?: string;
    piece?: Piece | null;
    background: string;
    x: number;
    y: number;
    originalBackground: string;

    constructor(background: string, x: number, y: number) { 
        this.background = background;
        this.originalBackground = background;
        this.x = x;
        this.y = y;
     }

    setPiece(piece: Piece | null){
        this.piece = piece;
    }
    setId(id: number){
        this.id = id;
        return this;
    }
    setBoardIndex(boardIndex: string){
        this.boardIndex = boardIndex;
        return this;
    }
}