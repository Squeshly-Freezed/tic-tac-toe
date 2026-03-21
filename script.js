"use strict"

function Gameboard() {
    const array = [];
    for (let i = 0; i < 9; i++) {
        array.push(Cell());
    }

    const getBoard = () => array.map(index => index.getValue());

    const isBoardFull = () => array.every(spot => spot.getValue() !== 0);

    const placeMarker = (player, spot) => {
        if (isBoardFull()) {
            console.log("Board is full");
            return;
        }
        if (array[spot].getValue() === 0) {
            array[spot].addValue(player);
        } else {
            console.log("retry placement");
            placeMarker(player, spot === 0 ? 8 : --spot);
        }
    };

    const printBoard = () => console.log(`${getBoard().slice(0, 3)}\n${getBoard().slice(3, 6)}\n${getBoard().slice(6, 9)}`);

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
    const getWinningPlayer = () => winningPlayer;

    const switchPlayerTurn = () => activePlayer = activePlayer === player1 ? player2 : player1;

    const printNewRound = () => board.printBoard();

    const checkForWinner = (player) => {
        winningPlayer = null;
        if ((board.getBoard().slice(0, 3) || board.getBoard().slice(3, 6) || board.getBoard().slice(6, 9)
            || board.getBoard()[0] && board.getBoard()[3] && board.getBoard()[6]
            || board.getBoard()[1] && board.getBoard()[4] && board.getBoard()[7]
            || board.getBoard()[2] && board.getBoard()[5] && board.getBoard()[8]
            || board.getBoard()[0] && board.getBoard()[4] && board.getBoard()[8]
            || board.getBoard()[2] && board.getBoard()[4] && board.getBoard()[6]) == player) {
            console.log(`${player} is winner!`);
            winningPlayer = activePlayer;
        }
    }

    const chooseSpot = () => {
        const spot = parseInt(prompt("Put marker at index: ?"));
        return spot;
    }

    const computerChooseSpot = () => {
        const spot = Math.floor(Math.random() * 9);
        return spot;
    }

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const playRound = async (spot) => {
        console.log("Start Round");
        console.log(`${getActivePlayer().name}'s Turn`);
        board.placeMarker(getActivePlayer().symbol, chooseSpot());
        printNewRound();
        checkForWinner(getActivePlayer().symbol);
        await wait(3000);
        switchPlayerTurn();
        console.log(`${getActivePlayer().name}'s Turn`);
        board.placeMarker(getActivePlayer().symbol, computerChooseSpot());
        printNewRound();
        checkForWinner(getActivePlayer().symbol);
        switchPlayerTurn();
        await wait(3000);
    }

    return {
        getActivePlayer,
        getWinningPlayer,
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

function Cell() {
    let value = 0;
    const addValue = (player) => value = player;
    const getValue = () => value;
    return {
        addValue,
        getValue,
    };
}

const run = async () => {
    const game = GameController();
    while (!game.getWinningPlayer()) await game.playRound();
}

run();