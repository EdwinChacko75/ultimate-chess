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
                    let pieceObject =  Piece.createPiece(piece, color, [i,j])
                    row.push(pieceObject);
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

    flipBoard(color) {
        color = color == 'black' ? 'black' : "white";
        this.createChessBoard(this.board, color);
        console.log(this.board)
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
                    squareHTML += '<img class="pieces" src="../img/chesspieces/wikipedia/'+ board[i][j].color + board[i][j].type +'.png">';
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

        // Enabling square highlighting
        var squares = document.querySelectorAll('.square');

        squares.forEach(square => {
            square.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                if (event.target.classList.contains('highlighted')) {
                    event.target.classList.remove('highlighted'); 
                }
                else {
                    event.target.classList.add('highlighted');
                }
            });
        });

        var piecesClass = document.querySelectorAll('.pieces');
        piecesClass.forEach(piece => {
            piece.addEventListener('contextmenu', function(event) {
                event.preventDefault();
                var square = event.target.parentNode; 
                if (square.classList.contains('highlighted')) {
                    square.classList.remove('highlighted');
                }
                else {
                    square.classList.add('highlighted');
                }
            });
        });

        // Removing highlighting when left clicking anywhere on board
        squares.forEach(square => {
            square.addEventListener('click', function(event) {
                squares.forEach(square => {
                    square.classList.remove('highlighted'); 
                });
            });
        });
    }

    static arr(ctx, fromx, fromy, tox, toy, arrowWidth, color){
        //variables to be used when creating the arrow

        var headlen = 10;
        var angle = Math.atan2(toy-fromy,tox-fromx);
    
        ctx.save();
        ctx.strokeStyle = color;
    
        //starting path of the arrow from the start square to the end square
        //and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.lineWidth = arrowWidth;
        ctx.stroke();
    
        //starting a new path from the head of the arrow to one of the sides of
        //the point
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                toy-headlen*Math.sin(angle-Math.PI/7));
    
        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
                toy-headlen*Math.sin(angle+Math.PI/7));
    
        //path from the side point back to the tip of the arrow, and then
        //again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                toy-headlen*Math.sin(angle-Math.PI/7));
    
        //draws the paths created above
        ctx.stroke();
        ctx.restore();
    }
    // }

    // get the coords a to b
    arrowCoords() {

        var squares = document.querySelectorAll('.square');
        var pieces = document.querySelectorAll('.pieces');

        let startSquare = null;

        squares.forEach(square => {
            square.addEventListener('mousedown', function(event) {
                if (event.button === 2) {
                    startSquare = event.target.id;
                    res.push(startSquare);
                }
            });
        });

        pieces.forEach(piece => {
            piece.addEventListener('mousedown', function(event) {
                if (event.button === 2) {
                    startSquare = event.target.parentNode.id;
                    res.push(startSquare);
                }
            });
        });

        document.addEventListener('mouseup', function(event) {
            if (event.button === 2) {
                let endSquare = null;
                if (event.target.classList.contains('square')) {
                    endSquare = event.target.id;
                } else if (event.target.classList.contains('pieces')) {
                    endSquare = event.target.parentNode.id;
                }
                if (endSquare) {
                    res.push(endSquare);
                    res = res.filter(item => item !== "");
                    if (res[0] != res[1] && res[0] && res[1]){
                        drawArrow(res);
                    }

                    res = [];
                }
                startSquare = null;
            }
        });
    }
}

export class Piece {
    constructor(type, color, position) {
        this.type = type;
        this.color = color;
        this.position = position;
        this.firstMove = true;
        this.iscaputured = false;
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
        let direction = this.color == 'white' ? -1 : 1;

        let nextRow = row + direction;
        let doubleRow = row + 2 * direction;
        let leftCol = col - 1;
        let rightCol = col + 1;

        let forward = (nextRow > -1 && nextRow < 8) ? board[nextRow][col].position : null;
        let doubleStep = (doubleRow > -1 && doubleRow < 8) ? board[row + 2 * direction][col].position : null;
        let leftCapture = (nextRow >= 0 && nextRow < 8 && leftCol >= 0) ? board[nextRow][leftCol].position : null;
        let rightCapture = (nextRow >= 0 && nextRow < 8 && rightCol < 8) ? board[nextRow][rightCol].position : null;

        
        if (forward && board[forward[0]][forward[1]].type == 'Empty'){
            moves.push([nextRow, col]);
            
            if (doubleStep && board[doubleStep[0]][doubleStep[1]].type == 'Empty' && this.firstMove) {
                moves.push([doubleRow, col]);
            }
        }
            // might throw error if its empty since .color
    
        if (leftCapture && board[leftCapture[0]][leftCapture[1]].type == 'Pawn' && board[leftCapture[0]][leftCapture[1]].color != this.color) {
            moves.push([nextRow, leftCol]);
        }
        if (rightCapture && board[rightCapture[0]][rightCapture[1]].type == 'Pawn' && board[rightCapture[0]][rightCapture[1]].color != this.color) {
            moves.push([nextRow, rightCol]);
        }
            
        let enPassantRow = this.color == 'black' ? 4 : 3;
        let enPassantMoveRow = this.color == 'black' ? 5 : 2;

        if (row == enPassantRow) {
            let leftEnPassant = board[enPassantRow][leftCol];
            let rightEnPassant = board[enPassantRow][rightCol];

            if (leftEnPassant && leftEnPassant.type == 'Pawn' && leftEnPassant.color !== this.color && leftEnPassant.secondMove) {
                moves.push([enPassantMoveRow, leftCol]);
            }

            if (rightEnPassant && rightEnPassant.type == 'Pawn' && rightEnPassant.color !== this.color && rightEnPassant.secondMove) {
                moves.push([enPassantMoveRow, rightCol]);
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
        this.iscaptured = true;
        return newPiece;
    }
}
export class Rook extends Piece {
    constructor(color, position) {
        super('Rook', color, position);
    }
}
export class Knight extends Piece {
    constructor(color, position) {
        super('Knight', color, position);
    }
}
export class Bishop extends Piece {
    constructor(color, position) {
        super('Bishop', color, position);
    }
}
export class Queen extends Piece {
    constructor(color, position) {
        super('Queen', color, position);
    }
}
export class King extends Piece {
    constructor(color, position) {
        super('King', color, position);
    }
}
export class Empty extends Piece {
    constructor(position) {
        super('Empty', null, position);
    }
}
