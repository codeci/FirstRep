var pNum = 2;
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
//var roundScore = [[0,0],[0,0],[0,0],[0,0],[0,0]];
var roundScore = new Array();

	
window.onload = function diceGame(){
//	Function to choose how many players	
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

	// Load the scoreboards for each player
	loadScoreBoards();	
	
	// Create dice object and instances for dice, but locked until first roll
	loadingDice();
	
	// Tracking score by player
	for (var i = 0; i < pNum;i++){
		document.getElementById("free" + i).innerHTML = "Player " + (i + 1) + " Score: " + 0;
	}
	document.getElementById("lblplayer0").setAttribute("class", "yes");
	
}

	// Prompt number of players
function playSelect(){
	
	var numPlayers = prompt("How many will be playing today? (Choose up to 6)", "2");
	
	if (numPlayers > 0 && numPlayers < 7){
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
	document.getElementById(data).setAttribute("data-rollcount", rolCount);
	
	// While dropping dice into keep area, track dice counts and values
	var dv = document.getElementById(data).getAttribute("data-value");
	roundScore.push([rolCount, dv]);

	diceCount -=1;	
	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) + " Score: " + pScore[p];
	
	document.getElementById("keep" + p).insertAdjacentHTML('beforeend', dv + ","); 	
	document.getElementById(data).setAttribute("draggable",false);
	document.getElementById(data).setAttribute("id","dieK" + keepDiceCount);	
	
	keepDiceCount+=1;
}

	// Rolling of dice dependant on the ones kept and ones rerolled

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
	
	// update button after users last roll to prepare for next user
	if (rolCount == 0){			
		document.getElementById("clicker").insertAdjacentHTML('beforeend',"<br/>Clear");
		document.getElementById("clicker").setAttribute("style","background-color:pink");
		rolCount = 3;
		document.getElementById("clicker").setAttribute("onclick","clearDice();");
		keepDiceCount = 0;
		document.getElementById("stopclicker").setAttribute("disabled",true);
		
	}else
	{
		document.getElementById("clicker").setAttribute("style","background-color:ivory");	
		document.getElementById("stopclicker").removeAttribute("disabled");
	}

	// update users roll tracking with the leftover dice from last roll
	document.getElementById("keep" + p).insertAdjacentHTML('beforeend',leftDice);
	
	// return stop roll capability for next user
	document.getElementById("stopclicker").setAttribute("onclick","stoproll();");
	
	gotoBottom("scoring" + p);
}

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
	loadingDice();
	document.getElementById("keep" + p).innerHTML = "Rolls: ";
	diceCount = 5;
	
		
	document.getElementById("free" + p).innerHTML = "Player " + (p + 1) +" Score: " + pScore[p];

	roundScore.length = 0;
	keepDiceCount = 0;
	document.getElementById("stopclicker").innerHTML = "STOP!";
	document.getElementById("stopclicker").setAttribute("onclick", "");
	
	document.getElementById("clicker").removeAttribute("disabled");
	gotoBottom("scoring" + p);
	// Cycle through players
	
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

function loadingDice(){
	
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



function scoreCalc(){
	
	var sCount = scoring();
	
    var count = new Array();	
	var rCount = new Array();

	// Show variables for troubleshooting...
	// Template document.getElementById("funcs").insertAdjacentHTML("beforeend","xxxx" + xxx);
/* 	document.getElementById("funcs").insertAdjacentHTML("beforeend","Before the loop...</br>");	
	document.getElementById("funcs").insertAdjacentHTML("beforeend","sCount: " + sCount + "</br>");	
	document.getElementById("funcs").insertAdjacentHTML("beforeend","count: " + count + "</br>");
	document.getElementById("funcs").insertAdjacentHTML("beforeend","rCount: " + rCount + "</br>"); */
	
	for(var i = 0;i < diceNum;i++){
		count[i] = roundScore[i][1];
		rCount[i] = roundScore[i][0];
	}
	
	document.getElementById("scoring" + p).insertAdjacentHTML('beforeend','<br/>' + 
		count.sort() + '.  Points: ' + sCount + ' Roll Counter: ' + rCount);
		
	if (sCount >= minScore){	
			thresh[p] = true;
			document.getElementById("free" + p).setAttribute("style", "color:rgb(29, 251, 29);");
	}
	
	if (thresh[p]){
		if (pScore[p] + sCount > 10000){
			document.getElementById("free" + p).innerHTML = "Player " + p + " Points: " + 
				pScore[p] + " YOU WENT OVER! YOU HAVE TO TRY AGAIN!";
		}
		else {
			pScore[p] += sCount;	
			if (pScore[p] == 10000){
				document.getElementById("free" + p).innerHTML = "Player " + (p + 1) + " Score: " + pScore[p] + " YOU WIN!";
				document.getElementById("clicker").setAttribute("disabled", true);
				document.getElementById("stopclicker").setAttribute("disabled", true);
//				document.getElementById("clicker").innerHTML = "YOU WON!! Player - " + p;	
//				alert("YOU WON!! Player - " + (p + 1));	
				if (confirm("YOU WON!! Player - " + (p + 1) + ". Would you like to play again?")){
					 window.location.assign("http://www.codyhesse.ca/WinLoseDie");
//					 window.location.assign("file:///C:/xampp/htdocs/WinLoseDie/Testing/index.html");					 
				}
				else {
					window.location.assign("http://www.codyhesse.ca");
				}
			}			
		}
	}
	// Show variables for troubleshooting...
	// Template document.getElementById("funcs").insertAdjacentHTML("beforeend","xxxx" + xxx);
/* 	document.getElementById("funcs").insertAdjacentHTML("beforeend","After the loop...</br>");	
	document.getElementById("funcs").insertAdjacentHTML("beforeend","sCount: " + sCount + "</br>");	
	document.getElementById("funcs").insertAdjacentHTML("beforeend","count: " + count + "</br>");
	document.getElementById("funcs").insertAdjacentHTML("beforeend","rCount: " + rCount + "</br>");
 */
	roundScore.length = 0;
	
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

	for (var j = rolCount; j > -1;j--){
		
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
	

			// after roll, calculate value of 1s and 5s if less than 3 of a kind, and all if 3 of a kind or more...

			if (count[0] > 2){
				switch (count[0]){
					case 3: result = 1000;
					break;
					case 4: result = 2000;
					break;
					case 5: result = 4000;
					break;
				}
				count[0] = 0;
			}
			if (count[0] < 3){
				s1 = (100 * count[0]);
//				count[0] = 0;
				
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
				count[4] = 0;
			}
			if (count[4] < 3){
				s5 = (50 * count[4]);
//				count[4] = 0;
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
		count = [0,0,0,0,0,0];
		
		side1 += s1;
		side5 += s5;	
		s1 = 0;
		s5 = 0;
		
	}
	
			
	return result + side1 + side5;	
//	return 5000;
}

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

function gotoBottom(id){
   var div = document.getElementById(id);
   div.scrollTop = div.scrollHeight - div.clientHeight;
}




