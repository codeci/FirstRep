/* set number of players and load scoreboards */
var pNum = 0;
var p = 0;
var modal = document.getElementById('myModal');
var btn = document.getElementById("btnVal");
modal.style.display = "block";

var pScore = [];
var thresh = [];

var minScore = 1000;
var diceNum = 5;
var diceCount = diceNum;
var keepDiceCount = 0;
var rolCount = 3;
var freeDiceCount = 0;
var roundScore = new Array();
var maxPlay = 6;

playScoreRound = 0;

// New rule variable requirements...
var tripCount = false;
var quadCount = false;
var fivCount = false;
var oneCount = 0;
var fivesCount = 0;

var tempVal = 0;

btn.onclick = function(){
	modal.style.display = "none";		
	pNum = 1 * document.getElementById("playVal").value;

	for (var i = 0;i < pNum;i++){
		pScore[i] = 0;
		thresh[i] = false;
	}		
	
	diceGame();
	
}

function loadScoreBoards(){
	var scoreBoardHead = document.getElementById("details");
	
	for (var i = 0; i < pNum;i++){
		
		var contDiv = document.createElement("div");
		contDiv.setAttribute("id", "player" + i);
		contDiv.setAttribute("class", "player_not");
		contDiv.setAttribute("style", "width:" + ((100/pNum)-1) +"%;margin:3px;");

		var lbl1 = document.createElement("p");
		lbl1.innerHTML = "Player " + (i + 1);
		lbl1.setAttribute("id", "lblplayer" + i);
		
		var div1 = document.createElement("div");
		div1.setAttribute("id", "scores" + i);
		div1.setAttribute("class", "scores");
		
		var div2 = document.createElement("div");
		div2.setAttribute("id", "keep" + i);
		div2.setAttribute("class", "keep");
		div2.innerHTML = "Roll: ";
		
		var div3 = document.createElement("div");
		div3.setAttribute("id", "scoring" + i);	
		div3.setAttribute("class", "scoring");
		
		var lbl2 = document.createElement("p");
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
/* load buttons and dice */

function diceGame(){
//	Function to choose how many players	
//	playSelect();

		
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

	// Load the scoreboards for each player
	loadScoreBoards();	
	
	// Create dice object and instances for dice, but locked until first roll
	loadingDice();
	
}

function loadingDice(){
	resCounts();
	var sc = 0;	
	var tarDiv = document.getElementById("roll_area");
	
	for (var i = 0; i < diceNum;i++){
		var die = document.createElement("BUTTON");
		var id = "die" + (i+1);
		die.setAttribute("id", id);
		die.setAttribute("class", "dice");
		die.setAttribute("draggable",false);
		die.setAttribute("ondragstart","drag(event)");
		die.setAttribute("style", "border-color:rgb(255,0,0);background-image: url(img/D" + (i+1) + 
			".png);background-repeat: no-repeat;background-size: 100px 100px;border-radius:10px;");
		tarDiv.appendChild(die);
	}		
	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) +" Score: " + pScore[p];

}

/* roll dice */

function roll(){	
	var rNum = ((Math.random() * 6) + 1);
	rNum = Math.floor(rNum);
	return rNum;
}

function reroll(){
	document.getElementById("player" + p).setAttribute("class", "player_yes");
	// track roll count
	rolCount -= 1;
	//Keep score track and track the value of the dice not rerolled
	
	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) +" Score: " + pScore[p];
	
	var leftDice = new Array();	
	var parentDiv = document.getElementById("roll_area");
	while (parentDiv.firstChild){
		parentDiv.removeChild(parentDiv.firstChild);
	}
	for (var i = 0; i < diceCount;i++){
		var die = document.createElement("BUTTON");
		var num = roll();
		die.setAttribute("data-value",num);
		die.setAttribute("id","die" + (i+1));
		die.setAttribute("class", "dice");
		die.setAttribute("draggable",true);
		die.setAttribute("ondragstart","drag(event)");
		die.setAttribute("style", "background-image: url(img/D" + num + 
			".png);background-repeat: no-repeat;background-size: 100px 100px;border-radius:10px;");
		if (rolCount == 0){
			die.setAttribute("data-rollcount", rolCount);
			die.setAttribute("id","dieK" + keepDiceCount);
			document.getElementById("middle").appendChild(die);
			leftDice[i] = num;
			roundScore.push([rolCount, num.toString()]);
			keepDiceCount+=1;		
		}
		else{
			parentDiv.appendChild(die);
		}
	}
	document.getElementById("clicker").innerHTML = "Rolls Left = " + rolCount;	
	
	// Calculate roll values for current roll....	
	
		
	
	// update button after users last roll to prepare for next user, or continue rolling...
	if (rolCount == 0){			
		
		if(keepGoing()){			
			document.getElementById("clicker").insertAdjacentHTML('beforeend',"<br/>Keep Rolling?");
			document.getElementById("clicker").setAttribute("style","background-color:lightgreen");
			rolCount = 3;
			document.getElementById("clicker").setAttribute("onclick","clearDice();");
			keepDiceCount = 0;
			document.getElementById("stopclicker").removeAttribute("disabled");	
			
		}
		else {
			document.getElementById("clicker").insertAdjacentHTML('beforeend',"<br/>Clear");
			document.getElementById("clicker").setAttribute("style","background-color:black;color:white");
			rolCount = 3;
			document.getElementById("clicker").setAttribute("onclick","clearDice();");
			keepDiceCount = 0;
			document.getElementById("stopclicker").setAttribute("disabled",true);
			document.getElementById("stopclicker").setAttribute("style","background-color:pink");
		}		
		tempVal += scoring();	
		document.getElementById("stopclicker").insertAdjacentHTML('beforeend',"<br/>Keep: " + tempVal);
	}
	else {
		document.getElementById("clicker").setAttribute("style","background-color:ivory;color:black");	
		document.getElementById("stopclicker").removeAttribute("disabled");
		document.getElementById("stopclicker").setAttribute("style","background-color:ivory");	
	}

	// update users roll tracking with the leftover dice from last roll
	document.getElementById("keep" + p).insertAdjacentHTML('beforeend',leftDice);
	
	// return stop roll capability for next user
	document.getElementById("stopclicker").setAttribute("onclick","stoproll();");
	
	
	
	gotoBottom("scoring" + p);

}
/* Scoring: Is it a straight? Else, count tripples, quadruples, quintuple pentadruple, ones and fives */

function scoring(){		
	
	// Create results from scoring rules of triples and straights
	if (isStraight()){
		return 1000;
	}else {
		var count = unique();		
		return count;
	}
	
}

function isStraight(){

	var count = [0,0,0,0,0,0];	
	
	for (var i = 0; i < diceNum;i++){
		
		if (roundScore[i][1] == 1){
			count[0] += 1;
		}
		if (roundScore[i][1] == 2){
			count[1] += 1;
		}
		if (roundScore[i][1] == 3){
			count[2] += 1;
		}
		if (roundScore[i][1] == 4){
			count[3] += 1;
		}
		if (roundScore[i][1] == 5){
			count[4] += 1;
		} 
		if (roundScore[i][1] == 6){
			count[5] += 1;
		}				
	}
	
	var straight1 = [0,1,1,1,1,1];
	var straight2 = [1,1,1,1,1,0];
	
	var st1 = straight1.toString();
	var st2 = straight2.toString();	
		
	var confSt = count.toString();
	
	var match1 = st1.localeCompare(confSt);
	var match2 = st2.localeCompare(confSt);
	
	if((match1 == 0 || match2 == 0) && isSameRoll()){
		return true;
	}else {
		return false;
	}
	
}

function unique(){
	
	var result = 0;
	var side5 = 0;
	var side1 = 0;			
	var s1 = 0;
	var s5 = 0;

	// Creates array called count for counting unique digit instances of dice values (1, 2, 3, 4, 5, 6)	for the roll
	var count = [0,0,0,0,0,0];		
	
	// Loop through each die....

	for (var j = rolCount-1; j > -1;j--){
		
		for (var i = 0; i < diceNum;i++){
			
			// Calculate the value of roll for each die... (how many 1s, 2s, 3s, etc....)
			
			if (roundScore[i][1]== 1 && roundScore[i][0] == j){
				count[0] += 1;
			}
			if (roundScore[i][1] == 2 && roundScore[i][0] == j){
				count[1] += 1;
			}
			if (roundScore[i][1] == 3 && roundScore[i][0] == j){
				count[2] += 1;
			}
			if (roundScore[i][1] == 4 && roundScore[i][0] == j){
				count[3] += 1;
			}
			if (roundScore[i][1] == 5 && roundScore[i][0] == j){
				count[4] += 1;
			} 
			if (roundScore[i][1] == 6 && roundScore[i][0] == j){
				count[5] += 1;
			}
			document.getElementById("funcs").insertAdjacentHTML("beforeend", "Player: " + (p+1) + "</br>");			
			document.getElementById("funcs").insertAdjacentHTML("beforeend", "i:" + i + " j:" + j + " count before = " + count + "</br>");
	

			// after roll, calculate value of 1s and 5s if less than 3 of a kind, and all if 3 of a kind or more...

			if (count[0] > 2){
				switch (count[0]){
					case 3: result = 1000;
					tripCount = true;
					break;
					case 4: result = 2000;
					quadCount = true;
					break;
					case 5: result = 4000;
					fivCount = true;
					break;
				}
				
				count[0] = 0;
			}
			
			if (count[0] < 3){
				s1 = (100 * count[0]);
				oneCount += 1 * count[0];				
			}

			if (count[1] > 2){
				switch (count[1]){
					case 3: result = 200;
					tripCount = true;
					break;
					case 4: result = 400;
					quadCount = true;
					break;
					case 5: result = 800;
					fivCount = true;
					break;
				}
			}

			if (count[2] > 2){
				switch (count[2]){
					case 3: result = 300;
					tripCount = true;
					break;
					case 4: result = 600;
					quadCount = true;
					break;
					case 5: result = 1200;
					fivCount = true;
					break;
				}
			}

			if (count[3] > 2){
				switch (count[3]){
					case 3: result = 400;
					tripCount = true;
					break;
					case 4: result = 800;
					quadCount = true;
					break;
					case 5: result = 1600;
					fivCount = true;
					break;
				}
			}

			if (count[4] > 2){
				switch (count[4]){
					case 3: result = 500;
					tripCount = true;
					break;
					case 4: result = 1000;
					quadCount = true;
					break;
					case 5: result = 2000;
					fivCount = true;
					break;
				}
				count[4] = 0;
			}
			if (count[4] < 3){
				s5 = (50 * count[4]);
				fivesCount += 1 * count[4];
			}		

			if (count[5] > 2){
				switch (count[5]){
					case 3: result = 600;
					tripCount = true;
					break;
					case 4: result = 1200;
					quadCount = true;
					break;
					case 5: result = 2400;
					fivCount = true;
				}
			}		

		}
		
		document.getElementById("funcs").insertAdjacentHTML("beforeend", "count after = " + count + "</br>");
		count = [0,0,0,0,0,0];		
		
		side1 += s1;
		side5 += s5;	
		s1 = 0;
		s5 = 0;				
		
	}

	return result + side1 + side5;	
//	return 5000;
}


/* reroll? yes/ no */

function keepGoing(){	
	if (
		(tripCount && (oneCount == 2 || fivesCount == 2 || (oneCount == 1 && fivesCount == 1))) ||		
		(quadCount && (oneCount == 1 || fivesCount == 1)) || 
		fivCount || 
		fivesNonesRule() || 
		isStraight()
		 ){
		
		return true;
	}else{
		return false;
	}
}

function stoproll(){

	var raParent = document.getElementById("roll_area");
	var kaParent = document.getElementById("middle");
	while(raParent.firstChild){	
		raParent.firstChild.setAttribute("data-rollcount", rolCount);
		raParent.firstChild.setAttribute("id","dieK" + keepDiceCount);
		roundScore.push([rolCount,raParent.firstChild.getAttribute("data-value")]);			
		kaParent.insertBefore(raParent.firstChild, kaParent.childNodes[0]);
		keepDiceCount += 1;
	}
	document.getElementById("clicker").setAttribute("disabled", true);
	document.getElementById("stopclicker").innerHTML = "CLEAR and COUNT";
	document.getElementById("stopclicker").setAttribute("onclick", "clearDice();");
	rolCount = 3;
	gotoBottom("scoring" + p);
}

function fivesNonesRule(){
	
	/* All single fives, or all single ones, or mixtures of both... */
	
	var count = [0,0,0,0,0,0];	
	
	for (var i = 0; i < diceNum;i++){
		
		if (roundScore[i][1] == 1){
			count[0] += 1;
		}
		if (roundScore[i][1] == 2){
			count[1] += 1;
		}
		if (roundScore[i][1] == 3){
			count[2] += 1;
		}
		if (roundScore[i][1] == 4){
			count[3] += 1;
		}
		if (roundScore[i][1] == 5){
			count[4] += 1;
		} 
		if (roundScore[i][1] == 6){
			count[5] += 1;
		}				
	}	
	
	if ((1 * count[0]) + (1 * count[4]) == 5){
		return true;
	}
	else {
		return false;
	}
}

function resCounts(){
	tripCount = false;
	quadCount = false;
	fivCount = false;

	oneCount = 0;
	fivesCount = 0;	
}


/* Clear board for next roll or next user */

function clearDice(){
	scoreCalc();
	var parentDiv = document.getElementById("roll_area");
	while (parentDiv.firstChild){
		parentDiv.removeChild(parentDiv.firstChild);
	}			
	var parentDiv = document.getElementById("middle");
	while (parentDiv.firstChild){
		parentDiv.removeChild(parentDiv.firstChild);
	}
	document.getElementById("clicker").setAttribute("onclick","reroll();");
	document.getElementById("clicker").setAttribute("style","background-color:ivory");
	document.getElementById("clicker").innerHTML = "ROLL!";
	diceCount = 5;
	if (keepGoing() && document.getElementById("stopclicker").innerHTML.localeCompare("CLEAR and COUNT") != 0){
		reroll();
	}
	else {
		loadingDice();
		
		document.getElementById("keep" + p).innerHTML = "Rolls: ";			
		document.getElementById("free" + p).innerHTML = "Player " + (p + 1) +" Score: " + pScore[p];	
		
		document.getElementById("clicker").removeAttribute("disabled");
		
		gotoBottom("scoring" + p);
		switchPlayer();
		roundScore.length = 0;
		keepDiceCount = 0;			
		tempVal = 0;
	}	
	document.getElementById("stopclicker").innerHTML = "STOP!";
	document.getElementById("stopclicker").setAttribute("onclick", "");	
	document.getElementById("stopclicker").setAttribute("style","background-color:pink");	
	
	
}

function switchPlayer(){
	
	if (p < (pNum - 1)){	
		document.getElementById("player" + p).setAttribute("class", "player_not");
		p+=1;
		document.getElementById("player" + p).setAttribute("class", "player_yes");
	}
	else {
		document.getElementById("player" + p).setAttribute("class", "player_not");		
		p=0;
		document.getElementById("player" + p).setAttribute("class", "player_yes");
	}			
}


/* add to scoreboard? yes/no  */

function scoreCalc(){
	
	playScoreRound = tempVal;
	
    var count = new Array();	
	var rCount = new Array();
	
	for(var i = 0;i < diceNum;i++){
		count[i] = roundScore[i][1];
		rCount[i] = roundScore[i][0];
	}
	
	document.getElementById("scoring" + p).insertAdjacentHTML('beforeend','<br/>' + 
		count.sort() + '.  Points: ' + playScoreRound + ' Roll Counter: ' + rCount);
		
	if (playScoreRound >= minScore){	
			thresh[p] = true;
			document.getElementById("free" + p).setAttribute("style", "color:rgb(29, 251, 29);");
	}
	
	if (thresh[p]){
		if (pScore[p] + playScoreRound > 10000){
			document.getElementById("free" + p).innerHTML = "Player " + p + " Points: " + 
				pScore[p] + " YOU WENT OVER! YOU HAVE TO TRY AGAIN!";
		}
		else {
			pScore[p] += playScoreRound;	
			if (pScore[p] == 10000){
				document.getElementById("free" + p).innerHTML = "Player " + (p + 1) + " Score: " + pScore[p] + " YOU WIN!";
				document.getElementById("clicker").setAttribute("disabled", true);
				document.getElementById("stopclicker").setAttribute("disabled", true);

				if (confirm("YOU WON!! Player - " + (p + 1) + ". Would you like to play again?")){
//					window.location.assign("http://www.codyhesse.ca/WinLoseDie");	
					window.location.assign("file:///C:/xampp/htdocs/WinLoseDie/Testing/index.html");	


					 
				}
				else {
					window.location.assign("http://www.codyhesse.ca");
				}
			}			
		}
	}

//	roundScore.length = 0;
	playScoreRound = 0;
}

function isSameRoll(){

	var sameroll1 = [0,0,0,0,0];
	var sameroll2 = [1,1,1,1,1];
	var sameroll3 = [2,2,2,2,2];
	
	var sr1 = sameroll1.toString();
	var sr2 = sameroll2.toString();
	var sr3 = sameroll3.toString();
		
	var rCount = new Array();

	for(var i = 0;i < diceNum;i++){
		rCount[i] = roundScore[i][0];
	}

	var confSr = rCount.toString();
	
	var match1 = confSr.localeCompare(sr1);
	var match2 = confSr.localeCompare(sr2);
	var match3 = confSr.localeCompare(sr3);
	
	if (match1 == 0 || match2 == 0 || match3 == 0){
			return true;
	}
	else{
		return false;
	}
}

function gotoBottom(id){
   var div = document.getElementById(id);
   div.scrollTop = div.scrollHeight - div.clientHeight;
}



/* Dice dropping utilities... */

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
	document.getElementById(data).setAttribute("data-rollcount", rolCount);
	
	// While dropping dice into keep area, track dice counts and values
	var dv = document.getElementById(data).getAttribute("data-value");
	roundScore.push([rolCount, dv]);

	diceCount -=1;	
	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) + " Score: " + pScore[p];
	
	document.getElementById("keep" + p).insertAdjacentHTML('beforeend', dv + ","); 	
	document.getElementById(data).setAttribute("draggable",false);
	document.getElementById(data).setAttribute("ondragover",false);
	document.getElementById(data).setAttribute("id","dieK" + keepDiceCount);	
	
	keepDiceCount+=1;
	
	if (keepDiceCount == 5){
		if(keepGoing()){
			document.getElementById("clicker").insertAdjacentHTML('beforeend',"<br/>Keep Rolling?");
			document.getElementById("clicker").setAttribute("style","background-color:lightgreen");
			rolCount = 3;
			document.getElementById("clicker").setAttribute("onclick","clearDice();");
			keepDiceCount = 0;
			document.getElementById("stopclicker").removeAttribute("disabled");				
		}		
		else {
			document.getElementById("clicker").insertAdjacentHTML('beforeend',"<br/>Clear");
			document.getElementById("clicker").setAttribute("style","background-color:black;color:white");
			rolCount = 3;
			document.getElementById("clicker").setAttribute("onclick","clearDice();");
			keepDiceCount = 0;
			document.getElementById("stopclicker").setAttribute("disabled",true);
			document.getElementById("stopclicker").setAttribute("style","background-color:pink");		
		}
	}	
}




