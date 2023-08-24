import {ChessBoard, c} from "./chessBoard.js";
import {Piece, Pawn, Rook, Bishop, Queen, King, Knight, Empty} from "./piece.js";
import {Move} from "./move.js";
import {Player, AI} from "./player.js";

export class Game {
    constructor(whitePlayer, blackPlayer, mode) {
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.mode = mode;
        this.board = new ChessBoard(whitePlayer.pieces.concat(blackPlayer.pieces));
        this.turn = whitePlayer;
        this.moves = [];
        this.isOver = false;        
    }
    static allPieces(game) {
        return game.whitePlayer.pieces.concat(game.blackPlayer.pieces);
    }
    startGame(turn) {
        this.board.createChessBoard(this);
        const boardElement = document.getElementById("board");
        let element = document.getElementById("game-over");
        element.style.display = "none";
        this.GameLoop(); 
    }

    async houseKeeping() {
        let nextTurn = this.turn.color === this.whitePlayer.color ? 'black' : 'white';
        this.board.updateTargetedSquares();

        console.log(Game.legalMoves(Game.allPieces(this), nextTurn))
        if (Game.legalMoves(Game.allPieces(this), nextTurn).length === 0) {
            if(this.isCheck(this.board, this.turn.color)) {
                this.isCheckmate = true;
                this.isOver = true;
                this.checkmate(this.turn.color);
            }
            else {
                this.isDraw = true;
                this.isOver = true;
                this.draw();
            }
        }

        this.board.updateTargetedSquares();
        
        this.board.removeAllHighlights();
        this.turn = this.turn.color === "white" ? this.blackPlayer : this.whitePlayer;
        document.querySelectorAll('.selected').forEach((el) => {
            el.classList.remove('selected');
        });
        await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    async GameLoop() {
        while (!this.isOver) {
            let move = this.turn instanceof AI ? this.turn.decideMove(this) : await this.waitForPlayerMove(this);
            await this.makeMove(move);
            await this.houseKeeping();
            console.log(this.blackPlayer.counter)
            this.blackPlayer.counter = 0;
        }
    }
    
    waitForPlayerMove(game) {
        return new Promise(resolve => {
            const boardElement = document.getElementById("board");
            const onClick = (event) => {
                let move = game.turn.decideMove(event, game);

                if (move === null) {
                    return;
                }

                if (event.target.classList.contains('displayedMoves') || event.target.parentNode.classList.contains('displayedMoves')) {
                    boardElement.removeEventListener('click', onClick);
                    resolve(move);
                }
            };

            boardElement.addEventListener('click', onClick);
        });
    }
    
  
    async makeMove(move) {
        let start = move.start;
        let end = move.end;
        let board = this.board.board;
        let piece = board[start[0]][start[1]];
        let startCoords = ChessBoard.indicesToCoords(start);
        let endCoords = ChessBoard.indicesToCoords(end);

        if(move.exception && move.piece === "Pawn") {
            board[move.exception[0]][move.exception[1]].isCaptured = true;
            board[move.exception[0]][move.exception[1]] = new Empty(move.exception);
            document.getElementById(ChessBoard.indicesToCoords(move.exception)).querySelector('img').remove();
        }

        if (piece.firstMove) {
            piece.firstMove = false;
            if (piece.type === "Pawn") {
                if (piece.justMoved){
                    piece.justMoved = false;
                } else {
                    piece.justMoved = true;
                }
            }
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8 ; j++) {
                if (i === start[0] && j === start[1])
                    continue;
                board[i][j].justMoved = false;
            }
        }

        if (move.exception) {
            if (move.piece === "King") {
                this.makeMove(move.exception);
            }
        }

        if ((end[0] == 0 || end[0] == 7) && piece.type === 'Pawn') {
            let id = 'promotion-modal-' + piece.color;
            document.getElementById(id).style.display = 'flex';
        
            await new Promise(resolve => {
                const onClick = (e) => {
                    if (e.target.id === 'cancel'){
                        document.getElementById(id).style.display = 'none';
                        resolve();
                    }
                    if (board[end[0]][end[1]].type !== "Empty") {
                        board[end[0]][end[1]].isCaptured = true;
                        board[end[0]][end[1]].moves = [];
                    }
                    piece.moves = [];

                    board[end[0]][end[1]] = piece.promote(e.target.id, this);
                    board[end[0]][end[1]].position = end;
                    board[end[0]][end[1]].promoted = false;
                    
                    let startingImage = document.getElementById(startCoords).querySelector('img');
                    if (startingImage) {
                        startingImage.remove();
                    }
                    piece.isCaptured = true;
                    board[start[0]][start[1]] = new Empty(start);
            
                    let newPieceLi = document.getElementById(endCoords);
                    let newPiece = newPieceLi.querySelector('img');
                    if (newPiece) {
                        newPiece.remove();
                    }
            
                    newPieceLi.innerHTML += '<img class="pieces '+ board[end[0]][end[1]].type + '" src="../img/chesspieces/wikipedia/'+ board[end[0]][end[1]].color + board[end[0]][end[1]].type +'.png">';
                    document.getElementById(id).style.display = 'none';
                    document.getElementById(id).removeEventListener('click', onClick);
                    resolve();
                };
                document.getElementById(id).addEventListener('click', onClick);
            });            
        }
        else {
            if (board[end[0]][end[1]].type !== "Empty" && !board[end[0]][end[1]].promoted) {
                board[end[0]][end[1]].moves = [];
                board[end[0]][end[1]].isCaptured = true;
            }
            
            board[start[0]][start[1]] = new Empty(start);
            board[end[0]][end[1]] = piece;
            piece.position = end;
            
            let element = document.getElementById(startCoords).querySelector('img')
            if (element) {
                element.remove();
            }
            element = document.getElementById(endCoords).querySelector('img')
            if (element){
                element.remove();
            }
    
            document.getElementById(endCoords).innerHTML += '<img class="pieces '+ board[end[0]][end[1]].type + '" src="../img/chesspieces/wikipedia/'+ piece.color + board[end[0]][end[1]].type +'.png">';
            
            element = document.querySelectorAll('.lastmove');
            if (element) {
                element.forEach((el) => {
                    el.classList.remove('lastmove');
                });
            }
        }      
        
        let element = document.querySelectorAll('.lastmove');
        if (element) {
            element.forEach((el) => {
                el.classList.remove('lastmove');
            });
        }
        
        document.getElementById(endCoords).classList.add('lastmove');
        document.getElementById(startCoords).classList.add('lastmove');

        this.moves.push(move);

    }
  
    checkmate(color) {
        let element = document.getElementById('game-over');
        color = color.charAt(0).toUpperCase() + color.slice(1);
        let messageElement = document.getElementById('end-message');
        messageElement.innerHTML =  color + ' wins by <br> checkmate!';
        element.style.display = 'flex';
        this.listenForNewGame();
    }
    draw() {
        let element = document.getElementById('game-over');
        let messageElement = document.getElementById('end-message');
        messageElement.innerHTML = 'Draw by stalemate!';
        element.style.display = 'flex';
        this.listenForNewGame();
    }
    listenForNewGame() {
        document.getElementById('startNewGame').addEventListener('click', () => {
            let element = document.getElementById('game-over-background');
            element.innerHTML = '<p id="end-message"></p>   <button id="startNewGame">New Game</button>';
            element.parentElement.style.display = 'none';
            let white = new Player('player1', 'white');
            let black = this.mode === 'singleplayer' ? new AI('computer', 'black') : new Player('player2', 'black');
            let game = new Game(white, black, this.mode);
            game.startGame(white);
        });
    }
    isCheck(chessboard, color) {
        chessboard.updateTargetedSquares();
        if (color === "white") {
            let targetedSquares = chessboard.whiteTargetedSquares.map((move) => {
                return move.end[0] + "," + move.end[1];
            });
            let kingPosition = this.blackPlayer.kingPosition();
            kingPosition = kingPosition[0] + "," + kingPosition[1];
            if (targetedSquares.includes(kingPosition)) {
                this.blackPlayer.isInCheck = true;
                return true;
            }
        } else {
            let targetedSquares = this.board.blackTargetedSquares.map((move) => {
                return move.end[0] + "," + move.end[1];
            });
            let kingPosition = this.whitePlayer.kingPosition();
            kingPosition = kingPosition[0] + "," + kingPosition[1];
            if (targetedSquares.includes(kingPosition)) {
                this.whitePlayer.isInCheck = true;
                return true;
            }
        }
        return false;
    }
    static clonePiece(piece) {
        if (piece.isCaptured || piece.type === "Empty") return null;
    
        let newPiece;
        switch (piece.type) {
            case "Pawn":
                newPiece = new Pawn(piece.color, piece.position);
                break;
            case "Rook":
                newPiece = new Rook(piece.color, piece.position);
                break;
            case "Knight":
                newPiece = new Knight(piece.color, piece.position);
                break;
            case "Bishop":
                newPiece = new Bishop(piece.color, piece.position);
                break;
            case "Queen":
                newPiece = new Queen(piece.color, piece.position);
                break;
            case "King":
                newPiece = new King(piece.color, piece.position);
                break;
        }
        newPiece.firstMove = piece.firstMove;
        newPiece.justMoved = piece.justMoved;
        newPiece.isCaptured = piece.isCaptured;
        
        return newPiece;
    }

    static isLegalMove(chessboard, color, kingPosition) {
        chessboard.updateTargetedSquares();
        if (color === "white") {
            let targetedSquares = chessboard.blackTargetedSquares.map((move) => {
                return move.end[0] + "," + move.end[1];
            });
            if (targetedSquares.includes(kingPosition)) {
                return false;
            }
        } else {
            let targetedSquares = chessboard.whiteTargetedSquares.map((move) => {
                return move.end[0] + "," + move.end[1];
            });
            if (targetedSquares.includes(kingPosition)) {
                return false;
            }        
        }
        return true;
    }
    
    static legalMoves(allPieces, color) {
        let allMoves = [];
        let legalMoves = [];
        allPieces.forEach((piece) => {
            if (piece.color === color && !piece.isCaptured) {
                allMoves = allMoves.concat(piece.moves);
                piece.moves = [];
            }
        });
        console.log(allMoves)
        allMoves.forEach((move) => {
            let clonedPieces = allPieces.map(Game.clonePiece).filter(piece => piece !== null);

            let kingPosition = Game.kingPosition(allPieces, color);
            let testBoard = new ChessBoard(clonedPieces);
            testBoard.updateTargetedSquares();
            if (move.piece === "King") {
                kingPosition = [move.end[0], move.end[1]];
            }
            Player.makeTestMove(testBoard, move);
            if (Game.isLegalMove(testBoard, color, `${kingPosition[0]},${kingPosition[1]}`)){
                legalMoves.push(move);
            }
        });
        legalMoves.forEach((move) => {
            allPieces.forEach((piece) => {
                if (piece.position[0] === move.start[0] && piece.position[1] === move.start[1]) {
                    piece.moves.push(move);
                }
            });
        });
            
        return legalMoves;
    }

    static kingPosition(allPieces, color) {
        let kingPosition;
        allPieces.forEach((piece) => {
            if (piece.type === "King" && piece.color === color) {
                kingPosition = piece.position;
            }
        });
        return kingPosition;
    }
}