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

const header = createElement({ tag: "header", classes: ["header"] });
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
const btnSound = createElement({
  tag: "button",
  classes: ["settings__sound"],
  text: "Sound",
});
const divSettings = createElement({
  tag: "div",
  classes: ["header__settings", "settings"],
  children: [btnTheme, btnSound],
});
const ulRes = createHeaderMenu(menuItems);
header.appendChild(logo);
header.appendChild(ulRes);
header.appendChild(divSettings);

const main = createElement({ tag: "main", classes: ["main"], children: [] });
const board = createElement({
  tag: "div",
  classes: ["board"],
  children: [createElement({ tag: "div", classes: ["board__header"] })],
});
main.appendChild(board);
const footer = createElement({ tag: "footer", classes: ["footer"] });
const wrapperEl = createElement({
  tag: "div",
  classes: ["wrapper"],
  children: [header, main, footer],
});
const gameDiv = createElement({ tag: "div", classes: ["game"] });
// Fill  2d matrix

const isValidPos = (i, j, n, m) => {
  if (i < 0 || j < 0 || i > n - 1 || j > m - 1) return 0;
  return 1;
};

function checkMine(r , c , target) {
  let n = gameBoard.length; // row 3
  let m = gameBoard[0].length; // col 3
  if (r < 0 || c < 0 || r > n - 1 || c > m - 1) return;
  if(target.classList.contains('cell-opened')) {
    return;
  }
  target.classList.add('cell-opened');

  checkMine(i - 1, j - 1 , target);
  checkMine(i - 1, j , target);
  checkMine(i - 1, j + 1, target);
  checkMine(i, j - 1 , target);
  checkMine(i, j + 1,  target);
  checkMine(i + 1, j - 1, target);
  checkMine(i + 1, j, target);
  checkMine(i + 1, j + 1, target);
}

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

let gameBoard = [];
let resArr = [];
let mineArr = [];
let rowInit = 10;
let colInit = 10;

// Loop to initialize 2D array elements.
for (let i = 0; i < rowInit; i++) {
  gameBoard[i] = [];
  for (let j = 0; j < colInit; j++) {
    gameBoard[i][j] = 0;
  }
}
let nums = gameBoard.length; // row 3
let cols = gameBoard[0].length; // col 3
let mineNumber = 10;
for (let i = 0; i < mineNumber; i++) {
  let randomRow = Math.floor(Math.random() * nums);
  let randomCol = Math.floor(Math.random() * cols);
  if (gameBoard[randomRow][randomCol] === 0) {
    gameBoard[randomRow][randomCol] = "x";
  } else {
    i--;
  }
}
console.log("ADDED RANDOM BOMBS", gameBoard);

for (let i = 0; i < nums; i++) {
  resArr.push(Array(cols).fill(i));
}
for (let i = 0; i < gameBoard.length; i++) {
  for (let j = 0; j < gameBoard[i].length; j++) {
    if (gameBoard[i][j] !== "x") {
      let res = checkAdjacent(gameBoard, i, j);
      gameBoard[i][j] = res;
    }
  }
}
gameBoard.forEach((rowData, rowIndex) => {
  const row = createElement({ tag: "div", classes: ["row"]});
  rowData.forEach((columnData, colIndex) => {
  const  cell = createElement({ tag: "div", classes: ["cell"] , parentNode: row});
    if (rowInit === 15 && colInit === 15) {
      cell.classList.add("medium");
    }
    if (rowInit === 25 && colInit === 25) {
      cell.classList.add("hard");
    }
    if (columnData === "x") {
      mineArr.push(cell);
    }
    resArr[rowIndex][colIndex] = {
      isFlagged: false,
      isRevealed: false,
      isMine: columnData === "x" ? true : false,
      cellCoords: { row: rowIndex, col: colIndex },
    };
    cell.dataset.row = rowIndex;
    cell.dataset.column = colIndex;
  });
  gameDiv.appendChild(row);
});

board.appendChild(gameDiv);
document.body.appendChild(wrapperEl);
console.log("OBJECT", resArr);
document.addEventListener("click", (e) => {
  if (!e.target.closest(".cell")) return;
  e.target.classList.add("cell-opened");
  let row = e.target.dataset.row;
  let column = e.target.dataset.column;
  let cellState = resArr[row][column];
  let currentCell = gameBoard[row][column];
  if (cellState.isMine) {
    mineArr.forEach((el) => {
      el.classList.add("mined", "game-over");
      cellState.isRevealed = true;
    });
    setTimeout(() => {
      renderTheEndMessage();
    }, 500);
    board.style.pointerEvents = "none";
  }
  if (!cellState.isMine) {
    e.target.textContent = currentCell;
  }
  let cellOpened = Array.from(document.querySelectorAll(".cell"));
  let res = cellOpened.filter((el) => !el.classList.contains("cell-opened"));
  if (res.length === mineNumber) {
    setTimeout(() => {
      // renderTheEndMessage();
      alert("You have won!");
    }, 500);
  }
  if (!cellState.isMine && currentCell === 0) {
    // checkMine(row , column , e.target);
    console.log(gameDiv[row][column])
  }
});
