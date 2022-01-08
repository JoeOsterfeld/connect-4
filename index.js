
let numRows = 0;
let numColumns = 0;
let playerTurn = 2;
let state = [];

function setViewState() {
  const firstChild = gameEl().firstChild;
  if (firstChild) {
    gameEl().removeChild(firstChild);
  }

  const game = document.createElement('div');
  game.id = 'game-container';
  updateInstructions(game);
  for (let rowNum = 0; rowNum < state.length; rowNum++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let column = 0; column < state[rowNum].length; column++) {
      const cell = document.createElement('div');
      cell.className = `cell player-${state[rowNum][column]}`;
      cell.setAttribute('data-row', rowNum);
      cell.setAttribute('data-column', column);
      cell.onclick = onMove;
      row.appendChild(cell);
    }
    game.appendChild(row);
  }
  gameEl().appendChild(game);
}

function startGame() {
  const rowsColsStr = prompt('Please enter a string in of comma separated integers in the format "rows, columns".');
  if (rowsColsStr) {
    const rowsCols = rowsColsStr.split(',').map(n => Number(n));
    if (rowsCols.length === 2 && rowsCols.every(num => !isNaN(num))) {
      // Assemble array
      const grid = [];
      const [rows, columns] = rowsCols;
      for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let x = 0; x < columns; x++) {
          grid[i].push(0);
        }
      }
      state = grid;
      setViewState(state);
    } else {
      // set error state
      const invalidDiv = document.createElement('div');
      invalidDiv.id = 'invalid-input';
      invalidDiv.innerText = 'Invalid rows/columns input. Please click restart and enter a valid value.'
      gameEl().appendChild(invalidDiv);
    }
  }
}

function setWinnerViewState() {
  const game = gameEl();
  document.getElementById('instructions').remove();
  document.getElementById('player-move').remove();
  document.getElementById('game-container').remove();
  const winEl = document.createElement('h2');
  winEl.className = 'winner';
  winEl.innerText = `Player ${playerTurn === 1 ? 2 : 1} wins!!!`;
  game.prepend(winEl);
}

function getWinner() {
  let winner = 0;
  for (let rowNum = state.length - 1; rowNum > -1; rowNum--) {
    const row = state[rowNum];
    for (let colNum = 0; colNum < row.length; colNum++) {
      // Check surrounding for consecutive
      const cellValue = row[colNum];
      if (cellValue === 0) {
        continue;
      }
      let horizStart = colNum;
      while (row[horizStart - 1] === row[horizStart]) horizStart--;
      const inARowHoriz = row.slice(horizStart).filter((cellNum, index, arr) => index === 0 || cellNum === row[horizStart]);
      if (inARowHoriz.length === 4) {
        return cellValue;
      }
      let verticalStart = rowNum;
      let verticalInARow = 1;
      while (verticalStart > -1 && state[verticalStart - 1] && state[verticalStart - 1][colNum] === cellValue) {
        verticalStart--;
        verticalInARow++;
      };
      if (verticalInARow > 3) {
        return cellValue;
      }

      // Check Diagonal forward
      const diagForwardStart = [rowNum, colNum];
      let diagForwardInARow = 1;
      while (
        diagForwardStart[0] > -1 && diagForwardStart[1] < row.length &&
        state[diagForwardStart[0] - 1][diagForwardStart[1] + 1] === cellValue
      ) {
        diagForwardStart[0]--;
        diagForwardStart[1]++;
        diagForwardInARow++;
      }
      if (diagForwardInARow > 3) {
        return cellValue;
      }

      // Check diagonal backward
      const diagBackward = [rowNum, colNum];
      let diagBackInARow = 1;
      while (
        diagBackward[0] > -1 && diagBackward[1] < row.length &&
        state[diagBackward[0] - 1][diagBackward[1] - 1] === cellValue
      ) {
        diagBackward[0]--;
        diagBackward[1]++;
        diagBackInARow++;
      }
      if (diagBackInARow > 3) {
        return cellValue;
      }
    }
  }
  return winner;
}

function onMove(clickEvent) {
  const cell = clickEvent.target;
  const column = Number(cell.getAttribute('data-column'));
  for (let rowNum = 0; rowNum < state.length; rowNum++) {
    if (!state[rowNum + 1] || state[rowNum + 1][column] !== 0) {
      state[rowNum][column] = playerTurn;
      break;
    }
  }
  setViewState();
  const winner = getWinner();
  if (winner > 0) {
    setWinnerViewState();
  }
}

function gameEl() {
  return document.getElementById('game');
}

function updateInstructions(gameContainer) {
  playerTurn = playerTurn === 1 ? 2 : 1;
  const playerMoveEl = document.createElement('h3');
  playerMoveEl.innerText = `Player ${playerTurn}'s move!`;
  playerMoveEl.id = 'player-move';
  gameContainer.appendChild(playerMoveEl);
  const instEl = document.createElement('p');
  instEl.id = 'instructions';
  instEl.innerText = 'Click inside any column to drop your piece into the column';
  gameContainer.appendChild(instEl);
  [1,2].forEach(num => {
    const cell = document.createElement('div');
    cell.className = `cell example player-${num}`;
    cell.innerText = `Player ${num} color`
    gameContainer.appendChild(cell);
  });
}

startGame();

document.getElementById('restart').onclick = () => {
  startGame();
}

