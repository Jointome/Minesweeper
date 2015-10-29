//board[x][y]=9 : localização das bombas

var board;
var nbandeiras;
var rows;
var cols;
easy = {nrow:9,ncol:9,nbombs:10};
medium = {nrow:16,ncol:16,nbombs:40};
hard = {nrow:16,ncol:30,nbombs:99};
diff = [easy,medium,hard];

//função que cria a tabela
function createTable(difficulty, rows, cols) {
	var i;
	var row;
	var j;
	var cell;
	var place = document.getElementById("game"), table = document
			.createElement("table");
	place.textContent = '';
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
	var table = document.getElementById("ide");
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
		table.rows[y].cells[x].style.backgroundColor = 'red';
	}
	return board;
}

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
function setColor(x, y, difficulty) {
	var table = document.getElementById("ide");
	var cell = table.rows[y].cells[x];
	if (board[x][y] > 0)
		cell.innerHTML = board[x][y];
	else if(board[x][y] < 0 && board[x][y] > -7){
		board[x][y] -= (2 * board[x][y]);console.log(board[x][y]);
		cell.innerHTML = board[x][y];
	table.rows[y].cells[x].style.backgroundImage = 'none';
	}
	else{table.rows[y].cells[x].style.backgroundImage = 'none';}
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
	//cell.style.backgroundColor = "#EBEBEB";
	//cell.style.textAlign = "center";
	cell.id = "difftd";
}

function expand(x, y, board, nrow, ncol, difficulty) {
	var table = document.getElementById("ide");
	
	if (board[x][y] === 0) {
		board[x][y] = -7;
		for ( var i = -1; i < 2; i++)
			for ( var j = -1; j < 2; j++)
				if (((x + i >= 0) && (x + i <= ncol))
						&& ((y + j >= 0) && (y + j <= nrow))
						&& !((i === x) && (j === y)))
					expand(x + i, y + j, board, nrow, ncol, difficulty);
	}
	setColor(x, y, difficulty);
	if (board[x][y] !== 0) {
		board[x][y] = -7;
	}
}

function fromStartMenu(difficulty){
	document.getElementById("start_page").style.display = "none";
	document.getElementById("gamepage").style.display = "block";
	start(difficulty);
}

function start(difficulty) {
	
	
	var i;
	var j;
	var nbombs;
		nrow = diff[difficulty].nrow;
		ncol = diff[difficulty].ncol;;
		nbombs = diff[difficulty].nbombs;
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
	table.onclick = function(event) {
		var x = event.target.cellIndex;
		var y = event.target.parentNode.rowIndex;
		if (board[x][y] === 9) {
			table.rows[y].cells[x].style.backgroundImage = "url('Bomb.jpeg')";
			if (difficulty === 0) {
				table.rows[y].cells[x].style.backgroundSize = '30px 30px';
			} else if (difficulty === 1) {
				table.rows[y].cells[x].style.backgroundSize = '25px 25px';
			} else if (difficulty === 2) {
				table.rows[y].cells[x].style.backgroundSize = '20px 20px';
			}
			for(i = 0; i < ncol; i++){
				for(j = 0; j < nrow ; j++){
					if(board[i][j] === 9 && ((i !== x) || (j !== y))){
						table.rows[j].cells[i].style.backgroundImage = "url('BombBl.jpg')";
						if (difficulty === 0) {
							table.rows[j].cells[i].style.backgroundSize = '30px 30px';
						} else if (difficulty === 1) {
							table.rows[j].cells[i].style.backgroundSize = '25px 25px';
						} else if (difficulty === 2) {
							table.rows[j].cells[i].style.backgroundSize = '20px 20px';
						}
					}
					board[i][j]=8;
				}
			}
		}
		else if(board[x][y]===8){
			var conf = confirm("GAME OVER");
			if (conf == true) {
				start(difficulty);
		}
		} else {
			if (board[x][y] > 0) {
				setColor(x, y, difficulty);
			} else if (board[x][y] === 0) {
				expand(x, y, board, nrow - 1, ncol - 1, difficulty);
			}
		}
	};
	table.oncontextmenu = function(event) {
		x = event.target.cellIndex;
		y = event.target.parentNode.rowIndex;
		if (board[x][y] > -1) {
			board[x][y] -= (2 * board[x][y]);
			table.rows[y].cells[x].style.backgroundImage = "url('2000px-Minesweeper_flag.svg.png')";
			if (difficulty === 0) {
				table.rows[y].cells[x].style.backgroundSize = '30px 30px';
			} else if (difficulty === 1) {
				table.rows[y].cells[x].style.backgroundSize = '25px 25px';
			} else if (difficulty === 2) {
				table.rows[y].cells[x].style.backgroundSize = '20px 20px';
			}
		}
		else if(board[x][y] < 0 && board[x][y] !== -7){
			board[x][y] -= (2 * board[x][y]);
			table.rows[y].cells[x].style.backgroundImage = 'none';
			table.rows[y].cells[x].style.backgroundColor = 'gray';
			if (difficulty === 0) {
				table.rows[y].cells[x].style.backgroundSize = '30px 30px';
			} else if (difficulty === 1) {
				table.rows[y].cells[x].style.backgroundSize = '25px 25px';
			} else if (difficulty === 2) {
				table.rows[y].cells[x].style.backgroundSize = '20px 20px';
			}
		}
		else if(board[x][y] === 8){
			var conf = confirm("GAME OVER");
			if (conf == true) {
				start(difficulty);
		}
		}
		return false;
	};
}
