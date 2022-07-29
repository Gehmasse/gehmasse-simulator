class Gehmasse {
    // stats
    GameLengthList = [];
    numberOfWinsPerPlayer = [];

    constructor(numberOfGames = 1, numberOfPlayers = 2) {
        this.resetAndInit();
        this.playGames(numberOfGames, numberOfPlayers);

        console.log(`average turns = ${this.avgturns()}`);
    }

    playGames(numberOfGames, numberOfPlayers) {
        for (let nthGame = 1; nthGame <= numberOfGames; nthGame++) {
            let game = new Game(numberOfPlayers);
            this.GameLengthList.push(game.numberOfTurns);
            this.numberOfWinsPerPlayer[game.winner] += 1;
        }
    }

    resetAndInit() {
        // init number of wins per player
        for (let i = 1; i <= this.numberOfPlayers; i++)
            this.numberOfWinsPerPlayer[i] = 0;
    }

    avgturns() {
        let avgturns = 0;

        for (let i = 0; i < this.GameLengthList.length; i++)
            avgturns += this.GameLengthList[i];

        avgturns /= this.GameLengthList.length;

        return avgturns;
    }
}

class Game {
    // field settings
    numberOfGamefields = 55;
    yellowFields = [3, 8, 15, 16, 19, 22, 25, 28, 42, 44, 47, 50, 53];
    redFields = [9, 21, 26, 30, 35, 40, 48, 52, 54];

    // player settings
    numberOfPlayers;
    startWithPlayer = 1;

    // game state
    playerPositions = [];
    pausingPlayer = null;
    currentPlayer = null;
    winner = null;

    // stats
    numberOfTurns = 0;

    constructor(numberOfPlayers) {
        this.numberOfPlayers = numberOfPlayers;
        this.play();
    }

    play() {
        this.initAndReset();

        while (!this.goalReached())
            this.turn();

        this.winner = this.getWinner();
    }

    turn() {
        // increment turn number
        this.numberOfTurns++;

        // go  if player is not pausing
        if (this.pausingPlayer === this.currentPlayer) {
            this.pausingPlayer = null;
        } else {
            this.go();
            this.applySpecialFields();
        }

        this.currentPlayer++;

        if (this.currentPlayer > this.numberOfPlayers)
            this.currentPlayer = 1;
    }

    go() {
        this.playerPositions[this.currentPlayer] += this.dice();
    }

    applySpecialFields() {
        if (this.redFields.includes(this.playerPositions[this.currentPlayer]))
            this.playerPositions[this.currentPlayer] = 1;

        if (this.yellowFields.includes(this.playerPositions[this.currentPlayer]))
            this.pausingPlayer = this.currentPlayer;
    }

    initAndReset() {
        // apply start player
        this.currentPlayer = this.startWithPlayer;

        // reset positions
        this.playerPositions = [];
        for (let i = 1; i <= this.numberOfPlayers; i++)
            this.playerPositions[i] = 0;
    }

    dice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    farthestPlayer() {
        let max = 0;
        let player;

        for (let i = 1; i <= this.numberOfPlayers; i++)
            if (this.playerPositions[i] > max) {
                max = this.playerPositions[i];
                player = i;
            }

        return [max, player];
    }

    goalReached() {
        return this.farthestPlayer()[0] >= this.numberOfGamefields;
    }

    getWinner() {
        return this.farthestPlayer()[1];
    }
}

new Gehmasse(10 ** 6, 2);