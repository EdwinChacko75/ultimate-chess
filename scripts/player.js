import {ChessBoard, c} from "./chessBoard.js";
import {Piece, Pawn, Rook, Bishop, Queen, King, Knight, Empty} from "./piece.js";
import {Move} from "./move.js";
import {Game} from "./game.js";
import { getZobristHash } from "./zobristTable.js";

export class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.moves = [];
        this.capturedPieces = [];
        this.isInCheck = false;
        this.checkmate = false;
        this.stalemate = false;
        let i = color === 'white' ? 7 : 0;
        let j = Math.abs(i - 1);
        this.pieces = [
            new Rook(color, [i, 0]),
            new Knight(color, [i, 1]),
            new Bishop(color, [i, 2]),
            new Queen(color, [i, 3]),
            new King(color, [i, 4]),
            new Bishop(color, [i, 5]),
            new Knight(color, [i, 6]),
            new Rook(color, [i, 7]),
            new Pawn(color, [j, 0]),
            new Pawn(color, [j, 1]),
            new Pawn(color, [j, 2]),
            new Pawn(color, [j, 3]),
            new Pawn(color, [j, 4]),
            new Pawn(color, [j, 5]),
            new Pawn(color, [j, 6]),
            new Pawn(color, [j, 7])
        ];
    }
    
    static makeTestMove(chessBoard, move) {
        let start = move.start;
        let end = move.end;
        let board = chessBoard.board;
        let piece = board[start[0]][start[1]];
        let endPiece = board[end[0]][end[1]];
        let previousJustMoved = null;
        let exception = false;
        let previousFirstMove = false;

        if (piece.firstMove) {
            previousFirstMove = true;
            piece.firstMove = false;
            if (piece.type === "Pawn") {
                if (piece.justMoved){
                    piece.justMoved = false;
                } else {
                    piece.justMoved = true;
                    // if the pawn is on an enpassant row, update chessBoard.enPassant
                    if (piece.position[0] === 4 || piece.position[0] === 3) {
                        chessBoard.enPassant = chessBoard.rows[piece.position[1]];
                        chessBoard.enPassant = [piece.position[0] + 1, piece.position[1]];
                    } else {
                        chessBoard.enPassant = null;
                    }
                }
            }
        }
        let i = 0;
        let j = 0;
        for (i=0; i < 8; i++) {
            for (j=0; j < 8 ; j++) {
                if (i === start[0] && j === start[1])
                    continue;
                if (board[i][j].justMoved) {
                    previousJustMoved = [i, j];
                }
                board[i][j].justMoved = false;
            }
        }
        if (board[end[0]][end[1]].type !== "Empty") {
            board[end[0]][end[1]].isCaptured = true;
        }
        board[start[0]][start[1]] = new Empty(start);
        board[end[0]][end[1]] = piece;
        piece.position = end;

        // move.exception is the final position, not a move object
        // if (move.exception) {
        //     exception = Player.makeTestMove(chessBoard, move.exception);
        // }

        chessBoard.updateTargetedSquares();

        return {endPiece, piece, previousJustMoved, exception, previousFirstMove};
    }
    static undoTestMove(chessBoard, move, oldBoardState) {
        let board = chessBoard.board;
        let start = move.start;
        let end = move.end;
        oldBoardState.piece.position = start;
        board[start[0]][start[1]] = oldBoardState.piece;
        board[end[0]][end[1]] = oldBoardState.endPiece;
        if (oldBoardState.endPiece.type !== "Empty") {
            oldBoardState.endPiece.isCaptured = false;
            oldBoardState.endPiece.getMoves(chessBoard);
        }
        if (oldBoardState.piece.type === "Pawn") {
            oldBoardState.piece.justMoved = oldBoardState.previousJustMoved;
        }

        if (oldBoardState.previousJustMoved !== null) {
            board[oldBoardState.previousJustMoved[0]][oldBoardState.previousJustMoved[1]].justMoved = true;
        }
        if (oldBoardState.previousFirstMove) {
            oldBoardState.piece.firstMove = true;
        }
        
        // if (oldBoardState.exception) {
        //     Player.undoTestMove(chessBoard, move.exception, oldBoardState.exception, oldBoardState.previousJustMoved);
        // }

        chessBoard.updateTargetedSquares();

    }
    decideMove(event, game) {
        event.stopPropagation();
        let clickedElement = event.target;
        let chessBoard = game.board;
        let board = game.board.board;
        let turn = game.turn;
        if (document.querySelector('.selected') === null) {
            return null;
        }
        let start = ChessBoard.coordsToIndices(document.querySelector('.selected').id);
        let end = clickedElement.id ? ChessBoard.coordsToIndices(clickedElement.id) : ChessBoard.coordsToIndices(clickedElement.parentNode.id);
        let moves = board[start[0]][start[1]].moves;
        let move = moves.find(move => move.end[0] == end[0] && move.end[1] == end[1]);

        return move;
    }  

    kingPosition(color) {
        let king = this.pieces.find(piece => piece.type === 'King');
        return king.position;
    }  
}

export class AI extends Player {
    constructor(name, color, difficulty) {
        super(name, color);
        this.difficulty = difficulty;    
        this.bestMove = null;   
        this.counter = 0; 
        this.pruned = 0;
        this.zorbisted = 0;
    }

    decideMove(game) {
        let clonedPieces = Game.allPieces(game).map(Game.clonePiece).filter(piece => piece !== null);
        let newBoard = new ChessBoard(clonedPieces, this.color);
        let best = this.minimax(game, newBoard, -Infinity, Infinity, true, 1);
        for (let i = 2; i <= this.difficulty; i++) {
            console.log(this.counter,this.pruned, this.zorbisted);
            this.counter = 0;
            this.pruned = 0;
            this.zorbisted = 0;
            best = this.minimax(game, newBoard, -Infinity, Infinity, true, i);
            this.bestMove = best.move;
        }
        this.bestMove = null;
        console.log(best);

        return best.move;
    }
    minimax(game, board, alpha, beta, maximizingPlayer, depth) {
        this.counter++;
        let playerColor = maximizingPlayer ? game.turn.color : game.turn.color === 'white' ? 'black' : 'white';
        let score = this.evaluateBoard(board, playerColor, maximizingPlayer);
        
        if (depth === 0 || score === 10000 || score === -10000) {
            return { score: score, move: null };
        }
       
        let bestMove = null;
        let bestScore = maximizingPlayer ? -Infinity : Infinity;

        let clonedPieces = board.pieces.map(Game.clonePiece).filter(piece => piece !== null);
        let testBoard = new ChessBoard(clonedPieces);
        let moves = Game.legalMoves(testBoard.pieces, playerColor);
        // if (this.bestMove !== null) {
        //     moves.unshift(this.bestMove);
            
        // }

        let hash = getZobristHash(testBoard);
        if (game.zobristCache[hash] !== undefined) {
            if (game.zobristCache[hash].depth >= depth) {
                this.zorbisted++;
                return game.zobristCache[hash];
            }
            else {
                game.zobristCache[hash] = undefined;
            }
        }

        // sorting moves to prune more branches
        // moves.sort((a, b) => {
        //     let aPiece = testBoard.board[a.start[0]][a.start[1]];
        //     let bPiece = testBoard.board[b.start[0]][b.start[1]];
        //     return -(aPiece.value - bPiece.value);
        // });


        for (let i = 0; i < moves.length; i++) {
            let oldBoardState = Player.makeTestMove(testBoard, moves[i]);
            this.updateTestBoardPieces(testBoard);

            let evaluation = this.minimax(game, testBoard, alpha, beta, !maximizingPlayer, depth - 1);
            if (evaluation.move === null) {
                evaluation.move = moves[i];
            }
            if (maximizingPlayer) {
                if (evaluation.score > bestScore) {
                    bestScore = evaluation.score;
                    bestMove = moves[i];
                }
                alpha = Math.max(alpha, evaluation.score);
            } else {
                if (evaluation.score < bestScore) {
                    bestScore = evaluation.score;
                    bestMove = moves[i];
                }
                beta = Math.min(beta, evaluation.score);
            }
            Player.undoTestMove(testBoard, moves[i], oldBoardState);
            if (beta <= alpha) {
                this.pruned++;
                break;
            }
        }
        
        game.zobristCache[hash] = { score: bestScore, move: bestMove , depth};
        return { score: bestScore, move: bestMove };
    }
    
    evaluateBoard(testBoard, playerColor, maximizingPlayer) {
        let board = testBoard.board;
        let score = 0;
        let allPieces = testBoard.pieces;
        
        let kingPosition = Game.kingPosition(allPieces, playerColor);

        try {
            let king = board[kingPosition[0]][kingPosition[1]];
        } catch (error) {
            console.log(kingPosition, board);
        }
        
        // if (Game.legalMoves(allPieces, playerColor).length === 0) {
        //     if(!king.isSafe(kingPosition, testBoard.whiteTargetedSquares, testBoard.blackTargetedSquares)) {
        //         return maximizingPlayer ? -10000 : 10000;
        //     }
        //     else {
        //         return 0;
        //     }
        // }

        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            let piece = board[row][col];
            if (piece.type !== "Empty") {
              let value = piece.value;
              if (maximizingPlayer) {
                score += (piece.color === playerColor ? value : -value);
              } else {
                score += (piece.color === playerColor ? -value : value);
              }
            }
          }
        }
        
        return score;
    }

    updateTestBoardPieces(testBoard) {
        testBoard.pieces = [];
        let board = testBoard.board;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = board[i][j];
                if (piece.type !== "Empty") {
                    testBoard.pieces.push(Game.clonePiece(piece)); 
                }
            }
        }
    }
}
