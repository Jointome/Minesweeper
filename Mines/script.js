

function createTable(){
var rows = 9;
var cols = 9;
var place = document.getElementById("game"),	
	table = document.createElement("table");
table.style.width  = '400px';
table.style.height  = '400px';
table.style.border = '1px solid black';
table.style.cursor = 'pointer';
	for( var i = 0; i < rows;++i){
		var row = table.insertRow();
		for(var j = 0; j < cols; ++j){
			var cell = row.insertCell();
				cell.style.backgroundColor = "gray";
				cell.addEventListener("click", function(){this.style.backgroundColor = "#EBEBEB";});
				cell.addEventListener("contextmenu", function(){this.style.backgroundImage = "url('2000px-Minesweeper_flag.svg.png')";
				this.style.backgroundSize = '42px 42px';
				});
		}
	}
	place.appendChild(table);
}


window.onload = function() {
	createTable();
};
	  