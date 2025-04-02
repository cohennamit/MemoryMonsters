var elBtn = document.querySelector('.btn');
elBtn.style.display = 'none';

var userName = prompt('Hello!, what is your name?');
localStorage.setItem('Name', userName);
var elUsername = document.querySelector('.username');
elUsername.innerText = 'Username : ' + userName;
var elBestTime = document.querySelector('.best-time')

// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;
var cardClicks = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 8;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioRight = new Audio('sound/right.mp3');
var audioWrong = new Audio('sound/wrong.mp3');

// This function is called whenever the user click a card
var startStamp = 0;
var finishStamp = 0;
var time = 0;
var bestTime = 20000000000000;
localStorage.setItem('Best', bestTime);
isProcessing = false;

let hr = min = sec = ms = "0" + 0,
    startTimer;

function cardClicked(elCard) {
    if (isProcessing) {
        return;
    }
    if (cardClicks === 0) {
        startStamp = Date.now();
        localStorage.setItem('Start', startStamp);
        startTimer = setInterval(() => {
            ms++
            ms = ms < 10 ? "0" + ms : ms;

            if (ms == 100) {
                sec++;
                sec = sec < 10 ? "0" + sec : sec;
                ms = "0" + 0;
            }
            if (sec == 60) {
                min++;
                min = min < 10 ? "0" + min : min;
                sec = "0" + 0;
            }
            if (min == 60) {
                hr++;
                hr = hr < 10 ? "0" + hr : hr;
                min = "0" + 0;
            }
            putValue();
        }, 10); //1000ms = 1s
        cardClicks++;
    } else {
        cardClicks++;
    }

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }

    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2) {
            isProcessing = true;
            audioWrong.play();
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                isProcessing = false;
            }, 1000)
        } else {
            // Yes! a match!
            flippedCouplesCount++;
            elPreviousCard = null;
            audioRight.play();

            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                finishStamp = Date.now();
                clearInterval(startTimer);
                localStorage.setItem('Finish', finishStamp);
                audioWin.play();
                time = finishStamp - startStamp;
                localStorage.setItem('Time', time);
                if (bestTime > time) {
                    bestTime = time;
                    localStorage.setItem('Best', bestTime);
                    elBestTime.innerText = 'Best Time : ' + bestTime + ' (MS), by ' + userName + '.';
                }
                elBtn.style.display = 'block';
            }

        }

    }

}

function changeUser() {
    userName = prompt('What is your new username?');
    localStorage.setItem('Name', userName);
    elUsername.innerText = 'Username : ' + userName;
    playAgain();
}

function playAgain() {
    elBtn.style.display = 'none';
    flippedCouplesCount = 0;
    cardClicks = 0;
    hr = min = sec = ms = "0" + 0;
    putValue();
    var elCards = document.querySelectorAll('.card');
    for (var i = 0; i < elCards.length; i++) {
        elCards[i].classList.remove('flipped');
    }
    var board = document.querySelector('.board');
    for (var i = board.children.length; i >= 0; i--) {
        board.appendChild(board.children[Math.random() * i | 0]);
    }
}

function putValue() {
    document.querySelector(".millisecond").innerText = ms;
    document.querySelector(".second").innerText = sec;
    document.querySelector(".minute").innerText = min;
    document.querySelector(".hour").innerText = hr;
}