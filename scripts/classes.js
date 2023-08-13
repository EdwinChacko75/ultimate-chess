let c = 1;

export class ChessBoard {
    constructor(initialPieces) {
        this.color = "white";
        this.opponent = 'black';
        this.board = [];
        this.whiteTargetedSquares = [];
        this.blackTargetedSquares = [];

        for (let i = 0; i < 8; i++) {
            let row = [];
            for (let j = 0; j < 8; j++) {
                row.push(new Empty([i, j]));
            }
            this.board.push(row);
        }

        initialPieces.forEach(piece => {
            this.board[piece.position[0]][piece.position[1]] = piece;
        });

        if (this.color == 'black') {
            this.board.reverse();
        }

        this.board.forEach(row => {
            row.forEach(piece => {
                if (piece.type !== "Empty") {
                    piece.getMoves(this);
                }
                if (piece.color === "white") {
                    this.whiteTargetedSquares = this.whiteTargetedSquares.concat(piece.targets);
                }
                else if (piece.color === "black"){
                    this.blackTargetedSquares = this.blackTargetedSquares.concat(piece.targets);
                }
            });
        });
    }
    clickEvent(event) {
        event.stopPropagation();
        let clickedElement = event.target;
        let chessBoard = this.board;
        let board = this.board.board;
        let turn = this.turn;
        let indices = ChessBoard.coordsToIndices(clickedElement.parentNode.id);
        
        if (this.turn.isInCheck) {
            console.log('in check');
        }


        if (indices.length === 2 && board[indices[0]][indices[1]].color !== turn.color && !clickedElement.parentNode.classList.contains('newhighlight')) {
            chessBoard.removeAllHighlights();
        }
        var squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            if (square.classList.contains('highlighted')) {
                square.classList.remove('highlighted');
            }
        });
        if (clickedElement.tagName == 'LI' && clickedElement.classList.length == 2) {
            chessBoard.removeAllHighlights();
            squares.forEach(square => {
                if (square.classList.contains('selected')) {
                    square.classList.remove('selected');
                }
            });
        }
        else if (clickedElement.tagName === 'IMG' && !clickedElement.parentNode.classList.contains('newhighlight')) {
            clickedElement = clickedElement.parentNode;
            var squares = document.querySelectorAll('.square');
            
            if (!clickedElement.classList.contains('selected')) {

                squares.forEach(square => {
                    if (square.classList.contains('selected')) {
                        square.classList.remove('selected');
                    }
                });
                clickedElement.classList.add('selected');
            
                let position = ChessBoard.coordsToIndices(clickedElement.id);
                let piece = board[position[0]][position[1]];
                let moves = piece.moves;
                let unSafeMoves = [];
                if (piece.color !== turn.color) {
                    return
                }
                if (piece.type === "King") {
                    let opponentMoves = piece.color === 'white' ? chessBoard.blackTargetedSquares : chessBoard.whiteTargetedSquares;
                    piece.moves.forEach(testMove => {
                        opponentMoves.forEach(move => {
                            if (move.end[0] === testMove.end[0] && move.end[1] === testMove.end[1] && move.type === 'Capture') {
                                unSafeMoves.push(move.end);
                            }
                        });
                    });
                    let filteredMoves = moves.filter(move => 
                        !unSafeMoves.some(arr => 
                            arr[0] === move.end[0] && arr[1] === move.end[1]
                        )
                    );
                    moves = filteredMoves;
                }
                chessBoard.removeAllHighlights();
                moves.forEach(move => {
                    let square = document.getElementById(ChessBoard.indicesToCoords(move.end));
                    square.classList.add('newhighlight');
                });
            }
            else if (clickedElement.classList.contains('selected')) {
                clickedElement.classList.remove('selected');
                chessBoard.removeAllHighlights();
            }   
        }
    }
    
    updateTargetedSquares() {
        this.whiteTargetedSquares = [];
        this.blackTargetedSquares = [];
    
        for (let row of this.board) { 
            for (let piece of row) {
                if (piece.name === "Empty") continue;
                piece.getMoves(this); 
                if (piece.type === "King" && piece.color === "black") {
                }
                if (piece.targets === [] || piece.targets === undefined) continue;
                for (let move of piece.targets) {
                    if (piece.color === "black") {
                        this.blackTargetedSquares.push(move);
                    } 
                    else if (piece.color === "white"){
                        this.whiteTargetedSquares.push(move);
                    }
                }
            }
        }
    }

    static removeBoard() {
        document.getElementById("board").innerHTML = "";
    }

    static indicesToCoords(position) {
        const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
        return columns[position[1]] + rows[position[0]];
    }
    static coordsToIndices(coord) {
        const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
        let res = [];
        for (let i = 0; i < 8; i++) {
            if (rows[i] == coord[1]) {
                res.push(i);
            }
        }
        for (let i = 0; i < 8; i++) {
            if (columns[i] == coord[0]) {
                res.push(i);
            }
        }
        return res;
    }
    
    removeHighlights() {
        var highlighted = document.querySelectorAll('.highlighted');
        highlighted.forEach(highlight => {
            if (highlight.classList.contains('highlighted')) {
                highlight.classList.remove('highlighted');
            }
            highlight.classList.remove('highlighted');
        });
    }

    removeNewHighlights() {
        var newHighlights = document.querySelectorAll('.newhighlight');
        newHighlights.forEach(newHighlight => {
            newHighlight.classList.remove('newhighlight');
        });
    }

    removeAllHighlights() {
        this.removeHighlights();
        this.removeNewHighlights();
    }
    flipBoard(color) {
        this.color = this.color == 'black' ? 'white' : "black";

        this.board.forEach(row => {
            row.forEach(piece => {
                piece.position = [7 - piece.position[0], 7 - piece.position[1]];
            });
        });
        this.board.forEach(row => {
            row.reverse(); 
        });
        this.board.reverse();

        let elements = document.querySelectorAll('.lastmove');
        c = -c; 
        this.createChessBoard(this.board, this.color);
        


        const boardElement = document.getElementById("board");
        boardElement.removeEventListener('click', ChessBoard.handleBoardClick.bind(this));
        boardElement.addEventListener('click', ChessBoard.handleBoardClick.bind(this));
        
    }
    
    createChessBoard(game) {
        let board = game.board.board;
        let color = game.color;
        ChessBoard.removeBoard();

        const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];

        if (color == "black") {
            columns.reverse();
            rows.reverse();
        }
        
        //Create the board
        for( let i = 0; i < 8; i++) {
            document.getElementById("board").innerHTML += '<div>';

            for (let j = 0; j < 8; j++) {
                var squareColor = (i + j) % 2 == 0 ? "light" : "dark" ;
                let squareHTML = '<li id="' + columns[j] + rows[i]  + '" class="square '+ squareColor +'">';

                if (board[i][j].type !== "Empty") { 
                    squareHTML += '<img class="pieces '+ board[i][j].type + '" src="../img/chesspieces/wikipedia/'+ board[i][j].color + board[i][j].type +'.png">';
                }
                if (i == 7 && j == 0){
                    squareHTML += '<p class="row ' + squareColor +'">' + rows[i] + '<p class="column">' + columns[j] + '</p>'
                }
                else if (i == 7){
                    squareHTML += '<p class="column"' + squareColor +'">' + columns[j] + '</p'
                }
                else if (j == 0){
                    squareHTML += '<p class="row"' + squareColor +'">' + rows[i] + '</p>'
                }

                squareHTML += '</li>';          
                document.getElementById("board").innerHTML += squareHTML;
            }
            document.getElementById("board").innerHTML += '</div>';
        }
        
        // Square Highlighting
        var squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            square.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                if (square.classList.contains('highlighted')) {
                    square.classList.remove('highlighted');
                }
                else {
                    square.classList.add('highlighted');
                    const isSelectedClassPresent = [...squares].some(square => square.classList.contains('selected'));
                    if (isSelectedClassPresent) {
                        squares.forEach(square => {
                            square.classList.remove('newhighlight');
                            square.classList.remove('selected');
                        });
                    }
                }
            });
        });
        const boardElement = document.getElementById("board");
        boardElement.removeEventListener('click', this.clickEvent.bind(game));
        boardElement.addEventListener('click', this.clickEvent.bind(game));

    }
}

export class Game {
    constructor(whitePlayer, blackPlayer) {
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.board = new ChessBoard(whitePlayer.pieces.concat(blackPlayer.pieces));
        this.turn = whitePlayer;
        this.moves = [];
        this.isOver = false;
        
    }
    startGame(turn) {
        this.board.createChessBoard(this);
        const boardElement = document.getElementById("board");
        boardElement.addEventListener('click', turn.decideMove.bind(this));     
        
    }
    closeModal() {
        document.getElementById('promotion-modal').style.display = 'none';
    }
    
    openModal() {
        document.getElementById('promotion-modal').style.display = 'flex';
    }   
  
    makeTestMove(move) {
    }
    
    makeMove(move) {
        let start = move.start;
        let end = move.end;
        let board = this.board.board;
        let piece = board[start[0]][start[1]];
        
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
        if (board[end[0]][end[1]].type !== "Empty") {
            board[end[0]][end[1]].isCaptured = true;
        }
        board[start[0]][start[1]] = new Empty(start);
        board[end[0]][end[1]] = piece;
        piece.position = end;
    

        let element = document.getElementById(ChessBoard.indicesToCoords(start)).querySelector('img')
        if (element) {
            element.remove();
        }
        element = document.getElementById(ChessBoard.indicesToCoords(end)).querySelector('img')
        if (element){
            element.remove();
        }

        document.getElementById(ChessBoard.indicesToCoords(end)).innerHTML += '<img class="pieces '+ board[end[0]][end[1]].type + '" src="../img/chesspieces/wikipedia/'+ piece.color + board[end[0]][end[1]].type +'.png">';
        
        
        element = document.querySelectorAll('.lastmove');
        if (element) {
            element.forEach((el) => {
                el.classList.remove('lastmove');
            });
        }

        document.getElementById(ChessBoard.indicesToCoords(end)).classList.add('lastmove');
        document.getElementById(ChessBoard.indicesToCoords(start)).classList.add('lastmove');

        this.board.updateTargetedSquares();
        if (this.isCheckmate()) {
            pass
        }
        if (this.isDraw()) {
            pass
        }
        if (this.isCheck(piece.color)) {
            
        }
    }
    isCheckmate() {
        return false;
    }
    isDraw() {
        return false;
    }
    isCheck(color) {
        if (color === "white") {
            let targetedSquares = this.board.whiteTargetedSquares.map((move) => {
                return move.end[0] + "," + move.end[1];
            });
            let kingPosition = this.blackPlayer.kingPosition()[0] + "," + this.blackPlayer.kingPosition()[1];
            if (targetedSquares.includes(kingPosition)) {
                this.blackPlayer.isInCheck = true;
                return true;
            }
        } else {
            let targetedSquares = this.board.blackTargetedSquares.map((move) => {
                return move.end[0] + "," + move.end[1];
            });
            let kingPosition = this.whitePlayer.kingPosition()[0] + "," + this.whitePlayer.kingPosition()[1];
            if (targetedSquares.includes(kingPosition)) {
                this.whitePlayer.isInCheck = true;
                return true;
            }        
        }
        return false;
    }
    deepCopyBoard(board) {
        const newBoard = [];
        for (let row = 0; row < board.length; row++) {
            const newRow = [];
            for (let col = 0; col < board[row].length; col++) {
            const piece = board[row][col];
            if (piece) {
                const newPiece = new Piece(piece.type, piece.color, piece.position); 
                newPiece.moves = piece.moves.map(move => {
                    let newMove = new Move(newPiece, move.start, move.end);
                    newMove.exception = move.exception;
                    newMove.type = move.type;
                    return new Move(move.start, move.end, move.otherAttributes); 
                });
                newPiece.firstMove = piece.firstMove;
                newPiece.isCaputured = piece.isCaputured;
                newPiece.targets = piece.targets.map(move => {
                    return new Move(move.start, move.end, move.otherAttributes);

                });

                newRow.push(newPiece);
            } else {
                newRow.push(null);
            }
            }
            newBoard.push(newRow);
        }
        console.log(newBoard)
        return newBoard;
    }
      
    legalMoves(board) {
        let moves = [];
        let legalMoves = [];

        board.forEach((row) => {
            row.forEach((piece) => {
                if (piece.color === this.turn.color) {
                    moves = moves.concat(piece.moves)
                }
            });
        });

        moves.forEach((move) => {
            let testBoard = this.deepCopyBoard(board);
            console.log(testBoard)
            this.makeTestMove(move);
            if (!this.isCheck(this.turn.color)) {
                legalMoves.push(move);
            }
        });
    }

    
}

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

    decideMove(event) {
        event.stopPropagation();
        let clickedElement = event.target;
        let chessBoard = this.board;
        let board = this.board.board;
        this.legalMoves(board);
        // let turn = this.turn;
        
        if (clickedElement.classList.contains('newhighlight') || clickedElement.parentNode.classList.contains('newhighlight')) {
            let start = ChessBoard.coordsToIndices(document.querySelector('.selected').id);
            let end = clickedElement.id ? ChessBoard.coordsToIndices(clickedElement.id) : ChessBoard.coordsToIndices(clickedElement.parentNode.id);
            let moves = board[start[0]][start[1]].moves;
            let move = moves.find(move => move.end[0] == end[0] && move.end[1] == end[1]);

            if ((end[0] == 0 || end[0] == 7) && board[start[0]][start[1]].type === 'Pawn') {
                let id = 'promotion-modal-' + board[start[0]][start[1]].color;
                document.getElementById(id).style.display = 'flex';
                document.getElementById(id).addEventListener('click', (e) => {
                    board[end[0]][end[1]].isCaptured = true;
                    board[end[0]][end[1]] = board[end[0]][end[1]].promote(e.target.id);

                    this.makeMove(new Move(board[end[0]][end[1]], end, end));
                    document.getElementById(id).style.display = 'none';
                });
            } 

            this.makeMove(move);

            if (move.exception) {
                if (move.piece === "Pawn") {
                    board[move.exception[0]][move.exception[1]].isCaptured = true;
                    let element = document.getElementById(ChessBoard.indicesToCoords(move.exception)).querySelector('img')
                    if(element){
                        element.remove();
                    };
                }
                else if (move.piece === "King") {
                    this.makeMove(move.exception);
                }
            }
            chessBoard.updateTargetedSquares();
            
            this.moves.push(move);
            chessBoard.removeAllHighlights();
            this.turn = this.turn.color === "white" ? this.blackPlayer : this.whitePlayer;
        }
    }  
    kingPosition() {
        let king = this.pieces.find(piece => piece.type === 'King');
        return king.position;
    }  
}

export class Piece {
    constructor(type, color, position) {
        this.type = type;
        this.color = color;
        this.position = position;
        this.firstMove = true;
        this.isCaputured = false;
        this.moves = [];
        this.targets = [];
    }
    static createPiece(type, color, position) {
        switch (type) {
            case 'Pawn':
                return new Pawn(color, position);
            case 'Rook':
                return new Rook(color, position);
            case 'Knight':
                return new Knight(color, position);
            case 'Bishop':
                return new Bishop(color, position);
            case 'Queen':
                return new Queen(color, position);
            case 'King':
                return new King(color, position);
            case 'Empty':
                return new Empty(position);
            default:
                throw new Error('Invalid piece type');
        }
    }
    getMovesFromDirection(chessBoard, directions) {
        let moves = [];
        this.targets = [];
        let row = this.position[0];
        let col = this.position[1];
        let board = chessBoard.board;

        let piece = board[row][col].type;
        let start = [row, col];
        
        for(let dir of directions) {               
            let i = 1;
            do {
                let newRow = row + i * dir[0];
                let newCol = col + i * dir[1];
                
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {
                    break;
                } else if (board[newRow][newCol].type !== "Empty") {
                    let move = new Move(piece, start, [newRow, newCol], false);
                    if (board[newRow][newCol].color !== this.color){
                        moves.push(move);
                        this.targets.push(move);

                    } 
                    else if (board[newRow][newCol].color === this.color){
                        this.targets.push(move);
                    }
                    
                    break;
                }
                let move = new Move(piece, start, [newRow, newCol], false);
                moves.push(move);
                this.targets.push(move);

                i++;
            } 
            while (true && this.type !== "Knight" && this.type !== "King");
        }
        return moves;
    }
}

export class Pawn extends Piece {
    constructor(color, position) {
        super('Pawn', color, position);
        this.justMoved = false;
        this.targets = [];
    }
    getMoves(chessBoard) {
        this.targets = [];
        let moves = [];
        let row = this.position[0];
        let col = this.position[1];
        let board = chessBoard.board;
        let piece = board[row][col].type;
        let start = [row, col];
        let direction = this.color == 'white' ? -c : c; // c is 1 or -1 declared at the top of the file

        
        let nextRow = row + direction;
        let doubleRow = row + 2 * direction;
        let leftCol = col - 1;
        let rightCol = col + 1;

        let forward = (nextRow > -1 && nextRow < 8) ? board[nextRow][col].position : null;
        let doubleStep = (doubleRow > -1 && doubleRow < 8) ? board[row + 2 * direction][col].position : null;
        let leftCapture = (nextRow >= 0 && nextRow < 8 && leftCol >= 0) ? board[nextRow][leftCol].position : null;
        let rightCapture = (nextRow >= 0 && nextRow < 8 && rightCol < 8) ? board[nextRow][rightCol].position : null;

        
        if (forward && board[forward[0]][forward[1]].type == 'Empty'){
            // let move = new Move(piece, start,[nextRow, col], false);
            // move.type = 'Pawn Advance';
            // moves.push(move);
            moves.push(new Move(piece, start,[nextRow, col], false))

            
            
            if (doubleStep && board[doubleStep[0]][doubleStep[1]].type == 'Empty' && this.firstMove) {
                moves.push(new Move(piece, start, [doubleRow, col], false));
            }
        }
        if (leftCapture) {
            let move = new Move(piece, start,[nextRow, leftCol], false);
            if (board[leftCapture[0]][leftCapture[1]].color != this.color && board[leftCapture[0]][leftCapture[1]].type !== 'Empty') {
                let move = new Move(piece, start,[nextRow, leftCol], false);
                moves.push(move);
                this.targets.push(move);
            }
            else {
                this.targets.push(move);
            }
        }
        if (rightCapture) {
            let move = new Move(piece, start,[nextRow, rightCol], false);
            if (board[rightCapture[0]][rightCapture[1]].color != this.color && board[rightCapture[0]][rightCapture[1]].type !== 'Empty') {
                let move = new Move(piece, start,[nextRow, rightCol], false);
                moves.push(move);
                this.targets.push(move);
            }
            else {
                this.targets.push(move);
            }
        }
        let enPassantRow = this.color == 'black' ? 4 : 3;
        let enPassantMoveRow = this.color == 'black' ? 5 : 2;
        if (row == enPassantRow) {
            let leftEnPassant = board[enPassantRow][leftCol];
            let rightEnPassant = board[enPassantRow][rightCol];

            if (leftEnPassant && leftEnPassant.type == 'Pawn' && leftEnPassant.color !== this.color && leftEnPassant.justMoved) {
                moves.push(new Move(piece, start, [enPassantMoveRow, leftCol], leftEnPassant.position));
            }

            if (rightEnPassant && rightEnPassant.type == 'Pawn' && rightEnPassant.color !== this.color && rightEnPassant.justMoved) {
                moves.push(new Move(piece, start, [enPassantMoveRow, rightCol], rightEnPassant.position));
            }
        }
       
        this.moves =  moves;
    }

    promote(promoted) {
        let newPiece;
        switch (promoted) {
            case 'Queen':
                newPiece = new Queen(this.color, this.position);
                newPiece.firstMove = false;
                break;
            case 'Rook':
                newPiece = new Rook(this.color, this.position);
                newPiece.firstMove = false;
                break;
            case 'Bishop':
                newPiece = new Bishop(this.color, this.position);
                newPiece.firstMove = false;
                break;
            case 'Knight':
                newPiece = new Knight(this.color, this.position);
                newPiece.firstMove = false;
                break;        
            default:
                newPiece = new Queen(this.color, this.position);
                newPiece.firstMove = false;
                break;
        }
        newPiece.firstMove = false;
        this.isCaptured = true;
        return newPiece;
    }
}
export class Rook extends Piece {
    constructor(color, position) {
        super('Rook', color, position);
        this.directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    }
    getMoves(board) {
        this.moves = this.getMovesFromDirection(board, this.directions);

    }

}
export class Bishop extends Piece {
    constructor(color, position) {
        super('Bishop', color, position);
        this.directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    }
    getMoves(board) {        
        this.moves = this.getMovesFromDirection(board, this.directions);
    }
}
export class Knight extends Piece {
    constructor(color, position) {
        super('Knight', color, position);
        this.directions = [[2, 1], [1, 2], [-2, 1], [1, -2], [2, -1], [-2, -1], [-1, -2], [-1, 2]];
    }
    getMoves(board) {
        this.moves = this.getMovesFromDirection(board, this.directions);
    }
}
export class Queen extends Piece {
    constructor(color, position) {
        super('Queen', color, position);
        this.directions = [[1, 1], [1, -1], [-1, 1], [-1, -1],[0, 1], [0, -1], [1, 0], [-1, 0]];
    }
    getMoves(board) {
        this.moves = this.getMovesFromDirection(board, this.directions);  
    
    }
    getTargets(board) {
    }
    
}
export class King extends Piece {
    constructor(color, position) {
        super('King', color, position);
        this.directions = [[1, 1], [1, -1], [-1, 1], [-1, -1],[0, 1], [0, -1], [1, 0], [-1, 0]];
    }  
    getTargets(board) {
        return this.getTargetsFromDirection(board, this.directions);
    }
    getMoves(chessBoard) {
        let board = chessBoard.board;

        let moves = this.getMovesFromDirection(chessBoard, this.directions);

        let row = this.position[0];
        let col = this.position[1];

        if (this.firstMove) {
            let isSafe = true;
            let i = 1;
            while (board[row][col + i].type === "Empty" && col + i < 7) {
                if (!this.isSafe([row, col + i], chessBoard)) {
                    isSafe = false;
                    break;
                }
                i++;

            }
            if (isSafe && board[row][col + i].type === "Rook" && board[row][col + i].color === this.color && board[row][col + i].firstMove) {
                // check that intermediate squares are safe
                moves.push(new Move(this.type, [row,col], [row, col + i - Math.floor(i/2)], new Move(board[row][col + i], [row, col + i], [row, col + 1], false)));
            }
            let j = 1;
            isSafe = true;
            while (board[row][col - j].type === "Empty" && col - j > 0) {
                if (!this.isSafe([row, col - j], chessBoard)) {
                    isSafe = false;
                    break;
                }
                j++;
            }        
            if (board[row][col - j].type === "Rook" && board[row][col - j].color === this.color && board[row][col - j].firstMove) {
                //check that intermediate squares are safe
                moves.push(new Move(this.type, [row,col], [row, col - j + Math.floor(j/2)], new Move(board[row][col - j], [row, col - j], [row, col - 1], false)));
            }
        }
        
            this.moves = moves;
    }
    isSafe(testMove, chessBoard) {
        let opponentMoves = this.color === 'white' ? chessBoard.blackTargetedSquares : chessBoard.whiteTargetedSquares;
        if (opponentMoves === undefined) {
            return true;
        }
        return !opponentMoves.some(move => 
            move.end[0] === testMove[0] && move.end[1] === testMove[1]
        );
    }

}
export class Empty extends Piece {
    constructor(position) {
        super('Empty', null, position);
        this.firstMove = false;
    }
    getMoves(board) {
        return;
    }
    getTargets(board) {
        return;
    }
}

export class Move {
    constructor(piece, start, end, exception) {
        this.piece = piece;
        this.start = start;
        this.end = end;
        this.exception = exception;
        this.type = 'Capture';
    }
}

