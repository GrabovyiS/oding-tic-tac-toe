
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
  
  let playerIdCounter = 0;
  const players = [];
  
  function createPlayer(name, symbol, color) {
    // Also setup player order maybe
    if (players.length >= 8) {
      return;
    }
    
    const score = 0;
    const player = {id: playerIdCounter, name, symbol, color, score};
    playerIdCounter++;
    players.push(player);
  }
  
  function deletePlayer(index) {
    players.splice(index, 1);
  }
  
  function startGame() {
    winner = null;
    this.endOfGame = null;
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
    
    const endOfGame = this.checkEndOfGame();
    
    if (endOfGame === 'WIN') {
      winner = currentPlayer;
      this.currentPlayer.score++;
    }

    if (this.endOfGame) {
      // this.resetBoard();
      this.on = false;
      return;
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
  
  function getWinner() {
    return winner;
  }
  
  // current player, gameBoard, makeTurn, checkVictory
  return {gameBoard, makeBoard, players, createPlayer, deletePlayer, startGame, makeTurn, checkEndOfGame, getWinner, resetBoard};
})();

const renderer = (function initializeRenderer() {
  const gameStatus = document.querySelector('#game-status');
  const playerCardsContainer = document.querySelector('.player-cards');
  const managePlayersCardsContainer = document.querySelector('section.manage-player-cards');

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
          if (clickedCellTaken(e.target.row, e.target.column)) {
            return;
          } 

          playerMadeTurn = game.currentPlayer;
          game.makeTurn(e.target.row, e.target.column, game.currentPlayer);
          renderer.renderTurn(e.target, playerMadeTurn, game.currentPlayer);
        })

        boardElement.appendChild(cell);
      }
    }
  }

  function clickedCellTaken(row, column) {
    if (game.gameBoard[row][column] === null) {
      return false;
    }

    return true;
  }

  function renderFirstStatus(firstPlayer) {
    gameStatus.textContent = `${firstPlayer.name}'s turn`;
  }

  function renderTurn(clickedCell, currentPlayer, nextPlayer) {
    clickedCell.textContent = currentPlayer.symbol;
    clickedCell.style.color = currentPlayer.color;

    endOfGame = game.checkEndOfGame();

    if (endOfGame === 'WIN') {
      this.renderWin(game.getWinner());
      this.renderPlayers();
      return;
    }

    if (endOfGame === 'TIE') {
      this.renderTie();
      return;
    }

    gameStatus.textContent = `${nextPlayer.name}'s turn`;
  }

  function renderPlayers() {
    playerCardsContainer.textContent = '';
    managePlayersCardsContainer.textContent = '';

    for (const playerData of game.players) {
      // Display players on main game screen
      const playerText = document.createElement('p');
      playerText.classList.add('player');
      
      playerSymbol = document.createElement('span')
      playerSymbol.style.color = playerData.color;
      playerSymbol.textContent = playerData.symbol + ' ';
      playerText.appendChild(playerSymbol);

      const playerName = document.createElement('span');
      playerName.textContent = playerData.name;
      playerText.appendChild(playerName);

      const playerScore = document.createElement('p');
      playerScore.classList.add('player-score');
      playerScore.textContent = playerData.score;

      const playerCard = document.createElement('li');
      playerCard.classList.add('player-card');

      playerCard.appendChild(playerText);
      playerCard.appendChild(playerScore);

      playerCardsContainer.appendChild(playerCard);

      // Display players in Manage players section

      const managePlayersCard = document.createElement('article');
      managePlayersCard.classList.add('manage-player-card')

      const managePlayersCardHeading = document.createElement('h3');
      managePlayersCardHeading.textContent = playerData.name;
      managePlayersCard.appendChild(managePlayersCardHeading);

      const managePlayersScore = document.createElement('div');
      managePlayersScore.classList.add('score');
      const managePlayersScoreText = document.createElement('p');
      managePlayersScoreText.textContent = 'Score:'
      const managePlayersScoreNumber = document.createElement('p');
      managePlayersScoreNumber.textContent = playerData.score;

      managePlayersScore.appendChild(managePlayersScoreText);
      managePlayersScore.appendChild(managePlayersScoreNumber);
      managePlayersCard.appendChild(managePlayersScore);

      const managePlayersName = document.createElement('div');
      managePlayersName.classList.add('form-control');
      const managePlayersNameInput = document.createElement('input');
      managePlayersNameInput.value = playerData.name;
      managePlayersNameInput.id = `player-${playerData.id}-name`;
      const managePlayersNameLabel = document.createElement('label');
      managePlayersNameLabel.textContent = 'Name:';
      managePlayersNameLabel.setAttribute('for', `player-${playerData.id}-name`);
      
      managePlayersName.appendChild(managePlayersNameLabel);
      managePlayersName.appendChild(managePlayersNameInput);
      managePlayersCard.appendChild(managePlayersName);
      
      const managePlayersSymbol = document.createElement('div');
      managePlayersSymbol.classList.add('form-control');
      const managePlayersSymbolInput = document.createElement('input');
      managePlayersSymbolInput.value = playerData.symbol;
      managePlayersSymbolInput.id = `player-${playerData.id}-symbol`;
      const managePlayersSymbolLabel = document.createElement('label');
      managePlayersSymbolLabel.textContent = 'Symbol:';
      managePlayersSymbolLabel.setAttribute('for', `player-${playerData.id}-symbol`);
      
      managePlayersSymbol.appendChild(managePlayersSymbolLabel);
      managePlayersSymbol.appendChild(managePlayersSymbolInput);
      managePlayersCard.appendChild(managePlayersSymbol);
      
      
      const managePlayersColor = document.createElement('div');
      managePlayersColor.classList.add('form-control');
      const managePlayersColorInput = document.createElement('input');
      managePlayersColorInput.value = playerData.color;
      managePlayersColorInput.id = `player-${playerData.id}-color`;
      const managePlayersColorLabel = document.createElement('label');
      managePlayersColorLabel.textContent = 'Color:';
      managePlayersColorLabel.setAttribute('for', `player-${playerData.id}-color`);
      
      managePlayersColor.appendChild(managePlayersColorLabel);
      managePlayersColor.appendChild(managePlayersColorInput);
      managePlayersCard.appendChild(managePlayersColor);

      const managePlayersButtons = document.createElement('div');
      managePlayersButtons.classList.add('manage-buttons');
      const managePlayersDeleteButton = document.createElement('button');
      managePlayersDeleteButton.textContent = 'Delete';
      managePlayersDeleteButton.classList.add('delete-button');
      const managePlayersSaveButton = document.createElement('button');
      managePlayersSaveButton.textContent = 'Save';
      managePlayersSaveButton.classList.add('save-button');

      managePlayersButtons.appendChild(managePlayersDeleteButton);
      managePlayersButtons.appendChild(managePlayersSaveButton);
      managePlayersCard.appendChild(managePlayersButtons);

      managePlayersCard.playerId = playerData.id;
      managePlayersCardsContainer.appendChild(managePlayersCard);

      // Set up event listeners with the inputs
      managePlayersSaveButton.addEventListener('click', (e) => {
        const currentId = e.target.closest('article').playerId;
        const currentPlayer = game.players.find((player) => player.id === currentId);
        
        currentPlayer.name = managePlayersNameInput.value;
        currentPlayer.symbol = managePlayersSymbolInput.value;
        currentPlayer.color = managePlayersColorInput.value;

        renderer.renderPlayers();
      });
    }
  }

  function renderWin(winner) {
    gameStatus.textContent = `The winner is ${winner.name}!`;
  }
  
  function renderTie() {
    gameStatus.textContent = `It's a tie!`;
  }

  return {renderBoard, renderTurn, renderFirstStatus, renderWin, renderTie, renderPlayers};
})();

(function setupEventListeners() {
  const startGameButton = document.querySelector('#start-game');
  const gridSizeInput = document.querySelector('#grid-size');
  const managePlayersButton = document.querySelector('#manage-players');
  const managePlayersDialog = document.querySelector('#manage-players-dialog');
  const managePlayersCloseButton = document.querySelector('#manage-players-close-button');
  const managePlayersDoneButton = document.querySelector('#done-button');
  const managePlayersCloseButtons = [managePlayersCloseButton, managePlayersDoneButton];

  startGameButton.addEventListener('click', (e) => {
    const gridSize = gridSizeInput.value;
    if (gridSize === '') {
      game.makeBoard();
    } else {
      game.makeBoard(gridSize);
    }
    renderer.renderBoard(game.gameBoard);
    // gridSizeInput.disabled = true; // disable all inputs and the default button
    game.startGame();
    renderer.renderFirstStatus(game.currentPlayer);
  });
  
  managePlayersButton.addEventListener('click', (e) => {
    managePlayersDialog.showModal();
  });
  
  managePlayersDialog.addEventListener('click', (e) => {    
    // Clicking backdrop counts as clicking the element directly
    // Clicking the wrapper child of the modal counts as bubbling (eventPhase === 3)
    if (e.eventPhase === 2) {
      managePlayersDialog.close();
    }
  })
  
  managePlayersCloseButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      managePlayersDialog.close();
    })
  })
})();


game.makeBoard();
renderer.renderBoard(game.gameBoard);

game.createPlayer('Player 1', 'X', 'red');
game.createPlayer('Player 2', 'O', 'black');
renderer.renderPlayers();