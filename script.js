let totalAmount = 1000;
let highestTotal = 0;
const multipliers = [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33];
let droppingInterval;

document.getElementById('total-amount').innerText = totalAmount;
document.getElementById('highest-total').innerText = highestTotal;

function dropBall() {
    const betAmount = parseFloat(document.getElementById('bet-amount').value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > totalAmount) {
        alert("Invalid bet amount");
        return;
    }

    totalAmount -= betAmount;
    document.getElementById('total-amount').innerText = totalAmount;

    const board = document.getElementById('plinko-board');
    const ball = document.createElement('div');
    ball.className = 'ball';
    ball.style.left = (board.offsetWidth / 2 - 10) + 'px';
    ball.style.top = '0px';
    board.appendChild(ball);

    let currentRow = 0;
    const interval = setInterval(() => {
        if (currentRow < 10) {
            const direction = Math.random() < 0.5 ? -1 : 1;
            const left = parseInt(ball.style.left) + (direction * 15);
            ball.style.left = Math.max(0, Math.min(board.offsetWidth - 20, left)) + 'px';
            ball.style.top = (currentRow * 30) + 'px';
            currentRow++;
        } else {
            clearInterval(interval);
            const slotIndex = Math.round(parseInt(ball.style.left) / 30);
            const multiplier = multipliers[slotIndex];
            const winAmount = betAmount * multiplier;
            totalAmount += winAmount;
            document.getElementById('total-amount').innerText = totalAmount;
            board.removeChild(ball);

            if (totalAmount > highestTotal) {
                highestTotal = totalAmount;
                document.getElementById('highest-total').innerText = highestTotal;
            }

            if (totalAmount <= 0) {
                totalAmount = 1000;
                document.getElementById('total-amount').innerText = totalAmount;
            }
        }
    }, 200);
}

// Generate pegs
const board = document.getElementById('plinko-board');
for (let row = 0; row < 10; row++) {
    for (let col = 0; col <= row; col++) {
        const peg = document.createElement('div');
        peg.className = 'peg';
        peg.style.left = (col * 30 + (board.offsetWidth / 2 - row * 15)) + 'px';
        peg.style.top = (row * 30) + 'px';
        board.appendChild(peg);
    }
}

// Generate slots
const multiplierContainer = document.getElementById('multiplier-container');
for (let i = 0; i < multipliers.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.innerText = `${multipliers[i]}x`;
    multiplierContainer.appendChild(slot);
}

// Handle button press for single drop and long press for continuous drops
const dropButton = document.getElementById('drop-button');

dropButton.addEventListener('click', () => {
    dropBall();
});

dropButton.addEventListener('mousedown', () => {
    droppingInterval = setInterval(dropBall, 500); // Drops a ball every 500ms
});

dropButton.addEventListener('mouseup', () => {
    clearInterval(droppingInterval);
});

dropButton.addEventListener('mouseleave', () => {
    clearInterval(droppingInterval);
});

dropButton.addEventListener('touchstart', () => {
    droppingInterval = setInterval(dropBall, 500);
});

dropButton.addEventListener('touchend', () => {
    clearInterval(droppingInterval);
});
