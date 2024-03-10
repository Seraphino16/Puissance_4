class Puissance4 {

    constructor (container, width = 7, height = 6) {
        this.width = width;
        this.height = height;
        this.container = container;
        

        this.player1 = new Player(1, "red");
        this.player2 = new Player(2, "yellow");
        this.players = [this.player1, this.player2];

        this.currentPlayer = this.player1;

        this.createAllRows();
        this.displayGameBoard();
    }

    createRow (rowIndex) {
        let row = [];
        for(let i = 0; i < this.width; i++) {
            let cell = new Cell (i, rowIndex, this);
            row.push(cell);
        }
        return row;
    }

    createAllRows () {
        this.table = [];
        for(let i = this.height - 1; i >= 0; i--) {
            let row = this.createRow(i);
            this.table.push(row);
        }
    }

    displayPlayer (player) {
        let div = document.createElement("div");
        div.className = "player";

        let canvas = document.createElement("canvas");
        canvas.style.width = "80px";
        canvas.style.height = "80px";
        canvas.style.backgroundColor = player.color;

        let playerName = document.createElement("p");
        playerName.innerText = "Player " + player.id;

        div.appendChild(canvas);
        div.appendChild(playerName);
        div.appendChild(player.scoreDisplay);

        this.gameBoard.appendChild(div);
    }

    displayHead () {
        let head = document.createElement("div");
        head.className = "head";

        this.canvas = document.createElement("canvas");
        this.canvas.style.backgroundColor = this.currentPlayer.color;

        this.txt = document.createElement("h3");
        this.txt.innerText = "Player " + this.currentPlayer.id + ", it's your turn !";

        head.appendChild(this.canvas);
        head.appendChild(this.txt);

        this.container.appendChild(head);
    }

    displayButtons () {
        let div = document.createElement("div");
        div.className = "buttonsContainer";

        let cancelButton = document.createElement("button");
        cancelButton.innerText = "Cancel last move";
        cancelButton.addEventListener("click", () => this.lastPlayedCell.resetColor());

        let restartButton = document.createElement("button");
        restartButton.innerText = "Restart";
        restartButton.addEventListener("click", () => this.restart());

        let resetScoresButton = document.createElement("button");
        resetScoresButton.innerText = "Reset scores";
        resetScoresButton.addEventListener("click", () => this.resetScores());


        div.appendChild(cancelButton);
        div.appendChild(restartButton);
        div.appendChild(resetScoresButton);
        this.container.appendChild(div);
    }

    displayGameBoard () {
        this.displayHead();

        this.gameBoard = document.createElement("div");
        this.gameBoard.className = "game-board";

        this.displayPlayer(this.player1);

        let table = document.createElement("table");

        this.table.forEach((row) => {
            let rowDOM = document.createElement("tr");

            row.forEach((cell) => {
                rowDOM.appendChild(cell.dom);
            })

            table.appendChild(rowDOM);
        })
    
        this.gameBoard.appendChild(table);

        this.displayPlayer(this.player2);

        this.container.appendChild(this.gameBoard);

        this.displayButtons();
    }

    dropToken (cell) {

        if(cell.isClickable !== true) {
            return;
        }

        let column = cell.x

        let rowId = this.height - 1;
        while(rowId >= 0 && this.table[rowId][column].color) {
            rowId--   
        }

        if(this.table[rowId] === undefined) {
            alert("Column is full");
            return
        }
        
        let cellPointed = this.table[rowId][column];
        cellPointed.updateColor(this.currentPlayer);

        let isWin = this.checkVictory(rowId, column);

        if(isWin) {
            this.currentPlayer.updateScore();

            this.table.forEach((row) => {
                row.forEach((cell) => {
                    cell.isClickable = false;
                })
            })
        }

        this.lastPlayedCell = cellPointed;
        this.changePlayer()
    }

    changePlayer () {
        if(this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
        this.updateHead();
    }

    updateHead () {
        this.canvas.style.backgroundColor = this.currentPlayer.color;
        this.txt.innerText = "Player " + this.currentPlayer.id + ", it's your turn !";
    }



    checkVictory (y, x) {
        let cell = this.table[y][x];

        this.isFull = true;
        for(let i = 0; i < this.height - 1; i++) {
            for(let j = 0; j < this.width; j++) {
                if(this.table[i][j].id === null) {
                    this.isFull = false;
                }
            }
        }

        if(this.isFull === true) {
            alert("DRAW");
            return;
        }

        //vertical verification        
        if(y - 1 >= 0 && this.table[y+3] !== undefined
            && cell.id === this.table[y+1][x].id
            && cell.id === this.table[y+2][x].id
            && cell.id === this.table[y+3][x].id) {
            alert("PLAYER " + cell.id + " WIN !");
            return this.currentPlayer;
        }

        //horizontal verification
        let pointedCell = cell
        let j = x;

        while(j < this.width - 1 && cell.id === this.table[y][j+1].id) {
            j++;
            pointedCell = this.table[y][j];
        }

        if(this.table[y][j-3] !== undefined
            && cell.id === this.table[y][j-1].id
            && cell.id === this.table[y][j-2].id
            && cell.id === this.table[y][j-3].id) {
                alert("PLAYER " + cell.id + " WIN !");
            return this.currentPlayer;

        }
        
        // Diagonal / verification
        pointedCell = cell;
        j = x;
        let i = y;

        while(j < this.width - 1 && i - 1 >= 0
            && cell.id === this.table[i-1][j+1].id) {
                j++;
                i--;
                pointedCell = this.table[i][j];
         }

        if(this.table[i+3] !== undefined 
            && this.table[i+3][j-3] !== undefined
            && cell.id === this.table[i+1][j-1].id
            && cell.id === this.table[i+2][j-2].id
            && cell.id === this.table[i+3][j-3].id) {

            alert("PLAYER " + cell.id + " WIN !");
            return this.currentPlayer;

        }

        // Diagonal \ verification
        pointedCell = cell;
        j = x;
        i = y;

        while(j - 1 >= 0 && i - 1 >= 0
            && cell.id === this.table[i-1][j-1].id) {
                j--;
                i--;
                pointedCell = this.table[i][j];
         }

        if(this.table[i+3] !== undefined
            && this.table[i+3][j+3] !== undefined
            && cell.id === this.table[i+1][j+1].id
            && cell.id === this.table[i+2][j+2].id
            && cell.id === this.table[i+3][j+3].id) {

                alert("PLAYER " + cell.id + " WIN !");
            return this.currentPlayer;

        }
        
    }

    restart () {
        this.table.forEach((row) => {
            row.forEach((cell) => {
                cell.resetColor();
                cell.isClickable = true;
            })
        })

        this.isFull = true;
        this.currentPlayer = this.player1;
    }

    resetScores () {
        this.players.forEach((player) => {
            player.resetScore();
        })
    }
}

class Cell {
    constructor (x, y, game) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.id = null;
        this.isClickable = true;
        this.createDOM();

        this.game = game;

        this.dom.addEventListener("click", () => game.dropToken(this));
    }

    createDOM () {
        this.dom = document.createElement("td");
    }

    updateColor (player) {
        this.id = player.id
        this.color = player.color;
        this.dom.style.backgroundColor = this.color;
    }

    resetColor () {
        
        if(this.id) {
            this.game.changePlayer();
        }        

        this.color = null;
        this.dom.style.backgroundColor = "white";
        this.id = null;        
    }

   
}

class Player {
    constructor (id, color) {
        this.id = id;
        this.color = color;
        this.score = 0;
        
        this.scoreDisplay = document.createElement("p");
        this.updateScoreDOM();
       
    }

    updateScore () {
        this.score++;
        this.updateScoreDOM();
    }

    resetScore () {
        this.score = 0;
        this.updateScoreDOM();
    }

    updateScoreDOM () {
         this.scoreDisplay.innerText = "Score : " + this.score + " pts";
    }
}

export { Puissance4 };