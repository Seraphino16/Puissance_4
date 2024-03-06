const container = document.getElementById("container-puissance-4");

document.addEventListener("DOMContentLoaded", () => {
    let game = new Puissance4(7, 6);

    let tableCells = document.querySelectorAll("#container-puissance-4 td");
    console.log(tableCells);
})




class Puissance4 {

    constructor (width, height) {
        this.width = width;
        this.height = height;
        this.container = container;
        

        this.player1 = new Player(1, "red");
        this.player2 = new Player(2, "yellow");

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
        console.log(this.table);
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

        // let scoreDisplay = document.createElement("p");
        // scoreDisplay.innerText = "Score : " + player.score + " pts";

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
        // canvas.style.width = "40px";
        // canvas.style.height = "40px";

        this.txt = document.createElement("h3");
        this.txt.innerText = "Player " + this.currentPlayer.id + ", it's your turn !";

        head.appendChild(this.canvas);
        head.appendChild(this.txt);

        this.container.appendChild(head);
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
    }

    dropToken (cell) {

        let column = cell.x

        let rowId = this.height - 1;
        while(rowId >= 0 && this.table[rowId][column].color) {
            rowId--   
        }

        if(this.table[rowId] === undefined) {
            console.log("Column full");
            alert("Column is full");
            return
        }
        
        let cellPointed = this.table[rowId][column];
        cellPointed.updateColor(this.currentPlayer);

        let isWin = this.checkVictory(rowId, column);

        if(isWin) {
            this.currentPlayer.updateScore();
        }

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

        //vertical verification        
        if(y - 1 >= 0 && this.table[y+3] !== undefined
            && cell.id === this.table[y+1][x].id
            && cell.id === this.table[y+2][x].id
            && cell.id === this.table[y+3][x].id) {
            alert("PLAYER " + cell.id + " WIN !");
            // alert("Player " + this.currentPlayer.id + "Win");
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
            return this.currentPlayer;

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
}

class Cell {
    constructor (x, y, game) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.createDOM();

        this.dom.addEventListener("click", () => game.dropToken(this));
    }

    createDOM () {
        this.dom = document.createElement("td");
        // this.dom.style.backgroundColor = this.color;
        // return this.dom;
    }

    updateColor (player) {
        this.id = player.id
        this.color = player.color;
        this.dom.style.backgroundColor = this.color;
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
        console.log(this.score);
    }

    resetScore () {
        this.score = 0;
    }

    updateScoreDOM () {
         this.scoreDisplay.innerText = "Score : " + this.score + " pts";
    }
}