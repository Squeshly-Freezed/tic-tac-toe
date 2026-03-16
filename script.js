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
        console.log(`${getBoard()}`); //try to add 2 line breaks to display proper board.
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

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s Turn`);
    }

    const playRound = (spot) => {
        console.log("Placing marker");
        board.placeMarker(getActivePlayer().symbol, spot);
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