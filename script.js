// --- LAUNCHER PENCERE KONTROLLERİ ---
function openGame(modalId) {
    document.getElementById(modalId).style.display = "flex";
    if (modalId === 'minesweeperModal') {
        initMinesweeper(); // Mayın tarlasını sıfırla ve kur
    }
}

function closeGame(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Dışarı tıklanınca kapatma
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

// Arama Filtresi
document.getElementById('searchInput').addEventListener('keyup', function(event) {
    let searchQuery = event.target.value.toLowerCase();
    let gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(function(card) {
        let gameTitle = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = gameTitle.includes(searchQuery) ? "block" : "none";
    });
});


// --- SIFIRDAN MAYIN TARLASI MOTORU (8x8 Izgara, 10 Mayın) ---
const rows = 8;
const cols = 8;
const minesCount = 10;
let board = [];
let gameOver = false;

function initMinesweeper() {
    const boardElement = document.getElementById('minesweeper-board');
    const statusElement = document.getElementById('minesweeper-status');
    boardElement.innerHTML = '';
    statusElement.innerText = '⚠️ Dikkatli bas!';
    gameOver = false;
    board = [];

    // 1. Boş matris oluştur
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            board[r][c] = { r, c, mine: false, revealed: false, count: 0 };
        }
    }

    // 2. Rastgele Mayın Yerleştir
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!board[r][c].mine) {
            board[r][c].mine = true;
            minesPlaced++;
        }
    }

    // 3. Etraftaki mayın sayılarını hesapla
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].mine) {
                board[r][c].count = countMinesAround(r, c);
            }
        }
    }

    // 4. HTML hücrelerini ekrana bas
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;
            cellElement.addEventListener('click', () => clickCell(r, c, cellElement));
            boardElement.appendChild(cellElement);
        }
    }
}

function countMinesAround(r, c) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (board[r + i] && board[r + i][c + j] && board[r + i][c + j].mine) {
                count++;
            }
        }
    }
    return count;
}

function clickCell(r, c, element) {
    if (gameOver || board[r][c].revealed) return;
    
    board[r][c].revealed = true;
    element.classList.add('revealed');

    if (board[r][c].mine) {
        element.classList.add('mine');
        element.innerText = '💣';
        document.getElementById('minesweeper-status').innerText = '💥 BOOM! Kaybettin.';
        gameOver = true;
        revealAllMines();
        return;
    }

    if (board[r][c].count > 0) {
        element.innerText = board[r][c].count;
    } else {
        // Eğer etrafta hiç mayın yoksa otomatik genişlet (Zincirleme reaksiyon)
        revealEmptyCells(r, c);
    }

    checkWin();
}

function revealEmptyCells(r, c) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let nr = r + i;
            let nc = c + j;
            if (board[nr] && board[nr][nc] && !board[nr][nc].revealed && !board[nr][nc].mine) {
                const targetElement = document.querySelector(`[data-row='${nr}'][data-col='${nc}']`);
                clickCell(nr, nc, targetElement);
            }
        }
    }
}

function revealAllMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) {
                const mineElement = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
                mineElement.classList.add('mine');
                mineElement.innerText = '💣';
            }
        }
    }
}

function checkWin() {
    let win = true;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].mine && !board[r][c].revealed) win = false;
        }
    }
    if (win) {
        document.getElementById('minesweeper-status').innerText = '🎉 Tebrikler! Kazandın!';
        gameOver = true;
    }
}
