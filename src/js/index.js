import {shuffle} from '../modules/shuffle.js';
import {createElement} from "../modules/insert-node.js";

const createHeaderMenu = (menuItems) => {
  let childrenLi = menuItems.map((item) => 
    createElement(
      {
        tag: "li",
        classes: [item.class],
        children: [createLinkElement({href: item.href , text: item.text , classes: ["difficulty-list__link"]})]
      },
    )
    )
  return createElement
  (
    {
      tag: 'ul',
      classes: ["header__difficulty" , "difficulty-list"],
      children: [...childrenLi]
    },
  )
}

const createLinkElement = (options) => {
  const { text="" , href= "#" , classes = [] , children = []} = options;
  const element = createElement({
    tag: "a",
    text,
    classes,
    children
  });
  element.setAttribute("href", href);
  return element;
}

const createHeaderImg = () => {
  const headerImg = createElement({tag: 'img'});
  headerImg.setAttribute("src" , "./assets/saper.png");
  headerImg.setAttribute("alt" , "Minesweeper Logo");
  return headerImg;
}

const menuItems = [
  { class: "difficulty-list__beginner", href: "#" , text: 'новичок'},
  { class: "difficulty-list__amateur", href: "#",  text: 'любитель' },
  { class: "difficulty-list__pro", href: "#", text: 'профессионал' },
];

const header = createElement({tag: 'header' , classes: ['header']});
const logo = createElement({tag:'div' , classes: ['header__logo'], 
children: [createLinkElement({href: "#" , classes: ["header__logo-link"] , children:[createHeaderImg()]})]});
const btnTheme = createElement({tag: 'button' , classes: ["settings__theme"] , text: "Dark"});
const btnSound = createElement({tag: 'button' , classes: ["settings__sound"] , text: "Sound"});
const divSettings = createElement({tag: 'div' , classes: ["header__settings" , "settings"] , children: [btnTheme , btnSound]});
const ulRes = createHeaderMenu(menuItems);
header.appendChild(logo);
header.appendChild(ulRes);
header.appendChild(divSettings);


const main = createElement({tag: 'main' , classes: ['main'],  children: []});
const board = createElement({tag: 'div' , classes: ["board"], 
children: [createElement({tag: 'div' , classes: ['board__header']})]});
main.appendChild(board);
const footer = createElement({tag: 'footer' , classes: ['footer']});
const wrapperEl = createElement({tag: 'div' , classes: ['wrapper'],  children: [header , main , footer]});

// Fill  2d matrix 

const isValidPos = (i, j, n, m) => {
  if (i < 0 || j < 0 || i > n - 1 || j > m - 1) return 0;
  return 1;
}

const checkAdjacent = (arr, i, j) => {
  let n = arr.length; // row 3
  let m = arr[0].length; // col 3
  let v = [];
  let counter = 0;

  if (isValidPos(i - 1, j - 1, n, m)) v.push(arr[i - 1][j - 1]);
  if (isValidPos(i - 1, j, n, m)) v.push(arr[i - 1][j]);
  if (isValidPos(i - 1, j + 1, n, m)) v.push(arr[i - 1][j + 1]);
  if (isValidPos(i, j - 1, n, m)) v.push(arr[i][j - 1]);
  if (isValidPos(i, j + 1, n, m)) v.push(arr[i][j + 1]);
  if (isValidPos(i + 1, j - 1, n, m)) v.push(arr[i + 1][j - 1]);
  if (isValidPos(i + 1, j, n, m)) v.push(arr[i + 1][j]);
  if (isValidPos(i + 1, j + 1, n, m)) v.push(arr[i + 1][j + 1]);

  v.forEach((el) => {
    if (el === 'x') {
      counter++;
    }
  });
  return counter;
}

let gameBoard = [];
let resArr = [];
let row = 10;
let col = 10;
let h = 0
 
// Loop to initialize 2D array elements.
for (let i = 0; i < row; i++) {
  gameBoard[i] = [];
    for (let j = 0; j < col; j++) {
      gameBoard[i][j] = 0;
    }
}

let nums = gameBoard.length; // row 3
let cols = gameBoard[0].length; // col 3

for (let i = 0; i < 10; i++) {
  let randomRow = Math.floor(Math.random() * nums);
  let randomCol = Math.floor(Math.random() * cols);
  if (gameBoard[randomRow][randomCol] === 0) {
    gameBoard[randomRow][randomCol] = 'x';
  } else {
    i--;
}
}
console.log("ADDED RANDOM BOMBS" , gameBoard);


for (let i = 0; i < nums; i++) {
  resArr.push(Array(cols).fill(i));
}

for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[i].length; j++) {
      if(gameBoard[i][j] !== 'x'){
        let res = checkAdjacent(gameBoard, i, j);
        gameBoard[i][j] = res;
      }
    }
}
console.log("FINAL MATRIX" , gameBoard);




document.body.appendChild(wrapperEl);

