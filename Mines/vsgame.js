
var user = "";
var pass = "";
var URL =  "http://twserver.alunos.dcc.fc.up.pt:8000/"
var curPlayer = '';
var game_num = null;
var game_key = null;
var opponent = false;
var array = ["beginner","intermediate","expert"];


//var players = ["player1","player2"];

function login(){
	online = true;
    user = myForm.fname.value;
    pass = myForm.password.value;
    var loginInfo = JSON.stringify({'name': user, 'pass':pass});
    var rec = new XMLHttpRequest();
    rec.open("POST", URL + "register", true);
    rec.setRequestHeader('Content-Type', 'application/json');
    rec.onreadystatechange = function(){
	if(rec.readyState == 4 && rec.status == 200){
	    var response = JSON.parse(rec.responseText);
	    if(rec.responseText == "{}"){
		alert("DEU CRL");
		document.getElementById('usr').classList.add('hidden');
		document.getElementById('usr').classList.remove('inlineblock');
		name = myForm.fname.value;
		document.getElementById('username').classList.add('inlineblock');
		document.getElementById('username').classList.remove('hidden');
		document.getElementById('signout').classList.remove('hidden');
		document.getElementById('signout').classList.add('inlineblock');
		document.getElementById("usernameh3").appendChild(document.createTextNode(name));
	    }
	    else {
		alert(response["error"]);
		document.getElementById('usernameid').focus();
	    }
	}
    };
    rec.send(loginInfo);
    
}


function showvsgame(diff){
	difficulty = diff;
	if(online){
    document.getElementById('home_page').classList.add('hidden');
    document.getElementById('home_page').classList.remove('block');
    document.getElementById('gamepage').classList.add('block');
    document.getElementById('gamepage').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('game').classList.remove('block');
    document.getElementById('qualquer12').classList.add('hidden');
    document.getElementById('qualquer12').classList.remove('inlineblock');


    vsPlayer();
	}
	else {
		alert("You need to be logged in!")
	}

}

function createvsgame(){
    var nbombs = diff[difficulty].nbombs;
    nrow = diff[difficulty].nrow;
    ncol = diff[difficulty].ncol;
//    curPlayer = players[Math.floor((Math.random() * 1))];

    board = [ ncol ];
    auxboard = [ ncol ];
    for (i = 0; i < ncol; i++) {
	board[i] = [ nrow ];
	for (j = 0; j < nrow; j++) {
	    board[i][j]= 0;
	}
    }
    
    createTable(nrow , ncol, "vsgamepage");
   // board = positionBomb(ncol, nrow, nbombs);

}

function vsPlayer(){
    createvsgame();
    online = true;
    var table = document.getElementById(tableid[difficulty]);
    var quemJoga = null;
    var params = {'name':user, 'pass': pass, 'level':array[difficulty], 'group':37};
    var req = new XMLHttpRequest();
    req.open("POST", URL+"join", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
	if(req.readyState == 4 && req.status == 200){
	    var response = JSON.parse(req.responseText);
	    if(response["error"] == undefined){
		game_key = response["key"];
		game_num = response["game"];
		inGame = true;
		alert(game_key + " --- " + game_num);

		var link = 'http://twserver.alunos.dcc.fc.up.pt:8000/update?name=' + user + '&game=' + game_num + '&key=' + game_key;
		var source = new EventSource(link);

			source.addEventListener('message', function(e) {
		   	   var ansL = JSON.parse(e.data);

		    	  if(ansL["opponent"] != undefined)
		     	 	opponent = true;//aqui dá quem é o opponent

		     	  if(ansL["turn"] != undefined){
			     	  	quemJoga = ansL["turn"];
			     	  	alert("Quem joga agora e o idiota com o nome de: " + ansL["turn"]);
					}
					else{
						if(ansL["winner"] === undefined)
							alert("Deu asneira aqui");
					}

				   if(ansL["move"] != undefined){
				   		var array = ansL["move"]["cells"];
				   		alert("entrou!");
				   		expandeX(array, table);

				   }
				   if(ansL["winner"]!= undefined){
				   	if(user === ansL["winner"]){
					document.getElementById('winner').classList.add('block');
					document.getElementById('winner').classList.remove('hidden');
					document.getElementById('gamepage').classList.add('hidden');
					document.getElementById('gamepage').classList.remove('block');
					document.getElementById('winnerbutton').classList.remove('hidden');

					getMenuback();
					game_key = null;
					game_num=null;
					  
				   	}
				   	else{
				   		document.getElementById('loser').classList.add('block');
	  				 	document.getElementById('loser').classList.remove('hidden');
	   					document.getElementById('gamepage').classList.add('hidden');
	    				document.getElementById('gamepage').classList.remove('block');
	    				document.getElementById('loserbutton').classList.remove('hidden');

	   					getMenuback();
				   	    game_key = null;
					    game_num = null;
					 
				   	}
				   }

					if(user === quemJoga){
						table.onclick = function (event) {
						var x = event.target.cellIndex + 1;
						var y = event.target.parentNode.rowIndex + 1;
						cell = table.rows[y-1].cells[x-1];
			        	alert(x + " " + y);
			    		clickFoleiro(user, game_num, game_key, y, x);
		    		}


			}
			else{
				table.onclick = function(event){
					alert("Não e a tua vez!");
				}
			}


	 		},false);

	 	}
	}
    }
    req.send(JSON.stringify(params));
}

function clickFoleiro(user, game_num, game_key, row, col){
var params = {'name': user, 'game': game_num, 'key': game_key, 'row': row, 'col': col};

		var req = new XMLHttpRequest();
		req.open("POST", URL+"notify", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.onreadystatechange = function () {
			if (req.readyState == 4 && req.status == 200) {
				var response = JSON.parse(req.responseText);
				if(req.responseText == "{}"){
					alert("HEISH CA PUTA DE TIRO NESTE BURACO")
					return;
				}
				else{
					alert(response["error"]);
				}
			}
		}
		req.send(JSON.stringify(params));	
}

function expandeX(array, table){
	for(var i = 0; i < array.length; i++){
		if(!(array[i][2] === 0 || array[i][2]== -1) ){
		table.rows[array[i][0] - 1].cells[array[i][1] - 1].appendChild(document.createTextNode(array[i][2]));
		}
		if(array[i][2] == -1)
			table.rows[array[i][0] - 1].cells[array[i][1] - 1].className = tdimg[difficulty].blackbomb;
		else{
			table.rows[array[i][0] - 1].cells[array[i][1] - 1].className = tdimg[difficulty].read;
			if(array[i][2] === 1)
		 	   table.rows[array[i][0] - 1].cells[array[i][1] - 1].classList.add('blue');
			else if(array[i][2] === 2)
		 	   table.rows[array[i][0] - 1].cells[array[i][1] - 1].classList.add('green');
			else
		    	table.rows[array[i][0] - 1].cells[array[i][1] - 1].classList.add('red');
		}

	}
}

function callRanking(){

var params = {'level': array[difficulty]};

		var req = new XMLHttpRequest();
		req.open("POST", URL+"ranking", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.onreadystatechange = function () {
			if (req.readyState == 4 && req.status == 200) {
				var response = JSON.parse(req.responseText);
				if(response["ranking"] != undefined){
					var outroA = response["ranking"];
					for(var i = 0; i < outroA.length; i++){
						var para = document.createElement("p");
						var node = document.createTextNode(outroA[i].name + " " + outroA[i].score);
						para.appendChild(node);
						document.getElementById("scores").appendChild(para);
					}

				}
				else{
					alert(response["error"]);
				}
			}
		}
		req.send(JSON.stringify(params));	
}



function quitGame(){
	if(game_key != null){
		if(!opponent){
		var params = {'name': user, 'key': game_key, 'game': game_num};
		var req = new XMLHttpRequest();
		req.open("POST", URL + "leave", true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.onreadystatechange = function () {
		    if (req.readyState == 4 && req.status == 200) {
		    	var response = JSON.parse(req.responseText);
		        alert("Abandonaste a fila de espera!");
		        signOut();
		        inGame = false;
		        online = false;
		        goHome();
		        user = "";
		        pass = "";
			}
			
		}
		req.send(JSON.stringify(params));
	}
	else {
		alert("LOSER NAO SAIS DAQUI ATE ACABARES O JOGO CRL");
	}
	}
    else signOut();
	
}
