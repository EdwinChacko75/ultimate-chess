export const zobristTable = initializeZobristTable();
export const pieceMapping = {
    'whitePawn': 0,
    'whiteKnight': 1,
    'whiteBishop': 2,
    'whiteRook': 3,
    'whiteQueen': 4,
    'whiteKing': 5,
    'blackPawn': 6,
    'blackKnight': 7,
    'blackBishop': 8,
    'blackRook': 9,
    'blackQueen': 10,
    'blackKing': 11,
};
export const castlingMapping = {
    'whiteKingside': 0,
    'whiteQueenside': 1,
    'blackKingside': 2,
    'blackQueenside': 3
};
export const enPassantMapping = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
    'f': 5,
    'g': 6,
    'h': 7
};
export const turnMapping = {
    'white': 0,
    'black': 1
};

function initializeZobristTable() {
    let table = {
        pieces: [],
        castling: [],
        enPassant: [],
        turn: [],   
    };
    
    let whiteTurn = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2)**BigInt(64);
    let blackTurn = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2)**BigInt(64);

    table.turn = [whiteTurn, blackTurn];
    
    for (let i = 0; i < 8; i++) {
        table.pieces.push([]);
        for (let j = 0; j < 8; j++) {
            table.pieces[i].push([]);
            for (let k = 0; k < 12; k++) {
                table.pieces[i][j].push(BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2)**BigInt(64));
            }
        }
    }
    
    table.castling = [
        BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2)**BigInt(64),
        BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2)**BigInt(64),
        BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2)**BigInt(64),
        BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2)**BigInt(64)
        
    ];
    
    table.enPassant = new Array(8).fill(0).map(() => BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) * BigInt(2)**BigInt(64));

    return table;
}

export function getZobristHash(chessBoard) {
    let hash = BigInt(0);
    let board = chessBoard.board;

    for (let i=0; i < 8; i++) {
        for (let j=0; j < 8 ; j++) {
            let piece = board[i][j];
            if (piece.type === "Empty") {
                continue;
            }
            let pieceIndex = pieceMapping[piece.color + piece.type];
            hash = hash ^ BigInt(zobristTable.pieces[i][j][pieceIndex]);
        }
    }
    let castling = chessBoard.castling;
    if (castling.whiteKingside) {
        hash = hash ^ BigInt(zobristTable.castling[castlingMapping.whiteKingside]);
    }
    if (castling.whiteQueenside) {
        hash = hash ^ BigInt(zobristTable.castling[castlingMapping.whiteQueenside]);
    }
    if (castling.blackKingside) {
        hash = hash ^ BigInt(zobristTable.castling[castlingMapping.blackKingside]);
    }
    if (castling.blackQueenside) {
        hash = hash ^ BigInt(zobristTable.castling[castlingMapping.blackQueenside]);
    }
    let enPassant = chessBoard.enPassant;
    if (enPassant !== null) {
        hash = hash ^ BigInt(zobristTable.enPassant[enPassantMapping[enPassant]]);
    }
    let turn = chessBoard.turn;
    hash = hash ^ BigInt(zobristTable.turn[turnMapping[turn]]);
    return hash;
}