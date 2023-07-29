"use strict";
// document.addEventListener('DOMContentLoaded', () => {}
let score = 0;
let level = 1;
let topScore = 0;
let topLevel = 1;
let m = 0;
let n = 0;
const storedScore = localStorage.getItem('topScore');
const storedLevel = localStorage.getItem('topLevel');
let gameOn = false;
if (storedScore) {
    topScore = Number(storedScore);
    const storedTopScore = document.getElementById('top-score');
    if (storedTopScore) {
        storedTopScore.innerHTML = String(topScore);
    }
}
if (storedLevel) {
    topLevel = Number(storedLevel);
    const storedTopLevel = document.getElementById('top-level');
    if (storedTopLevel) {
        storedTopLevel.innerHTML = String(topLevel);
    }
}
//@ts-ignore
document.getElementById('move-left').innerHTML = '<';
//@ts-ignore
document.getElementById('move-right').innerHTML = '>';
//@ts-ignore
document.getElementById('rotate').innerHTML = '↻';
//@ts-ignore
document.getElementById('move-down').innerHTML = '↓';
const box = `<div class="square" ></div>`;
for (let i = 0; i < 210; i++) {
    //@ts-ignore
    document.getElementById('play-area').innerHTML += box;
}
// let grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('#play-area div'));
let speed = 500;
let timerId;
let levelSpeed = 100;
let levelUp = levelSpeed;
// const audio = new Audio('./music/robotrock.mp3');
const newGame = () => {
    const utterance = new SpeechSynthesisUtterance('new game');
    utterance.voice = speechSynthesis.getVoices()[0];
    utterance.rate = 1;
    utterance.volume = 3;
    utterance.pitch = 0.7;
    speechSynthesis.speak(utterance);
    gameOn = true;
    // console.log(box, 'BOX');
    //@ts-ignore
    document.getElementById('play-area').innerHTML = '';
    for (let i = 0; i < 210; i++) {
        //@ts-ignore
        document.getElementById('play-area').innerHTML += box;
    }
    squares = Array.from(document.querySelectorAll('#play-area div'));
    squares.forEach((square, i) => {
        if (i < 10) {
            square.style.display = 'none';
        }
    });
    // audio.currentTime = 0;
    // audio.pause();
    // setTimeout(() => {
    //   audio.play();
    // }, 1000);
};
const width = 10;
const lPiece = [
    [1, 2, width + 1, 2 * width + 1],
    [width, width + 1, width + 2, 2 * width + 2],
    [2 * width, 2 * width + 1, width + 1, 1],
    [width, 2 * width, 2 * width + 1, 2 * width + 2],
];
const oPiece = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
];
const zPiece = [
    [2 * width, 2 * width + 1, width + 1, width + 2],
    [0, width, width + 1, 2 * width + 1],
    [2 * width, 2 * width + 1, width + 1, width + 2],
    [0, width, width + 1, 2 * width + 1],
];
const tPiece = [
    [width, width + 1, width + 2, 1],
    [1, width + 1, 2 * width + 1, width + 2],
    [width, width + 1, width + 2, 2 * width + 1],
    [1, width + 1, 2 * width + 1, width],
];
const iPiece = [
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
];
const pieces = [lPiece, zPiece, tPiece, oPiece, iPiece];
const nextPieces = [];
const addPiece = () => {
    let x = Math.floor(Math.random() * pieces.length);
    //   m = Math.floor(Math.random() * pieces[n].length);
    nextPieces.push(pieces[x]);
};
const setInitialPieces = () => {
    for (let i = 0; i < 4; i++) {
        addPiece();
    }
};
setInitialPieces();
// console.log(nextPieces, 'NEXT PIECES');
let currentPosition = 4;
// //@ts-ignore
// assert(nextPieces.shift() !== undefined);
let current = nextPieces.shift();
console.log(nextPieces, current, 'NEXT PIECES after shift');
for (let i = 0; i < 40; i++) {
    //@ts-ignore
    document.getElementById('next-one').innerHTML += box;
}
for (let i = 0; i < 40; i++) {
    //@ts-ignore
    document.getElementById('next-two').innerHTML += box;
}
for (let i = 0; i < 40; i++) {
    //@ts-ignore
    document.getElementById('next-three').innerHTML += box;
}
let initialNextArray = [];
const initialNext = () => {
    console.log(document.querySelectorAll('#next-one div'), 'NEXT ONE');
    const squaresNextOne = Array.from(document.querySelectorAll('#next-one div'));
    const squaresNextTwo = Array.from(document.querySelectorAll('#next-two div'));
    const squaresNextThree = Array.from(document.querySelectorAll('#next-three div'));
    initialNextArray = [squaresNextOne, squaresNextTwo, squaresNextThree];
};
const drawNext = () => {
    initialNextArray.forEach((grid, i) => {
        grid.forEach((square) => {
            square.classList.remove('tetris-piece');
        });
    });
    nextPieces.forEach((piece, i) => {
        console.log(piece, 'PIECE');
        piece[0].forEach((index) => {
            console.log(initialNextArray, 'INITIAL NEXT ARRAY');
            initialNextArray[i][index].classList.add('tetris-piece');
        });
    });
};
initialNext();
drawNext();
// let currentPiece = pieces[n];
const draw = () => {
    console.log(nextPieces, current, 'NEXT PIECES in draw');
    // m = 0;
    let check = current[m].some((index) => {
        return squares[currentPosition + index].classList.contains('taken');
    });
    current[m].forEach((index) => {
        if (squares[currentPosition + index].classList.contains('taken')) {
            squares[currentPosition + index].classList.add('tetris-piece');
            squares[currentPosition + index].style.backgroundColor = 'purple';
        }
        else {
            squares[currentPosition + index].classList.add('tetris-piece');
        }
    });
    if (check) {
        gameOn = false;
        let interval = 20;
        clearInterval(timerId);
        squares.forEach((square, i) => {
            setTimeout(function () {
                square.classList.remove('tetris-piece');
                square.classList.remove('taken');
                //   square.classList.add('game-over-squares');
                square.style.backgroundColor = 'grey';
            }, i * interval);
        });
        // audio.currentTime = 0;
        // audio.pause();
        const utterance = new SpeechSynthesisUtterance('Your game');
        utterance.voice = speechSynthesis.getVoices()[0];
        utterance.rate = 0.8;
        utterance.pitch = 0.6;
        speechSynthesis.speak(utterance);
        const utterance2 = new SpeechSynthesisUtterance('is');
        utterance2.voice = speechSynthesis.getVoices()[0];
        utterance2.rate = 0.8;
        utterance2.pitch = 0.6;
        setTimeout(() => {
            speechSynthesis.speak(utterance2);
        }, 1000);
        const utterance3 = new SpeechSynthesisUtterance('over');
        utterance3.voice = speechSynthesis.getVoices()[0];
        utterance3.rate = 0.5;
        utterance3.pitch = 0.6;
        setTimeout(() => {
            speechSynthesis.speak(utterance3);
        }, 1500);
        //@ts-ignore
        document.getElementById('game-over').style.visibility = 'visible';
    }
};
const newPiece = () => {
    m = 0;
    if (gameOn) {
        n = Math.floor(Math.random() * pieces.length);
        let y = Math.floor(Math.random() * pieces[n].length);
        let shifted = nextPieces.shift();
        console.log(shifted, 'SHIFTED');
        current = shifted;
        addPiece();
        drawNext();
        // current = pieces[n][m];
        currentPosition = 4;
        console.log(current, 'CURRENT new piece');
        draw();
    }
};
const moveLeft = () => {
    if (gameOn) {
        if (current[m].some((index) => {
            return squares[currentPosition - 1 + index].classList.contains('taken');
        }) ||
            current[m].some((index) => {
                return (currentPosition + index) % width === 0;
            })) {
            return;
        }
        current[m].forEach((index) => {
            squares[currentPosition + index].classList.remove('tetris-piece');
        });
        currentPosition -= 1;
        draw();
    }
};
const moveRight = () => {
    if (gameOn) {
        if (current[m].some((index) => {
            return squares[currentPosition + 1 + index].classList.contains('taken');
        }) ||
            current[m].some((index) => {
                return (currentPosition + index) % width === 9;
            })) {
            return;
        }
        current[m].forEach((index) => {
            squares[currentPosition + index].classList.remove('tetris-piece');
        });
        currentPosition += 1;
        draw();
    }
};
const moveDown = () => {
    //   if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    //   console.log(current, currentPosition, 'CURRENT');
    //   }
    if (gameOn) {
        if (current[m].some((index) => {
            console.log(currentPosition + index + width, 'SQUARES CURRENT');
            return currentPosition + index + width > 209;
        }) ||
            current[m].some((index) => squares[currentPosition + index + width].classList.contains('taken'))) {
            console.log('HIT BOTTOM');
            current[m].forEach((index) => {
                squares[currentPosition + index].classList.add('taken');
            });
            const checkLines = () => {
                let check = false;
                for (let i = 0; i < 209; i += width) {
                    const row = [
                        i,
                        i + 1,
                        i + 2,
                        i + 3,
                        i + 4,
                        i + 5,
                        i + 6,
                        i + 7,
                        i + 8,
                        i + 9,
                    ];
                    if (row.every((index) => squares[index].classList.contains('taken'))) {
                        row.forEach((index) => {
                            check = true;
                            squares[index].classList.remove('taken');
                            squares[index].classList.remove('tetris-piece');
                            // const initial = index % 10;
                            // console.log(index, initial, 'INDEX');
                            // for (let j = 0; j < index; j ++) {
                        });
                        if (check) {
                            clearLine(i);
                        }
                        score += 20 * level;
                        if (score > topScore) {
                            topScore = score;
                            localStorage.setItem('topScore', String(topScore));
                        }
                        //@ts-ignore
                        document.getElementById('score').innerHTML = score;
                        if (score >= levelUp) {
                            speed -= 50;
                            level += 1;
                            if (level > topLevel) {
                                topLevel = level;
                                localStorage.setItem('topLevel', String(topLevel));
                            }
                            levelUp += level * levelSpeed;
                            //@ts-ignore
                            document.getElementById('level').innerHTML = level;
                            //@ts-ignore
                            document.getElementById('level-up').style.visibility = 'visible';
                            setTimeout(() => {
                                //@ts-ignore
                                document.getElementById('level-up').style.visibility = 'hidden';
                            }, 1000);
                            clearInterval(timerId);
                            timerId = setInterval(moveDown, speed);
                        }
                    }
                }
            };
            const clearLine = (row) => {
                for (let j = row; j > 0; j--) {
                    if (squares[j].classList.contains('taken')) {
                        console.log(j, squares[j], 'J TAKEN');
                        squares[j].classList.remove('taken');
                        squares[j].classList.remove('tetris-piece');
                        squares[j + width].classList.add('taken');
                        squares[j + width].classList.add('tetris-piece');
                        console.log(j, squares[j + width], 'J TAKEN');
                    }
                }
            };
            checkLines();
            // if (squares)
            newPiece();
        }
        else {
            current[m].forEach((index) => {
                squares[currentPosition + index].classList.remove('tetris-piece');
            });
            currentPosition += width;
            draw();
        }
    }
};
const rotate = () => {
    console.log(current, nextPieces, 'CURRENT');
    if (gameOn) {
        /// HERE BUG GOES OUT OF BOUNDS AND GAME OVER IF ROTATE INTO TAKEN PIECE OR BOTTOM
        // if (squares[currentPosition + index].classList.contains('taken')) {}
        current[m].forEach((index) => {
            squares[currentPosition + index].classList.remove('tetris-piece');
        });
        m++;
        console.log(nextPieces, 'NEXT PIECES in rotate');
        if (m === current.length) {
            m = 0;
        }
        // current = nextPieces[n][m];
        draw();
    }
};
addEventListener('keydown', (e) => {
    console.log(e, 'EVENT');
    if (e.key === 'ArrowLeft') {
        moveLeft();
    }
    if (e.key === 'ArrowRight') {
        moveRight();
    }
    if (e.key === 'ArrowDown') {
        moveDown();
    }
    if (e.key === 'ArrowUp') {
        rotate();
    }
});
addEventListener('click', (e) => {
    // console.log(e, e.target.id, 'EVENT');
    if (e && e.target) {
        //@ts-ignore
        if (e.target.id === 'start-button') {
            //@ts-ignore
            document.getElementById('game-over').style.visibility = 'hidden';
            speed = 500;
            timerId = setInterval(moveDown, speed);
            level = 1;
            newGame();
            newPiece();
            //@ts-ignore
        }
        else if (e.target.id === 'move-left') {
            moveLeft();
            //@ts-ignore
        }
        else if (e.target.id === 'move-right') {
            moveRight();
            //@ts-ignore
        }
        else if (e.target.id === 'rotate') {
            rotate();
            //@ts-ignore
        }
        else if (e.target.id === 'move-down') {
            moveDown();
        }
    }
});
if (gameOn) {
    draw();
    //   console.log(gameOn, 'GAME ON');
    //   setInterval(moveDown, speed);
}
for (let i = 4; i < 8; i++) {
    if (squares[i].classList.contains('taken')) {
        // console.log(
        //   document.getElementById('game-over'),
        //   document.getElementById('game-over').style,
        //   'GAME OVER'
        // );
        // // // audio.currentTime = 0;
        // // // audio.pause();
        // // // console.log(audio.paused, 'PAUSED');
        // audio.load();
        // audio.prototype.restart = function () {
        //   this.pause();
        //   this.currentTime = 0;
        //   this.play();
        // };
        //@ts-ignore
        document.getElementById('game-over').style.visibility = 'visible';
    }
}
function assert(arg0) {
    throw new Error('Function not implemented.');
}
// resetTimer();
// const newPiece = () => {
//   const pieces = [
//     [1, 2, 11, 21],
//     [0, 1, 2, 3],
//     [0, 1, 11, 12],
//     [1, 2, 10, 11],
//     [1, 2, 11, 12],
//   ];
//   let random = Math.floor(Math.random() * pieces.length);
//   console.log(random, 'RANDOM');
//   let current = pieces[random];
//   console.log(current, 'CURRENT');
//   current.forEach((index) => {
//     squares[index].classList.add('tetris-piece');
//   });
// };
// newPiece();
// setTimeout(() => {
//   squares[1].classList.remove('tetris-piece');
//   squares[2].classList.remove('tetris-piece');
//   squares[11].classList.remove('tetris-piece');
//   squares[21].classList.remove('tetris-piece');
//   squares[0].classList.remove('tetris-piece');
//   squares[1].classList.remove('tetris-piece');
//   squares[2].classList.remove('tetris-piece');
//   squares[3].classList.remove('tetris-piece');
//   squares[0].classList.remove('tetris-piece');
//   squares[1].classList.remove('tetris-piece');
//   squares[11].classList.remove('tetris-piece');
//   squares[12].classList.remove('tetris-piece');
//   squares[1].classList.remove('tetris-piece');
//   squares[2].classList.remove('tetris-piece');
//   squares[10].classList.remove('tetris-piece');
//   squares[11].classList.remove('tetris-piece');
//   squares[1].classList.remove('tetris-piece');
//   squares[2].classList.remove('tetris-piece');
//   squares[11].classList.remove('tetris-piece');
//   squares[12].classList.remove('tetris-piece');
// }, 1000);
//
// Interface current =
