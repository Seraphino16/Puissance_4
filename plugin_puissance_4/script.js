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

    displayGameBoard () {
        let table = document.createElement("table");

        this.table.forEach((row) => {
            let rowDOM = document.createElement("tr");

            row.forEach((cell) => {
                rowDOM.appendChild(cell.dom);
            })

            table.appendChild(rowDOM);
        })
    
        this.container.appendChild(table);
    }

    dropToken (cell) {

        let column = cell.x

        let rowId = this.height - 1;
        while(rowId >= 0 && this.table[rowId][column].color) {
            rowId--
        }

        if(!this.table[rowId]) {
            alert("Column is full");
            return
        }
        
        let cellPointed = this.table[rowId][column];
        cellPointed.updateColor(this.currentPlayer);

        this.checkVictory(rowId, column);


        if(this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
    }


    checkVictory (y, x) {
        let cell = this.table[y][x];

        //vertical verification        
        if(y - 1 >= 0 && this.table[y+3] !== undefined
            && cell.id === this.table[y+1][x].id
            && cell.id === this.table[y+2][x].id
            && cell.id === this.table[y+3][x].id) {
            alert("PLAYER " + cell.id + " WIN !");
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
    }
}



