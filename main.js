const game = (function initializeGame() {
  on = false;
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
      this.on = false;
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
      this.on = false;
      return 'TIE';
    }
  }
  
  function getWinner() {
    return winner;
  }
  
  // current player, gameBoard, makeTurn, checkVictory
  return {gameBoard, makeBoard, on, players, createPlayer, deletePlayer, startGame, makeTurn, checkEndOfGame, getWinner, resetBoard};
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

          if (e.target.closest('#game').disabled) {
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

    let outcome = game.checkEndOfGame();

    if (outcome) {
      this.finishGame(outcome);
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
      managePlayersCard.classList.add('manage-player-card');

      const managePlayersCardHeader = document.createElement('header');

      const managePlayersCardHeading = document.createElement('h3');
      managePlayersCardHeading.textContent = playerData.name;
      managePlayersCardHeader.appendChild(managePlayersCardHeading);

      const managePlayersOrderButtons = document.createElement('div');
      managePlayersOrderButtons.classList.add('order-buttons');
      
      const backButton = document.createElement('button');
      const backButtonImage = document.createElement('img');
      backButtonImage.setAttribute('src', './res/arrow-left-thick.svg');
      backButtonImage.setAttribute('alt', 'left arrow');
      backButton.appendChild(backButtonImage);

      const forwardButton = document.createElement('button');
      const forwardButtonImage = document.createElement('img');
      forwardButtonImage.setAttribute('src', './res/arrow-right-thick.svg');
      forwardButtonImage.setAttribute('alt', 'right arrow');
      forwardButton.appendChild(forwardButtonImage);

      managePlayersOrderButtons.appendChild(backButton);
      managePlayersOrderButtons.appendChild(forwardButton);
      managePlayersCardHeader.appendChild(managePlayersOrderButtons);
      managePlayersCard.appendChild(managePlayersCardHeader);

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
      managePlayersColorInput.style.color = playerData.color;
      managePlayersColorInput.style.borderColor = playerData.color;
      managePlayersColorInput.value = playerData.color;
      managePlayersColorInput.id = `player-${playerData.id}-color`;
      const managePlayersColorLabel = document.createElement('label');
      managePlayersColorLabel.textContent = 'Color:';
      managePlayersColorLabel.style.color = playerData.color;
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
      
      managePlayersDeleteButton.addEventListener('click', (e) => {
        const currentId = e.target.closest('article').playerId;
        const currentPlayer = game.players.find((player) => player.id === currentId);
        const currentPlayerIndex = game.players.indexOf(currentPlayer);
        game.players.splice(currentPlayerIndex, 1);
        
        renderer.renderPlayers();
      });
      
      forwardButton.addEventListener('click', (e) => {
        const currentId = e.target.closest('article').playerId;
        const currentPlayer = game.players.find((player) => player.id === currentId);
        const currentPlayerIndex = game.players.indexOf(currentPlayer);
        const players = game.players;
        [players[currentPlayerIndex], players[currentPlayerIndex + 1]] = [players[currentPlayerIndex + 1], players[currentPlayerIndex]];

        renderer.renderPlayers();
      });

      backButton.addEventListener('click', (e) => {
        const currentId = e.target.closest('article').playerId;
        const currentPlayer = game.players.find((player) => player.id === currentId);
        const currentPlayerIndex = game.players.indexOf(currentPlayer);
        const players = game.players;
        [players[currentPlayerIndex], players[currentPlayerIndex - 1]] = [players[currentPlayerIndex - 1], players[currentPlayerIndex]];

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
  
  function renderAbort() {
    gameStatus.textContent = `Game aborted. It's a tie!`;
  }

  function startGame() {
    this.enableGameField();
    this.disableSettings();

    switchButtonToAbort();
    
    renderBoard(game.gameBoard);
  }
  
  function finishGame(outcome) {
    this.disableGameField();
    this.enableSettings();
    
    switchButtonToStart();
    
    if (outcome === 'WIN') {
      this.renderWin(game.getWinner());
      this.renderPlayers();
      return;
    }

    if (outcome === 'TIE') {
      this.renderTie();
      return;
    }

    if (outcome === 'ABORT') {
      this.renderAbort();
    }
  }

  const gameElement = document.querySelector('#game');
  const playersSettingsElement = document.querySelector('section.players');
  const settingsElement = document.querySelector('section.settings');
  const startGameButton = document.querySelector('#start-game');
  const abortGameButton = document.querySelector('#abort-game');
  
  function disableGameField() {
    gameElement.disabled = true;
    gameElement.classList.add('disabled');
  }
  
  function enableGameField() {
    gameElement.disabled = false;
    gameElement.classList.remove('disabled');
  }
  
  function disableSettings() {
    settingsElement.disabled = true;
    playersSettingsElement.disabled = true;

    settingsButtons = document.querySelectorAll('section.players button, section.settings button');
    settingsButtons.forEach((button) => {
      button.disabled = true;
    });

    startGameButton.disabled = false;
    abortGameButton.disabled = false;
    
    settingsInputs = document.querySelectorAll('section.players input, section.settings input');
    settingsInputs.forEach((input) => {
      input.disabled = true;
    });
  }

  function enableSettings() {
    settingsElement.disabled = false;
    playersSettingsElement.disabled = false;

    settingsButtons = document.querySelectorAll('section.players button, section.settings button');
    settingsButtons.forEach((button) => {
      button.disabled = false;
    });
    
    settingsInputs = document.querySelectorAll('section.players input, section.settings input');
    settingsInputs.forEach((input) => {
      input.disabled = false;
    })
  }

  function switchButtonToAbort() {
    abortGameButton.classList.remove('display-none');
    startGameButton.classList.add('display-none');
  }

  function switchButtonToStart() {
    abortGameButton.classList.add('display-none');
    startGameButton.classList.remove('display-none');
  }

  return {renderBoard, renderTurn, renderFirstStatus, renderWin, renderTie, renderPlayers, startGame, finishGame, disableGameField, enableGameField, disableSettings, enableSettings, renderAbort};
})();

(function setupEventListeners() {
  const startGameButton = document.querySelector('#start-game');
  abortGameButton = document.querySelector('#abort-game');
  const gridSizeInput = document.querySelector('#grid-size');
  const managePlayersButton = document.querySelector('#manage-players');
  const managePlayersDialog = document.querySelector('#manage-players-dialog');
  const managePlayersCloseButton = document.querySelector('#manage-players-close-button');
  const managePlayersDoneButton = document.querySelector('#done-button');
  const managePlayersCloseButtons = [managePlayersCloseButton, managePlayersDoneButton];
  const managePlayersCreateButton = document.querySelector('#create-player-button');

  startGameButton.addEventListener('click', (e) => {
    const gridSize = gridSizeInput.value;
    if (gridSize === '') {
      game.makeBoard();
    } else {
      game.makeBoard(gridSize);
    }

    renderer.startGame();
    game.startGame();
    renderer.renderFirstStatus(game.currentPlayer);
  });

  abortGameButton.addEventListener('click', (e) => {
    renderer.finishGame('ABORT');
    game.on = false;
  })
  
  managePlayersButton.addEventListener('click', (e) => {
    managePlayersDialog.showModal();
  });
  
  managePlayersDialog.addEventListener('click', (e) => {    
    // Clicking backdrop counts as clicking the element directly
    // Clicking the wrapper child of the modal counts as bubbling (eventPhase === 3)
    if (e.eventPhase === 2) {
      managePlayersDialog.close();
    }
  });
  
  managePlayersCloseButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      managePlayersDialog.close();
    })
  });

  managePlayersCreateButton.addEventListener('click', (e) => {
    game.createPlayer('New player', helpers.getRandomChar(), helpers.getRandomColor());
    renderer.renderPlayers();
  })
})();


game.makeBoard();
renderer.renderBoard(game.gameBoard);
renderer.disableGameField();

game.createPlayer('Player 1', 'X', 'red');
game.createPlayer('Player 2', 'O', 'black');
renderer.renderPlayers();

const helpers = (function () {
    function getRandomColor() {
      return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }
    
    function getRandomChar() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return { getRandomColor, getRandomChar };
  }
)();