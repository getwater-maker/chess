const gameBoard = document.getElementById('game-board');
let selectedPiece = null;

// 체스 말의 시작 위치
const boardState = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

// 체스판 만들기
function createBoard() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            // 칸 색깔 정하기
            if ((i + j) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            // 체스 말 놓기
            square.textContent = boardState[i][j];

            // 마우스 이벤트 추가
            square.addEventListener('click', () => {
                if (selectedPiece) {
                    // 선택된 말이 있으면 그 자리로 이동
                    square.textContent = selectedPiece.textContent;
                    selectedPiece.textContent = '';
                    selectedPiece = null;
                } else if (square.textContent !== '') {
                    // 빈 칸이 아니면 말 선택
                    selectedPiece = square;
                }
            });

            gameBoard.appendChild(square);
        }
    }
}

createBoard();