//board[x][y]=9 : localização das bombas

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
			cell = row.insertCell();
		}
	}
	place.appendChild(table);
}

function positionBomb(board, cols, rows, nbombs) {
	var myTable = document.getElementById("ide");
	var i;
	var x;
	var y;
	for (i = 0; i < nbombs; i++) {
		x = Math.floor((Math.random() * cols));
		y = Math.floor((Math.random() * rows));
		while (board[x][y] === 9) {
			x = Math.floor((Math.random() * cols));
			y = Math.floor((Math.random() * rows));
		}
		board[x][y] = 9;
		myTable.rows[y].cells[x].style.backgroundColor = 'red';
	}
	return board;
}

function verify(x, y, board, nrow, ncol) {
	var count = 0;
	if (x === 0) {
		if (y === 0) {
			if (board[1][1] === 9)
				count++;
			if (board[0][1] === 9)
				count++;
			if (board[1][0] === 9)
				count++;
		} else if (y === nrow) {
			if (board[1][nrow] === 9)
				count++;
			if (board[1][nrow - 1] === 9)
				count++;
			if (board[0][nrow - 1] === 9)
				count++;
		} else {
			for ( var i = -1; i < 2; i++)
				if (board[1][y + i] === 9) {
					count++;
				}
			if (board[x][y - 1] === 9) {
				count++;
			}
			if (board[x][y + 1] === 9) {
				count++;
			}
		}
	} else if (x === ncol) {
		if (y === 0) {
			if (board[ncol - 1][0] === 9)
				count++;
			if (board[ncol - 1][1] === 9)
				count++;
			if (board[ncol][1] === 9)
				count++;
		} else if (y === nrow) {
			if (board[ncol][nrow - 1] === 9)
				count++;
			if (board[ncol - 1][nrow - 1] === 9)
				count++;
			if (board[ncol - 1][nrow] === 9)
				count++;

		} else {
			for ( var i = -1; i < 2; i++)
				if (board[ncol - 1][y + i] === 9) {
					count++;
				}
			if (board[x][y - 1] === 9) {
				count++;
			}
			if (board[x][y + 1] === 9) {
				count++;
			}
		}
	} else if (y === nrow) {
		for ( var i = -1; i < 2; i++)
			if (board[x + i][y - 1] === 9) {
				count++;
			}
		if (board[x - 1][y] === 9) {
			count++;
		}
		if (board[x + 1][y] === 9) {
			count++;
		}
	} else if (y === 0) {
		for ( var i = -1; i < 2; i++)
			if (board[x + i][y + 1] === 9) {
				count++;
			}
		if (board[x - 1][y] === 9) {
			count++;
		}
		if (board[x + 1][y] === 9) {
			count++;
		}
	} else {
		for ( var i = -1; i < 2; i += 2) {
			for ( var j = -1; j < 2; j++) {
				if (board[x + i][y + j] === 9) {
					count++;
				}
			}
		}
		if (board[x][y - 1] === 9) {
			count++;
		}
		if (board[x][y + 1] === 9) {
			count++;
		}

	}
	board[x][y] = count;
	return board[x][y];
}
function setColor(x,y,difficulty){
	var table = document.getElementById("ide");
	var cell = table.rows[y].cells[x];
	if(board[x][y] > 0)
		cell.innerHTML = board[x][y];
	if (difficulty === 0) {
		cell.style.width = 30;
		cell.style.height = 30;
	} else if (difficulty === 1) {
		cell.style.width = 25;
		cell.style.height = 25;
	} else {
		cell.style.width = 20;
		cell.style.height = 20;
	}
	cell.style.backgroundColor = "#EBEBEB";
	cell.style.textAlign = "center";
}

function expand(x, y, board, nrow, ncol, difficulty) {
	var table = document.getElementById("ide");
	if(board[x][y] === 0){
		board[x][y] = -1;
		if (x === 0) {
			if (y === 0) {
					expand(1, 1, board, nrow, ncol, difficulty);
					expand(0, 1, board, nrow, ncol, difficulty);
					expand(1, 0, board, nrow, ncol, difficulty);
			} else if (y === nrow) {
					expand(1, nrow, board, nrow, ncol);
					expand(1, nrow - 1, board, nrow, ncol, difficulty);
					expand(0, nrow - 1, board, nrow, ncol, difficulty);
			} else {
				for ( var i = -1; i < 2; i++)
						expand(1, y + i, board, nrow, ncol, difficulty);
					expand(x, y - 1, board, nrow, ncol, difficulty);
					expand(x, y + 1, board, nrow, ncol, difficulty);
			}
		} else if (x === ncol) {
			if (y === 0) {
					expand(ncol - 1, 0, board, nrow, ncol, difficulty);
					expand(ncol - 1, 1, board, nrow, ncol, difficulty);
					expand(ncol, 1, board, nrow, ncol, difficulty);
			} else if (y === nrow) {
					expand(ncol, nrow - 1, board, nrow, ncol, difficulty);
					expand(ncol - 1, nrow - 1, board, nrow, ncol, difficulty);
					expand(ncol - 1, nrow, board, nrow, ncol, difficulty);

			} else {
				for ( var i = -1; i < 2; i++)
						expand(ncol - 1, y + i, board, nrow, ncol, difficulty);
					expand(x, y - 1, board, nrow, ncol, difficulty);
					expand(x, y + 1, board, nrow, ncol, difficulty);
			}
		} else if (y === nrow) {
			for ( var i = -1; i < 2; i++)
					expand(x + i, y - 1, board, nrow, ncol, difficulty);
				expand(x - 1, y, board, nrow, ncol, difficulty);
				expand(x + 1, y, board, nrow, ncol, difficulty);
		} else if (y === 0) {
			for ( var i = -1; i < 2; i++)
					expand(x + i, y + 1, board, nrow, ncol, difficulty);
				expand(x - 1, y, board, nrow, ncol, difficulty);
				expand(x + 1, y, board, nrow, ncol, difficulty);
		} else {
			for ( var i = -1; i < 2; i += 2) 
				for ( var j = -1; j < 2; j++) 
						expand(x + i, y + j, board, nrow, ncol, difficulty);
				expand(x, y - 1, board, nrow, ncol, difficulty);
				expand(x, y + 1, board, nrow, ncol, difficulty);

		}
	}
	setColor(x,y,difficulty);
}

function start(difficulty) {
	var i;
	var j;
	var nbombs;
	if (difficulty === 0) {
		nrow = 9;
		ncol = 9;
		nbombs = 10;
	} else if (difficulty === 1) {
		nrow = 16;
		ncol = 16;
		nbombs = 40;
	} else {
		nrow = 16;
		ncol = 30;
		nbombs = 99;
	}
	createTable(difficulty, nrow, ncol);

	board = [ ncol ];
	for (i = 0; i < ncol; i++) {
		board[i] = [ nrow ];
		for (j = 0; j < nrow; j++) {
			board[i][j] = 0;
		}
	}
	board = positionBomb(board, ncol - 1, nrow - 1, nbombs);
	for (i = 0; i < ncol; i++) {
		for (j = 0; j < nrow; j++) {
			if (board[i][j] !== 9)
				board[i][j] = verify(i, j, board, nrow - 1, ncol - 1);
		}

	}

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
				var x = this.positionIndex;
				var y = this.rowIndex;
				if (board[x][y] === 9) {
					confirm("GAME OVER");
				} else {
					if (board[x][y] > 0) {
						setColor(x,y,difficulty);
					}else if(board[x][y] === 0){
						expand(x, y, board, nrow - 1, ncol - 1,difficulty);
					}
					
				}
			};
			cell.oncontextmenu = function() {
				this.style.backgroundImage = "url('2000px-Minesweeper_flag.svg.png')";
				if (difficulty === 0) {
					this.style.backgroundSize = '30px 30px';
				} else if (difficulty === 1) {
					this.style.backgroundSize = '25px 25px';
				} else if (difficulty === 2) {
					this.style.backgroundSize = '20px 20px';
				}
				return false;
			};
		}
	}
}
