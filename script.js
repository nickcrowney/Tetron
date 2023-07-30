// document.addEventListener('DOMContentLoaded', () => {}
var score = 0;
var level = 1;
var topScore = 0;
var topLevel = 1;
var m = 0;
var n = 0;
let newTopScore = false;
let newTopScoreSet = false;
let newTopLevel = false;
let newTopLevelSet = false;
let levelUpText = false;
var storedScore = localStorage.getItem('topScore');
var storedLevel = localStorage.getItem('topLevel');
var gameOn = false;

if (storedScore) {
  topScore = Number(storedScore);
  var storedTopScore = document.getElementById('top-score');
  if (storedTopScore) {
    storedTopScore.innerHTML = String(topScore);
  }
}

if (storedLevel) {
  topLevel = Number(storedLevel);
  var storedTopLevel = document.getElementById('top-level');
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
var box = '<div class="square" ></div>';
for (var i = 0; i < 210; i++) {
  //@ts-ignore
  document.getElementById('play-area').innerHTML += box;
}
// let grid = document.querySelector('.grid');
var squares = Array.from(document.querySelectorAll('#play-area div'));
var speed = 500;
var timerId;
var levelSpeed = 100;
var levelUp = levelSpeed;

const levelUpSound = new Audio('./music/TronLevelShort.mp3');
levelUpSound.currentTime = 0;

const highScoreSound = new Audio('./music/JesusQuote.mp3');
highScoreSound.currentTime = 0;

const lineClearSound = new Audio('./music/boom.mp3');
lineClearSound.currentTime = 0;

const audio = new Audio('./music/sonofflynn.mp3');
audio.currentTime = 0;
// audio.play();

const secondAudio = new Audio('./music/endoftheline.mp3');
audio.addEventListener('ended', function () {
  secondAudio.currentTime = 0;
  secondAudio.play();
});

secondAudio.addEventListener('ended', function () {
  audio.currentTime = 0;
  audio.play();
});
var newGame = function () {
  const audioStart = new Audio('./music/gameon.mp3');
  setTimeout(() => {
    audioStart.currentTime = 0;
    audioStart;
    audioStart.play();
  }, 1000);
  audio.currentTime = 0;
  audio.play();
  gameOn = true;
  //@ts-ignore
  document.getElementById('play-area').innerHTML = '';
  for (var i = 0; i < 210; i++) {
    //@ts-ignore
    // box.classList.add('glow');
    // console.log('GLOW');
    document.getElementById('play-area').innerHTML += box;
  }
  squares = Array.from(document.querySelectorAll('#play-area div'));
  squares.forEach(function (square, i) {
    square.classList.add('glow');
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
var width = 10;
var lPiece = [
  [1, 2, width + 1, 2 * width + 1],
  [width, width + 1, width + 2, 2 * width + 2],
  [2 * width, 2 * width + 1, width + 1, 1],
  [width, 2 * width, 2 * width + 1, 2 * width + 2],
];
var oPiece = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];
var zPiece = [
  [2 * width, 2 * width + 1, width + 1, width + 2],
  [0, width, width + 1, 2 * width + 1],
  [2 * width, 2 * width + 1, width + 1, width + 2],
  [0, width, width + 1, 2 * width + 1],
];
var tPiece = [
  [width, width + 1, width + 2, 1],
  [1, width + 1, 2 * width + 1, width + 2],
  [width, width + 1, width + 2, 2 * width + 1],
  [1, width + 1, 2 * width + 1, width],
];
var iPiece = [
  [1, width + 1, 2 * width + 1, 3 * width + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, 2 * width + 1, 3 * width + 1],
  [width, width + 1, width + 2, width + 3],
];
var pieces = [lPiece, zPiece, tPiece, oPiece, iPiece];
var nextPieces = [];
var addPiece = function () {
  var x = Math.floor(Math.random() * pieces.length);
  //   m = Math.floor(Math.random() * pieces[n].length);
  nextPieces.push(pieces[x]);
};
var setInitialPieces = function () {
  for (var i = 0; i < 4; i++) {
    addPiece();
  }
};
setInitialPieces();

var currentPosition = 4;
// //@ts-ignore
var current = nextPieces.shift();
for (var i = 0; i < 40; i++) {
  //@ts-ignore
  document.getElementById('next-one').innerHTML += box;
}
for (var i = 0; i < 40; i++) {
  //@ts-ignore
  document.getElementById('next-two').innerHTML += box;
}
for (var i = 0; i < 40; i++) {
  //@ts-ignore
  document.getElementById('next-three').innerHTML += box;
}
var initialNextArray = [];
var initialNext = function () {
  var squaresNextOne = Array.from(document.querySelectorAll('#next-one div'));
  var squaresNextTwo = Array.from(document.querySelectorAll('#next-two div'));
  var squaresNextThree = Array.from(
    document.querySelectorAll('#next-three div')
  );
  initialNextArray = [squaresNextOne, squaresNextTwo, squaresNextThree];
};
var drawNext = function () {
  initialNextArray.forEach(function (grid, i) {
    grid.forEach(function (square) {
      square.classList.add('invisible');

      square.classList.remove('tetris-piece');
    });
  });
  nextPieces.forEach(function (piece, i) {
    piece[0].forEach(function (index) {
      initialNextArray[i][index].classList.add('tetris-piece');
      initialNextArray[i][index].classList.remove('invisible');
    });
  });
};
initialNext();
drawNext();
// let currentPiece = pieces[n];
var draw = function () {
  // m = 0;
  var check = current[m].some(function (index) {
    return squares[currentPosition + index].classList.contains('taken');
  });
  current[m].forEach(function (index) {
    if (squares[currentPosition + index].classList.contains('taken')) {
      squares[currentPosition + index].classList.add('tetris-piece');
      squares[currentPosition + index].style.backgroundColor = 'purple';
    } else {
      squares[currentPosition + index].classList.add('tetris-piece');
    }
  });
  if (check) {
    gameOn = false;
    var interval_1 = 20;
    clearInterval(timerId);
    squares.forEach(function (square, i) {
      setTimeout(function () {
        square.classList.remove('tetris-piece');
        square.classList.remove('taken');
        //   square.classList.add('game-over-squares');
        square.style.backgroundColor = 'rgb(249, 249, 249)';
      }, i * interval_1);
    });
    squares.forEach(function (square, i) {
      setTimeout(function () {
        square.style.backgroundColor = 'rgb(8, 12, 27)';
      }, i * interval_1 + 40);
    });
    setTimeout(function () {
      secondAudio.currentTime = 0;
      secondAudio.pause();
      audio.currentTime = 0;
      audio.pause();
    }, 1000);

    // const audioStart = new Audio('./music/zenthing.mp3');
    const audioStart = new Audio('./music/endofline_out.mp3');

    audioStart.currentTime = 0;
    audioStart;
    audioStart.play();

    // // var utterance = new SpeechSynthesisUtterance('Your game');
    // // utterance.voice = speechSynthesis.getVoices()[0];
    // // utterance.rate = 0.8;
    // // utterance.pitch = 0.6;
    // // speechSynthesis.speak(utterance);
    // // var utterance2_1 = new SpeechSynthesisUtterance('is');
    // // utterance2_1.voice = speechSynthesis.getVoices()[0];
    // // utterance2_1.rate = 0.8;
    // // utterance2_1.pitch = 0.6;
    // // setTimeout(function () {
    // //   speechSynthesis.speak(utterance2_1);
    // // }, 1000);
    // // var utterance3_1 = new SpeechSynthesisUtterance('over');
    // // utterance3_1.voice = speechSynthesis.getVoices()[0];
    // // utterance3_1.rate = 0.5;
    // // utterance3_1.pitch = 0.6;
    // // setTimeout(function () {
    // //   speechSynthesis.speak(utterance3_1);
    // // }, 1500);
    //@ts-ignore
    document.getElementById('game-over').style.visibility = 'visible';
  }
};
var newPiece = function () {
  m = 0;
  if (gameOn) {
    n = Math.floor(Math.random() * pieces.length);
    var y = Math.floor(Math.random() * pieces[n].length);
    var shifted = nextPieces.shift();
    current = shifted;
    addPiece();
    drawNext();
    // current = pieces[n][m];
    currentPosition = 4;
    draw();
  }
};
var moveLeft = function () {
  if (gameOn) {
    if (
      current[m].some(function (index) {
        return squares[currentPosition - 1 + index].classList.contains('taken');
      }) ||
      current[m].some(function (index) {
        return (currentPosition + index) % width === 0;
      })
    ) {
      return;
    }
    current[m].forEach(function (index) {
      squares[currentPosition + index].classList.remove('tetris-piece');
    });
    currentPosition -= 1;
    draw();
  }
};
var moveRight = function () {
  if (gameOn) {
    if (
      current[m].some(function (index) {
        return squares[currentPosition + 1 + index].classList.contains('taken');
      }) ||
      current[m].some(function (index) {
        return (currentPosition + index) % width === 9;
      })
    ) {
      return;
    }
    current[m].forEach(function (index) {
      squares[currentPosition + index].classList.remove('tetris-piece');
    });
    currentPosition += 1;
    draw();
  }
};
var moveDown = function () {
  if (gameOn) {
    if (
      current[m].some(function (index) {
        return currentPosition + index + width > 209;
      }) ||
      current[m].some(function (index) {
        return squares[currentPosition + index + width].classList.contains(
          'taken'
        );
      })
    ) {
      current[m].forEach(function (index) {
        squares[currentPosition + index].classList.add('taken');
      });
      var checkLines = function () {
        var check = false;
        let lines = 0;
        for (var i = 0; i < 209; i += width) {
          var row = [
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
          if (
            row.every(function (index) {
              return squares[index].classList.contains('taken');
            })
          ) {
            lines += 1;
            row.forEach(function (index) {
              check = true;
              squares[index].classList.add('flashing');
              setTimeout(function () {
                squares[index].classList.remove('flashing');
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetris-piece');
              }, 600);
            });
            if (check) {
              clearLine_1(i);
            }
            lineClearSound.currentTime = 0;
            lineClearSound.play();
            score += 20 * level;
            if (lines > 1 && !newTopScore && !newTopLevel && !levelUpText) {
              switch (lines) {
                case 2:
                  document.getElementById('multi-lines').innerHTML = '2 LINES!';
                  setTimeout(() => {
                    document.getElementById('multi-lines').innerHTML = '';
                  }, 1000);
                  break;
                case 3:
                  document.getElementById('multi-lines').innerHTML = '3 LINES!';
                  setTimeout(() => {
                    document.getElementById('multi-lines').innerHTML = '';
                  }, 1000);
                  break;
                case 4:
                  document.getElementById('multi-lines').innerHTML = '4 LINES!';
                  setTimeout(() => {
                    document.getElementById('multi-lines').innerHTML = '';
                  }, 1000);
                  break;
              }
            }
            if (score > topScore) {
              if (!newTopScoreSet) {
                highScoreSound.currentTime = 0;
                highScoreSound.play();
                newTopScore = true;
                setTimeout(() => {
                  newTopScore = false;
                }, 1000);
                if (!newTopScoreSet) {
                  document.getElementById('multi-lines').innerHTML = '';

                  document.getElementById('new-top-score').innerHTML =
                    'New Top Score!';
                  setTimeout(() => {
                    document.getElementById('new-top-score').innerHTML = '';
                  }, 1000);
                  newTopScoreSet = true;
                }
              }
              topScore = score;
              localStorage.setItem('topScore', String(topScore));
            }
            //@ts-ignore
            document.getElementById('score').innerHTML = score;
            if (score >= levelUp) {
              speed -= 50;
              level += 1;

              if (level > topLevel) {
                if (!newTopLevelSet && !newTopScore) {
                  highScoreSound.currentTime = 0;
                  highScoreSound.play();
                  newTopLevel = true;
                  document.getElementById('new-top-level').innerHTML =
                    'New Top Level!';
                  setTimeout(() => {
                    document.getElementById('new-top-level').innerHTML = '';
                  }, 1000);
                  setTimeout(() => {
                    newTopLevel = false;
                  }, 1000);
                  newTopLevelSet = true;
                }
                topLevel = level;
                localStorage.setItem('topLevel', String(topLevel));
              }
              levelUp += level * levelSpeed;
              //@ts-ignore
              document.getElementById('level').innerHTML = level;
              //@ts-ignore
              if (!newTopScore && !newTopLevel) {
                levelUpSound.currentTime = 0;
                levelUpSound.play();
                levelUpText = true;
                document.getElementById('level-up').style.visibility =
                  'visible';
                document.getElementById('new-top-score').innerHTML = '';
              }
              document.getElementById('multi-lines').innerHTML = '';

              setTimeout(function () {
                levelUpText = false;

                //@ts-ignore
                document.getElementById('level-up').style.visibility = 'hidden';
              }, 1000);
              clearInterval(timerId);
              timerId = setInterval(moveDown, speed);
            }
          }
        }
      };
      var clearLine_1 = function (row) {
        setTimeout(() => {
          for (var j = row; j > 0; j--) {
            if (squares[j].classList.contains('taken')) {
              squares[j].classList.remove('taken');
              squares[j].classList.remove('tetris-piece');
              squares[j + width].classList.add('taken');
              squares[j + width].classList.add('tetris-piece');
            }
          }
        }, 900);
      };
      checkLines();
      newPiece();
    } else {
      current[m].forEach(function (index) {
        squares[currentPosition + index].classList.remove('tetris-piece');
      });
      currentPosition += width;
      draw();
    }
  }
};
var rotate = function () {
  if (gameOn) {
    let mPlus = m + 1;
    if (m === 3) {
      mPlus = 0;
    }
    if (
      (current[m].some((index) => {
        return (
          (currentPosition + index) % 10 === 9 ||
          (currentPosition + index) % 10 === 8
        );
      }) &&
        current[mPlus].some((index) => {
          return (currentPosition + index) % 10 === 0;
        })) ||
      (current[m].some((index) => {
        return (
          (currentPosition + index) % 10 === 0 ||
          (currentPosition + index) % 10 === 1
        );
      }) &&
        current[mPlus].some((index) => {
          return (currentPosition + index) % 10 === 9;
        }))
    ) {
      return;
    }
    if (
      current[mPlus].some((index) => {
        return squares[currentPosition + index].classList.contains('taken');
      })
    ) {
      return;
    }
    current[m].forEach(function (index) {
      squares[currentPosition + index].classList.remove('tetris-piece');
    });
    m++;
    if (m === current.length) {
      m = 0;
    }
    draw();
  }
};
addEventListener('keydown', function (e) {
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
addEventListener('click', function (e) {
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
    } else if (e.target.id === 'move-left') {
      moveLeft();
      //@ts-ignore
    } else if (e.target.id === 'move-right') {
      moveRight();
      //@ts-ignore
    } else if (e.target.id === 'rotate') {
      rotate();
      //@ts-ignore
    } else if (e.target.id === 'move-down') {
      moveDown();
    }
  }
});
if (gameOn) {
  draw();
}
for (var i = 4; i < 8; i++) {
  if (squares[i].classList.contains('taken')) {
    //@ts-ignore
    document.getElementById('new-top-score').innerHTML = '';
    document.getElementById('multi-lines').innerHTML = '';
    document.getElementById('game-over').style.visibility = 'visible';
  }
}
function assert(arg0) {
  throw new Error('Function not implemented.');
}
