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

    dropToken (column) {
        console.log("You play column : " + column);



        let rowId = this.height - 1;
        while(rowId >= 0 && this.table[rowId][column].color) {
            rowId--
        }
        
        this.table[rowId][column].updateColor(this.currentPlayer.color);


        if(this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
    }
}

class Cell {
    constructor (x, y, game) {
        this.x = x;
        this.y = y;
        this.color = null;
        this.createDOM();

        this.dom.addEventListener("click", () => game.dropToken(this.x));
    }

    createDOM () {
        this.dom = document.createElement("td");
        // this.dom.style.backgroundColor = this.color;
        // return this.dom;
    }

    updateColor (color) {
        this.color = color;
        this.dom.style.backgroundColor = this.color;
    }

   
}

class Player {
    constructor (id, color) {
        this.id = id;
        this.color = color;
    }
}



