//board[x][y]=1 : localização das bombas
//board[x][y]=2 : posiçoes colocadas pelo jogador(lado esquerdo do rato)

var board;
var nbandeiras;
var rows;
var cols;

function createTable(difficulty, rows, cols) {
	var i;
	var row;
	var j;
	var cell;
	var place = document.getElementById("game"), table = document
			.createElement("table");
	table.id = "ide";
	if (difficulty === 0) {
		table.style.width = '292px';
		table.style.height = '292px';
		table.style.margin = "auto";
	} else if (difficulty == 1) {
		table.style.width = '436px';
		table.style.height = '436px';
		table.style.margin = "auto";
	} else {
		table.style.width = '664px';
		table.style.height = '356px';
		table.style.margin = "auto";
	}
	table.style.border = '1px solid black';
	table.style.cursor = 'pointer';
	for (i = 0; i < rows; ++i) {
		row = table.insertRow();
		for (j = 0; j < cols; ++j) {
			cell = row.insertCell();/*
			 * cell.addEventListener("click",
			 * function(){boss()this.style.backgroundColor =
			 * "#EBEBEB";});
			 * cell.addEventListener("contextmenu",
			 * function(){this.style.backgroundImage =
			 * "url('2000px-Minesweeper_flag.svg.png')";
			 * this.style.backgroundSize = '42px 42px';
			 * });
			 */
		}
	}
	place.appendChild(table);
}

function positionBomb(board, rows, cols, nbombs) {
	var myTable = document.getElementById("ide");
	var i;
	var x;
	var y;
	for (i = 0; i < nbombs; i++) {
		x = Math.floor((Math.random() * rows));
		y = Math.floor((Math.random() * cols));
		while (board[x][y] === 1) {
			x = Math.floor((Math.random() * rows));
			y = Math.floor((Math.random() * cols));
		}
		board[x][y] = 1;
		myTable.rows[y].cells[x].style.backgroundColor = 'red';
	}
	return board;
}

function verify(x, y, board, cell,nrow,ncol,difficulty) {
	var count = 0;
	if (board[x][y] === 1) {
		alert("GAME OVER MOTHERFUcKER");
	} else {
		if (x === 0) {
			if (y === 0) {
				if (board[1][1] === 1)
					count++;
				if (board[0][1] === 1)
					count++;
				if (board[1][0] === 1)
					count++;
			} else if (y === nrow) {
				if (board[1][nrow] === 1)
					count++;
				if (board[1][nrow-1] === 1)
					count++;
				if (board[0][nrow-1] === 1)
					count++;
			} else {
				for ( var i = -1; i < 2; i++)
					if (board[1][y + i]) {
						count++;
					}
				if (board[x][y - 1]) {
					count++;
				}
				if (board[x][y + 1]) {
					count++;
				}
			}
		} else if (x === ncol) {
			if (y ===0) {
				if (board[ncol-1][0] === 1)
					count++;
				if (board[ncol-1][1] === 1)
					count++;
				if (board[ncol][1] === 1)
					count++;
			} else if (y === nrow) {
				if (board[ncol][nrow-1] === 1)
					count++;
				if (board[ncol-1][nrow-1] === 1)
					count++;
				if (board[ncol-1][nrow] === 1)
					count++;

			} else {
				for ( var i = -1; i < 2; i++)
					if (board[ncol - 1][y + i]) {
						count++;
					}
				if (board[x][y - 1]) {
					count++;
				}
				if (board[x][y + 1]) {
					count++;
				}
			}
		} else if (y === nrow) {
			for ( var i = -1; i < 2; i++)
				if (board[x + i][y - 1]) {
					count++;
				}
			if (board[x - 1][y]) {
				count++;
			}
			if (board[x + 1][y]) {
				count++;
			}
		} else if (y === 0) {
			for ( var i = -1; i < 2; i++)
				if (board[x + i][y + 1]) {
					count++;
				}
			if (board[x - 1][y]) {
				count++;
			}
			if (board[x + 1][y]) {
				count++;
			}
		} else {
			for ( var i = -1; i < 2; i += 2) {
				for ( var j = -1; j < 2; j++) {
					if (board[x + i][y + j]) {
						count++;
					}
				}
			}
			if (board[x][y - 1]) {
				count++;
			}
			if (board[x][y + 1]) {
				count++;
			}

		}
		cell.style.backgroundColor = "#EBEBEB";
		if (count !== 0) {
			cell.innerHTML = count;
		}
			if(difficulty === 0){
				cell.height = 30;
				cell.width = 30;}
			else if (difficulty === 1){
				cell.height = 25;
				cell.width = 25;
			}
			else{
				cell.height = 20;
				cell.width = 20;
			}
			cell.style.textAlign = "center";
	}
}/*
function secondveri(x, y, board) {
	myTable = document.getElementById("ide");
	if (x === 0) {
		if (y === 0) {
			verify(1, 1, board, myTable.rows[1].cells[1]);
			verify(0, 1, board, myTable.rows[1].cells[0]);
			verify(1, 0, board, myTable.rows[0].cells[1]);
		} else if (y === 8) {
			verify(1, 8, board, myTable.rows[8].cells[1]);
			verify(1, 7, board, myTable.rows[7].cells[1]);
			verify(0, 7, board, myTable.rows[7].cells[0]);
		} else {
			for ( var i = -1; i < 2; i++)
				verify(0 + 1, y + i, board, myTable.rows[y + i].cells[0 + 1]);
			verify(x, y - 1, board, myTable.rows[y - 1].cells[x]);
			verify(x, y + 1, board, myTable.rows[y + 1].cells[x]);
		}
	} else if (x === 8) {
		if (y === 0) {
			verify(7, 0, board, myTable.rows[0].cells[7]);
			verify(7, 1, board, myTable.rows[1].cells[7]);
			verify(8, 1, board, myTable.rows[1].cells[8]);
		} else if (y === 8) {
			verify(8, 7, board, myTable.rows[7].cells[8]);
			verify(7, 7, board, myTable.rows[7].cells[7]);
			verify(7, 8, board, myTable.rows[8].cells[7]);
		} else {
			for ( var i = -1; i < 2; i++)
				verify(8 - 1, y + i, board, myTable.rows[y + i].cells[8 - 1]);
			verify(x, y - 1, board, myTable.rows[y - 1].cells[x]);
			verify(x, y + 1, board, myTable.rows[y + 1].cells[x]);
		}
	} else if (y === 8) {
		for ( var i = -1; i < 2; i++)
			verify(x + i, y - 1, board, myTable.rows[y - 1].cells[x + i]);
		verify(x - 1, y, board, myTable.rows[y].cells[x - 1]);
		verify(x + 1, y, board, myTable.rows[y].cells[x + 1]);
	} else if (y === 0) {
		for ( var i = -1; i < 2; i++)
			verify(x + i, y + 1, board, myTable.rows[y + 1].cells[x + i]);
		verify(x - 1, y, board, myTable.rows[y].cells[x - 1]);
		verify(x + 1, y, board, myTable.rows[y].cells[x + 1]);
	} else {
		for ( var i = -1; i < 2; i += 2) {
			for ( var j = -1; j < 2; j++) {
				verify(x + i, y + j, board, myTable.rows[y + j].cells[x + i]);
			}
		}
		verify(x, y - 1, board, myTable.rows[y - 1].cells[x]);
		verify(x, y + 1, board, myTable.rows[y + 1].cells[x]);
	}

}*/

window.onload = function() {

	var i;
	var j;
	difficulty =2;
	var nbombs;
	if (difficulty === 0) {
		rows = 9;
		cols = 9;
		nbombs = 10;
	} else if (difficulty === 1) {
		rows = 16;
		cols = 16;
		nbombs = 40;
	} else {
		rows = 16;
		cols = 30;
		nbombs = 99;
	}
	createTable(difficulty, rows, cols);

	board = [ cols ];
	for (i = 0; i < cols; i++) {
		board[i] = [ rows ];
		for (j = 0; j < rows; j++) {
			board[i][j] = 0;
		}
	}
	board = positionBomb(board, cols,rows, nbombs);

	var table = document.getElementById("ide");
	var rows = table.getElementsByTagName("tr");

	for ( var i = 0; i < rows.length; i++) {
		// Get the cells in the given row
		var cells = rows[i].getElementsByTagName("td");
		for ( var j = 0; j < cells.length; j++) {
			// Cell Object
			var cell = cells[j];
			cell.rowIndex = i;
			cell.positionIndex = j;
			cell.onclick = function() {
				verify(this.positionIndex, this.rowIndex, board, this, rows-1,cols-1, difficulty);
			};
			cell.oncontextmenu = function() {
				this.style.backgroundImage = "url('2000px-Minesweeper_flag.svg.png')";
				if(difficulty === 0){
					this.style.backgroundSize = '30px 30px';}
				else if(difficulty === 1){
					this.style.backgroundSize = '25px 25px';
				}
				else if(difficulty === 2){
					this.style.backgroundSize = '20px 20px';
				}
				return false;
			};
		}
	}

	/*
	 * var table = document.getElementById("ide"); if (table != null) { for (var
	 * i = 0; i < table.rows.length; i++) { for (var j = 0; j <
	 * table.rows[i].cells.length; j++){ table.rows[i].cells[j].onclick =
	 * function () { tableText(this); }; table.rows[i].cells[j].oncontextmenu =
	 * function(){this.style.backgroundImage =
	 * "url('2000px-Minesweeper_flag.svg.png')"; this.style.backgroundSize =
	 * '42px 42px';}; } } }
	 * 
	 * function tableText(tableCell) { tableCell.style.backgroundColor =
	 * "#EBEBEB"; }
	 */
};
