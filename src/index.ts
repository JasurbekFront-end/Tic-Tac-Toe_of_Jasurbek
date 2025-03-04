import { buttonDiv, cubes, wrapper } from './elements';

let scoreArray = ['100', '100', '100', '100', '100', '100', '100', '100', '100'];
let mainArray: Array<Array<string>> = [];
const winningPatterns = [
  [0, 1, 2], // Horizontal rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Vertical columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonal
  [2, 4, 6]
];
const turnsArray: Array<number> = [];

let oScores: Array<Number> = [];
let xScores: Array<Number> = [];
let turn: number = 0;
let gameOver = false;
let stepBtn = 0;
let isStepped = false;
let pressedBtn = 0;

function setArrayVal(id: number) {
  if (gameOver || scoreArray[id] !== '100') return;
  stepBtn++;
  if (turn % 2 === 0) {
    scoreArray[id] = 'x';
    xScores.push(id);
  } else {
    scoreArray[id] = 'o';
    oScores.push(id);
  }
  turn++;
  mainArray.push([...scoreArray]);
  turnsArray.push(turn);
  checkWinner();
}

function checkWinner() {
  for (const pattern of winningPatterns) {
    if (pattern.every(pos => xScores.includes(pos))) {
      wrapper.classList.add('opacity-50');
      setTimeout(() => {
        alert('Winner is X');
        gameOver = true;
        return;
      }, 500);
    }
    if (pattern.every(pos => oScores.includes(pos))) {
      wrapper.classList.add('opacity-50');
      setTimeout(() => {
        alert('Winner is O');
        gameOver = true;
        return;
      }, 500);
    }
  }

  if (xScores.length + oScores.length === 9) {
    setTimeout(() => {
      console.log("It's a Draw!");
      gameOver = true;
    }, 500);
  }
}
function draw(mainArray: Array<string>) {
  cubes.forEach(cube => {
    cube.innerHTML = '';
  });
  mainArray.forEach((item, idx) => {
    cubes.forEach(cube => {
      if (item !== '100' && Number(cube.id) === idx) {
        let xElm = document.createElement('div');
        xElm.className = 'text-blue-500 text-[80px]';
        xElm.textContent = item;
        let oElm = document.createElement('div');
        oElm.className = 'text-white text-[80px]';
        oElm.textContent = item;
        item === 'x' ? cube.appendChild(xElm) : cube.appendChild(oElm);
      }
    });
  });
}
function saveHistory(step: number) {
  buttonDiv.innerHTML = "<button class='bg-gray-500 px-3 py-2 text-[20px] text-white' id='clear'>Clear History</button>";
  for (let i = 1; i <= step; i++) {
    let btn = document.createElement('button');
    btn.className = 'bg-gray-500 px-3 py-2 text-[20px] text-white';
    btn.id = `${i}`;
    btn.textContent = `Step-${String(i)}`;
    buttonDiv.appendChild(btn);
  }
  let buttons = buttonDiv.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
  buttons.forEach(btn => {
    btn.onclick = () => {
      isStepped = true;
      if (btn.id === 'clear') {
        xScores.splice(0);
        oScores.splice(0);
        turnsArray.splice(0);
        scoreArray = ['100', '100', '100', '100', '100', '100', '100', '100', '100'];
        mainArray.splice(0);
        mainArray.push(scoreArray);
        buttonDiv.innerHTML = "<button class='bg-gray-500 px-3 py-2 text-[20px] text-white' id='clear'>Clear History</button>";
        isStepped = false;
        turn = 0;
        stepBtn=0
        draw(mainArray[0]);
      } else {
        draw(mainArray[Number(btn.id) - 1]);
        pressedBtn = Number(btn.id);
      }
      return btn.id;
    };
  });
}

cubes.forEach(cube => {
  cube.onclick = (e: MouseEvent) => {
    let target = e.target as HTMLElement;
    let id: string | null = target.id;
    if (isStepped) {
      mainArray.splice(pressedBtn);
      scoreArray = [...mainArray[mainArray.length - 1]];
      console.log(pressedBtn);
      turn % 2 === 0 ? xScores.splice(pressedBtn / 2) : xScores.splice(Math.ceil(pressedBtn / 2));
      turn % 2 === 0 ? oScores.splice(pressedBtn / 2) : oScores.splice(Math.floor(pressedBtn / 2));
      isStepped = false;
      turn = turnsArray[pressedBtn - 1];
      stepBtn = pressedBtn;
    }
    setArrayVal(Number(id));
    saveHistory(stepBtn);  
    draw(mainArray[mainArray.length - 1]);
  };
});
