import {ChessBoard, c} from "./chessBoard.js";
import {Piece, Pawn, Rook, Bishop, Queen, King, Knight, Empty} from "./piece.js";
import {Game} from "./game.js";
import {Player, AI} from "./player.js";

export class Move {
    constructor(piece, start, end, exception) {
        this.piece = piece;
        this.start = start;
        this.end = end;
        this.exception = exception;
        this.type = 'Capture';
    }
}
