var waiting = [];
var games = [];

var begginer = {
	nrow : 9,
	ncol : 9,
	nbombs : 10
};
var intermediate = {
	nrow : 16,
	ncol : 16,
	nbombs : 40
};
var expert = {
	nrow : 16,
	ncol : 30,
	nbombs : 99
};
var diff = [ begginer, intermediate, expert ];
var move = [];
var connect = [];

function positionBomb(cols, rows, nbombs,board) {
	var i;
	var x;
	var y;
	for (i = 0; i < nbombs; i++) {
		x = Math.floor((Math.random() * cols));
		y = Math.floor((Math.random() * rows));
		while (board[x][y] === -1) {
			x = Math.floor((Math.random() * cols));
			y = Math.floor((Math.random() * rows));
		}
		board[x][y] = -1;
	}
	return board;
}

function verify(x, y, nrow, ncol,board) {
	var count = 0;
	for ( var i = -1; i < 2; i++) {
		for ( var j = -1; j < 2; j++) {
			if (notoutoftable(i, j, x, y, ncol, nrow)
					&& board[x + i][y + j] === -1) {
				count++;
			}
		}
	}
	board[x][y] = count;
	return board[x][y];
}

function startGame(level, gameid, name1, name2, key1, key2){
	var nameturn = Math.floor((Math.random() * 2));
	var firstplayer = [name1,name2];
	var diffnumb;
	if(level === "beginner")
		diffnumb=0;
	else if(level === "intermediate")
		diffnumb=1;
	else
		diffnumb=2;
	var game =
	{
		level: level,
		bombs: diff[diffnumb].nbombs,
		board: [[]],
		ncol : diff[diffnumb].ncol,
		nrow : diff[diffnumb].nrow,
		player1: name1,
		p1score: 0,
		p1key: key1,
		player2: name2,
		p2key: key2,
		p2score: 0,
		turn: firstplayer[nameturn]
	};
	   game.board = [ diff[diffnumb].ncol ];
	    for (var i = 0; i <diff[diffnumb].ncol; i++) {
		game.board[i] = [ diff[diffnumb].nrow ];
		for (var j = 0; j < diff[diffnumb].nrow; j++) {
		    game.board[i][j] = 0;
		}
	    }
	    game.board = positionBomb(diff[diffnumb].ncol, diff[diffnumb].nrow, diff[diffnumb].nbombs,game.board);
	
	    //sets the number of bombs around each cell on it position
	    for (var i = 0; i < diff[diffnumb].ncol; i++) {
	    	for (var j = 0; j < diff[diffnumb].nrow; j++) {
	    		if (game.board[i][j] !== -1)
	    			game.board[i][j] = verify(i, j, diff[diffnumb].nrow, diff[diffnumb].ncol,game.board);

		}
	    }
	    games[gameid] = game;
}

function testKey(name, key, gameid){
	if (games[gameid] === undefined){
		for (var i = 0; i < waiting.length; i++)
			if ((waiting[i].name == name) && (waiting[i].key == key)) return true;
	}
	else if (((games[gameid].player1 == name) && (games[gameid].p1key == key)) || ((games[gameid].player2 == name) && (games[gameid].p2key == key))) return true;
	return false;
}

function setScore(name, level, score){
	conn.query('SELECT * FROM Rankings WHERE name = ? && level = ?', [name, level], function(err,result) {

			if (err)
				console.log(err);
			if (result.length > 0){
				conn.query('UPDATE Rankings SET score = ? WHERE name = ? && level = ?', [score,name, level], function(err, result) {
					if (err)
						console.log(err);
				});
			}
			else{
				var post = { name : name, score : score, level : level , timestamp : Date.now()};
				conn.query('INSERT INTO Rankings SET ?', [post], function(err, result) {
					if (err)
						console.log(err);
				});

			}


	});
}

function play(row, col, gameid, req, res){
	if(games[gameid].board[col][row] === -1){
		if (games[gameid].player1 == games[gameid].turn)
			games[gameid].p1score++;
		else
			games[gameid].p2score++;
		games[gameid].board[col][row] === -2;
		
		if (games[gameid].p1score >= (games[gameid].bombs / 2)){
			sendupdate(gameid, 'end', {'name':games[gameid].turn, 'cells':[[row+1, col+1, -1]], 'winner':games[gameid].player1});
			setScore(games[gameid].player1, games[gameid].level,games[gameid].p1score); 
			setScore(games[gameid].player2, games[gameid].level,games[gameid].p2score);
		}
		else if (games[gameid].p2score >= (games[gameid].mines / 2)){
			sendupdate(gameid, 'end', {'name':games[game].turn, 'cells':[[row+1, col+1, -1]], 'winner':games[gameid].player2});
			setScore(games[gameid].player2, games[gameid].level,games[gameid].p2score); 
			setScore(games[gameid].player1, games[gameid].level,games[gameid].p1score);
		}
		else
			sendupdate(gameid, 'move', {'name':games[gameid].turn, 'cells':[[row+1, col+1, -1]], 'turn':games[gameid].turn});
	}
	else{
		move = [];
		expand( col,row, games[gameid].nrow,games[gameid].ncol, gameid);
		var p = games[gameid].turn;
		if (games[gameid].turn === games[gameid].player1)
			games[gameid].turn = games[gameid].player2;
		else
			games[gameid].turn = games[gameid].player1;
		sendupdate(gameid, 'move', {'name': p, 'cells':move, 'turn':games[gameid].turn});
	}
}

function sendupdate(gameid, e, move){
	for (var i = 0; i < connect.length; i++){
		if (connect[i].game == gameid){
			if (e == 'start'){
				if (connect[i].name == games[gameid].player1) {
					connect[i].connection.write("data: "+ JSON.stringify({"opponent":games[gameid].player2, "turn":games[gameid].turn})+"\n\n");
				}
				else {
					connect[i].connection.write("data: "+JSON.stringify({"opponent":games[gameid].player1, "turn":games[gameid].turn})+"\n\n");
				}
			}
			else if (e == 'move'){
				connect[i].connection.write("data: "+JSON.stringify({ "move":{ "name":move.name, "cells":move.cells } , "turn":move.turn })+"\n\n");
			}
			else if (e == 'end'){
				connect[i].connection.write("data: "+JSON.stringify({"move":{ "name":move.name, "cells":move.cells } , "winner":move.winner })+"\n\n");
			}
		}
	}
}

function notoutoftable(i, j, x, y, ncol, nrow) {
	if (((x + i >= 0) && (x + i <= ncol - 1))
			&& ((y + j >= 0) && (y + j <= nrow - 1))) {
		return true;
	}
	return false;
}

function expand(x, y, nrow, ncol, gameid) {
	if (games[gameid].board[x][y] === 0) {
		games[gameid].board[x][y] = -2;
		for ( var i = -1; i < 2; i++)
			for ( var j = -1; j < 2; j++)
				if (notoutoftable(i, j, x, y, ncol, nrow)
						&& games[gameid].board[x + i][y + j] !== -2) {
					expand(x + i, y + j, nrow, ncol, gameid);
				}
	}
	if(games[gameid].board[x][y] === -2)
		games[gameid].board[x][y] = 0;
	move.push([y+1, x+1, games[gameid].board[x][y]]);
	games[gameid].board[x][y] = -2;
};

var mysql= require('mysql');

var conn = mysql.createConnection({
	host	: 'localhost',
	user	: 'up201205747',
	password: 'MySecret',
	database: 'up201205747'
});

conn.connect(function(err){
	if(err){
		console.log("ERROR");
	}
	else{
		console.log('Connected!');
	}
});
var Chance = require('chance');
var chance = new Chance();
var crypto = require('crypto');
var regex = /[A-Za-z0-9_]{4,20}/;
var express = require('express')
, cors = require('cors')
, app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.post('/register', function(req, res, next){
		var name = req.body.name;
		var pass = req.body.pass;
		if(regex.test(name)){	
			conn.query('SELECT * FROM Users WHERE name = ?', [name], function(err,result) {
			if (err)
				console.log(err);
			// utilizador já existe
			if (result.length > 0) {
				// resultado da query
				var user = result[0];
				// verificar se a password está correta
				if (crypto.createHash('md5').update(pass + user.salt).digest('hex') == user.pass) {
					res.json({});
				}
				else {
					res.json({"error": "Wrong password"});
				}
			}
			else{
				var salt = chance.string({length : 4});
				var hash = crypto.createHash('md5').update(pass + salt).digest('hex');
				var post = { name : name, pass : hash, salt : salt };
				conn.query('INSERT INTO Users SET ?', [post], function(err, result) {
					if (err)
						console.log(err);
					res.json({});
				});
			}
		});
	}
	else {
		res.json({"error": "Username is Invalid"});
	}
});

app.post('/ranking', function(req, res, next){
	var level = req.body.level;
	conn.query('SELECT * FROM Rankings WHERE level = ? ORDER BY score DESC, timestamp ASC LIMIT 10;', [level], function(err, result) {
		if (err)
			console.log(err);
		res.json({"ranking":result});
	});
});

app.post('/notify', function(req, res){
	var name = req.body.name;
	var gameid = req.body.game;
	var key  = req.body.key;
	var row  = req.body.row;
	var col  = req.body.col;
	if(regex.test(name) && testKey(name, key, gameid)){
		if(name === games[gameid].turn) {
			if((row > 0 && row <= games[gameid].nrow) && (col > 0 && col <= games[gameid].ncol)){
				if(games[gameid].board[col-1][row-1] !== -2){
					res.json({});
					play(row-1, col-1, gameid, req, res);
				}
				else{
					res.json({"error": "Position already discovered"});
				}
			}
			else{
				res.json({"error": "Invalid"});
			}
		}
		else
			res.json({"error": "Not your turn"});
		}
	else
		res.json({"error": "Wrong game"});
	
});

function findOpp(player1){
	var player2;
	for(var i = 0; i<waiting.length; i++){
		if(waiting[i].level === player1.level && waiting[i].group === player1.group){
			player2 = waiting[i];
			waiting.splice(i,1);//remove elemento da lista
			break;
		}
	}
	return player2;
}
	
app.post('/join', function (req, res) {
	var name = req.body.name;
	if(regex.test(name)){
		conn.query('SELECT * FROM Users WHERE name = ?', [name], function(err,result) {
			if (err)
				console.log(err);
			if (result.length > 0) {
				var user = result[0];
				if (crypto.createHash('md5').update(req.body.pass + user.salt).digest('hex') == user.pass) {
					var gameid;
					var key;
					var p1 = {};
					var p2 = {};
					p1.name = name;
					p1.group = req.body.group;
					p1.level = req.body.level;
					p1.key = crypto.createHash('md5').update(chance.string({length : 8})).digest('hex');
					key = p1.key;
					p2 = findOpp(p1);
					if(p2 === undefined){
						gameid = Math.floor((Math.random() * 999999)+1);
						while(games[gameid] != undefined){
							gameid = Math.floor((Math.random() * 999999)+1);
						}
						p1.game = gameid;
						waiting.push(p1);//adicona p1 ao fim da fila
					}
					else {
						gameid = p2.game;
						startGame(p2.level, p2.game, p2.name, p1.name, p2.key, p1.key);

					}
					res.json({"key": key, "game":gameid});
				}
			}
		});
	}
	else {
		res.json({"error": "Invalid Play"});
		}
});
	
app.post('/leave', function (req, res) {
	var name = req.body.name;
	var gameid = req.body.game;
	var key = req.body.key;
	if (regex.test(name) && testKey(name, key, gameid)) {
		for(var i = 0; i<waiting.length; i++){
			if(waiting[i].name == name){
				found = true;
				waiting.splice(i, 1);
			}
		}
		res.json({});
	}
});
	
app.post('/score', function (req, res) {
	if(regex.test(req.body.name)){
		conn.query('SELECT * FROM Rankings WHERE name = ? && level = ?', [req.body.name, req.body.level], function(err,result) {
			if (err)
				console.log(err);
			if (result.length > 0)
				res.json({"score": result[0].score});
			else
				res.json({"score": 0});
		});
	}
	else {
		res.json({"error": "Invalid name"});
	}
});


app.get('/update', function (req, res) {
	var name = req.query.name;
	var gameid = req.query.game;
	var key = req.query.key;
 	if(regex.test(name) && testKey(name, key, gameid)){
 		// impedir que a conecção se feche
		req.socket.setTimeout(6000000);
		// cabecalho da resposta
		res.writeHead(200, {
		    'Content-Type': 'text/event-stream',
		    'Cache-Control': 'no-cache',
		    'Connection': 'keep-alive'
		});
		res.write('\n');
		connect.push({ 'name' : name, 'game' : gameid , 'connection' : res});
		
		if(checkGameStart(gameid)) sendupdate(gameid, 'start',{});

		// no caso do cliente terminar a conecção, remover da lista
		req.on("close", function() {
			for (var i = 0; i < connect.length; i++){
				if (connect[i].name == name)
					connect.splice(i, 1);
					break;
			}
 	 	});
 	}
	else {
		res.json({"error": "Erro! Não foi possivel validar o pedido"});
	}
});

function checkGameStart(game_id){
	var players = [];
	if (games[game_id] === undefined)
		return false;
	else {
		for (var i = 0; i < connect.length; i++){
			if (connect[i].game == game_id)
				players.push(connect[i].name);
		}

		if ((players.length == 2) && (((players[0] == games[game_id].player1) && (players[1] == games[game_id].player2)) || ((players[0] == games[game_id].player2) && (players[1] == games[game_id].player1))))
				 return true;
	}
	return false;
}

app.listen(8037, function(){
console.log('Web server listening on port 8037');
});