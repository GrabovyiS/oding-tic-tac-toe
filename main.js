const gameState = (function initializeGame() {
  const gameBoard = [];
  
  function makeBoard(boardSize) {
    for (let i = 0; i < boardSize; i++) {
      this.gameBoard.push([]);
      for (let j = 0; j < boardSize; j++) {
        this.gameBoard[i].push(null);
      }
    }
  }


  const players = [];
  const currentPlayer = 0;
  const SYMBOLS = ['X', 'O'];

  function makePlayers(playerCount) {
    // also set up player order maybe
    for (let i = 0; i < playerCount; i++) {
      const name = prompt('whats ur name, player ' + (i+1));
      players.push(createPlayer(name, SYMBOLS[i]))
    }
  }
  
  function startGame() {
    // set first player? maybe maybe not
    // begin listening for input
  }
  
  function makeTurn() {
    // alter the gameboard
    // check for victory and tie
  }

  function createPlayer(name, symbol) {
    return {name, symbol};
  }
  
  // current player, gameBoard, makeTurn, checkVictory
  return {gameBoard, makeBoard, players, currentPlayer, makePlayers, startGame, makeTurn};
})();

gameState.makeBoard(3);
gameState.makePlayers(2);