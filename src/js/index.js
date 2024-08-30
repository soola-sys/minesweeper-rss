import { shuffle } from "../modules/shuffle.js";
import { createElement } from "../modules/insert-node.js";

const createHeaderMenu = (menuItems) => {
  let childrenLi = menuItems.map((item) =>
    createElement({
      tag: "li",
      classes: [item.class],
      children: [
        createLinkElement({
          href: item.href,
          text: item.text,
          classes: ["difficulty-list__link"],
        }),
      ],
    })
  );
  return createElement({
    tag: "ul",
    classes: ["header__difficulty", "difficulty-list"],
    children: [...childrenLi],
  });
};

const createLinkElement = (options) => {
  const { text = "", href = "#", classes = [], children = [] } = options;
  const element = createElement({
    tag: "a",
    text,
    classes,
    children,
  });
  element.setAttribute("href", href);
  return element;
};

const createHeaderImg = () => {
  const headerImg = createElement({ tag: "img" });
  headerImg.setAttribute("src", "./assets/saper.png");
  headerImg.setAttribute("alt", "Minesweeper Logo");
  return headerImg;
};

const menuItems = [
  { class: "difficulty-list__beginner", href: "#", text: "новичок" },
  { class: "difficulty-list__amateur", href: "#", text: "любитель" },
  { class: "difficulty-list__pro", href: "#", text: "профессионал" },
];
const headerInner = createElement({ tag: "div", classes: ["header__inner"] });
const header = createElement({
  tag: "header",
  classes: ["header"],
  children: [headerInner],
});
const logo = createElement({
  tag: "div",
  classes: ["header__logo"],
  children: [
    createLinkElement({
      href: "#",
      classes: ["header__logo-link"],
      children: [createHeaderImg()],
    }),
  ],
});
const btnTheme = createElement({
  tag: "button",
  classes: ["settings__theme"],
  text: "Dark",
});
const btnTest = createElement({
  tag: "button",
  classes: ["settings__sound"],
  text: "New game",
});
const timerContainer = createElement({
  tag: "div",
  classes: ["settings__timer-container"],
  text: "",
  children: [
    createElement({ text: "⏲️" }),
    createElement({ tag: "div", classes: ["timer"], text: "00:00" }),
  ],
});
const flagsContainer = createElement({
  tag: "div",
  classes: ["settings__flags-container"],
  text: "",
  children: [
    createElement({ text: "🚩" }),
    createElement({ tag: "div", classes: ["flags"], text: "0" }),
  ],
});
const divSettings = createElement({
  tag: "div",
  classes: ["header__settings", "settings"],
  children: [timerContainer, flagsContainer , btnTheme, btnTest],
});
const ulRes = createHeaderMenu(menuItems);
headerInner.appendChild(logo);
headerInner.appendChild(ulRes);
headerInner.appendChild(divSettings);
const gameDiv = createElement({ tag: "div", classes: ["game"] });
const main = createElement({
  tag: "main",
  classes: ["main"],
  children: [gameDiv],
});
const footer = createElement({ tag: "footer", classes: ["footer"] });
const wrapperEl = createElement({
  tag: "div",
  classes: ["wrapper"],
  children: [header, main, footer],
});

// Fill  2d matrix

const isValidPos = (i, j, n, m) => {
  if (i < 0 || j < 0 || i > n - 1 || j > m - 1) return 0;
  return 1;
};

const renderTheEndMessage = () => {
  const span = createElement({
    tag: "span",
    classes: ["end-game__message"],
  });
  const modal = createElement({
    tag: "div",
    classes: ["end-game"],
    text: "You have lost ,Try again",
    children: [
      createLinkElement({
        href: "#",
        classes: ["js-restart-game"],
        children: [span],
      }),
    ],
  });
  board.appendChild(modal);
};

function winCondition() {
  let cellOpened = Array.from(document.querySelectorAll(".cell"));
  let res = cellOpened.filter((el) => !el.classList.contains("cell-opened"));
  if (res.length === mineNumber) {
    clearInterval(timerId);
    setTimeout(() => {
      alert("You have won!");
    }, 500);
    cellOpened.forEach(endGameTouches);
  }
}

const checkAdjacent = (arr, i, j) => {
  let n = arr.length; // row 3
  let m = arr[0].length; // col 3
  let v = [];
  let counter = 0;

  if (isValidPos(i - 1, j - 1, n, m)) v.push(arr[i - 1][j - 1]); // 1 , 1
  if (isValidPos(i - 1, j, n, m)) v.push(arr[i - 1][j]); // 1 , 2
  if (isValidPos(i - 1, j + 1, n, m)) v.push(arr[i - 1][j + 1]); // 1, 3
  if (isValidPos(i, j - 1, n, m)) v.push(arr[i][j - 1]); // 2, 1
  if (isValidPos(i, j + 1, n, m)) v.push(arr[i][j + 1]); // 2, 2
  if (isValidPos(i + 1, j - 1, n, m)) v.push(arr[i + 1][j - 1]); // 2, 3
  if (isValidPos(i + 1, j, n, m)) v.push(arr[i + 1][j]);
  if (isValidPos(i + 1, j + 1, n, m)) v.push(arr[i + 1][j + 1]);

  v.forEach((el) => {
    if (el === "x") {
      counter++;
    }
  });
  return counter;
};

function checkMine(r, c) {
  let n = gameBoard.length;
  let m = gameBoard[0].length;
  if (r < 0 || c < 0 || r > n - 1 || c > m - 1) return;
  let curr = minesAndNumbers[r][c];
  if (curr !== "x" && curr !== 0) {
      if(gameBoard[r][c].classList.contains("cell-flagged")) {
        gameBoard[r][c].classList.remove("cell-flagged");
      }
      gameBoard[r][c].textContent = curr.toString();
      gameBoard[r][c].classList.add("number");
      gameBoard[r][c].classList.add("cell-opened");
      gameBoard[r][c].classList.add(`x${curr}`);
  }

  if (curr !== "x" && curr === 0) {
    if(gameBoard[r][c].classList.contains("cell-flagged")) {
      gameBoard[r][c].classList.remove("cell-flagged");
    }
    if (gameBoard[r][c].classList.contains("cell-opened")) {
      return;
    }
    gameBoard[r][c].classList.add("cell-opened");
    checkMine(r - 1, c - 1);
    checkMine(r - 1, c);
    checkMine(r - 1, c + 1);
    checkMine(r, c - 1);
    checkMine(r, c + 1);
    checkMine(r + 1, c - 1);
    checkMine(r + 1, c);
    checkMine(r + 1, c + 1);
  }
  if (curr === "x") {
    let AllCells = document.querySelectorAll('.cell');
    clearInterval(timerId);
    mineArr.forEach((el) => {
      if(!el.classList.contains("mined"))
       el.classList.add("mined");
      if(el.classList.contains("cell-flagged")) {
        el.classList.remove("cell-flagged");
        el.classList.add("game-over-flag");
      }
    });
    gameBoard[r][c].classList.add("game-over");
    setTimeout(() => {
      alert('you lost');
    }, 500);
    AllCells.forEach(endGameTouches);
    console.log("MineArr", mineArr);
  }
  gameBoard[r][c].removeEventListener("click", clickCell);
}

function initBoard(rowClicked, columnClicked) {
  for (let i = 0; i < mineNumber; i++) {
    let randomRow = Math.floor(Math.random() * 10);
    let randomCol = Math.floor(Math.random() * 10);
    if (
      minesAndNumbers[randomRow][randomCol] !== "x" &&
      !(randomRow === rowClicked && randomCol === columnClicked)
    ) {
      minesAndNumbers[randomRow][randomCol] = "x";
      mineArr.push(gameBoard[randomRow][randomCol]);
    } else {
      i--;
    }
  }
  for (let i = 0; i < minesAndNumbers.length; i++) {
    for (let j = 0; j < minesAndNumbers[i].length; j++) {
      if (minesAndNumbers[i][j] !== "x") {
        let res = checkAdjacent(minesAndNumbers, i, j);
        minesAndNumbers[i][j] = res;
      }
    }
  }
}

function endGameTouches(e) {
  e.removeEventListener("click", clickCell);
  e.removeEventListener("contextmenu" , rightClickCell);
  e.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
  e.style.opacity = '0.5';
  console.log('calling.....');
}   

function clickCell() {
  let tile = this;
  let r = parseInt(tile.dataset.row);
  let c = parseInt(tile.dataset.column);
  moves += 1;
  if (firstClick) {
    initBoard(r, c);
    timerId = setInterval(startDurationTimer, 1000);
    firstClick = false;
  }
  if(!gameBoard[r][c].classList.contains('cell-flagged')) {
    console.log(minesAndNumbers);
    checkMine(r, c);
    console.log("Mines board", minesAndNumbers);
    winCondition();
  }
}

function rightClickCell(evt) {
  evt.preventDefault();
    if(!evt.target.classList.contains('cell-flagged')) {
      if(!evt.target.classList.contains('cell-opened')) {
        evt.target.classList.add('cell-flagged');
        flagNumber -= 1;
        document.querySelector('.flags').textContent = `${flagNumber}`;
      }
    }
    else if(evt.target.classList.contains('cell-flagged')){
      evt.target.classList.remove('cell-flagged');
      flagNumber += 1;
      document.querySelector('.flags').textContent = `${flagNumber}`;
    }
}

let moves, firstClick, minesAndNumbers, gameBoard;
let mineArr, rowInit, colInit;
const mineNumber = 10;
let seconds = 0;
let timerId;
let flagNumber;

function startGame() {
  moves = 0;
  firstClick = true;
  minesAndNumbers = [];
  gameBoard = [];
  mineArr = [];
  rowInit = 10;
  colInit = 10;
  flagNumber = mineNumber;
  // Loop to initialize 2D array elements.
  for (let i = 0; i < rowInit; i++) {
    minesAndNumbers[i] = [];
    for (let j = 0; j < colInit; j++) {
      minesAndNumbers[i][j] = 0;
    }
  }
  minesAndNumbers.forEach((rowData, rowIndex) => {
    let gameRow = [];
    const row = createElement({ tag: "div", classes: ["row"] });
    rowData.forEach((columnData, colIndex) => {
      const cell = createElement({ tag: "div", classes: ["cell"] });
      if (rowInit === 15 && colInit === 15) {
        cell.classList.add("medium");
      }
      if (rowInit === 25 && colInit === 25) {
        cell.classList.add("hard");
      }
      cell.dataset.row = rowIndex;
      cell.dataset.column = colIndex;
      cell.addEventListener("click", clickCell);
      cell.addEventListener("contextmenu", rightClickCell);
      row.appendChild(cell);
      gameRow.push(cell);
    });
    gameDiv.appendChild(row);
    gameBoard.push(gameRow);
  });
}

function startDurationTimer() {
  seconds += 1;
  let minutes = Math.floor(seconds / 60);
  let formattedMinutes = String(minutes).padStart(2 , "0");
  let formattedSeconds = String(seconds % 60).padStart(2 , "0");
  document.querySelector('.timer').textContent = `${formattedMinutes}:${formattedSeconds}`;
}

startGame();
document.body.appendChild(wrapperEl);
document.querySelector('.flags').textContent = `${flagNumber}`;
btnTest.addEventListener("click", () => {
  gameDiv.style.pointerEvents = "auto";
  gameDiv.innerHTML = "";
  seconds = 0;
  flagNumber = mineNumber;
  document.querySelector('.flags').textContent = `${flagNumber}`;
  document.querySelector('.timer').textContent = '00:00';
  clearInterval(timerId);
  startGame();
});
