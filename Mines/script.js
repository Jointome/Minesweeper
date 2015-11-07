//board[x][y]={8,...,0} nº of bombs around
//board[x][y]={-10...-18} nº of bombs around while have selected a flag
//board[x][y]={-20..-28} nº of bombs around while have selected an interrogation point
//board[x][y]=-2 when the cell has been revealed
//when all board is set to -10 is game over it was set to show where the bombs were

var board;
var mflags;
var rows;
var cols;
var exploded;
var rightclick;
var discovered;

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
	blackbomb : "td6",
	bothbuttons : "td17"
};
tdmedium = {
	flag : "td7",
	inte : "td8",
	read : "td9",
	redbomb : "td10",
	blackbomb : "td11",
	bothbuttons : "td18"
};
tdhard = {
	flag : "td12",
	inte : "td13",
	read : "td14",
	redbomb : "td15",
	blackbomb : "td16",
	bothbuttons : "td19"
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
function positionBomb(cols, rows, nbombs, difficulty) {
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
		table.rows[y].cells[x].className = "td1";
	}
	return board;
}
function verifyAround(x, y, nrow, ncol) {
	var count = 0;
	for ( var i = -1; i < 2; i++) {
		for ( var j = -1; j < 2; j++) {
			if (notoutoftable(i, j, x, y, ncol, nrow)
					&& board[x + i][y + j] < -9 && board[x + i][y + j] > -20) {
				count++;
			}
		}
	}
	return count;
}

// Function that verifies how many bombs each cell as around it
function verify(x, y, nrow, ncol) {
	var count = 0;
	for ( var i = -1; i < 2; i++) {
		for ( var j = -1; j < 2; j++) {
			if (notoutoftable(i, j, x, y, ncol, nrow)
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
	} else if (board[x][y] < -19) {
		board[x][y] += 20;
		board[x][y] -= (2 * board[x][y]);
		if (cell.childNodes.length > 0)
			cell.removeChild(cell.childNodes[0]);
		if (board[x][y] !== 0)
			cell.appendChild(document.createTextNode(board[x][y]));
		cell.className = tdimg[difficulty].inte;
		expand(x, y, nrow, ncol, difficulty);
	}
	board[x][y] = -2;
	cell.className = tdimg[difficulty].read;
}

function notoutoftable(i, j, x, y, ncol, nrow) {
	if (((x + i >= 0) && (x + i <= ncol - 1))
			&& ((y + j >= 0) && (y + j <= nrow - 1))) {
		return true;
	}
	return false;
}

// Function that opens all cells around if it has no bombs around
function expand(x, y, nrow, ncol, difficulty) {
	discovered++;
	if (board[x][y] === 0) {
		board[x][y] = -2;
		for ( var i = -1; i < 2; i++)
			for ( var j = -1; j < 2; j++)
				if (notoutoftable(i, j, x, y, ncol, nrow) && board[x+i][y+j] !== -2) {
					expand(x + i, y + j, nrow, ncol, difficulty);
				}
	}
	if (!(board[x][y] <= -10 && board[x][y] >= -19)) {
		setColor(x, y, nrow, ncol, difficulty);
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

function ifhasBomb(x, y, ncol, nrow, difficulty) {
	var table = document.getElementById(tableid[difficulty]);
	var i;
	var j;
	var cell = table.rows[y].cells[x];
	if (cell.childNodes.length > 0)
		cell.removeChild(cell.childNodes[0]);
	cell.className = tdimg[difficulty].redbomb;
	for (i = 0; i < ncol; i++) {
		for (j = 0; j < nrow; j++) {
			if ((board[i][j] === 9 || board[i][j] === -29)
					&& !(i === x && j === y)) {
				if (table.rows[j].cells[i].childNodes.length > 0)
					table.rows[j].cells[i]
							.removeChild(table.rows[j].cells[i].childNodes[0]);
				table.rows[j].cells[i].className = tdimg[difficulty].blackbomb;
			}
		}
	}
}
var seconds;
var minutes;
var hours;

/*
function add() {
	seconds++;
	if (progressh3.childNodes.length > 4)
		progressh3.removeChild(progress.childNodes[4]);
	progressh3.appendChild(document.createTextNode(seconds));
	if (seconds >= 60) {
		seconds = 0;
		minutes++;
		if (progressh3childNodes.length > 2)
			progressh3removeChild(progress.childNodes[2]);
		progressh3appendChild(document.createTextNode(minutes));
	}
	if (minutes >= 60) {
		minutes = 0;
		hours++;
		if (progressh3childNodes.length > 0)
			progressh3removeChild(progress.childNodes[0]);
		progressh3appendChild(document.createTextNode(hours));
	}
}*/
// Function to start the game
function start(difficulty) {
	var progress = document.getElementById("progress");
	var i;
	var j;
	var cell;
	seconds = 0;
	minutes = 0;
	hours = 0;
	rightclick = false;
	discovered = 0;
	//t = clearTimeout(t);
	var nbombs = diff[difficulty].nbombs;
	var firstclick = false;
	nrow = diff[difficulty].nrow;
	ncol = diff[difficulty].ncol;
	var todiscover = (nrow*ncol-nbombs);
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
	board = positionBomb(ncol, nrow, nbombs, difficulty);
	for (i = 0; i < ncol; i++) {
		for (j = 0; j < nrow; j++) {
			if (board[i][j] !== 9)
				auxboard[i][j] = board[i][j] = verify(i, j, nrow, ncol);

		}

	}

	var table = document.getElementById(tableid[difficulty]);
	table.onclick = function(event) {
		var x = event.target.cellIndex;
		var y = event.target.parentNode.rowIndex;
		cell = table.rows[y].cells[x];
		if (firstclick === false && rightclick === false &&(board[x][y] === 9 || board[x][y] === -29)) {
			firstclick = true;
			//t = setInterval(add, 1000);
			cell.className = tdimg[difficulty].inte;
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
			table.rows[county].cells[countx].className = "td1";
			board[x][y] = 1;
			board[countx][county] = 9;
			
			for (i = 0; i < ncol; i++) {
				for (j = 0; j < nrow; j++) {
					if (board[i][j] !== 9)
						auxboard[i][j] = board[i][j] = verify(i, j, nrow, ncol);

				}
			}
			if (board[x][y] !== 0){ 
				setColor(x, y, nrow, ncol, difficulty);
				discovered++;}
			else{
				expand(x, y, nrow, ncol, difficulty);}
		} else if(rightclick === false && board[x][y] !== -2){
			if (firstclick === false) {
			//	t = setInterval(add, 1000);
				firstclick = true;
			}
			if ((board[x][y] === 9 || board[x][y] === -29) && !exploded) {
				ifhasBomb(x, y, ncol, nrow, difficulty);
				exploded = true;
			} else if (exploded) {
				 alert("GAME OVER");
				 start(difficulty);
			} else if (!(board[x][y] <= -10 && board[x][y] >= -19)) {
				if (board[x][y] !== 0 && board[x][y] !== -29) {
					setColor(x, y, nrow, ncol, difficulty);
					discovered++;
				} else if (board[x][y] === 0) {
					expand(x, y, nrow, ncol, difficulty);
					
				}
			}
		}
		if(todiscover === discovered){
			alert("CONGRATS! YOU WINNNNN");
				start(difficulty);
		}
	};
	
	// Received a right click
	table.oncontextmenu = function(event) {
		if(firstclick === true) {
			rightclick = true;
			x = event.target.cellIndex;
			y = event.target.parentNode.rowIndex;
			cell = table.rows[y].cells[x];
			table.onmousedown = function(e) {
				x = e.target.cellIndex;
				y = e.target.parentNode.rowIndex;
				if (e.button === 0 && e.which === 1 && board[x][y] === -2 && rightclick === true) {
					for ( var i = -1; i < 2; i++) {
						for ( var j = -1; j < 2; j++) {
							if (notoutoftable(i, j, x, y, ncol, nrow)
									&& (board[x + i][y + j] > -1 || (board[x
											+ i][y + j] < -19))) {
								table.rows[y + j].cells[x + i].className = tdimg[difficulty].bothbuttons;
							}
						}
					}
					table.onmouseup = function(e) {
						if (e.button === 0 && e.which === 1
								&& board[x][y] === -2) {
							var nbombs;
							for ( var i = -1; i < 2; i++) {
								for ( var j = -1; j < 2; j++) {
									if (notoutoftable(i, j, x, y, ncol, nrow)
											&& (board[x + i][y + j] > -1 || board[x
													+ i][y + j] < -19)) {
										table.rows[y + j].cells[x + i].className = tdimg[difficulty].inte;
									}
								}
							}
							nbombs = verifyAround(x, y, nrow, ncol);
							if (nbombs === auxboard[x][y]) {
								for ( var i = -1; i < 2; i++) {
									for ( var j = -1; j < 2; j++) {
										if (notoutoftable(i, j, x, y, ncol,
												nrow) 
												&& board[x + i][y + j] !== 9 && board[x + i][y + j] !== -29
												&& (board[x + i][y + j] > -1 || (board[x + i][y + j] < -19 
														&& board[x + i][y + j] > -29))) {
											expand(x + i, y + j, nrow, ncol,
													difficulty);
										} else if (notoutoftable(i, j, x, y,
												ncol, nrow)
												&& (board[x + i][y + j] === 9 || board[x
														+ i][y + j] === -29)) {
											ifhasBomb(x + i, y + j, ncol, nrow,
													difficulty);
											exploded = true;
										}
									}
								}

							}
						}
						else{rightclick = false;}
					};

				}
			};
			if (board[x][y] !== -2 && !exploded) {
				if (board[x][y] > -1) {
					board[x][y] -= (2 * board[x][y]);
					board[x][y] -= 10;
					bombrcl--;
					progress.removeChild(progress.childNodes[2]);
					progress.appendChild(document.createTextNode(bombrcl));
					cell.className = tdimg[difficulty].flag;
				} else if (board[x][y] < -9 && board[x][y] > -20) {
					board[x][y] -= 10;
					bombrcl++;
					progress.removeChild(progress.childNodes[2]);
					progress.appendChild(document.createTextNode(bombrcl));
					cell.appendChild(document.createTextNode("?"));
					cell.className = tdimg[difficulty].inte;
				} else if (board[x][y] < -19) {
					board[x][y] += 20;
					board[x][y] -= (2 * board[x][y]);

					if (cell.childNodes.length > 0)
						cell.removeChild(cell.childNodes[0]);
					cell.className = tdimg[difficulty].inte;
				}rightclick = false;
			}

			else if (exploded) {
				confirm("GAME OVER");
					start(difficulty);
			}
		}if(todiscover === discovered){
			alert("CONGRATS! YOU WINNNNN");
			start(difficulty);
		}
		return false;
	};

}
