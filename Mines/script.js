//board[x][y]=1 : localização das bombas
//board[x][y]=2 : posiçoes colocadas pelo jogador(lado esquerdo do rato)

var board;
var nbandeiras;
var rows;
var cols;



function createTable(difficulty, rows, cols){
var i;
var row;
var j;
var cell;
var place = document.getElementById("game"),	
	table = document.createElement("table");
table.id="ide";
if(difficulty === 0){
table.style.width  = '300px';
table.style.height  = '300px';
}
else if (difficulty == 1 ){
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
			cell = row.insertCell();/*
				cell.addEventListener("click", function(){boss()this.style.backgroundColor = "#EBEBEB";});
				cell.addEventListener("contextmenu", function(){this.style.backgroundImage = "url('2000px-Minesweeper_flag.svg.png')";
				this.style.backgroundSize = '42px 42px';
				});*/
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
	return board;
}

function verify(x,y,board,cell){
	var count = 0;
	if(board[x][y]===1){alert("GAME OVER MOTHERFUcKER");}
	else{
		if(x === 0){
			if(y === 0){
				if(board[1][1] === 1)
					count++;
				if(board[0][1] === 1)
					count++;
				if(board[1][0] === 1)
					count++;
			}
			else if(y === 8){
				if(board[1][8] === 1)
					count++;
				if(board[1][7] === 1)
					count++;
				if(board[0][7] === 1)
					count++;
			}
		}
		else if(x === 8){
			if(y === 0){
				if(board[7][0] === 1)
					count++;
				if(board[7][1] === 1)
					count++;
				if(board[8][1] === 1)
					count++;
			}
			else if(y === 8){
				if(board[8][7] === 1)
					count++;
				if(board[7][7] === 1)
					count++;
				if(board[7][8] === 1)
					count++;

			}
		}
		
		cell.style.backgroundColor = "#EBEBEB";
		cell.innerHTML = count;
	}
	
}


window.onload = function() {
	var i;
	var j;
	var nbombs;
	difficulty = 0;
	if(difficulty === 0){
		rows = 9;
		cols = 9;
		nbombs = 10;}
	else if (difficulty === 1){
		rows = 16;
		cols = 16;
		nbombs = 40;
	}
	else{
		rows = 16;
		cols = 30;
		nbombs = 99;
	}
	createTable(difficulty,rows, cols);
	
	board = [rows];
	for(i=0;i<rows;i++){
		board[i]=[cols];
		for( j=0 ; j<cols;j++){
			board[i][j]=0;
		}
	}
		board = positionBomb(board, rows, cols, nbombs);
		
		var table = document.getElementById("ide");
		var rows = table.getElementsByTagName("tr");

		for (var i = 0; i < rows.length; i++) {
		    //Get the cells in the given row
		    var cells = rows[i].getElementsByTagName("td");
		    for (var j = 0; j < cells.length; j++) {
		        // Cell Object
		        var cell = cells[j];
		        cell.rowIndex = i;
		        cell.positionIndex = j;
		        cell.onclick = function () {
		           verify(this.rowIndex,this.positionIndex,board,this);
		        };
		    }
		}
/*
var table = document.getElementById("ide");
if (table != null) {
    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++){
        table.rows[i].cells[j].onclick = function () {
            tableText(this);
        };
        table.rows[i].cells[j].oncontextmenu = function(){this.style.backgroundImage = "url('2000px-Minesweeper_flag.svg.png')";
		this.style.backgroundSize = '42px 42px';};
        }
    }
}

function tableText(tableCell) {
	tableCell.style.backgroundColor = "#EBEBEB";
}*/
};



	  