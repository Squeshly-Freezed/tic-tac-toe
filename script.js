function Gameboard() {
    const array = [];
    for (let i = 0; i < 9; i++) {
        array.push(Cell());
    }

    const getBoard = () => array.map(index => index.getValue());

    const placeMarker = (player, spot) => {
        if (array[spot] === 0) array[spot].addValue(player);
    };

    const printBoard = () => {
        console.log(`${getBoard().slice(0, 3)}\n${getBoard().slice(3, 6)}\n${getBoard().slice(6, 9)}`); //try to add 2 line breaks to display proper board.
    };

    return { 
        getBoard,
        placeMarker,
        printBoard,
    };
}

function GameController() {
    const board = Gameboard();
    const player1 = Player("Rob", 1);
    const player2 = Player("AI", 2);

    let activePlayer = player1;
    let winningPlayer;

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s Turn`);
    }

    const checkForWinner = (player) => {
        winningPlayer = null;
        if ((board.getBoard().slice(0, 3) || board.getBoard().slice(3, 6) || board.getBoard().slice(6, 9)
            || board.getBoard()[0] && board.getBoard()[3] && board.getBoard()[6]
            || board.getBoard()[1] && board.getBoard()[4] && board.getBoard()[7]
            || board.getBoard()[2] && board.getBoard()[5] && board.getBoard()[8]
            || board.getBoard()[0] && board.getBoard()[4] && board.getBoard()[8]
            || board.getBoard()[2] && board.getBoard()[4] && board.getBoard()[6]) == player) {
                console.log("Rob is winner!");
                winningPlayer = activePlayer;
        }
        
    }

    const playRound = (spot) => {
        console.log("Placing marker");
        board.placeMarker(getActivePlayer().symbol, spot);
        checkForWinner(getActivePlayer().symbol);
        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {
        getActivePlayer,
        playRound,
    }
}

function Player(name, symbol) {
    const score = 0;
    const draws = 0;
    return {
        name,
        symbol,
        score,
        draws,
    };
}

function Cell(player) {
    const value = 0;

    const addValue = () => value = player;
    const getValue = () => value;

    return {
        addValue,
        getValue,
    };
}

const game = GameController();
game.playRound();