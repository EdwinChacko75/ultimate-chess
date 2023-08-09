import {ChessBoard, Piece, Pawn, Empty, Rook, Bishop, Queen, King, Knight, Move} from "./classes.js";

let chessBoard = new ChessBoard();

document.addEventListener("DOMContentLoaded", () => {
    chessBoard.createChessBoard(chessBoard.board,chessBoard.color);
    // chessBoard.arrowCoords();



    const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const rows = ['8', '7', '6', '5', '4', '3', '2', '1'];

    let r = 4;
    let c = 3;
    let br = 4;
    let bc = 1;
    // let whiteRook = new Rook('white', [r,c]);  // Example for white pawn at e4
    // let blackPawn = new Pawn('white', [br,bc]); // Example for white pawn at e4

    // chessBoard.board[r][c] = whiteRook;

    // chessBoard.board[br][bc] = blackPawn;
    // let move = new Move(chessBoard.board[6][0], chessBoard.board[6][0].position, [0,1]);
    // move.makeMove(chessBoard.board, chessBoard.board[br][bc], [6,0], [0,1]);






});

document.addEventListener("DOMContentLoaded", (event)=> {
    var canvas = document.getElementById('myCanvas');
    var ctx=canvas.getContext('2d');
    
    window.onload = function() {
    
        ChessBoard.arr(ctx, 10, 10, 100, 100, 10, 'red');
        ChessBoard.arr(ctx, 100, 10, 140, 140, 3, 'black');
    }
});

document.getElementById('flipBoardButton').addEventListener('click', () => {
    chessBoard.flipBoard('black');  
});


// // Square Highlighting
// var squares = document.querySelectorAll('.square');
// squares.forEach(square => {
//     square.addEventListener('contextmenu', function(event) {
//         event.preventDefault();
//         if (square.classList.contains('highlighted')) {
//             square.classList.remove('highlighted');
//         }
//         else {
//             square.classList.add('highlighted');
//         }
//         const isSelectedClassPresent = [...squares].some(square => square.classList.contains('selected'));
//         if (isSelectedClassPresent) {
//             squares.forEach(square => {
//                 square.classList.remove('newhighlight');
//             });
//         }
//     });
// });

// squares.forEach(square => {
//     square.addEventListener('click', function(event) {
//         squares.forEach(square => {
//                 square.classList.remove('highlighted');
//         });
//         if (square.classList.contains('newhighlight')) {
//             let selectedPiece;
//             let target = [ChessBoard.findIndex(rows, event.target.id[1]), ChessBoard.findIndex(columns, event.target.id[0])];
//             squares.forEach(square => {
//                 if (square.classList.contains('selected')) {
//                     selectedPiece = [ChessBoard.findIndex(rows, square.id[1]), ChessBoard.findIndex(columns, square.id[0])];
//                 }
//             })
//             let moves = board[selectedPiece[0]][selectedPiece[1]].getMoves(board);
//             moves.forEach(move => {
//                 if (move.end[0] == target[0] && move.end[1] == target[1]) {
//                     move.makeMove(board);
//                     console.log(board);
//                 }
//             })

//         }
//         const isSelectedClassPresent = [...squares].some(square => square.classList.contains('selected'));
//         if (isSelectedClassPresent) {
//             squares.forEach(square => {
            
//             square.classList.remove('newhighlight');
                              
//             if (square.classList.contains('selected')){
//                     square.classList.remove('selected');
//                 }
//             });
//         }
//     });
// });

// var piecesClass = document.querySelectorAll('.pieces');
// piecesClass.forEach(piece => {
//     piece.addEventListener('click', function(event) {   
//         event.stopPropagation();      
//         console.log('clicked');       
//         let row = ChessBoard.findIndex(rows, event.target.parentNode.id[1]);
//         let column = ChessBoard.findIndex(columns, event.target.parentNode.id[0]);
//         let piece = board[row][column];
//         let moves = piece.getMoves(board);
//         let squares = document.querySelectorAll('.square');

//         squares.forEach(square => {
//             square.classList.remove('highlighted');
//             square.classList.remove('newhighlight');
//         });

//         if (!document.getElementById(ChessBoard.indicesToCoords([row, column])).classList.contains('selected')) {
//             moves.forEach(move => { 
//                 let square = document.getElementById(ChessBoard.indicesToCoords(move.end));
//                 square.classList.add('newhighlight'); 
//             });
//             document.getElementById(ChessBoard.indicesToCoords([row, column])).classList.add('selected');     
//         } 
//         else {
//             document.getElementById(ChessBoard.indicesToCoords([row, column])).classList.remove('selected');
//         }
        


//     });
// });