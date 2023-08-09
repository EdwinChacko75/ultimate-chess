let c = 1;

export class ChessBoard {
    constructor() {
        this.color = "white";
        this.opponent = 'black';
        this.board = [];
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
    }

    static removeBoard() {
        document.getElementById("board").innerHTML = "";
    }

    static pxToVw(px) {
        return (100 * px) / document.documentElement.clientWidth;
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
    
    flipBoard(color) {
        color = color == 'black' ? 'black' : "white";

        this.board.forEach(row => {
            row.forEach(piece => {
                piece.position = [7 - piece.position[0], 7 - piece.position[1]];
            });
        });
        c = -c;
        this.createChessBoard(this.board, color);
    }
    
    createChessBoard(board, color) {
        ChessBoard.removeBoard();

        const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];

        if (color == "black") {
            board.forEach(row => {
                row.reverse(); 
            });
            board.reverse();
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

        const boardElement = document.getElementById("board");
        boardElement.addEventListener('click', this.handleBoardClick.bind(this));

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
    }

    handleBoardClick(event) {
        event.stopPropagation();
        let clickedElement = event.target;
        var squares = document.querySelectorAll('.square');
        if (clickedElement.tagName == 'LI' && clickedElement.classList.length == 2) {
            this.removeAllHighlights();
            squares.forEach(square => {
                if (square.classList.contains('selected')) {
                    square.classList.remove('selected');
                }
            });
        }
        if (clickedElement.classList.contains('newhighlight') || clickedElement.parentNode.classList.contains('newhighlight')) {
            let start = ChessBoard.coordsToIndices(document.querySelector('.selected').id);
            let end;
            if (clickedElement.id) {
                end = ChessBoard.coordsToIndices(clickedElement.id);
            }
            else {
                end = ChessBoard.coordsToIndices(clickedElement.parentNode.id);
            }

            let moves = this.board[start[0]][start[1]].getMoves(this.board);
            let move = moves.find(move => move.end[0] == end[0] && move.end[1] == end[1]);

            move.makeMove(this.board);
            this.removeAllHighlights();
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
                let moves = this.board[position[0]][position[1]].getMoves(this.board);
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
}

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
                    moves.push(new Move(piece, start, [newRow, newCol]));
                    break;
                }
                moves.push(new Move(piece, start, [newRow, newCol]));
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
        this.secondMove = false;
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
            moves.push(new Move(piece, start,[nextRow, col]));
            
            if (doubleStep && board[doubleStep[0]][doubleStep[1]].type == 'Empty' && this.firstMove) {
                moves.push(new Move(piece, start, [doubleRow, col]));
            }
        }
            // might throw error if its empty since .color
    
        if (leftCapture && board[leftCapture[0]][leftCapture[1]].type == 'Pawn' && board[leftCapture[0]][leftCapture[1]].color != this.color) {
            moves.push(new Move(piece, start,[nextRow, leftCol]));
        }
        if (rightCapture && board[rightCapture[0]][rightCapture[1]].type == 'Pawn' && board[rightCapture[0]][rightCapture[1]].color != this.color) {
            moves.push(new Move(piece, start,[nextRow, rightCol]));
        }
            
        let enPassantRow = this.color == 'black' ? 4 : 3;
        let enPassantMoveRow = this.color == 'black' ? 5 : 2;

        if (row == enPassantRow) {
            let leftEnPassant = board[enPassantRow][leftCol];
            let rightEnPassant = board[enPassantRow][rightCol];

            if (leftEnPassant && leftEnPassant.type == 'Pawn' && leftEnPassant.color !== this.color && leftEnPassant.secondMove) {
                moves.push(new Move(piece, start, [enPassantMoveRow, leftCol]));
            }

            if (rightEnPassant && rightEnPassant.type == 'Pawn' && rightEnPassant.color !== this.color && rightEnPassant.secondMove) {
                moves.push(new Move(piece, start, [enPassantMoveRow, rightCol]));
            }
        }
       
        return moves;
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
        let moves = this.getMovesFromDirection(board, directions);

        //castling logic function call 

        return moves;
    }

}
export class Bishop extends Piece {
    constructor(color, position) {
        super('Bishop', color, position);
    }
    getMoves(board) {
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        return this.getMovesFromDirection(board, directions);
    }
}
export class Knight extends Piece {
    constructor(color, position) {
        super('Knight', color, position);
    }
    getMoves(board) {
        let directions = [[2, 1], [1, 2], [-2, 1], [1, -2], [2, -1], [-2, -1], [-1, -2], [-1, 2]];
        
        return this.getMovesFromDirection(board, directions);
    }
}
export class Queen extends Piece {
    constructor(color, position) {
        super('Queen', color, position);
    }
    getMoves(board) {
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1],[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        return this.getMovesFromDirection(board, directions);
    }
    
}
export class King extends Piece {
    constructor(color, position) {
        super('King', color, position);
    }
    getMoves(board) {
        let directions = [[1, 1], [1, -1], [-1, 1], [-1, -1],[0, 1], [0, -1], [1, 0], [-1, 0]];
        let moves = this.getMovesFromDirection(board, directions);

        //castling logic function call 

        return moves;
    }
}
export class Empty extends Piece {
    constructor(position) {
        super('Empty', null, position);
    }
}

export class Move {
    constructor(piece, start, end) {
        this.piece = piece;
        this.start = start;
        this.end = end;
    }
    makeMove(board) {
        
        let start = this.start;
        let end = this.end;
        let piece = board[start[0]][start[1]];
        
        if (board[end[0]][end[1]].type !== "Empty") {
            board[end[0]][end[1]].isCaptured = true;
        }
        
        board[start[0]][start[1]] = new Empty(start);

        board[end[0]][end[1]] = piece;
        if (piece.firstMove) {
            piece.firstMove = false;
        }
            piece.position = end;
        
            // this is shortcut a bit and may lead to issues. 
            // a white pawn moving backward to the first rank will be promoted
            // this should not be an issue as such movement is not permitted
        if (piece.type === "Pawn" && (end[0] === 7 ) || end[0] === 0) {
            board[end[0]][end[1]].isCaptured = true;
            board[end[0]][end[1]] = piece.promote("Queen");
        }

        let element = document.getElementById(ChessBoard.indicesToCoords(start)).querySelector('img')
        if (element) {
            element.remove();
        }
        element = document.getElementById(ChessBoard.indicesToCoords(end)).querySelector('img')
        if (element){
            element.remove();
        }
        document.getElementById(ChessBoard.indicesToCoords(end)).innerHTML += '<img class="pieces '+ board[end[0]][end[1]].type + '" src="../img/chesspieces/wikipedia/'+ board[end[0]][end[1]].color + board[end[0]][end[1]].type +'.png">';

        
    }
}