//board[x][y]=1 : localização das bombas
//board[x][y]=2 : posiçoes colocadas pelo jogador(lado esquerdo do rato)

var board;
var nbandeiras;
var rows;
var cols;


function createTable(dificulty, rows, cols){
var i;
var row;
var j;
var cell;
var place = document.getElementById("game"),	
	table = document.createElement("table");
table.id="ide";
if(dificulty === 0){
table.style.width  = '250px';
table.style.height  = '250px';
}
else if (dificulty == 1 ){
	table.style.width  = '400px';
	table.style.height  = '400px';
}
else{
	table.style.width  = '630px';
	table.style.height  = '400px';
}
table.style.border = '1px solid black';
table.style.cursor = 'pointer';
	for(i = 0; i < rows;++i){
		row = table.insertRow();
		for(j = 0; j < cols; ++j){
			cell = row.insertCell();
				cell.style.backgroundColor = "gray";
				cell.addEventListener("click", function(){this.style.backgroundColor = "#EBEBEB";});
				cell.addEventListener("contextmenu", function(){this.style.backgroundImage = "url('2000px-Minesweeper_flag.svg.png')";
				this.style.backgroundSize = '42px 42px';
				});
		}
	}
	place.appendChild(table);
}

function positionBomb(board, rows, cols, nbombs){
	var myTable = document.getElementById("ide");
	var i; 
	var x;
	var y;
	for(i = 0;i < nbombs; i++){
		x = Math.floor((Math.random() * rows));
		y = Math.floor((Math.random() * cols));
		while(board[x][y] === 1){
			x = Math.floor((Math.random() * rows));
			y = Math.floor((Math.random() * cols));
		}
		board[x][y]=1;
		myTable.rows[x].cells[y].style.backgroundColor = 'red';}
}


window.onload = function() {
	var i;
	var nbombs;
	dificulty = 2;
	if(dificulty === 0){
		rows = 9;
		cols = 9;
		nbombs = 10;}
	else if (dificulty === 1){
		rows = 16;
		cols = 16;
		nbombs = 40;
	}
	else{
		rows = 16;
		cols = 30;
		nbombs = 99;
	}
	createTable(dificulty,rows, cols);
	
	board = [rows];
	for(i=0;i<rows;i++){
		board[i]=[cols];
	}
		board = positionBomb(board, rows, cols, nbombs);
//	visiRestore(board);
};
	  