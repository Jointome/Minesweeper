//board[x][y]={8,...,0} nº of bombs around
//board[x][y]={-10...-18} nº of bombs around while have selected a flag
//board[x][y]={-20..-28} nº of bombs around while have selected an interrogation point
//board[x][y]=-2 when the cell has been revealed
//when all board is set to -10 is game over it was set to show where the bombs were

var board;
var rows;
var cols;
var name;
var hours;
var mflags;
var seconds;
var minutes;
var exploded;
var rightclick;
var discovered;
//
var fooBar;
var honorarray = [10];
var honortime = [10];
clockMoving  = false;                
clockActive  = false;                
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


//cenas

function Jogador(nick, points){
	this.nick = nick;
	this.points = points;
}

var jogadores_scores = new Array();
//-------------------------------------------------
//Uses distinct css classes cells and sizes 
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


//validation form
function validateForm(name) {
    document.getElementById("usr").className="hidden";
	name = myForm.fname.value;
    document.getElementById("username").className="inlineblock";
    document.getElementById("usernameh3").appendChild(document.createTextNode(name));
}

//-----------------------------------------------------------------
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
function setColor(x, y, nrow, ncol, difficulty) {
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
		else{
			expand(x, y, nrow, ncol, difficulty);
		}
	}
	//Set it to -2 to say it has been discovered and set's is class name
	board[x][y] = -2;
	cell.className = tdimg[difficulty].read;
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
function expand(x, y, nrow, ncol, difficulty) {
	if(board[x][y] > -20 )
	discovered++;
	if (board[x][y] === 0 ) {
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
function showHonor(){
	document.getElementById("allhonorboard").style.display = "block";
	document.getElementById("honorboard").style.display = "block";
	document.getElementById("menubott").style.display = "block";
	var scores = document.getElementById("scores");
	//Eh so dos Acores e na sê apagá filhes!
	if(scores.childNodes.length > 0)
		while( scores.hasChildNodes() ){
    		scores.removeChild(scores.lastChild);
	}
	jogadores_scores.sort(compareFunction);
    for(var i = 0; i < jogadores_scores.length; i++){
		honorarray[i] = "Player:" + jogadores_scores[i].nick.toString() + "---" + jogadores_scores[i].points.toString() +"s";
		var para = document.createElement("p");
		var node = document.createTextNode(honorarray[i]);
		para.appendChild(node);
		scores.appendChild(para);
	}

	if(showHonordb){
		document.getElementById("allhonorboard").style.display = "none";
		document.getElementById("honorboard").style.display = "none";
		document.getElementById("menubott").style.display = "block";
		showHonordb = false;
	}else showHonordb = true;
}
/*
function changeHonor(){
    var scores = document.getElementById("scores");
  if(scores.childNodes.length>1){
    var child = scores.getElementsByTagName('p');
	scores.removeChild(child);
	}
    console.log(scores.childNodes.length);
    jogadores_scores.sort(compareFunction);
    for(var i = 0; i < jogadores_scores.length; i++){

    //TU AQUI NAO ESTAS A APAGAR ALGO QUE NAO DEVIAS DE APAGAR? A POSICAO 0 TEM LA UM GAJO!
    
	honorarray[0] = "Player:" + jogadores_scores[0].nick.toString() + "---" + jogadores_scores[0].points.toString() +"s";
	var para = document.createElement("p");
       var node = document.createTextNode(honorarray[0]);
       var child = scores.childNodes[0];
	para.appendChild(node);
       scores.appendChild(para);
       scores.replaceChild(para,child);
       
    }
}
*/

// Function to hide start menu and display the game page
function fromHomeMenu(difficulty) {
	document.getElementById("home_page").style.display = "none";
	document.getElementById("gamepage").style.display = "block";
	fooBar = difficulty;
	start(fooBar);
}

//dispays home and hides the game page
function goHome() {
	document.getElementById("home_page").style.display = "block";
	document.getElementById("gamepage").style.display = "none";
}

//It shows the bombs when a person lose
function ifhasBomb(x, y, ncol, nrow, difficulty) {
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
function start(difficulty) {

	hours = 0;
	seconds = 0;
	minutes = 0;
	discovered = 0;	
	exploded = false;
	rightclick = false;
	nrow = diff[difficulty].nrow;
	ncol = diff[difficulty].ncol;
	
	var i;
	var j;
	var cell;
	var auxboard;
	var firstclick = false;
	var nbombs = diff[difficulty].nbombs;
	var bombrcl = nbombs;
	var todiscover = (nrow*ncol-nbombs);
    var progress = document.getElementById("countFlag");
/* 
    for(i=0;i<2;i++){
    var playa = new Jogador(myForm.fname.value, clockCurrent);
    jogadores_scores.push(playa);
    //nem sei se isto funciona
    jogadores_scores.sort(compareFunction);
	changeHonor();}
*/
	//Creates a table
	createTable(difficulty, nrow, ncol);

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
	board = positionBomb(ncol, nrow, nbombs, difficulty);
	
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
		if (firstclick === false && rightclick === false &&(board[x][y] === 9 || board[x][y] === -29)) {
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
			table.rows[county].cells[countx].className = "td1";
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
			if (board[x][y] !== 0 && board[x][y] !== -20){ 
				setColor(x, y, nrow, ncol, difficulty);
				discovered++;}
			else{
				expand(x, y, nrow, ncol, difficulty);}
		}
		//if is a click and hasn't the right button on the mous down
		else if(rightclick === false && board[x][y] !== -2){
			//If is the firstclick sets the clock
			if (firstclick === false) {
				clockStart();
				firstclick = true;
			}
			//If is on a bomb and it hasn't already exploded and explodes
			if ((board[x][y] === 9 || board[x][y] === -29) && !exploded) {
				ifhasBomb(x, y, ncol, nrow, difficulty);
				exploded = true;
			}
			//if already has exploded starts the game again
			else if (exploded) {
				 alert("GAME OVER");
				 clockClear();
				 start(difficulty);
			} 
			//if it hasn't a flag shows it
			else if (!(board[x][y] <= -10 && board[x][y] >= -19)) {
				if (board[x][y] !== 0 && board[x][y] !== -20) {
					setColor(x, y, nrow, ncol, difficulty);
					discovered++;
				} else if (board[x][y] === 0 || board[x][y] === -20) {
					expand(x, y, nrow, ncol, difficulty);
					
				}
			}
		}console.log(todiscover + " " + discovered);
		//if the cells have been all discovered
		if(todiscover === discovered){
			clockStop();
			alert("CONGRATS! YOU WINNNNN");
			//TRETA
			var playa = new Jogador(myForm.fname.value, clockCurrent);
			jogadores_scores.push(playa);
			//nem sei se isto funciona
			jogadores_scores.sort(compareFunction);
			showHonor();
			clockClear();
			//start(difficulty);
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
								&& board[x][y] === -2) {
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
												&& board[x + i][y + j] !== 9 && board[x + i][y + j] !== -29
												&& (board[x + i][y + j] > -1 || (board[x + i][y + j] < -19 
														&& board[x + i][y + j] > -29))) {
											if(board[x + i][y + j] === 0){
												expand(x + i, y + j, nrow, ncol,difficulty);
											}
											else {
												setColor(x+i, y+j, nrow, ncol, difficulty);
												discovered++;
											}
										}
										//if it has bomb explodes
										else if (notoutoftable(i, j, x, y,
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
						//if the right button has been released set it to false
						else{rightclick = false;}
					};

				}
			};
			//If isn't in a discovered cell
			if (board[x][y] !== -2 && !exploded) {
				//if is a cell not manipuleted insert a flag
				if (board[x][y] > -1) {
					board[x][y] -= (2 * board[x][y]);
					board[x][y] -= 10;
					bombrcl--;
					if(progress.childNodes.length > 0)
						progress.removeChild(progress.childNodes[0]);
					progress.appendChild(document.createTextNode(bombrcl));
					cell.className = tdimg[difficulty].flag;
				}
				//if it has a flag turns to an interrogation point
				else if (board[x][y] < -9 && board[x][y] > -20) {
					board[x][y] -= 10;
					bombrcl++;
					if(progress.childNodes.length > 0)
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
				}rightclick = false;
			}
			//if it has exploded
			else if (exploded) {
				confirm("GAME OVER");
				clockClear();
					start(difficulty);
			}
		}
		//if the user has discovered all bombs
		if(todiscover === discovered){
			alert("CONGRATS! YOU WINNNNN");
			clockClear();
			start(difficulty);
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
   
     if (tempClock == -1) { tempClock = 0; }
     while(tempClock >= 60){
    	 tempClock-=60;
    	 digitm++;
    	 if(digitm===60){
    		 digitm = 0;
    		 digith++;
    		 }
     }
     digit = tempClock;
     var sec = digit;
     var min = digitm;
     var hou = digith;
     if(digit < 10){
    	 sec = "0" + digit;
     }
     if(digitm < 10){
    	 min = "0" + digitm;
     }
     if(digith < 10){
    	 hou = "0" + digith;
     }
	 document.getElementById("progressh3").innerHTML = hou + ":" + min + ":" + sec;
	}

	function ticClock() {
      if (clockMoving) {
         ++ clockCurrent; }
      if ((clockMoving)) // Max out display at 999?
         updateClock(); 
      clockActive = clockMoving;
      if (clockActive)  {          
         id = setTimeout("ticClock()",1000); } 
	}



  function clockStop() {
   clockMoving = false; }

  function clockClear() {
   if ((!clockMoving) && (clockCurrent != 0)) {
      clockCurrent = 0;
      updateClock(); }
   clockCurrent = -1;
   clockMoving = false; 
   updateClock();
   if(clockActive)
   	clearTimeout(id);
  }

	function clockStart() {
   clockWasActive = clockActive;
   clockMoving = true;
   ticClock();
	}	
	

function compareFunction(a,b){
	if(a.points < b.points) return -1;
	else return 1;
}
