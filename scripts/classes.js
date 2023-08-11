let c = 1;

export class Piece {
    constructor(type, color, position) {
        this.type = type;
        this.color = color;
        this.position = position;
        this.firstMove = true;
        this.isCaputured = false;
        this.moves = [];
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
    getMovesFromDirection(board, directions) {
        let moves = [];
        let row = this.position[0];
        let col = this.position[1];
        let piece = board[row][col].type;
        let start = [row, col];

        
        for(let dir of directions) {               
            let i = 1;
            do {
                let newRow = row + i * dir[0];
                let newCol = col + i * dir[1];
                
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8 || board[newRow][newCol].color === this.color) {
                    break;
                } else if (board[newRow][newCol].type !== "Empty" && board[newRow][newCol].color !== this.color){
                    moves.push(new Move(piece, start, [newRow, newCol], false));
                    break;
                }
                moves.push(new Move(piece, start, [newRow, newCol], false));
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
    }
    getMoves(board) {
        let moves = [];
        let row = this.position[0];
        let col = this.position[1];
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
            moves.push(new Move(piece, start,[nextRow, col], false));
            
            if (doubleStep && board[doubleStep[0]][doubleStep[1]].type == 'Empty' && this.firstMove) {
                moves.push(new Move(piece, start, [doubleRow, col], false));
            }
        }
        if (leftCapture && board[leftCapture[0]][leftCapture[1]].type !== 'Empty' && board[leftCapture[0]][leftCapture[1]].color != this.color) {
            moves.push(new Move(piece, start,[nextRow, leftCol], false));
        }
        if (rightCapture && board[rightCapture[0]][rightCapture[1]].type !== 'Empty' && board[rightCapture[0]][rightCapture[1]].color != this.color) {
            moves.push(new Move(piece, start,[nextRow, rightCol], false));
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
    }
    getMoves(board) {
        let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        this.moves = this.getMovesFromDirection(board, directions);
    }

}
export class Bishop extends Piece {
    constructor(color, position) {
        super('Bishop', color, position);
    }
    getMoves(board) {
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        this.moves = this.getMovesFromDirection(board, directions);
    }
}
export class Knight extends Piece {
    constructor(color, position) {
        super('Knight', color, position);
    }
    getMoves(board) {
        let directions = [[2, 1], [1, 2], [-2, 1], [1, -2], [2, -1], [-2, -1], [-1, -2], [-1, 2]];
        
        this.moves = this.getMovesFromDirection(board, directions);
    }
}
export class Queen extends Piece {
    constructor(color, position) {
        super('Queen', color, position);
    }
    getMoves(board) {
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1],[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        this.moves = this.getMovesFromDirection(board, directions);
    }
    
}
export class King extends Piece {
    constructor(color, position) {
        super('King', color, position);
    }  
    getMoves(board, unSafe) {
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1],[0, 1], [0, -1], [1, 0], [-1, 0]];
        let moves = this.getMovesFromDirection(board, directions);

        let row = this.position[0];
        let col = this.position[1];

        if (this.firstMove) {
            let isSafe = true;
            let i = 1;
            while (board[row][col + i].type === "Empty" && col + i < 7) {
                if (!this.isSafe([row, col + i], board)) {
                    isSafe = false;
                    break;
                }
                i++;
                console.log(board[row][col + i].type === "Empty" , col + i < 7,i)

            }
            if (this.color === 'white') {
                console.log(board[row][col + i])
            }
            if (isSafe && board[row][col + i].type === "Rook" && board[row][col + i].color === this.color && board[row][col + i].firstMove) {
                // check that intermediate squares are safe
                console.log('short castle')
                moves.push(new Move(this.type, [row,col], [row, col + i - Math.floor(i/2)], new Move(board[row][col + i], [row, col + i], [row, col + 1], false)));
            }
            let j = 1;
            isSafe = true;
            while (board[row][col - j].type === "Empty" && col - j > 0) {
                if (!this.isSafe([row, col - j], board)) {
                    isSafe = false;
                    break;
                }
                j++;
            }        
           
            if (board[row][col - j].type === "Rook" && board[row][col - j].color === this.color && board[row][col - j].firstMove) {
                //check that intermediate squares are safe
                console.log('long castle')

                moves.push(new Move(this.type, [row,col], [row, col - j + Math.floor(j/2)], new Move(board[row][col - j], [row, col - j], [row, col - 1], false)));
            }
        }
        if (!unSafe) {
            const safeMoves = moves.filter(move => {
                return this.isSafe(move, board);
            });
            return safeMoves;
        }
        this.moves = moves;
    }
    isSafe(position, board) {
        let opponentMoves = this.color === 'white' ? board.blackTargetedSquares : board.whiteTargetedSquares;
        if (opponentMoves === undefined) {
            return true;
        }
        opponentMoves.forEach(move => {
            if (move.end[0] === position[0] && move.end[1] === position[1]) {
                return false;
            }
        });
        return true;
    }

    // getSafeMoves(board) {
    //     const moves = this.getMoves(board);
    //     const safeMoves = moves.filter(move => {
    //     // Use cached targeted squares to determine if this move is safe.
    //         return this.isSafe(move, board);
    //     });
    //     this.moves = safeMoves;
    // }

}
export class Empty extends Piece {
    constructor(position) {
        super('Empty', null, position);
        this.firstMove = false;
    }
    getMoves(board) {
        return;
    }
}

export class Move {
    constructor(piece, start, end, exception) {
        this.piece = piece;
        this.start = start;
        this.end = end;
        this.exception = exception;
    }
}

export class ChessBoard {
    constructor() {
        this.color = "white";
        this.opponent = 'black';
        this.board = [];
        this.whiteTargetedSquares = [];
        this.blackTargetedSquares = [];
        let pieces = ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'];

        for (let i = 0; i < 8; i++) {
            let row = [];
            if (i == 0 || i == 7){
                let color = i == 7 ? this.color : this.opponent;
                let j = 0;
                pieces.forEach(piece => {
                    row.push(Piece.createPiece(piece, color, [i,j]));
                    j++;
                })
            }
            else if (i == 1 || i == 6){
                let color = i == 6 ? this.color : this.opponent;
                for (let j = 0; j < 8; j++) { 
                    row.push(Piece.createPiece("Pawn", color, [i, j]));
                }
            }
            else {
                for (let j = 0; j < 8; j++) { 
                    row.push(Piece.createPiece('Empty', this.color, [i,j]));
                }
            }
            
            this.board.push(row);
        }
        if (this.color == 'black') {
            this.board.reverse();
        }

        this.board.forEach(row => {
            row.forEach(piece => {
                if (piece.type !== "Empty") {
                    piece.getMoves(this.board);
                }
                if (piece.color === "white") {
                    this.whiteTargetedSquares = this.whiteTargetedSquares.concat(piece.moves);
                }
                else if (piece.color === "black"){
                    this.blackTargetedSquares = this.blackTargetedSquares.concat(piece.moves);
                }
            });
        });
    }
    clickEvent(event) {
        event.stopPropagation();
        let clickedElement = event.target;
        let board = this.board;
        var squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            if (square.classList.contains('highlighted')) {
                square.classList.remove('highlighted');
            }
        });
        if (clickedElement.tagName == 'LI' && clickedElement.classList.length == 2) {
            this.removeAllHighlights();
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
                let moves = board[position[0]][position[1]].moves
                this.removeAllHighlights();
                moves.forEach(move => {
                    let square = document.getElementById(ChessBoard.indicesToCoords(move.end));
                    square.classList.add('newhighlight');
            });
            }
            else if (clickedElement.classList.contains('selected')) {
                clickedElement.classList.remove('selected');
                this.removeAllHighlights();
            }   
        }
    }
    updateTargetedSquares() {
        this.whiteTargetedSquares = [];
        this.blackTargetedSquares = [];
    
        for (let row of this.board) { 
            for (let piece of row) {
                if (piece.name === "Empty") continue;
                
                piece.getMoves(this.board, piece.type === "King"); 
                if (piece.moves === [] || piece.moves === undefined) continue;
                for (let move of piece.moves) {
                    if (piece.color === "white") {
                        this.whiteTargetedSquares.push(move);
                    } 
                    else {
                    this.blackTargetedSquares.push(move);
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
        console.log(this.board);
        console.log(this.color)


        const boardElement = document.getElementById("board");
        boardElement.removeEventListener('click', ChessBoard.handleBoardClick.bind(this));
        boardElement.addEventListener('click', ChessBoard.handleBoardClick.bind(this));
        
    }
    
    createChessBoard(board, color) {
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
        boardElement.removeEventListener('click', this.clickEvent.bind(this));
        boardElement.addEventListener('click', this.clickEvent.bind(this));

    }
}



export class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.moves = [];
    }
    decideMove(event) {
        event.stopPropagation();
        let clickedElement = event.target;
        let chessBoard = this.board;
        let board = this.board.board;
        
        if (clickedElement.classList.contains('newhighlight') || clickedElement.parentNode.classList.contains('newhighlight')) {
            let start = ChessBoard.coordsToIndices(document.querySelector('.selected').id);
            let end = clickedElement.id ? ChessBoard.coordsToIndices(clickedElement.id) : ChessBoard.coordsToIndices(clickedElement.parentNode.id);
            let moves = this.board.board[start[0]][start[1]].moves;
            let move = moves.find(move => move.end[0] == end[0] && move.end[1] == end[1]);

            if ((end[0] == 0 || end[0] == 7) && board[start[0]][start[1]].type === 'Pawn') {
                document.getElementById('promotion-modal').style.display = 'flex';
                document.getElementById('promotion-modal').addEventListener('click', (e) => {
                    board[end[0]][end[1]].isCaptured = true;
                    board[end[0]][end[1]] = piece.promote(e.target.id);
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
        }
        
    }    
}
export class Game {
    constructor(whitePlayer, blackPlayer) {
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.board = new ChessBoard();
        this.turn = "white";
        this.moves = [];
        this.isOver = false;
        
    }
    gameLoop(turn) {
        this.board.createChessBoard(this.board.board, this.board.color);
        const boardElement = document.getElementById("board");
        boardElement.addEventListener('click', turn.decideMove.bind(this));


        let nextTurn = turn.color === "white" ? this.blackPlayer : this.whitePlayer;
        this.turn = nextTurn.color;
        // this.gameLoop(nextTurn);


        // this.gameLoop(this.turn);
    }
    closeModal() {
        document.getElementById('promotion-modal').style.display = 'none';
    }
    
    openModal() {
        document.getElementById('promotion-modal').style.display = 'flex';
    }   
    makeMove(move) {
        let start = move.start;
        let end = move.end;
        let board = this.board.board;
        let piece = board[start[0]][start[1]];
        // if (move.exception) {
        //     if (piece.type === "Pawn") {
        //         board[move.exception[0]][move.exception[1]].isCaptured = true;
        //         let element = document.getElementById(ChessBoard.indicesToCoords(move.exception)).querySelector('img')
        //         if(element){
        //             element.remove();
        //         };
        //     }
        //     else if (piece.type === "King") {
        //         this.makeMove(board);
        //     }
        // }
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
        
            // this is shortcut a bit and may lead to issues. 
            // a white pawn moving backward to the first rank will be promoted
            // this should not be an issue as such movement is not permitted
        if (piece.type === "Pawn" && (end[0] === 7  || end[0] === 0)) {
            // document.getElementById('promotion-modal').style.display = 'flex';
            // document.getElementById('promotion-modal').addEventListener('click', (e) => {
                board[end[0]][end[1]].isCaptured = true;
                board[end[0]][end[1]] = piece.promote("Queen");//e.target.id);
            // });
        }

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
        
    }
    
}
