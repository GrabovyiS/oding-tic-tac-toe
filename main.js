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
    while (winner === null) {
      this.makeTurn(); 
    }
  }
  
  function makeTurn() {
    const currentPlayer = this.currentPlayer;
    const symbol = currentPlayer.symbol;
    
    let row;
    let column;

    do {
      row = prompt(`${currentPlayer.name} to put ${symbol} in row`);
      column = prompt(`${currentPlayer.name} to put ${symbol} in column`);
    }
    while (this.gameBoard[row][column] !== null)

    this.gameBoard[row][column] = symbol;

    console.table(this.gameBoard);

    // Check for victory and tie
    if (this.checkEndOfGame() === 'WIN') {
      // The last player to make a turn created a winning position
      winner = currentPlayer;
      this.players[players.indexOf(winner)].score++;
      this.announceWinner();
    }

    // Change to next player
    this.currentPlayer = players[(players.indexOf(currentPlayer) + 1) % players.length]
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
  return {gameBoard, makeBoard, players, createPlayer, deletePlayer, startGame, makeTurn, checkEndOfGame, announceWinner};
})();

game.makeBoard(3);
game.createPlayer('bob', 'Ш', 'black');
game.createPlayer('joe', 'B', 'red');
game.startGame();