//board[x][y]={8,...,0} nº of bombs around
//board[x][y]={-1...-8 && -11} nº of bombs around while have selected a flag
//board[x][y]={-21..-28 && -31} nº of bombs around while have selected an interrogation point
//board[x][y]=-12 when the cell has been revealed
//board[x][y]=-31 When it's a zero with a interrogation point
//board[x][y]=-11 When it's a zero with a flag
//when all board is set to -10 is game over it was set to show where the bombs were

var board;
var mflags;
var rows;
var cols;
var exploded;
easy = {
	nrow : 9,
	ncol : 9,
	nbombs : 10
};
medium = {
	nrow : 16,
	ncol : 16,
	nbombs : 40
};
hard = {
	nrow : 16,
	ncol : 30,
	nbombs : 99
};
diff = [ easy, medium, hard ];

tableid = [ "table0", "table1", "table2" ];

tdeasy = {
	flag : "td2",
	inte : "td3",
	read : "td4",
	redbomb : "td5",
	blackbomb : "td6"
};
tdmedium = {
	flag : "td7",
	inte : "td8",
	read : "td9",
	redbomb : "td10",
	blackbomb : "td11"
};
tdhard = {
	flag : "td12",
	inte : "td13",
	read : "td14",
	redbomb : "td15",
	blackbomb : "td16"
};
tdimg = [ tdeasy, tdmedium, tdhard ];

// Function to create a Table
function createTable(difficulty, rows, cols) {
	var i;
	var row;
	var j;
	var place = document.getElementById("game"), table = document
			.createElement("table");
	place.textContent = '';
	table.id = tableid[difficulty];
	for (i = 0; i < rows; ++i) {
		row = table.insertRow();
		for (j = 0; j < cols; ++j) {
			row.insertCell();
		}
	}
	place.appendChild(table);
}

// Function to positions the bombs at start
function positionBomb(board, cols, rows, nbombs, difficulty) {
	var table = document.getElementById(tableid[difficulty]);
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
		table.rows[y].cells[x].id = "td1";
	}
	return board;
}
function verifyAround(x, y, board, nrow, ncol) {
	var count = 0;
	for ( var i = -1; i < 2; i++) {
		for ( var j = -1; j < 2; j++) {
			if (((x + i >= 0) && (x + i <= ncol))
					&& ((y + j >= 0) && (y + j <= nrow))
					&& board[x + i][y + j] < 0 && board[x + i][y + j] > -10) {
				count++;
			}
		}
	}
	return count;
}

// Function that verifys how many bombs each cell as around it
function verify(x, y, board, nrow, ncol) {
	var count = 0;
	for ( var i = -1; i < 2; i++) {
		for ( var j = -1; j < 2; j++) {
			if (((x + i >= 0) && (x + i <= ncol))
					&& ((y + j >= 0) && (y + j <= nrow))
					&& board[x + i][y + j] === 9) {
				count++;
			}
		}
	}
	board[x][y] = count;
	return board[x][y];
}

function setColor(x, y, nrow, ncol, difficulty) {
	var table = document.getElementById(tableid[difficulty]);
	var cell = table.rows[y].cells[x];
	if (board[x][y] > 0) {
		if (cell.childNodes.length === 0)
			cell.appendChild(document.createTextNode(board[x][y]));
	} else if (board[x][y] < -18 || board[x][y] === -35) {
		if (board[x][y] === -31) {
			board[x][y] = 0;
		} else {
			board[x][y] += 20;
			board[x][y] -= (2 * board[x][y]);
		}
		if (cell.childNodes.length > 0)
			cell.removeChild(cell.childNodes[0]);
		if (board[x][y] !== 0)
			cell.appendChild(document.createTextNode(board[x][y]));
		cell.id = tdimg[difficulty].inte;
		expand(x, y, board, nrow, ncol, difficulty);
	}
	board[x][y] = -12;
	cell.id = tdimg[difficulty].read;
}

// Function that opens all cells around if it has no bombs around
function expand(x, y, board, nrow, ncol, difficulty) {
	if (board[x][y] === 0) {
		board[x][y] = -12;
		for ( var i = -1; i < 2; i++)
			for ( var j = -1; j < 2; j++)
				if (((x + i >= 0) && (x + i <= ncol))
						&& ((y + j >= 0) && (y + j <= nrow))
						&& !((i === x) && (j === y)))
					expand(x + i, y + j, board, nrow, ncol, difficulty);
	}
	if (!(board[x][y] <= -1 && board[x][y] >= -9) && board[x][y] !== -11) {
		setColor(x, y, nrow, ncol, difficulty);
		board[x][y] = -12;
	}
}

// Function to hide start menu and display the game page
function fromHomeMenu(difficulty) {
	document.getElementById("home_page").style.display = "none";
	document.getElementById("gamepage").style.display = "block";
	start(difficulty);
}

function goHome() {
	document.getElementById("home_page").style.display = "block";
	document.getElementById("gamepage").style.display = "none";
}

function ifhasBomb(x, y, board, ncol, nrow, difficulty) {
	var table = document.getElementById(tableid[difficulty]);
	var i;
	var j;
	var cell = table.rows[y].cells[x];
	if (cell.childNodes.length > 0)
		cell.removeChild(cell.childNodes[0]);
	cell.id = tdimg[difficulty].redbomb;
	for (i = 0; i < ncol; i++) {
		for (j = 0; j < nrow; j++) {
			if ((board[i][j] === 9 || board[i][j] === -29)
					&& !(i === x && j === y)) {
				if (table.rows[j].cells[i].childNodes.length > 0)
					table.rows[j].cells[i]
							.removeChild(table.rows[j].cells[i].childNodes[0]);
				table.rows[j].cells[i].id = tdimg[difficulty].blackbomb;
			}
		}
	}
}

// Function to start the game
function start(difficulty) {
	var i;
	var j;
	var nbombs = diff[difficulty].nbombs;
	var firstclick = false;
	nrow = diff[difficulty].nrow;
	ncol = diff[difficulty].ncol;
	var bombrcl = nbombs;
	var auxboard;
	exploded = false;
	createTable(difficulty, nrow, ncol);

	board = [ ncol ];
	for (i = 0; i < ncol; i++) {
		board[i] = [ nrow ];
		for (j = 0; j < nrow; j++) {
			board[i][j] = 0;
		}
	}
	auxboard = [ ncol ];
	for (i = 0; i < ncol; i++) {
		auxboard[i] = [ nrow ];
		for (j = 0; j < nrow; j++) {
			auxboard[i][j] = 0;
		}
	}
	board = positionBomb(board, ncol, nrow, nbombs, difficulty);
	for (i = 0; i < ncol; i++) {
		for (j = 0; j < nrow; j++) {
			if (board[i][j] !== 9)
				auxboard[i][j] = board[i][j] = verify(i, j, board, nrow - 1,
						ncol - 1);

		}

	}

	var table = document.getElementById(tableid[difficulty]);
	var progress = document.getElementById("progress");
	if (progress.childNodes.length > 3)
		progress.removeChild(progress.childNodes[3]);
	progress.appendChild(document.createTextNode(bombrcl));

	// Received a left click
	table.onclick = function(event) {
		console.log("1");
		var x = event.target.cellIndex;
		var y = event.target.parentNode.rowIndex;
		var cell = table.rows[y].cells[x];
		if (firstclick === false && (board[x][y] === 9 || board[x][y] === -29)) {
			cell.id = tdimg[difficulty].inte;
			var countx = 0;
			var county = 0;
			while (board[countx][county] === 9) {
				if (countx < ncol - 1)
					countx++;
				else {
					countx = 0;
					county++;
				}
			}
			table.rows[county].cells[countx].id = "td1";
			board[x][y] = 1;
			board[countx][county] = 9;
			firstclick = true;
			for (i = 0; i < ncol; i++) {
				for (j = 0; j < nrow; j++) {
					if (board[i][j] !== 9)
						auxboard[i][j] = board[i][j] = verify(i, j, board,
								nrow - 1, ncol - 1);

				}
			}
			if (board[x][y] !== 0)
				setColor(x, y, nrow - 1, ncol - 1, difficulty);
			else
				expand(x, y, board, nrow - 1, ncol - 1, difficulty);
		} else {
			firstclick = true;
			if ((board[x][y] === 9 || board[x][y] === -29) && !exploded) {
				ifhasBomb(x, y, board, ncol, nrow, difficulty);
				exploded = true;
			} else if (exploded) {
				var conf = confirm("GAME OVER");
				if (conf == true) {
					start(difficulty);
				}
			} else if (!(board[x][y] <= -1 && board[x][y] >= -9)
					&& board[x][y] !== -11) {
				if (board[x][y] !== 0 && board[x][y] !== -29) {
					setColor(x, y, nrow - 1, ncol - 1, difficulty);
				} else if (board[x][y] === 0) {
					expand(x, y, board, nrow - 1, ncol - 1, difficulty);
				}
			}
		}
	};
	// Received a right click

	table.oncontextmenu = function(event) {
		console.log("2");
		x = event.target.cellIndex;
		y = event.target.parentNode.rowIndex;
		var cell = table.rows[y].cells[x];
		table.onmousedown = function (e){
			if (e.button === 0 && e.which === 1 && board[x][y] === -12) {
				table.onmouseover = function(e){
			x = e.target.cellIndex;
			y = e.target.parentNode.rowIndex;
			for ( var i = -1; i < 2; i++) {
				for ( var j = -1; j < 2; j++) {
					if (((x + i >= 0) && (x + i <= ncol))
							&& ((y + j >= 0) && (y + j <= nrow))
							&& board[x + i][y + j] >-1) {
						table.rows[y+j].cells[x+i]=----------------------------------------------------------
					}
				}
			}
			};
				}
		} ;
		table.onmouseup = function (e) {
			if (e.button === 0 && e.which === 1 && board[x][y] === -12) {
				x = e.target.cellIndex;
				y = e.target.parentNode.rowIndex;
				var nbombs = verifyAround(x, y, board, nrow - 1, ncol - 1);
				if (nbombs === auxboard[x][y]) {
					for ( var i = -1; i < 2; i++) {
						for ( var j = -1; j < 2; j++) {
							if (((x + i >= 0) && (x + i <= ncol - 1))
									&& ((y + j >= 0) && (y + j <= nrow - 1))
									&& board[x + i][y + j] !== 9
									&& board[x + i][y + j] > -1) {
								expand(x + i, y + j, board, nrow - 1, ncol - 1,
										difficulty);
							} else if (((x + i >= 0) && (x + i <= ncol - 1))
									&& ((y + j >= 0) && (y + j <= nrow - 1))
									&& (board[x + i][y + j] === 9 || board[x
											+ i][y + j] === -29)) {
								ifhasBomb(x + i, y + j, board, ncol, nrow,
										difficulty);
								exploded = true;
							}
						}
					}

				}
			}
		};
		firstclick = true;
		if (board[x][y] !== -12 && !exploded) {
			if (board[x][y] > -1) {
				if (board[x][y] === 0)
					board[x][y] = -11;
				else
					board[x][y] -= (2 * board[x][y]);
				bombrcl--;
				progress.removeChild(progress.childNodes[3]);
				progress.appendChild(document.createTextNode(bombrcl));
				cell.id = tdimg[difficulty].flag;
			} else if (board[x][y] < 0 && board[x][y] !== -12
					&& board[x][y] > -19) {
				board[x][y] -= 20;
				bombrcl++;
				progress.removeChild(progress.childNodes[3]);
				progress.appendChild(document.createTextNode(bombrcl));
				cell.appendChild(document.createTextNode("?"));
				cell.id = tdimg[difficulty].inte;
			} else if (board[x][y] < -19) {
				if (board[x][y] === -31)
					board[x][y] = 0;
				else {
					board[x][y] += 20;
					board[x][y] -= (2 * board[x][y]);
				}
				if (cell.childNodes.length > 0)
					cell.removeChild(cell.childNodes[0]);
				cell.id = tdimg[difficulty].inte;

			}
		}

		else if (exploded) {
			var conf = confirm("GAME OVER");
			if (conf == true) {
				start(difficulty);
			}
		}

		return false;
	};
}
