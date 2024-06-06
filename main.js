const game = (function initializeGame() {
  winner = null;

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
  const SYMBOLS = ['X', 'O'];

  function makePlayers(playerCount) {
    // also set up player order maybe
    for (let i = 0; i < playerCount; i++) {
      const name = prompt('whats ur name, player ' + (i+1));
      players.push(createPlayer(name, SYMBOLS[i]))
    }
  }
  
  function startGame() {
    // Set first player
    this.currentPlayer = players[0];
    
    // Begin listening for input
    while (winner === null) {
      this.makeTurn(); 
    }
  }
  
  function makeTurn() {
    const currentPlayer = this.currentPlayer;
    const symbol = currentPlayer.symbol;
    const row = prompt(`${currentPlayer.name} to put ${symbol} in row`);
    const column = prompt(`${currentPlayer.name} to put ${symbol} in column`);

    if (this.gameBoard[row][column] === null) {
      this.gameBoard[row][column] = symbol;
    }
    console.table(this.gameBoard);
    // check for victory and tie

    // Change to next player
    this.currentPlayer = players[(players.indexOf(currentPlayer) + 1) % players.length]
  }

  function createPlayer(name, symbol) {
    return {name, symbol};
  }
  
  // current player, gameBoard, makeTurn, checkVictory
  return {gameBoard, makeBoard, players, makePlayers, startGame, makeTurn};
})();

game.makeBoard(3);
game.makePlayers(2);