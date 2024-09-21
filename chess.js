const board = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

const pieceUnicode = {
    "r": "♜", "n": "♞", "b": "♝", "q": "♛", "k": "♚", "p": "♟",
    "R": "♖", "N": "♘", "B": "♗", "Q": "♕", "K": "♔", "P": "♙"
};

let selectedPiece = null;
let selectedSquare = null;
let currentPlayer = 'white';

function drawBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.row = row;
            square.dataset.col = col;

            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }

            const piece = board[row][col];
            if (piece) {
                const pieceElement = document.createElement('span');
                pieceElement.classList.add('piece');
                pieceElement.innerHTML = pieceUnicode[piece];
                pieceElement.dataset.piece = piece;
                pieceElement.classList.add(piece === piece.toUpperCase() ? 'white' : 'black');
                square.appendChild(pieceElement);
            }

            square.addEventListener('click', () => handleSquareClick(square));
            chessboard.appendChild(square);
        }
    }
}

function handleSquareClick(square) {
    if (!selectedPiece) {
        // Selecting a piece
        const pieceElement = square.querySelector('.piece');
        if (pieceElement && pieceElement.classList.contains(currentPlayer === 'white' ? 'white' : 'black')) {
            selectedPiece = pieceElement;
            selectedSquare = square;
            selectedSquare.classList.add('selected'); // Highlight the selected piece
        }
    } else {
        // Attempting to move the piece
        const fromRow = parseInt(selectedSquare.dataset.row);
        const fromCol = parseInt(selectedSquare.dataset.col);
        const toRow = parseInt(square.dataset.row);
        const toCol = parseInt(square.dataset.col);

        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
            square.appendChild(selectedPiece);
            board[toRow][toCol] = board[fromRow][fromCol];
            board[fromRow][fromCol] = "";
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white'; // Switch turns
        }

        selectedSquare.classList.remove('selected'); // Remove highlight
        selectedPiece = null;
        selectedSquare = null;
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const targetPiece = board[toRow][toCol];
    const isTargetPieceEnemy = (targetPiece && (piece.toUpperCase() !== targetPiece.toUpperCase()));

    // Check if the piece belongs to the current player
    if ((currentPlayer === 'white' && piece === piece.toLowerCase()) ||
        (currentPlayer === 'black' && piece === piece.toUpperCase())) {
        return false;
    }

    switch (piece.toLowerCase()) {
        case 'p': return isValidPawnMove(fromRow, fromCol, toRow, toCol, piece, isTargetPieceEnemy);
        case 'r': return isValidRookMove(fromRow, fromCol, toRow, toCol);
        case 'n': return isValidKnightMove(fromRow, fromCol, toRow, toCol);
        case 'b': return isValidBishopMove(fromRow, fromCol, toRow, toCol);
        case 'q': return isValidQueenMove(fromRow, fromCol, toRow, toCol);
        case 'k': return isValidKingMove(fromRow, fromCol, toRow, toCol);
        default: return false;
    }
}

// Piece movement logic
function isValidPawnMove(fromRow, fromCol, toRow, toCol, piece, isTargetPieceEnemy) {
    const direction = (piece === 'P') ? -1 : 1; // White moves up, Black moves down
    if (toCol === fromCol) {
        if (toRow === fromRow + direction && !isTargetPieceEnemy) {
            return true; // Move forward one space
        }
        if (toRow === fromRow + (direction * 2) && !isTargetPieceEnemy && ((piece === 'P' && fromRow === 6) || (piece === 'p' && fromRow === 1))) {
            return true; // Move forward two spaces
        }
    } else if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction && isTargetPieceEnemy) {
        return true; // Capture
    }
    return false;
}

function isValidRookMove(fromRow, fromCol, toRow, toCol) {
    if (fromRow === toRow) {
        return isPathClear(fromRow, fromCol, toRow, toCol, 0, Math.sign(toCol - fromCol));
    }
    if (fromCol === toCol) {
        return isPathClear(fromRow, fromCol, toRow, toCol, Math.sign(toRow - fromRow), 0);
    }
    return false;
}

function isValidKnightMove(fromRow, fromCol, toRow, toCol) {
    return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
           (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
}

function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
    if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
        return isPathClear(fromRow, fromCol, toRow, toCol, Math.sign(toRow - fromRow), Math.sign(toCol - fromCol));
    }
    return false;
}

function isValidQueenMove(fromRow, fromCol, toRow, toCol) {
    return isValidRookMove(fromRow, fromCol, toRow, toCol) || isValidBishopMove(fromRow, fromCol, toRow, toCol);
}

function isValidKingMove(fromRow, fromCol, toRow, toCol) {
    return (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1);
}

function isPathClear(fromRow, fromCol, toRow, toCol, rowStep, colStep) {
    let row = fromRow + rowStep;
    let col = fromCol + colStep;
    while (row !== toRow || col !== toCol) {
        if (board[row][col] !== "") {
            return false; // Path is blocked
        }
        row += rowStep;
        col += colStep;
    }
    return true;
}

// Initial draw
drawBoard();
