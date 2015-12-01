//board[x][y]={8,...,0} nº of bombs around
//board[x][y]={-10...-18} nº of bombs around while have selected a flag
//board[x][y]={-20..-28} nº of bombs around while have selected an interrogation point
//board[x][y]=-2 when the cell has been revealed
//when all board is set to -10 is game over it was set to show where the bombs were

var board;
var rows;
var cols;
var name = "Player1";
var hours;
var mflags;
var seconds;
var minutes;
var exploded;
var rightclick;
var discovered;
var honoreasy = [];
var honormedium = [];
var honorhard = [];
var honorarray = [ honoreasy, honormedium, honorhard ];
var jogadores_easy = [];
var jogadores_hard = [];
var jogadores_medium = [];
var jogadores_scores = [ jogadores_easy, jogadores_medium, jogadores_hard ];
var allhonor = false;
var difficulty;
var online = false;
var inGame = false;
clockMoving = false;
clockActive = false;
clockCurrent = -1;
// HONOR SHOW AND HIDE
showHonordb = false;

//Defines which board and number of bombs
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

//-------------------------------------------------
//Uses distinct css classes cells and sizes 
tdeasy = {
	flag : "td2",
	inte : "td3",
	read : "td4",
	redbomb : "td5",
	blackbomb : "td6",
	bothbuttons : "td17",
	changebuttons : "Easy"
};
tdmedium = {
	flag : "td7",
	inte : "td8",
	read : "td9",
	redbomb : "td10",
	blackbomb : "td11",
	bothbuttons : "td18",
	changebuttons : "Medium"
};
tdhard = {
	flag : "td12",
	inte : "td13",
	read : "td14",
	redbomb : "td15",
	blackbomb : "td16",
	bothbuttons : "td19",
	changebuttons : "Hard"
};
tdimg = [ tdeasy, tdmedium, tdhard ];



function signOut() {
    		inGame = false;
		        online = false;
			user = "";
		        pass = "";
	document.getElementById('usr').classList.add('inlineblock');
	document.getElementById('usr').classList.remove('hidden');
	name = "Player1";
	document.getElementById('username').classList.add('hidden');
	document.getElementById('username').classList.remove('inlineblock');
	document.getElementById('signout').classList.remove('inlineblock');
	document.getElementById('signout').classList.add('hidden');
    document.getElementById('usernameh3').removeChild(document.getElementById('usernameh3').childNodes[3]);
    document.getElementById('usernameid').focus();
	
}

function Jogador(nick, points) {
	this.nick = nick;
	this.points = points;
}


function showbuttons(which){
    document.getElementById('butoesonoff').classList.add('hidden');
    if(which === 0){
	document.getElementById('onlines').classList.remove('hidden');
	document.getElementById('onlines').classList.add('block');
    }
    else{
	document.getElementById('offlines').classList.add('block');
	document.getElementById('offlines').classList.remove('hidden');
    }
}

// Function to hide start menu and display the game page
function fromHomeMenu(diff) {
	difficulty = diff;
	document.getElementById('home_page').classList.add('hidden');
	document.getElementById('home_page').classList.remove('block');
	document.getElementById('gamepage').classList.add('block');
	document.getElementById('gamepage').classList.remove('hidden');
	document.getElementById('allhonorboard').classList.add('hidden');
	document.getElementById('allhonorboard').classList.remove('block');
	document.getElementById('honorboard').classList.add('hidden');
	document.getElementById('honorboard').classList.remove('block');
	document.getElementById('qualquer12').classList.remove('hidden');
	document.getElementById('qualquer12').classList.add('inlineblock');


	for ( var i = 0; i < 3; i++) {
		document.getElementById(tdimg[1].changebuttons).classList
				.add('inlineblock');
		document.getElementById(tdimg[i].changebuttons).classList
				.remove('hidden');
		document.getElementById(tdimg[i].changebuttons).classList
				.remove('nofu');
	}
	document.getElementById(tdimg[difficulty].changebuttons).classList
			.add('hidden');
	document.getElementById(tdimg[difficulty].changebuttons).classList
			.remove('inlineblock');
	if (difficulty === 0)
		document.getElementById(tdimg[1].changebuttons).classList.add('nofu');
	else
		document.getElementById(tdimg[0].changebuttons).classList.add('nofu');
	start();
}
//-----------------------------------------------------------------
// Function to create a Table
function createTable(rows, cols, place2) {
	var i;
	var row;
	var j;
	var place3 = document.getElementById("game");
	var place4 = document.getElementById("vsgamepage");
	place4.textContent = '';
	place3.textContent = '';
	var place = document.getElementById(place2), table = document
			.createElement("table");

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
function positionBomb(cols, rows, nbombs) {
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
		//table.rows[y].cells[x].className = "td1";
	}
	return board;
}

//----------------------------------------------------------------------------
//Function that verifies how many flags are around a certain cell
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

//-----------------------------------------------------------------------------------------------
// Function that verifies how many bombs each cell as around it to place it in the board
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

//---------------------------------------------------------------------------------------------
//set a css class for a cell in a specific situation
function setColor(x, y, nrow, ncol) {
	var table = document.getElementById(tableid[difficulty]);
	var cell = table.rows[y].cells[x];
	//if is a cell without flag interrogation point or has been discovered
	if (board[x][y] > 0) {
		if (cell.childNodes.length === 0)
			cell.appendChild(document.createTextNode(board[x][y]));
	}//if it has an interrogation point sets it like the one before
	else if (board[x][y] < -19) {
		board[x][y] += 20;
		board[x][y] -= (2 * board[x][y]);
		cell.removeChild(cell.childNodes[0]);
		//if is not a zero put a number on the cell
		if (board[x][y] !== 0)
			cell.appendChild(document.createTextNode(board[x][y]));
		//if is a zero expands
		else {
			expand(x, y, nrow, ncol);
		}
	}
	//Set it to -2 to say it has been discovered and set's is class name
	
	cell.className = tdimg[difficulty].read;

	if(board[x][y] === 1 || board[x][y] === 9)
			table.rows[y].cells[x].classList.add('blue');
    	else if(board[x][y] === 2)
			table.rows[y].cells[x].classList.add('green');
    	else
			table.rows[y].cells[x].classList.add('red');

	board[x][y] = -2;
}

//----------------------------------------------------------------------------------------------
//Verifies if it's inside the table
function notoutoftable(i, j, x, y, ncol, nrow) {
	if (((x + i >= 0) && (x + i <= ncol - 1))
			&& ((y + j >= 0) && (y + j <= nrow - 1))) {
		return true;
	}
	return false;
}

// Function that opens all cells around if it has no bombs around
function expand(x, y, nrow, ncol) {
	if (board[x][y] > -20)
		discovered++;
	if (board[x][y] === 0) {
		board[x][y] = -2;
		for ( var i = -1; i < 2; i++)
			for ( var j = -1; j < 2; j++)
				if (notoutoftable(i, j, x, y, ncol, nrow)
						&& board[x + i][y + j] !== -2) {
					expand(x + i, y + j, nrow, ncol);
				}
	}
	if (!(board[x][y] <= -10 && board[x][y] >= -19)) {
		setColor(x, y, nrow, ncol);
		} 
}
//To show the honor board
function getMenuback() {
	document.getElementById('allhonorboard').classList.add('hidden');
	document.getElementById('allhonorboard').classList.remove('block');
	document.getElementById('honorboard').classList.add('hidden');
	document.getElementById('honorboard').classList.remove('block');
	document.getElementById('menubott').classList.add('block');
	document.getElementById('menubott').classList.remove('hidden');
}
function showAllHonor() {
	if (!allhonor) {
		document.getElementById('allhonorboard').classList.add('block');
		document.getElementById('allhonorboard').classList.remove('hidden');
		document.getElementById('honorboard').classList.add('block');
		document.getElementById('honorboard').classList.remove('hidden');
		var scores = document.getElementById("scores");
		if (scores.childNodes.length > 0)
			while (scores.hasChildNodes()) {
				scores.removeChild(scores.lastChild);
			}
		for ( var j = 0; j < 3; j++) {
			var para = document.createElement("h3");
			var node = document.createTextNode(tdimg[j].changebuttons);
			para.appendChild(node);
			scores.appendChild(para);
			if (jogadores_scores[j].length - 1 > 3)
				jogadores_scores[j].pop();

			for ( var i = 0; i < jogadores_scores[j].length; i++) {
				honorarray[j][i] = "Player:  "
						+ jogadores_scores[j][i].nick.toString() + " --- "
						+ jogadores_scores[j][i].points.toString() + "s";
				var para = document.createElement("p");
				var node = document.createTextNode(honorarray[j][i]);
				para.appendChild(node);
				scores.appendChild(para);
			}
		}
		allhonor = true;
	} else {
		document.getElementById('allhonorboard').classList.add('hidden');
		document.getElementById('allhonorboard').classList.remove('block');
		document.getElementById('honorboard').classList.add('hidden');
		document.getElementById('honorboard').classList.remove('block');
		allhonor = false;
	}
}
function showHonor() {
	document.getElementById('allhonorboard').classList.add('block');
	document.getElementById('allhonorboard').classList.remove('hidden');
	document.getElementById('honorboard').classList.add('block');
	document.getElementById('honorboard').classList.remove('hidden');
	document.getElementById('menubott').classList.add('hidden');
	document.getElementById('menubott').classList.remove('block');
	var scores = document.getElementById("scores");
	if (scores.childNodes.length > 0)
		while (scores.hasChildNodes()) {
			scores.removeChild(scores.lastChild);
		}
	//console.log(jogadores_scores[difficulty].length);
	if(!inGame){
	if (jogadores_scores[difficulty].length - 1 > 3)
		jogadores_scores[difficulty].pop();

	for ( var i = 0; i < jogadores_scores[difficulty].length; i++) {
		honorarray[difficulty][i] = "Player:"
				+ jogadores_scores[difficulty][i].nick.toString() + " --- "
				+ jogadores_scores[difficulty][i].points.toString() + "s";
		var para = document.createElement("p");
		var node = document.createTextNode(honorarray[difficulty][i]);
		para.appendChild(node);
		scores.appendChild(para);
	}
	}
	if(online && inGame)
	callRanking();
}

//To manipulate Honor Board
function changeHonor() {
	var scores = document.getElementById("scores");
	if (scores.childNodes.length > 0)
		while (scores.hasChildNodes()) {
			scores.removeChild(scores.lastChild);
		}
	if (jogadores_scores[difficulty].length > 10)
		jogadores_scores[difficulty].pop();
	for ( var i = 0; i < jogadores_scores[difficulty].length; i++) {
		honorarray[difficulty][i] = "Player:"
				+ jogadores_scores[difficulty][i].nick.toString() + " --- "
				+ jogadores_scores[difficulty][i].points.toString() + "s";
		var para = document.createElement("p");
		var node = document.createTextNode(honorarray[difficulty][i]);
		para.appendChild(node);
		scores.appendChild(para);
	}
}

function getBackwinner() {
	document.getElementById('winner').classList.add('hidden');
	document.getElementById('winner').classList.remove('block');
	document.getElementById('gamepage').classList.add('block');
	document.getElementById('gamepage').classList.remove('hidden');
}
function getBackloser() {
	document.getElementById('loser').classList.add('hidden');
	document.getElementById('loser').classList.remove('block');
	document.getElementById('gamepage').classList.add('block');
	document.getElementById('gamepage').classList.remove('hidden');
}

//dispays home and hides the game page
function goHome() {
	if(!inGame){
	    document.getElementById('winnerbutt').classList.add('hidden');
	    document.getElementById('loserbutt').classList.add('hidden');
	    document.getElementById('winnerbutton').classList.add('hidden');
	    document.getElementById('loserbutton').classList.add('hidden');
	    document.getElementById('winnerbutt').classList.remove('block');
	    document.getElementById('winnerbutton').classList.remove('block');
	    document.getElementById('loserbutt').classList.remove('block');
	    document.getElementById('loserbutton').classList.remove('block');
	    document.getElementById('winner').classList.add('hidden');
	    document.getElementById('loser').classList.add('hidden');
	    document.getElementById('winner').classList.remove('block');
	    document.getElementById('loser').classList.remove('block');
	    document.getElementById('allhonorboard').classList.add('hidden');
	    document.getElementById('allhonorboard').classList.remove('block');
	    document.getElementById('honorboard').classList.add('hidden');
	    document.getElementById('honorboard').classList.remove('block');
	    document.getElementById('menubott').classList.add('block');
	    document.getElementById('menubott').classList.remove('hidden');
	    document.getElementById('home_page').classList.add('block');
	    document.getElementById('home_page').classList.remove('hidden');
	    document.getElementById('gamepage').classList.add('hidden');
	    document.getElementById('gamepage').classList.remove('block');
	    document.getElementById('onlines').classList.add('hidden');
	    document.getElementById('onlines').classList.remove('block');
	    document.getElementById('offlines').classList.remove('block');
	    document.getElementById('offlines').classList.add('hidden');
	    document.getElementById('butoesonoff').classList.remove('hidden');
	    document.getElementById('canvasdiv').classList.add('hidden');
	    document.getElementById('progress').classList.remove('hidden');
	    
	}
}
//It shows the bombs when a person lose
function ifhasBomb(x, y, ncol, nrow) {
	var table = document.getElementById(tableid[difficulty]);
	var i;
	var j;
	clockStop();
	var cell = table.rows[y].cells[x];
	//If is the bomb the user has lost
	if (cell.childNodes.length > 0)
		cell.removeChild(cell.childNodes[0]);
	cell.className = tdimg[difficulty].redbomb;
	//the other bombs
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

// Function to start the game
function start() {
	inGame = false;
    hours = 0;
    seconds = 0;
    minutes = 0;
    discovered = 0;
    exploded = false;
    rightclick = false;
    nrow = diff[difficulty].nrow;
    ncol = diff[difficulty].ncol;
    allhonor = false;
    
    var i;
    var j;
    var cell;
    var auxboard;
    var firstclick = false;
    var nbombs = diff[difficulty].nbombs;
    var bombrcl = nbombs;
    var todiscover = (nrow * ncol - nbombs);
    var progress = document.getElementById("countFlag");
    var node = document.createTextNode(nbombs);
    var child = progress.childNodes[0];
    var finished=false;

    progress.replaceChild(node, child);

    //Creates a table
    createTable(nrow, ncol, "game");
    
    //creates a multidimensional array that it is used for everything
    board = [ ncol ];
    auxboard = [ ncol ];
    for (i = 0; i < ncol; i++) {
	board[i] = [ nrow ];
	auxboard[i] = [ nrow ];
	for (j = 0; j < nrow; j++) {
	    board[i][j] = auxboard[i][j] = 0;
	}
    }

    //Places the bombs on the array
  board = positionBomb(ncol, nrow, nbombs);

    //sets the number of bombs around each cell on it position
    for (i = 0; i < ncol; i++) {
	for (j = 0; j < nrow; j++) {
	    if (board[i][j] !== 9)
		auxboard[i][j] = board[i][j] = verify(i, j, nrow, ncol);

	}
    }
    var table = document.getElementById(tableid[difficulty]);
    clockClear();

    //If it has a click
    table.onclick = function(event) {
	var x = event.target.cellIndex;
	var y = event.target.parentNode.rowIndex;
	cell = table.rows[y].cells[x];

	//If it is the firstclick and is on a bomb
	if (firstclick === false && rightclick === false
	    && board[x][y] === 9) {
	    firstclick = true;
	    clockStart();
	    cell.className = tdimg[difficulty].inte;

	    //put's the bomb on the left corner if it hasn't a bomb
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
	    //Opens the cell that the user has clicked
	    //table.rows[county].cells[countx].className = "td1";
	    board[x][y] = 1;
	    board[countx][county] = 9;

	    //Sets the number of bombs again on each cell
	    for (i = 0; i < ncol; i++) {
		for (j = 0; j < nrow; j++) {
		    if (board[i][j] !== 9)

			auxboard[i][j] = board[i][j] = verify(i, j, nrow, ncol);

		}
	    }

	    //if it is diferent then a zero only shows the cell if not it expends all the cells around and shows it
	    if (board[x][y] !== 0 && board[x][y] !== -20) {
		setColor(x, y, nrow, ncol);
		discovered++;
	    } else {
		expand(x, y, nrow, ncol);
	    }
	}
	//if is a click and hasn't the right button on the mous down
	else if (rightclick === false && board[x][y] !== -2)
	    //If is the firstclick sets the clock
	    if (firstclick === false) {
		clockStart();
		firstclick = true;
	    }
	//If is on a bomb and it hasn't already exploded and explodes
	if ((board[x][y] === 9 || board[x][y] === -29) && !exploded && !(todiscover === discovered)) {
	    ifhasBomb(x, y, ncol, nrow);
	    exploded = true;
	}
	//if already has exploded starts the game again
	//if it hasn't a flag shows it
	else if (!(board[x][y] <= -10 && board[x][y] >= -19) && !exploded && board[x][y] !== -2 && !(todiscover === discovered)) {
	    if (board[x][y] !== 0 && board[x][y] !== -20) {
		setColor(x, y, nrow, ncol);
		discovered++;
	    } else if (board[x][y] === 0 || board[x][y] === -20) {
		expand(x, y, nrow, ncol);

	    }
	}
    if(exploded) {
	    document.getElementById('loser').classList.add('block');
	    document.getElementById('loser').classList.remove('hidden');
	    document.getElementById('gamepage').classList.add('hidden');
	    document.getElementById('gamepage').classList.remove('block');
	document.getElementById('loserbutt').classList.remove('hidden');
	    document.getElementById('loserbutt').classList.add('block');

	    getMenuback();
	    clockClear();
    }
    //if the cells have been all discovered
    if (todiscover === discovered) {
	clockStop();
	document.getElementById('winner').classList.add('block');
	document.getElementById('winner').classList.remove('hidden');
	document.getElementById('gamepage').classList.add('hidden');
	document.getElementById('gamepage').classList.remove('block');
	document.getElementById('winnerbutt').classList.remove('hidden');
	document.getElementById('winnerbutt').classList.add('block');
	document.getElementById('loserbutt').classList.add('block');

	getMenuback();
	if(!finished){
	    finished = true;
	    var playa = new Jogador(name, clockCurrent);
	    jogadores_scores[difficulty].push(playa);
	    if (jogadores_scores[difficulty].length > 1)
		jogadores_scores[difficulty].sort(compareFunction);
	    changeHonor();
	    clockClear();
	}
    }
};

    // Received a right click
    table.oncontextmenu = function(event) {
	if (firstclick === true) {
	    rightclick = true;
	    x = event.target.cellIndex;
	    y = event.target.parentNode.rowIndex;
	    cell = table.rows[y].cells[x];
	    
	    table.onmousedown = function(e) {
		x = e.target.cellIndex;
		y = e.target.parentNode.rowIndex;
		if (e.button === 0 && e.which === 1 && board[x][y] === -2
		    && rightclick) {
		    //received a right followed by a left click sets all around it gray
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
			    && board[x][y] === -2 && rightclick) {
			    //if left button is set up it puts all aroud lightgray again
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
			    //then verifies if it has the number of flags equal to the number of bombs around
			    nbombs = verifyAround(x, y, nrow, ncol);
			    if (nbombs === auxboard[x][y]) {
				for ( var i = -1; i < 2; i++) {
				    for ( var j = -1; j < 2; j++) {
					//if it is a cell without a bomb and a flag
					if (notoutoftable(i, j, x, y, ncol,
							  nrow)
					    && board[x + i][y + j] !== 9
					    && board[x + i][y + j] !== -29
					    && (board[x + i][y + j] > -1 || (board[x
										   + i][y + j] < -19 && board[x
													      + i][y + j] > -29))) {
					    if (board[x + i][y + j] === 0) {
						expand(x + i, y + j, nrow, ncol);
					    } else {
						setColor(x + i, y + j, nrow,
							 ncol);
						discovered++;
					    }
					}
					//if it has bomb it explodes
					else if (notoutoftable(i, j, x, y,
							       ncol, nrow)
						 && (board[x + i][y + j] === 9 || board[x
											+ i][y + j] === -29)) {
					    ifhasBomb(x + i, y + j, ncol, nrow);
					    exploded = true;
					}
				    }
				}

			    }
			    			console.log("preso");

			}
			//if the right button has been released set it to false
			else {
				console.log("nunca aqui estive!");
			    rightclick = false;
			}
		    };

		}
	    };
	    //If isn't in a discovered cell
	    if (board[x][y] !== -2 && !exploded && !(todiscover === discovered)) {
		//if is a cell not manipuleted insert a flag
		if (board[x][y] > -1) {
		    board[x][y] -= (2 * board[x][y]);
		    board[x][y] -= 10;
		    bombrcl--;
		    if (progress.childNodes.length > 0)
			progress.removeChild(progress.childNodes[0]);
		    progress.appendChild(document.createTextNode(bombrcl));
		    cell.className = tdimg[difficulty].flag;
		}
		//if it has a flag turns to an interrogation point
		else if (board[x][y] < -9 && board[x][y] > -20) {
		    board[x][y] -= 10;
		    bombrcl++;
		    if (progress.childNodes.length > 0)
			progress.removeChild(progress.childNodes[0]);
		    progress.appendChild(document.createTextNode(bombrcl));
		    cell.appendChild(document.createTextNode("?"));
		    cell.className = tdimg[difficulty].inte;
		}
		//if it has an interrogation point sets it to not manipulated
		else if (board[x][y] < -19) {
		    board[x][y] += 20;
		    board[x][y] -= (2 * board[x][y]);
		    if (cell.childNodes.length > 0)
			cell.removeChild(cell.childNodes[0]);
		    cell.className = tdimg[difficulty].inte;
		}
		rightclick = false;
	    }
	    //if it has exploded
	    if (exploded) {
		if(!finished){
		    finished=true;
		    document.getElementById('loser').classList.add('block');
		    document.getElementById('loser').classList.remove('hidden');
		    document.getElementById('gamepage').classList.add('hidden');
		    document.getElementById('gamepage').classList.remove('block');
		    document.getElementById('loserbutt').classList.remove('hidden');
		    document.getElementById('loserbutt').classList.add('block');
		    getMenuback();
		    clockClear();
		}
	    }
	}
	//if the user has discovered all bombs
	if (todiscover === discovered) {
	    clockStop();
	    document.getElementById('winner').classList.add('block');
	    document.getElementById('winner').classList.remove('hidden');
	    document.getElementById('gamepage').classList.add('hidden');
	    document.getElementById('gamepage').classList.remove('block');
	    document.getElementById('winnerbutt').classList.remove('hidden');
	document.getElementById('winnerbutt').classList.add('block');

	    getMenuback();
	    if(!finished){
		finished=true;
		var playa = new Jogador(name, clockCurrent);
		jogadores_scores[difficulty].push(playa);
		if (jogadores_scores[difficulty].length > 1)
		    jogadores_scores[difficulty].sort(compareFunction);
		changeHonor();
		clockClear();
	    }
	}
	return false;

    };
}

//updates the clock
function updateClock() {
    tempClock = clockCurrent;
    var digit = 0;
    var digitm = 0;
    var digith = 0;

    if (tempClock == -1) {
	tempClock = 0;
    }
    while (tempClock >= 60) {
	tempClock -= 60;
	digitm++;
	if (digitm === 60) {
	    digitm = 0;
	    digith++;
		}
	}
	digit = tempClock;
	var sec = digit;
	var min = digitm;
	var hou = digith;
	if (digit < 10) {
		sec = "0" + digit;
	}
	if (digitm < 10) {
		min = "0" + digitm;
	}
	if (digith < 10) {
		hou = "0" + digith;
	}
	document.getElementById("progressh3").innerHTML = hou + ":" + min + ":"
			+ sec;
}

function ticClock() {
	if (clockMoving) {
		++clockCurrent;
	}
	if ((clockMoving)) // Max out display at 999?
		updateClock();
	clockActive = clockMoving;
	if (clockActive) {
		id = setTimeout("ticClock()", 1000);
	}
}

function clockStop() {
	clockMoving = false;
}

function clockClear() {
	if ((!clockMoving) && (clockCurrent != 0)) {
		clockCurrent = 0;
		updateClock();
	}
	clockCurrent = -1;
	clockMoving = false;
	updateClock();
	if (clockActive)
		clearTimeout(id);
}

function clockStart() {
	clockWasActive = clockActive;
	clockMoving = true;
	ticClock();
}

function compareFunction(a, b) {
	if (a.points < b.points)
		return -1;
	else
		return 1;
}
