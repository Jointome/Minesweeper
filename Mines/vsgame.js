
var user = "";
var pass = "";
var URL =  "http://twserver.alunos.dcc.fc.up.pt:8000/"
var curPlayer = '';
var game_num = null;
var game_key = null;
//var players = ["player1","player2"];

function login(){
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


function showvsgame(){
    document.getElementById('home_page').classList.add('hidden');
    document.getElementById('home_page').classList.remove('block');
    document.getElementById('gamepage').classList.add('block');
    document.getElementById('gamepage').classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
    document.getElementById('game').classList.remove('block');
    vsPlayer();

}

function createvsgame(){
    difficulty=0;
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
    var params = {'name':user, 'pass': pass, 'level':"beginner", 'group':37};
    var req = new XMLHttpRequest();
    req.open("POST", URL+"join", true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = function() {
	if(req.readyState == 4 && req.status == 200){
	    var response = JSON.parse(req.responseText);
	    if(response["error"] == undefined){
		game_key = response["key"];
		game_num = response["game"];
		alert(game_key + " --- " + game_num);

		var link = 'http://twserver.alunos.dcc.fc.up.pt:8000/update?name=' + user + '&game=' + game_num + '&key=' + game_key;
		var source = new EventSource(link);

		source.addEventListener('message', function(e) {
		    var response2 = JSON.parse(e.data);
		    alert(respose2);
		}
	    }
	}
    }
    req.send(JSON.stringify(params));
}
