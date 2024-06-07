
const game = (function initializeGame() {
  winner = null;
  
  const gameBoard = [];
  
  function makeBoard(boardSize = 3) {
    this.gameBoard = [];
    for (let i = 0; i < boardSize; i++) {
      this.gameBoard.push([]);
      for (let j = 0; j < boardSize; j++) {
        this.gameBoard[i].push(null);
      }
    }
  }
  
  const players = [];
  
  function createPlayer(name, symbol, color) {
    // Also setup player order maybe
    if (players.length >= 8) {
      return;
    }
    
    const score = 0;
    const player = {name, symbol, color, score};
    players.push(player);
  }
  
  function deletePlayer(index) {
    players.splice(index, 1);
  }
  
  function startGame() {
    winner = null;
    // Set first player
    this.currentPlayer = players[0];
    
    // Begin listening for input
    // game.classList.remove('disabled');
    this.on = true;
  }
  
  function makeTurn(row, column, currentPlayer) {
    const symbol = currentPlayer.symbol;    
    
    this.gameBoard[row][column] = symbol;

    
    console.table(this.gameBoard);
    
    // Check for victory and tie
    if (this.checkEndOfGame() === 'WIN') {
      // The last player to make a turn created a winning position
      winner = currentPlayer;
      this.players[players.indexOf(winner)].score++;
      this.announceWinner();
      this.resetBoard();
      this.on = false;
    }
    
    // Change to next player
    this.currentPlayer = players[(players.indexOf(currentPlayer) + 1) % players.length]
  }
  
  function resetBoard() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard.length; j++) {
        this.gameBoard[i][j] = null;
      }
    }
  }
  
  function checkEndOfGame() {
    const board = this.gameBoard;
    
    if (
      board[0][0] !== null && board[0][0] === board[0][1] && board[0][1] === board[0][2] || 
      board[1][0] !== null && board[1][0] === board[1][1] && board[1][1] === board[1][2] || 
      board[2][0] !== null && board[2][0] === board[2][1] && board[2][1] === board[2][2] || 
      
      board[0][0] !== null && board[0][0] === board[1][0] && board[1][0] === board[2][0] || 
      board[0][1] !== null && board[0][1] === board[1][1] && board[1][1] === board[2][1] || 
      board[0][2] !== null && board[0][2] === board[1][2] && board[1][2] === board[2][2] || 
      
      board[0][0] !== null && board[0][0] === board[1][1] && board[1][1] === board[2][2] || 
      board[2][0] !== null && board[2][0] === board[1][1] && board[1][1] === board[0][2]
    ) {
      return 'WIN';
    }
    
    let isTie = true;
    for (const row of board) {
      for (const cell of row) {
        if (cell == null) {
          isTie = false;
        }
      }
    }
    
    if (isTie) {
      return 'TIE';
    }
  }
  
  function announceWinner() {
    console.log(`The winner is ${winner.name}!`)
  }
  
  // current player, gameBoard, makeTurn, checkVictory
  return {gameBoard, makeBoard, players, createPlayer, deletePlayer, startGame, makeTurn, checkEndOfGame, announceWinner, resetBoard};
})();

const renderer = (function initializeRenderer() {
  function renderBoard(gameBoard) {
    const boardElement = document.querySelector('#game');
    while (boardElement.firstChild) {
      boardElement.removeChild(boardElement.lastChild);
    }

    boardElement.style.gridTemplateColumns = `repeat(${gameBoard.length}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${gameBoard.length}, 1fr)`;

    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard.length; j++) {
        let cell = document.createElement('div');
        cell.classList.add('cell');
        cell.row = i;
        cell.column = j;

        cell.addEventListener('click', (e) => {
          game.makeTurn(e.target.row, e.target.column, game.currentPlayer);
          renderer.renderTurn(e.target, game.currentPlayer)
        })

        boardElement.appendChild(cell);
      }
    }
  }

  function renderTurn(clickedCell, currentPlayer) {
    clickedCell.textContent = currentPlayer.symbol;
    clickedCell.style.color = currentPlayer.color;
  }

  return {renderBoard, renderTurn};
})();

(function setupEventListeners() {
  const startGameButton = document.querySelector('#start-game');
  const gridSizeInput = document.querySelector('#grid-size');
  
  startGameButton.addEventListener('click', (e) => {
    const gridSize = gridSizeInput.value;
    if (gridSize === '') {
      game.makeBoard();
    } else {
      game.makeBoard(gridSize);
    }
    renderer.renderBoard(game.gameBoard);
    gridSizeInput.disabled = true;
  });
  
  
})();


game.makeBoard();
renderer.renderBoard(game.gameBoard);
game.createPlayer('bob', 'Ш', 'black');
game.createPlayer('joe', 'B', 'red');
game.startGame();

