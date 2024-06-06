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

    // Check for victory and tie
    if (this.checkEndOfGame() === 'WIN') {
      // The last player to make a turn created a winning position
      winner = currentPlayer;
      this.announceWinner();
    }

    // Change to next player
    this.currentPlayer = players[(players.indexOf(currentPlayer) + 1) % players.length]
  }

  function createPlayer(name, symbol) {
    return {name, symbol};
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
  }

  function announceWinner() {
    console.log(`The winner is ${winner.name}!`)
  }
  
  // current player, gameBoard, makeTurn, checkVictory
  return {gameBoard, makeBoard, players, makePlayers, startGame, makeTurn, checkEndOfGame, announceWinner};
})();

game.makeBoard(3);
game.makePlayers(2);
game.startGame();