// 이 코드는 Stockfish라는 체스 AI 엔진을 웹에서 사용하게 해줍니다.
// 우리가 직접 AI를 만들지 않아도, 이 엔진이 똑똑하게 수를 계산해줘요.
const stockfish = new Worker('stockfish.js');

let board = null;
const game = new Chess();
const statusEl = document.getElementById('status');
let skillLevel = 5; // 컴퓨터의 기본 레벨 (보통)

// 컴퓨터가 수를 계산하고 있다는 것을 알려주는 함수
function uciCmd(cmd) {
    stockfish.postMessage(cmd);
}

// 새 게임 시작
uciCmd('ucinewgame');

// 컴퓨터의 레벨을 정해주는 함수
function setSkillLevel(level) {
    uciCmd('setoption name Skill Level value ' + level);
}

// 게임 상태를 화면에 보여주는 함수
function updateStatus() {
    let status = '';
    const moveColor = game.turn() === 'b' ? '검은색' : '흰색';

    if (game.game_over()) {
        status = '게임 종료!';
        if (game.in_checkmate()) {
            status += ', ' + moveColor + ' 체크메이트.';
        } else if (game.in_draw()) {
            status += ', 무승부입니다.';
        }
    } else {
        status = moveColor + ' 차례입니다.';
        if (game.in_check()) {
            status += ', 체크 상태입니다.';
        }
    }

    statusEl.textContent = status;
}

// 컴퓨터가 수를 생각하고 움직이는 함수
function getBestMove() {
    if (!game.game_over()) {
        // 컴퓨터에게 현재 게임 상황을 알려주고 수를 생각하라고 명령
        uciCmd('position fen ' + game.fen());
        uciCmd('go movetime 1000'); // 1초 동안 생각하기
    }
}

// Stockfish AI 엔진으로부터 메시지를 받았을 때 처리
stockfish.onmessage = function (event) {
    const message = event.data;
    // 'bestmove' 라는 메시지가 오면, 컴퓨터가 찾은 최고의 수를 게임에 반영
    if (message.startsWith('bestmove')) {
        const bestMove = message.split(' ')[1];
        game.move(bestMove, {
            sloppy: true
        });
        board.position(game.fen());
        updateStatus();
    }
};

// 플레이어가 말을 놓았을 때 호출되는 함수
function onDrop(source, target) {
    // 말을 움직여보고, 규칙에 맞는지 확인
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // 폰이 끝까지 가면 퀸으로 자동 변경
    });

    // 잘못된 수이면 원래 자리로 돌려놓기
    if (move === null) return 'snapback';

    // 올바른 수이면 컴퓨터 차례
    updateStatus();
    window.setTimeout(getBestMove, 250);
}

// 체스판 설정
const config = {
    draggable: true,
    position: 'start',
    onDrop: onDrop,
};
board = Chessboard('game-board', config);
updateStatus();

// 레벨 선택 버튼을 누르면 컴퓨터 레벨 변경
document.querySelectorAll('button[data-level]').forEach(button => {
    button.addEventListener('click', () => {
        skillLevel = parseInt(button.dataset.level, 10);
        setSkillLevel(skillLevel);
        alert('컴퓨터 레벨이 ' + button.textContent + '(으)로 변경되었습니다.');
    });
});
