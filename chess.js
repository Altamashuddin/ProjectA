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
let currentPlayer = 'white'; // Keep track of whose turn it is

function drawBoard() {
    const chessboard = document.getElementById('chessboard');
    chessboard.innerHTML = ''; // Clear the board first

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
                pieceElement.draggable = true;
                pieceElement.addEventListener('dragstart', onDragStart);
                square.appendChild(pieceElement);
            }

            square.addEventListener('dragover', onDragOver);
            square.addEventListener('drop', onDrop);
            chessboard.appendChild(square);
        }
    }
}

function onDragStart(event) {
    selectedPiece = event.target;
    selectedSquare = event.target.parentElement;
    selectedSquare.classList.add('selected');
}

function onDragOver(event) {
    event.preventDefault();  // Allow the drop
}

function onDrop(event) {
    event.preventDefault();
    const dropSquare = event.target.classList.contains('square') ? event.target : event.target.parentElement;

    if (selectedPiece && selectedSquare && dropSquare !== selectedSquare) {
        const fromRow = parseInt(selectedSquare.dataset.row);
        const fromCol = parseInt(selectedSquare.dataset.col);
        const toRow = parseInt(dropSquare.dataset.row);
        const toCol = parseInt(dropSquare.dataset.col);

        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
            dropSquare.appendChild(selectedPiece);
            movePiece(fromRow, fromCol, toRow, toCol);
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white'; // Switch turns
        }
    }

    selectedSquare.classList.remove('selected');
    selectedPiece = null;
    selectedSquare = null;
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
        case 'p': // Pawn
            return isValidPawnMove(fromRow, fromCol, toRow, toCol, piece, isTargetPieceEnemy);
        case 'r': // Rook
            return isValidRookMove(fromRow, fromCol, toRow, toCol);
        case 'n': // Knight
            return isValidKnightMove(fromRow, fromCol, toRow, toCol);
        case 'b': // Bishop
            return isValidBishopMove(fromRow, fromCol, toRow, toCol);
        case 'q': // Queen
            return isValidQueenMove(fromRow, fromCol, toRow, toCol);
        case 'k': // King
            return isValidKingMove(fromRow, fromCol, toRow, toCol);
        default:
            return false;
    }
}

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

function movePiece(fromRow, fromCol, toRow, toCol) {
    // Update board array
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = "";
}

// Initial draw
drawBoard();
