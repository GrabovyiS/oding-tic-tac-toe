const game = (function initializeGame() {
  on = false;
  winner = null;
  this.DEFAULT_GRID_SIZE = 3;
  this.DEFAULT_WINNING_ROW_SIZE = 3;
  this.winningRowSize;
  
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

  function setWinningRowSize(size) {
    this.winningRowSize = size;
  }

  function getWinningRowSize() {
    return this.winningRowSize;
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
    
    if (checkWin()) {
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

  function checkWin() {
    const winningRowSize = game.getWinningRowSize();
    console.log(winningRowSize);
    console.log(game.gameBoard.length);

    for (let i = 0; i < game.gameBoard.length; i++) {
      for (let j = 0; j < game.gameBoard.length; j++) {
        // for each cell
        const column = [];
        for (let k = 0; k < winningRowSize; k++) {
          if (i + winningRowSize > game.gameBoard.length) {
            break;
          }
          console.log('entered', i, j)
          column.push(game.gameBoard[i + k][j]);
        }
        console.log(column);
        
        const row = [];
        for (let k = 0; k < winningRowSize; k++) {
          if (j + winningRowSize > game.gameBoard.length) {
            break;
          }
          
          row.push(game.gameBoard[i][j + k]);
        }
        
        const rightDiagonal = [];
        for (let k = 0; k < winningRowSize; k++) {
          if (i + winningRowSize > game.gameBoard.length || j + winningRowSize > game.gameBoard.length) {
            break;
          }
          
          rightDiagonal.push(game.gameBoard[i + k][j + k]);
        }
        
        const leftDiagonal = [];
        for (let k = 0; k < winningRowSize; k++) {
          // gameBoard.length is maxIndex + 1, while 0 is the minindex. that is why we subtract 1 when going backwards
          if (i + winningRowSize > game.gameBoard.length || j - (winningRowSize - 1) < 0) {
            break;
          }
          
          leftDiagonal.push(game.gameBoard[i + k][j - k]);
        }

        if (column.every((el) => el === column[0]) && column[0]) {
          return true;
        }

        if (row.every((el) => el === row[0]) && row[0]) {
          return true;
        }

        if (rightDiagonal.every((el) => el === rightDiagonal[0]) && rightDiagonal[0]) {
          return true;
        }

        if (leftDiagonal.every((el) => el === leftDiagonal[0]) && leftDiagonal[0]) {
          return true;
        }
      }
    }
  }
  
  return {gameBoard, makeBoard, on, players, getWinningRowSize, setWinningRowSize, DEFAULT_GRID_SIZE, DEFAULT_WINNING_ROW_SIZE, createPlayer, deletePlayer, startGame, makeTurn, checkEndOfGame, getWinner, resetBoard, checkWin};
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
        cell.style.fontSize = `${cell.offsetWidth / 1.5}px`;
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
      const playerScoreCard = createPlayerScoreCard(playerData.name, playerData.symbol, playerData.color, playerData.score);
      playerCardsContainer.appendChild(playerScoreCard);

      // Display players in manage settings
      const managePlayersCard = createManagePlayersCard(playerData.id, playerData.name, playerData.symbol, playerData.color, playerData.score);
      managePlayersCardsContainer.appendChild(managePlayersCard);      
    }
  }

  function createPlayerScoreCard(name, symbol, color, score) {
    const playerText = document.createElement('p');
    playerText.classList.add('player');
    
    playerSymbol = document.createElement('span')
    playerSymbol.style.color = color;
    playerSymbol.textContent = symbol + ' ';
    playerText.appendChild(playerSymbol);

    const playerName = document.createElement('span');
    playerName.textContent = name;
    playerText.appendChild(playerName);

    const playerScore = document.createElement('p');
    playerScore.classList.add('player-score');
    playerScore.textContent = score;

    const playerScoreCard = document.createElement('li');
    playerScoreCard.classList.add('player-card');

    playerScoreCard.appendChild(playerText);
    playerScoreCard.appendChild(playerScore);

    return playerScoreCard;
  }

  function createManagePlayersCard(id, name, symbol, color, score) {
    const managePlayersCard = document.createElement('article');
    managePlayersCard.classList.add('manage-player-card');

    const managePlayersCardHeader = document.createElement('header');

    const managePlayersCardHeading = document.createElement('h3');
    managePlayersCardHeading.textContent = name;
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
    managePlayersScoreNumber.textContent = score;

    managePlayersScore.appendChild(managePlayersScoreText);
    managePlayersScore.appendChild(managePlayersScoreNumber);
    managePlayersCard.appendChild(managePlayersScore);

    const managePlayersName = document.createElement('div');
    managePlayersName.classList.add('form-control');
    const managePlayersNameInput = document.createElement('input');
    managePlayersNameInput.value = name;
    managePlayersNameInput.id = `player-${id}-name`;
    const managePlayersNameLabel = document.createElement('label');
    managePlayersNameLabel.textContent = 'Name:';
    managePlayersNameLabel.setAttribute('for', `player-${id}-name`);
    
    managePlayersName.appendChild(managePlayersNameLabel);
    managePlayersName.appendChild(managePlayersNameInput);
    managePlayersCard.appendChild(managePlayersName);
    
    const managePlayersSymbol = document.createElement('div');
    managePlayersSymbol.classList.add('form-control');
    const managePlayersSymbolInput = document.createElement('input');
    managePlayersSymbolInput.value = symbol;
    managePlayersSymbolInput.id = `player-${id}-symbol`;
    const managePlayersSymbolLabel = document.createElement('label');
    managePlayersSymbolLabel.textContent = 'Symbol:';
    managePlayersSymbolLabel.setAttribute('for', `player-${id}-symbol`);
    
    managePlayersSymbol.appendChild(managePlayersSymbolLabel);
    managePlayersSymbol.appendChild(managePlayersSymbolInput);
    managePlayersCard.appendChild(managePlayersSymbol);
    
    
    const managePlayersColor = document.createElement('div');
    managePlayersColor.classList.add('form-control');
    const managePlayersColorInput = document.createElement('input');
    managePlayersColorInput.style.color = color;
    managePlayersColorInput.style.borderColor = color;
    managePlayersColorInput.value = color;
    managePlayersColorInput.id = `player-${id}-color`;
    const managePlayersColorLabel = document.createElement('label');
    managePlayersColorLabel.textContent = 'Color:';
    managePlayersColorLabel.style.color = color;
    managePlayersColorLabel.setAttribute('for', `player-${id}-color`);
    
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

    managePlayersCard.playerId = id;

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

    return managePlayersCard;
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
  const abortGameButton = document.querySelector('#abort-game');
  const gridSizeInput = document.querySelector('#grid-size');
  const winningRowSizeInput = document.querySelector('#win-condition');
  const defaultButton = document.querySelector('#default');

  const managePlayersButton = document.querySelector('#manage-players');
  const managePlayersDialog = document.querySelector('#manage-players-dialog');
  const managePlayersDialogBackdrop = document.querySelector('#manage-dialog-backdrop');
  const managePlayersCloseButton = document.querySelector('#manage-players-close-button');
  const managePlayersDoneButton = document.querySelector('#done-button');
  const managePlayersCloseButtons = [managePlayersCloseButton, managePlayersDoneButton, managePlayersDialogBackdrop];
  const managePlayersCreateButton = document.querySelector('#create-player-button');

  const errorMessageDialog = document.querySelector('#manage-error-dialog');

  startGameButton.addEventListener('click', (e) => {
    if (!gridSizeInput.value) {
      gridSizeInput.value = game.DEFAULT_GRID_SIZE;
    }
    game.makeBoard(gridSizeInput.value);

    if (!winningRowSizeInput.value) {
      winningRowSizeInput.value = game.DEFAULT_WINNING_ROW_SIZE;
      game.setWinningRowSize(game.DEFAULT_WINNING_ROW_SIZE);
    } else {
      game.setWinningRowSize(+winningRowSizeInput.value);
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
    showManageModal();
  });
  
  managePlayersCloseButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      if (!managePlayersIsValid()) {
        showInvalidMessageManage();
        return;
      }

      hideManageModal();
    })
  });
  
  function managePlayersIsValid() {
    return game.players.length >= 2;
  }

  function showInvalidMessageManage() {
    errorMessageDialog.show();
    managePlayersDialog.style.borderColor = 'rgb(160, 0, 0)';
  }
  
  function showManageModal() {
    managePlayersDialog.show();
    managePlayersDialogBackdrop.style.display = 'block';
  }
  
  function hideManageModal() {
    managePlayersDialog.close();
    managePlayersDialogBackdrop.style.display = 'none';
    
    hideInvalidMessageManage();
  }
  
  function hideInvalidMessageManage() {
    managePlayersDialog.style.borderColor = 'black';
    errorMessageDialog.close();
  }
  
  managePlayersCreateButton.addEventListener('click', (e) => {
    game.createPlayer('New player', helpers.getRandomChar(), helpers.getRandomColor());
    renderer.renderPlayers();
    
    if (game.players.length >= 2 && errorMessageDialog.open) {
      hideInvalidMessageManage();
    }
  });

  defaultButton.addEventListener('click', (e) => {
    gridSizeInput.value = game.DEFAULT_GRID_SIZE;
    winningRowSizeInput.value = game.DEFAULT_WINNING_ROW_SIZE;
  });
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