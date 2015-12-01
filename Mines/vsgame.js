
var user = "";
var pass = "";
var URL =  "http://twserver.alunos.dcc.fc.up.pt:8000/"
var game_num = null;
var game_key = null;
var opponent = false;
var quemJoga = null;
var array = ["beginner","intermediate","expert"];
var bombsfound=0;
var maxbombs;
var enebombsfound=0;


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
    var nbombs = maxbombs = diff[difficulty].nbombs;
    nrow = diff[difficulty].nrow;
    ncol = diff[difficulty].ncol;

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
    percent();
    percent2();
    online = true;
    var table = document.getElementById(tableid[difficulty]);
    quemJoga = null;
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
				   		expandeX(array, table);

				   }
				   if(ansL["winner"]!= undefined){
				   	if(user === ansL["winner"]){
					    document.getElementById('winner').classList.add('block');
					    document.getElementById('winner').classList.remove('hidden');
					    document.getElementById('gamepage').classList.add('hidden');
					    document.getElementById('gamepage').classList.remove('block');
					    document.getElementById('winnerbutton').classList.remove('hidden');
					    document.getElementById('winnerbutton').classList.add('block');
					   
					    getMenuback();
					    game_key = null;
					    game_num=null;
					    inGame = false;
					    opponent = false;
				   	}
				   	else{
				   	    document.getElementById('loser').classList.add('block');
	  				    document.getElementById('loser').classList.remove('hidden');
	   				    document.getElementById('gamepage').classList.add('hidden');
	    				    document.getElementById('gamepage').classList.remove('block');
	    				    document.getElementById('loserbutton').classList.remove('hidden');
					    document.getElementById('loserbutton').classList.add('block');

					    getMenuback();
				   	    game_key = null;
					    game_num = null;
					    inGame = false;
					    opponent = false;
				   	}
				   }

					if(user === quemJoga){
						table.onclick = function (event) {
						var x = event.target.cellIndex + 1;
						var y = event.target.parentNode.rowIndex + 1;
						cell = table.rows[y-1].cells[x-1];
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
	if(array[i][2] == -1){
	    table.rows[array[i][0] - 1].cells[array[i][1] - 1].className = tdimg[difficulty].blackbomb;
	    if(quemJoga == user){
	    bombsfound++;
		draw();
	    }
	    else{
	    enebombsfound++;
	    draw2();
	    }
	}
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

		        goHome();

			}
			
		}
		req.send(JSON.stringify(params));
	}
	else {
		alert("You can't quit. Fair play said the teacher.");
	}
	}
    else signOut();
	
}

var canvas ;
var ctx;
//dimensions
var W;
var H;
//Variables
var degrees;
var new_degrees;
var difference;
var color;
var bgcolor;
var text;
var animation_loop, redraw_loop;
function percent(){
    //canvas initialization
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    //dimensions
    W = canvas.width;
    H = canvas.height;
    //Variables
    degrees = 0;
    new_degrees = 0;
    difference = 0;
    color = "lightgreen"; //green looks better to me
    bgcolor = "#222";
    text;
    animation_loop, redraw_loop;
    init();
    draw();
    animate_to();
}

function init()
{
    //Clear the canvas everytime a chart is drawn
    ctx.clearRect(0, 0, W, H);
    
    //Background 360 degree arc
    ctx.beginPath();
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = 30;
    ctx.arc(W/2, H/2, 100, 0, Math.PI*2, false); //you can see the arc now
    ctx.stroke();
    
    //gauge will be a simple arc
    //Angle in radians = angle in degrees * PI / 180
    var radians = degrees * Math.PI / 180;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 30;
    //The arc starts from the rightmost end. If we deduct 90 degrees from the angles
    //the arc will start from the topmost end
    ctx.arc(W/2, H/2, 100, 0 - 90*Math.PI/180, radians - 90*Math.PI/180, false); 
    //you can see the arc now
    ctx.stroke();
    
    //Lets add the text
    ctx.fillStyle = color;
    ctx.font = "50px bebas";
    text = Math.floor(degrees/360*100) + "%";
    //Lets center the text
    //deducting half of text width from position x
    text_width = ctx.measureText(text).width;
    //adding manual value to position y since the height of the text cannot
    //be measured easily. There are hacks but we will keep it manual for now.
    ctx.fillText(text, W/2 - text_width/2, H/2 + 15);
}

function draw()
{
    //Cancel any movement animation if a new chart is requested
    if(typeof animation_loop != undefined) clearInterval(animation_loop);
    
    //random degree from 0 to 360
    new_degrees = ((bombsfound * 360)/(maxbombs/2));
    difference = new_degrees - degrees;
    //This will animate the gauge to new positions
    //The animation will take 1 second
    //time for each frame is 1sec / difference in degrees
    animation_loop = setInterval(animate_to, 1000/difference);
}

//function to make the chart move to new degrees
function animate_to()
{
    //clear animation loop if degrees reaches to new_degrees
    if(degrees == new_degrees) 
	clearInterval(animation_loop);
    
    if(degrees < new_degrees)
	degrees++;
    else
	degrees--;
    
    init();
}

var canvas2 ;
var ctx2;
//dimensions
var W2;
var H2;
//Variables
var degrees2;
var new_degrees2;
var difference2;
var color2;
var bgcolor2;
var text2;
var animation_loop2, redraw_loop2;

function percent2(){
    //canvas initialization
    canvas2 = document.getElementById('canvasadv');
    ctx2 = canvas2.getContext("2d");
    //dimensions
    W2 = canvas2.width;
    H2 = canvas2.height;
    //Variables
    degrees2 = 0;
    new_degrees2 = 0;
    difference2 = 0;
    color2 = "red";
    bgcolor2 = "#222";
    text2;
    animation_loop2, redraw_loop2;
    init2();
    draw2();
    animate_to2();
}

function init2()
{
    //Clear the canvas everytime a chart is drawn
    ctx2.clearRect(0, 0, W, H);
    
    //Background 360 degree arc
    ctx2.beginPath();
    ctx2.strokeStyle = bgcolor2;
    ctx2.lineWidth = 30;
    ctx2.arc(W2/2, H2/2, 100, 0, Math.PI*2, false); //you can see the arc now
    ctx2.stroke();
    
    //gauge will be a simple arc
    //Angle in radians = angle in degrees * PI / 180
    var radians2 = degrees2 * Math.PI / 180;
    ctx2.beginPath();
    ctx2.strokeStyle = color2;
    ctx2.lineWidth = 30;
    //The arc starts from the rightmost end. If we deduct 90 degrees from the angles
    //the arc will start from the topmost end
    ctx2.arc(W2/2, H2/2, 100, 0 - 90*Math.PI/180, radians2 - 90*Math.PI/180, false); 
    //you can see the arc now
    ctx2.stroke();
    
    //Lets add the text
    ctx2.fillStyle = color2;
    ctx2.font = "50px bebas";
    text2 = Math.floor(degrees2/360*100) + "%";
    //Lets center the text
    //deducting half of text width from position x
    text_width2 = ctx2.measureText(text2).width;
    //adding manual value to position y since the height of the text cannot
    //be measured easily. There are hacks but we will keep it manual for now.
    ctx2.fillText(text2, W2/2 - text_width2/2, H2/2 + 15);
}

function draw2()
{
    //Cancel any movement animation if a new chart is requested
    if(typeof animation_loop2 != undefined) clearInterval(animation_loop2);
    
    //random degree from 0 to 360
    new_degrees2 = ((enebombsfound * 360)/(maxbombs/2));
    difference2 = new_degrees2 - degrees2;
    //This will animate the gauge to new positions
    //The animation will take 1 second
    //time for each frame is 1sec / difference in degrees
    animation_loop2 = setInterval(animate_to2, 1000/difference2);
}

//function to make the chart move to new degrees
function animate_to2()
{
    //clear animation loop if degrees reaches to new_degrees
    if(degrees2 == new_degrees2) 
	clearInterval(animation_loop2);
    
    if(degrees2 < new_degrees2)
	degrees2++;
    else
	degrees2--;
    
    init2();
}
