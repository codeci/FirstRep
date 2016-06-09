var pNum = 1;
var pScore = [];
var thresh = [];
var p = 0;

for (var i = 0;i < pNum;i++){
	pScore[i] = 0;
	thresh[i] = false;
}

var minScore = 1000;

var diceNum = 5;


var diceCount = diceNum;
var keepDiceCount = 0;
var rolCount = 3;
var freeDiceCount = 0;

var roundScore = new Array();

	
window.onload = function loadDice(){
	
	playSelect();
	// Create Roll button to roll dice
	var rolDiv = document.getElementById("roller");
	var btn = document.createElement("BUTTON");	
	btn.setAttribute("id","clicker");
	btn.setAttribute("class", "test");
	btn.setAttribute("onclick","reroll();");
	btn.innerHTML="ROLL!";
	rolDiv.appendChild(btn);		

	// Create stop roll button to pass next roll(s)

	var stopDiv = document.getElementById("stopper");
	var btn = document.createElement("BUTTON");	
	btn.setAttribute("id","stopclicker");
	btn.setAttribute("class", "test");
	btn.setAttribute("disabled",true);
	btn.innerHTML="STOP!";
	stopDiv.appendChild(btn);	
	loadScoreBoards();	
	// Create dice object and instances for dice
	loadingDice();
	// Dice count tracker
	for (var i = 0; i < pNum;i++){
		document.getElementById("free" + i).innerHTML = "Player " + (i + 1) + " Score: " + 0;
	}
	document.getElementById("lblplayer0").setAttribute("class", "yes");
	
}



function playSelect(){
	
	var numPlayers = prompt("How many will be playing today? (Choose up to 10)", "2");
	
	if (numPlayers > 0 && numPlayers < 10){
		pNum = numPlayers;		
	}
	else {
		pNum = 2;
	}
}





	// Create score boards for random number of players
	
function loadScoreBoards(){
	var scoreBoardHead = document.getElementById("details");
	
	for (var i = 0; i < pNum;i++){
		
		var contDiv = document.createElement("div");
		contDiv.setAttribute("id", "player" + i);
		contDiv.setAttribute("class", "player");
		
		var lbl1 = document.createElement("label");
		lbl1.innerHTML = "Player " + (i + 1);
		lbl1.setAttribute("id", "lblplayer" + i);
		
		var div1 = document.createElement("div");
		div1.setAttribute("id", "scores" + i);
		
		var div2 = document.createElement("div");
		div2.setAttribute("id", "keep" + i);
		div2.setAttribute("class", "keep");
		div2.innerHTML = "Tracking Dice Values by Role<br/>";
		
		var div3 = document.createElement("div");
		div3.setAttribute("id", "scoring" + i);	
		div3.innerHTML = "Points Scored";
		div3.setAttribute("class", "scoring");
		
		var lbl2 = document.createElement("label");
		lbl2.innerHTML = "Score";

		var div4 = document.createElement("div");
		div4.setAttribute("id", "free" + i);
		div4.setAttribute("class", "free");
		
		scoreBoardHead.appendChild(contDiv);
		
		contDiv.appendChild(lbl1);
		contDiv.appendChild(div1);
		contDiv.appendChild(lbl2);
		contDiv.appendChild(div4);
		
		div1.appendChild(div2);
		div1.appendChild(div3);	

	}	
}


	// Roll function to randomize dice rolls
function roll(){	
	var rNum = ((Math.random() * 6) + 1);
	rNum = Math.floor(rNum);
	return rNum;
}

// Drag and drop functions to choose dice to keep and not re-roll
function allowDrop(ev){
	ev.preventDefault();	
}
function drag(ev){
	ev.dataTransfer.setData("text", ev.target.id);
}
function drop(ev){
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	ev.target.appendChild(document.getElementById(data));
	
	// While dropping dice into keep area, track dice counts and values
	var dv = document.getElementById(data).getAttribute("data-value");
	roundScore[keepDiceCount] = dv;

	diceCount -=1;	
	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) + " Score: " + pScore[p];
	
	document.getElementById("keep" + p).insertAdjacentHTML('beforeend', dv + ","); 	
	document.getElementById(data).setAttribute("draggable",false);
	document.getElementById(data).setAttribute("id","dieK" + keepDiceCount);
	keepDiceCount+=1;
}



function reroll(){

	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) +" Score: " + pScore[p];
	
	var leftDice = new Array();	
	var parentDiv = document.getElementById("roll_area");
	while (parentDiv.firstChild){
		parentDiv.removeChild(parentDiv.firstChild);
	}
	for (var i = 0; i < diceCount;i++){
		var btn = document.createElement("BUTTON");
		var num = roll();
		btn.setAttribute("data-value",num);
		btn.setAttribute("id","die" + (i+1));
		btn.setAttribute("class", "dice");
		btn.setAttribute("draggable",true);
		btn.setAttribute("ondragstart","drag(event)");
		btn.setAttribute("style", "background-image: url(img/D" + num + 
			".png);background-repeat: no-repeat;background-size: 100px 100px");
		if (rolCount == 1){
			document.getElementById("middle").appendChild(btn);
			leftDice[i] = num;
			roundScore[keepDiceCount] = num;
			keepDiceCount+=1;
		}
		else{
			parentDiv.appendChild(btn);
		}		
	}	
	rolCount -= 1;
	document.getElementById("clicker").innerHTML = "Rolls Left = " + rolCount;
	if (rolCount == 0){
		document.getElementById("clicker").insertAdjacentHTML('beforeend',"<br/>Clear");
		document.getElementById("clicker").setAttribute("style","background-color:pink");
		rolCount = 3;
		document.getElementById("clicker").setAttribute("onclick","clearDice();");
		keepDiceCount = 0;
		document.getElementById("stopclicker").setAttribute("disabled",true);

	}else
	{
		document.getElementById("clicker").setAttribute("style","background-color:rgb(221, 221, 221)");
		document.getElementById("stopclicker").removeAttribute("disabled");
	}


	document.getElementById("keep" + p).insertAdjacentHTML('beforeend',leftDice);
	document.getElementById("stopclicker").setAttribute("onclick","stoproll();");
}

function clearDice(){
	var parentDiv = document.getElementById("roll_area");
	while (parentDiv.firstChild){
		parentDiv.removeChild(parentDiv.firstChild);
	}			
	var parentDiv = document.getElementById("middle");
	while (parentDiv.firstChild){
		parentDiv.removeChild(parentDiv.firstChild);
	}
	document.getElementById("clicker").setAttribute("onclick","reroll();");
	document.getElementById("clicker").setAttribute("style","background-color:rgb(221, 221, 221)");
	document.getElementById("clicker").innerHTML = "ROLL!";
	loadingDice();
	document.getElementById("keep" + p).innerHTML = "Tracking Dice Values by Role<br/>";
	diceCount = 5;
	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) +" Score: " + pScore[p];
	scoreCalc();
	roundScore.length = 0;
	keepDiceCount = 0;
	document.getElementById("stopclicker").innerHTML = "STOP!";
	document.getElementById("stopclicker").setAttribute("onclick", "");
	gotoBottom("scoring" + p);
	document.getElementById("clicker").removeAttribute("disabled");
	
	if (p < (pNum - 1)){	
		document.getElementById("lblplayer" + p).setAttribute("class", "not");
		p+=1;
		document.getElementById("lblplayer" + p).setAttribute("class", "yes");
	}
	else {
		document.getElementById("lblplayer" + p).setAttribute("class", "not");		
		p=0;
		document.getElementById("lblplayer" + p).setAttribute("class", "yes");
	}
}

function loadingDice(){
	
	var sc = 0;		
	var tarDiv = document.getElementById("roll_area");	
	
	for (var i = 0; i < diceNum;i++){
		var btn = document.createElement("BUTTON");
		var id = "die" + (i+1);
		btn.setAttribute("id", id);
		btn.setAttribute("class", "dice");
		btn.setAttribute("draggable",false);
		btn.setAttribute("ondragstart","drag(event)");
		btn.setAttribute("style", "border-color:rgb(255,0,0);background-image: url(img/D" + (i+1) + 
			".png);background-repeat: no-repeat;background-size: 100px 100px");
		tarDiv.appendChild(btn);
	}		
	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) +" Score: " + pScore[p];

}



function scoreCalc(){
	var sCount = scoring();
	var total = 0;
	roundScore.sort();
	
	for (var i = 0;i < roundScore.length;i++){
		total += roundScore[i];
	}	
	
	document.getElementById("scoring" + p).insertAdjacentHTML('beforeend','<br/>' + 
		roundScore + '.  Score: ' + sCount);
		
	if (sCount >= minScore){
			thresh[p] = true;	
	}
	
	if (thresh[p]){
		if (pScore[p] + sCount > 10000){
			document.getElementById("free" + p).innerHTML = "Player " + p + " Score: " + 
				pScore[p] + " YOU WENT OVER! YOU HAVE TO TRY AGAIN!";
		}
		else {
			pScore[p] += sCount;			
			if (pScore[p] == 10000){
				document.getElementById("free" + p).innerHTML = "Player " + (p + 1) + " Score: " + pScore[p] + " YOU WIN!";
				document.getElementById("clicker").setAttribute("disabled", true);
				document.getElementById("stopclicker").setAttribute("disabled", true);
				document.getElementById("clicker").innerHTML = "YOU WON!!";	
			}
		}
	}

	roundScore.length = 0;
}

function unique(){
	// Creates array called count for counting unique digit instances of dice values (1, 2, 3, 4, 5, 6)
	var count = [0,0,0,0,0,0];	
	for (var i = 0;i < roundScore.length;i++){
		if (roundScore[i] == 1){
			count[0] += 1;
		}
		if (roundScore[i] == 2){
			count[1] += 1;
		}
		if (roundScore[i] == 3){
			count[2] += 1;
		}
		if (roundScore[i] == 4){
			count[3] += 1;
		}
		if (roundScore[i] == 5){
			count[4] += 1;
		} 
		if (roundScore[i] == 6){
			count[5] += 1;
		}		
	}
	return count;
}

function scoring(){		
	
	// Create results from scoring rules of triples and straights
	if (isStraight()){
		return 1000;
	}else {
		var count = unique();
		
		var result = 0;
		var side5 = 0;
		var side1 = 0;
		
		for (var i = 0; i < count.length;i++){
			if (count[0] > 2){
				switch (count[0]){
					case 3: result = 1000;
					break;
					case 4: result = 2000;
					break;
					case 5: result = 4000;
					break;
				}
			}
			if (count[0] < 3 && count[0] > 0){
				side1 = (100 * count[0]);
			}
			if (count[1] > 2){
				switch (count[1]){
					case 3: result = 200;
					break;
					case 4: result = 400;
					break;
					case 5: result = 800;
					break;
				}
			}
			if (count[2] > 2){
				switch (count[2]){
					case 3: result = 300;
					break;
					case 4: result = 600;
					break;
					case 5: result = 1200;	
					break;
				}
			}
			if (count[3] > 2){
				switch (count[3]){
					case 3: result = 400;
					break;
					case 4: result = 800;
					break;
					case 5: result = 1600;	
					break;
				}
			}
			if (count[4] > 2){
				switch (count[4]){
					case 3: result = 500;
					break;
					case 4: result = 1000;
					break;
					case 5: result = 2000;
					break;
				}
			}
			if (count[4] < 3 && count[4] > 0){
				side5 = (50 * count[4]);
			}
			if (count[5] > 2){
				switch (count[5]){
					case 3: result = 600;
					break;
					case 4: result = 1200;
					break;
					case 5: result = 2400;					
				}
			}		
		}
		return result + side1 + side5;
	}
}

function isStraight(){

	var count = unique();
	
	var straight1 = [0,1,1,1,1,1];
	var straight2 = [1,1,1,1,1,0];
	
	var st1 = straight1.toString();
	var st2 = straight2.toString();	
		
	var confSt = count.toString();
	
	var match1 = st1.localeCompare(confSt);
	var match2 = st2.localeCompare(confSt);
	
	if(match1 == 0 || match2 == 0){
		return true;
	}else {
		return false;
	}
}

function stoproll(){
	var raParent = document.getElementById("roll_area");
	var kaParent = document.getElementById("middle");
	while(raParent.firstChild){		
		roundScore[keepDiceCount] = raParent.firstChild.getAttribute("data-value");			
		kaParent.insertBefore(raParent.firstChild, kaParent.childNodes[0]);
		keepDiceCount += 1;
	}
	document.getElementById("clicker").setAttribute("disabled", true);
	document.getElementById("stopclicker").innerHTML = "CLEAR and COUNT";
	document.getElementById("stopclicker").setAttribute("onclick", "clearDice();");
	rolCount = 3;
}

function gotoBottom(id){
   var element = document.getElementById(id);
   element.scrollTop = element.scrollHeight - element.clientHeight;
}