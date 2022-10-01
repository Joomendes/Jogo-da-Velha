const viewController = (view) => {
  const gameBoard = document.querySelector("#game-board");
  switch (view) {
    case "mainGame":
      game.reset();
      newGameMenu.style.display = "none";
      gameBoard.style.display = "block";
      gameBoard.style.opacity = "1.0";
      modal.style.display = "none";
      resetModal.style.display = "none";
      break;
    case "newGame":
      newGameMenu.style.display = "block";
      gameBoard.style.display = "none";
      modal.style.display = "none";
      resetModal.style.display = "none";
      break;
    case "modal-open":
      setTimeout(() => {
        generateModal();
        modal.style.display = "block";
        gameBoard.style.opacity = "0.5";
      }, 1100);

      break;
    case "modal-close":
      modal.style.display = "none";
      gameBoard.style.opacity = "1.0";

      break;
    case "reset-modal-open":
      resetModal.style.display = "block";
      gameBoard.style.opacity = "0.5";

      break;
    case "reset-modal-close":
      resetModal.style.display = "none";
      gameBoard.style.opacity = "1.0";

      break;
  }
};

const game = {
  p1Mark: "o",
  p2Mark: "x",
  isHumanOpponent: null,
  isComputerMoving: null,
  turn: "x",
  board: [],
  roundWinner: null,
  winningSquares: [],
  xWinsCount: 0,
  tiesCount: 0,
  oWinsCount: 0,
  roundCount: 1,
  determineInitialTurn() {
    const turnIndicator = document.querySelector(".whos-turn img");
    if (this.roundCount % 2 !== 0) {
      this.turn = "x";
      turnIndicator.src = "./assets/icon-x-silver.png";
    } else {
      this.turn = "o";
      turnIndicator.src = "./assets/icon-o-silver.png";
    }

    if (this.p1Mark !== this.turn && !this.isHumanOpponent) {
      this.aiMove();
    }
  },

  aiMove() {
    this.isComputerMoving = true;
    setTimeout(() => {
      if (!this.roundWinner) {
        let numOne;
        let numTwo;
        do {
          numOne = Math.floor(Math.random() * 3);
          numTwo = Math.floor(Math.random() * 3);
        } while (
          !cellClickHandler(
            document.getElementById(`${numOne},${numTwo}`),
            true
          )
        );
        this.isComputerMoving = false;
      }
    }, 600);
  },
  toggleTurn() {
    if (this.turn === "x") {
      this.turn = "o";
      if (this.turn !== this.p1Mark && !this.isHumanOpponent) {
        this.aiMove();
      }
    } else {
      this.turn = "x";
      if (this.turn !== this.p1Mark && !this.isHumanOpponent) {
        this.aiMove();
      }
    }
  },

  reset() {
    this.isComputerMoving = false;
    this.determineInitialTurn();
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.winningSquares = [];
    this.roundWinner = null;

    clearBoardHTML();
  },
  quitGame() {
    this.reset();
    this.isHumanOpponent = null;
    this.isComputerMoving = null;
    this.xWinsCount = 0;
    this.oWinsCount = 0;
    this.tiesCount = 0;
    this.roundCount = 1;
    updateScoreHTML();
  },
  resetRound() {
    clearBoardHTML();
    this.determineInitialTurn();
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  },
};

newGameMenu = document.getElementById("new-game-menu");
gameBoard = document.getElementById("game-board");
modal = document.getElementById("modal");
resetModal = document.getElementById("reset-modal");

viewController("newGame");

const toggleSelection = (el) => {
  const letter = el.id;
  const o = document.querySelector("#o");
  const x = document.querySelector("#x");
  const oImg = document.querySelector("#o img");
  const xImg = document.querySelector("#x img");

  if (el.id === "x") {
    o.classList.remove("menu-selected-character");
    x.classList.add("menu-selected-character");

    game.p1Mark = "x";
    game.p2Mark = "o";

    xImg.src = xImg.src.replace("silver", "dark-navy");
    oImg.src = oImg.src.replace("dark-navy", "silver");
  }
  if (el.id === "o") {
    x.classList.remove("menu-selected-character");
    o.classList.add("menu-selected-character");

    game.p1Mark = "o";
    game.p2Mark = "x";

    xImg.src = xImg.src.replace("dark-navy", "silver");
    oImg.src = oImg.src.replace("silver", "dark-navy");
  }
};

const toggleHumanOrAI = (el) => {
  el.id === "human"
    ? (game.isHumanOpponent = true)
    : (game.isHumanOpponent = false);

  const whoIsX = document.getElementById("who-is-x");
  const whoIsO = document.getElementById("who-is-o");
  const turnIndicator = document.querySelector(".whos-turn img");

  if (game.turn === "o") {
    turnIndicator.src = "./assets/icon-o-silver.png";
  }

  if (game.isHumanOpponent) {
    if (game.p1Mark === "x") {
      whoIsX.innerText = "J1";
      whoIsO.innerText = "J2";
    } else {
      whoIsX.innerText = "J2";
      whoIsO.innerText = "J1";
    }
  } else {
    if (game.p1Mark === "x") {
      whoIsX.innerText = "VOCÊ";
      whoIsO.innerText = "CPU";
    } else {
      whoIsX.innerText = "CPU";
      whoIsO.innerText = "VOCÊ";
    }
  }

  viewController("mainGame");
};

function clearBoardHTML() {
  for (i = 0; i <= 2; i++) {
    for (j = 0; j <= 2; j++) {
      const cell = document.getElementById(`${i},${j}`);
      cell.innerHTML = "";
      cell.style.backgroundColor = "#1f3641";
      cell.style.boxShadow = "inset 0px -8px 0px #10212a";
    }
  }
}

function updateScoreHTML() {
  xTotal = document.querySelector("#x-score p");
  ties = document.querySelector("#ties p");
  oTotal = document.querySelector("#o-score p");

  xTotal.innerText = game.xWinsCount;
  ties.innerText = game.tiesCount;
  oTotal.innerText = game.oWinsCount;
}

function determineWinOrTie() {
  let isWinner = false;
  let nullCount = 0;
  for (y = 0; y <= 2; y++) {
    let horizXCount = 0;
    let horizOCount = 0;
    let vertXCount = 0;
    let vertOCount = 0;

    for (x = 0; x <= 2; x++) {
      if (game.board[x][y]) {
        game.board[x][y] === "x" ? horizXCount++ : horizOCount++;
      } else {
        nullCount++;
      }
      if (game.board[y][x]) {
        game.board[y][x] === "x" ? vertXCount++ : vertOCount++;
      } else {
        nullCount++;
      }
      if (horizXCount === 3) {
        isWinner = true;
        game.roundWinner = "x";
        game.xWinsCount++;
        game.roundCount++;
        for (m = 0; m <= 2; m++) {
          game.winningSquares.push(`${x - m},${y}`);
        }
      }
      if (horizOCount === 3) {
        isWinner = true;
        game.roundWinner = "o";
        game.oWinsCount++;
        game.roundCount++;
        for (m = 0; m <= 2; m++) {
          game.winningSquares.push(`${x - m},${y}`);
        }
      }
      if (vertXCount === 3) {
        isWinner = true;
        game.roundWinner = "x";
        game.xWinsCount++;
        game.roundCount++;
        for (m = 0; m <= 2; m++) {
          game.winningSquares.push(`${y},${x - m}`);
        }
      }
      if (vertOCount === 3) {
        isWinner = true;
        game.oWinsCount++;
        game.roundCount++;
        game.roundWinner = "o";
        for (m = 0; m <= 2; m++) {
          game.winningSquares.push(`${y},${x - m}`);
        }
      }
    }
  }

  if (game.board[1][1]) {
    if (
      game.board[0][0] === game.board[1][1] &&
      game.board[1][1] === game.board[2][2]
    ) {
      game.winningSquares.push("0,0", "1,1", "2,2");
      game.roundWinner = game.board[1][1];
      if (game.board[1][1] === "x") {
        game.roundWinner = "x";
        game.xWinsCount++;
        game.roundCount++;
        isWinner = true;
      } else {
        game.roundWinner = "o";
        game.oWinsCount++;
        game.roundCount++;
        isWinner = true;
      }
    }

    if (
      game.board[0][2] === game.board[1][1] &&
      game.board[1][1] === game.board[2][0]
    ) {
      game.winningSquares.push("0,2", "1,1", "2,0");
      game.roundWinner = game.board[1][1];
      if (game.board[1][1] === "x") {
        game.roundWinner = "x";
        game.xWinsCount++;
        game.roundCount++;
        isWinner = true;
      } else {
        game.roundWinner = "o";
        game.oWinsCount++;
        game.roundCount++;
        isWinner = true;
      }
    }
  }

  if (nullCount === 0 && isWinner === false) {
    game.roundWinner = "tie";
    game.tiesCount++;
    game.roundCount++;
  }
  if (game.roundWinner && game.roundWinner !== "tie") {
    game.winningSquares.forEach((square) => {
      el = document.getElementById(square);
      if (game.roundWinner === "x") {
        el.innerHTML =
          "<img src='./assets/icon-x-dark-navy.png' alt='x winning square' />";
        el.style.backgroundColor = "#65e9e4";
        el.style.boxShadow = "inset 0px -8px 0px #31c3bd";
        viewController("modal-open");
      } else {
        el.innerHTML =
          "<img src='./assets/icon-o-dark-navy.png' alt='o winning square' />";
        el.style.backgroundColor = "#ffc860";
        el.style.boxShadow = "inset 0px -8px 0px #f2b137";
        viewController("modal-open");
      }
    });
  }
  if (game.roundWinner === "tie") {
    viewController("modal-open");
  }

  updateScoreHTML();
}

function cellClickHandler(el, isAICaller) {
  if (isAICaller || !game.isComputerMoving) {
    const turnIndicator = document.querySelector(".whos-turn img");
    const xCoord = el.id.charAt(0);
    const yCoord = el.id.charAt(2);

    if (!game.board[xCoord][yCoord] && !game.roundWinner) {
      if (game.turn === "x") {
        el.innerHTML = "<img src='./assets/icon-x.png' alt='x' />";

        game.toggleTurn();
        game.board[xCoord][yCoord] = "x";

        turnIndicator.src = turnIndicator.src.replace(
          "icon-x-silver.png",
          "icon-o-silver.png"
        );
      } else {
        el.innerHTML = "<img src='./assets/icon-o.png' alt='o' />";
        game.toggleTurn();
        game.board[xCoord][yCoord] = "o";

        turnIndicator.src = turnIndicator.src.replace(
          "icon-o-silver.png",
          "icon-x-silver.png"
        );
      }
      determineWinOrTie();

      return true;
    }
  }

  return false;
}

function cellHoverEffect(el) {
  const xCoord = Number(el.id.slice(0, 1));
  const yCoord = Number(el.id.slice(2, 3));

  if (
    game.board[xCoord][yCoord] === null &&
    !game.roundWinner &&
    !game.isComputerMoving
  ) {
    if (game.turn === "o") {
      el.innerHTML = `<img src='./assets/icon-o-outline.png' alt='o' />`;
    } else {
      el.innerHTML = `<img src='./assets/icon-x-outline.png' alt='x'/>`;
    }
    el.style.cursor = "pointer";
  }
}

function cellMouseLeave(el) {
  const xCoord = el.id.slice(0, 1);
  const yCoord = el.id.slice(2, 3);

  if (game.board[xCoord][yCoord] === null) {
    el.innerHTML = "";
    el.style.cursor = "default";
  }
}

function generateModal() {
  const modalMessage = document.querySelector("#modal .message");
  const gameResult = document.getElementById("winner");
  const image = document.querySelector("#modal img");
  image.style.display = "block";

  gameResult.classList.remove(...gameResult.classList);

  if (game.roundWinner === "tie") {
    modalMessage.innerHTML = "";
    gameResult.innerHTML = "ROUND TIED";
    gameResult.classList.add("tied");
    image.style.display = "none";
  } else {
    gameResult.innerHTML = "VENCEU A RODADA";
    gameResult.classList.add(`${game.roundWinner}-winner`);
    image.src = `./assets/icon-${game.roundWinner}.png`;
    if (!game.isHumanOpponent) {
      if (game.p1Mark === game.roundWinner) {
        modalMessage.innerHTML = "JOGADOR 1 VENCEU!";
      } else {
        modalMessage.innerHTML = "VOCÊ PERDEU..";
      }
    } else {
      if (game.p1Mark === game.roundWinner) {
        modalMessage.innerHTML = "JOGADOR 1 VENCEU!";
      } else {
        modalMessage.innerHTML = "JOGADOR 2 VENCEU!";
      }
    }
  }
}

function nextRound() {
  viewController("mainGame");
}

function quit() {
  game.quitGame();
  viewController("newGame");
}

function restartModalOpen() {
  if (!game.roundWinner) {
    viewController("reset-modal-open");
  }
}

function restartRound() {
  if (!game.roundWinner) game.resetRound();
  viewController("reset-modal-close");
}

function restartRoundCancel() {
  viewController("reset-modal-close");
}
