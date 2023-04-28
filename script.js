let numberOfP1Wins = 0;
let numberOfP2Wins = 0;
let numberOfTies = 0;

const App = {
  // all our selected html elements
  elements: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id='modal']"),
    modalText: document.querySelector("[data-id='modal-text']"),
    modalBtn: document.querySelector("[data-id='modal-btn']"),
    turn: document.querySelector("[data-id='turn']"),
    p1Wins: document.querySelector("[data-id='p1-wins']"),
    p2Wins: document.querySelector("[data-id='p2-wins']"),
    ties: document.querySelector("[data-id='ties']"),
  },

  state: {
    moves: [],
    p1Wins: 0,
    p2Wins: 0,
    ties: 0,
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);

    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    const winningPatterns = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) {
        winner = 1;
        numberOfP1Wins++;
        App.elements.p1Wins.textContent = `${numberOfP1Wins} Wins`;
      }

      if (p2Wins) {
        winner = 2;
        numberOfP2Wins++;
        App.elements.p2Wins.textContent = `${numberOfP2Wins} Wins`;
      }
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", //in progress || complete
      winner, // 1 || 2 || null
    };
  },

  init() {
    App.registerEvents();
  },

  registerEvents() {
    //this will add and remove my 'hidden' class for my items element
    App.elements.menu.addEventListener("click", (event) => {
      App.elements.menuItems.classList.toggle("hidden");
    });

    // reset button if you get stuck or run into bug, or you're about to lose and want to reset
    App.elements.resetBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.elements.squares.forEach((square) => square.replaceChildren());
      App.elements.modal.classList.add("hidden");

      const turnIcon = document.createElement("i");
      turnIcon.classList.add("fa", "fa-solid", "fa-x", "turquoise");
      const turnLabel = document.createElement("p");
      turnLabel.innerText = "Player 1, you are up!";
      turnLabel.classList = "turquoise";
      App.elements.turn.replaceChildren(turnIcon, turnLabel);

	  numberOfP1Wins = 0;
	  numberOfP2Wins = 0;
	  numberOfTies = 0;
	  App.elements.p1Wins.textContent = `${numberOfP1Wins} Wins`;
	  App.elements.p2Wins.textContent = `${numberOfP2Wins} Wins`;
	  App.elements.ties.textContent = `${numberOfTies}`;
    });

    //used same code for modal button to reset game board and whose turn it is
    App.elements.modalBtn.addEventListener("click", (event) => {
      App.state.moves = [];
      App.elements.squares.forEach((square) => square.replaceChildren());
      App.elements.modal.classList.add("hidden");

      const turnIcon = document.createElement("i");
      turnIcon.classList.add("fa", "fa-solid", "fa-x", "turquoise");
      const turnLabel = document.createElement("p");
      turnLabel.innerText = "Player 1, you are up!";
      turnLabel.classList = "turquoise";
      App.elements.turn.replaceChildren(turnIcon, turnLabel);
    });

    App.elements.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        //check if there's already a play, if so, return early
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          return existingMove !== undefined;
        };

        if (hasMove(+square.id)) {
          return;
        }

        //determine which player icon to add to square
        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);

        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you are up!`;

        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnIcon.classList.add("fa", "fa-solid", "fa-o", "yellow");
          turnLabel.classList = "yellow";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnIcon.classList.add("fa", "fa-solid", "fa-x", "turquoise");
          turnLabel.classList = "turquoise";
        }

        App.elements.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(squareIcon);

        //check if there is a winner or tie game
        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          App.elements.modal.classList.remove("hidden");

          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = `Tie game!`;
			numberOfTies++;
			App.elements.ties.textContent = `${numberOfTies}`;
          }
          App.elements.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
