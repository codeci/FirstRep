
/*  VARIABLES 				---------------------------------*/

var extraRounds = false;
var p = 0;
var pNum = 1;
var pScore = new Array();
var thresh = new Array();

for (var i = 0;i < pNum;i++){
	pScore[i] = 0;
	thresh[i] = false;
}		

var allDice = 5;
var kdt = 0;
var rdt = allDice

var valDice = [];
var keptDice = [];

var tripCount = false;
var quadCount = false;
var fivCount = false;

var oneCount = 0;
var fivesCount = 0;

var tempVal = 0;

/*  HTML					---------------------------------*/

var rollArea = htmlID("roll_area") ;
var keepArea = htmlID("middle");	
var rollerSpace = htmlID("roller");
var stopperSpace = htmlID("stopper");

var funcs = htmlID("funcs");
var rClick = htmlID("clicker");
var sClickL = htmlID("sClickL");
var sClickR = htmlID("sClickR");
var mesg = htmlID("messages");

var rCounter = htmlID("roll_count");
var pKeeper = htmlID("point_count");
var sKeeper = htmlID("total_count");

function htmlID(id){
	return document.getElementById(id);
}


/*  GAME FUNCTION CALLS		---------------------------------*/

setGame();
loadButtons();
loadDice();


/*  GAME FUNCTIONS 				---------------------------------*/

function setGame(){
	funcs.insertAdjacentHTML("beforeend", "---------------Round Seperation---------------</br>");

	pScore[p] += tempVal;
	sKeeper.innerHTML = pScore[p];	

	rollCount = 0;	
	rCounter.innerHTML = rollCount;

	tempVal = 0;
	pKeeper.innerHTML = tempVal;	
}	

function loadButtons(){

	var rolDiv = htmlID("roller");	
	var rollButton = document.createElement("BUTTON");
	
	rollButton.setAttribute("id","clicker");
	rollButton.setAttribute("class", "rButton");
	rollButton.setAttribute("onclick","rollDice(rdt);");
	rollButton.innerHTML="ROLL!";
	rolDiv.appendChild(rollButton);		

	// Create stop roll button to pass next roll(s)
	var stopDiv = htmlID("stopper");
	
	var stopKeepL = document.createElement("BUTTON");	
	
	stopKeepL.setAttribute("id","sClickL");
	stopKeepL.setAttribute("class", "stopKeepL");
	stopKeepL.setAttribute("onclick","stopRoll();");
	stopKeepL.setAttribute("disabled",true);
	
	stopKeepL.innerHTML="STOP!";
	stopKeepL.setAttribute("style","background-color:pink");
	stopDiv.appendChild(stopKeepL);
	
	var stopKeepR = document.createElement("BUTTON");	
	stopKeepR.setAttribute("id","sClickR");
	stopKeepR.setAttribute("class", "stopKeepR");
	stopKeepR.setAttribute("onclick","stopRoll();");
	stopKeepR.setAttribute("disabled",true);
	
	stopKeepR.innerHTML="STOP!";
	stopKeepR.setAttribute("style","background-color:pink");
	stopDiv.appendChild(stopKeepR);
}

function loadDice(){
	
	var sClickL = htmlID("sClickL");
	var sClickR = htmlID("sClickR");
	var rClick = htmlID("clicker");
	
	clearDice(keepArea);
	
	sClickL.innerHTML = "STOP";
	sClickL.setAttribute("onclick", "stopRoll();");
	butDisable(sClickL);
	butDisable(sClickL);
	
	sClickR.innerHTML = "KEEP";
	sClickR.setAttribute("onclick", "keepCurrent();");
	butDisable(sClickR);
	butDisable(sClickR);
	
	butEnable(rClick);
	
	var die = new Array();
	for (var i = 0; i < allDice; i++){
		var id = "die" + (i+1);
		die[i] = document.createElement("BUTTON");
		die[i].setAttribute("data-value",i+1);
		die[i].setAttribute("id", id);
		die[i].setAttribute("class", "dice");
		die[i].setAttribute("draggable",false);
		die[i].setAttribute("style", "border-color:rgb(255,0,0);background-image: url(img/D" + (i+1) + 
			".png);background-repeat: no-repeat;background-size: 100px 100px;border-radius:10px;");
		rollArea.appendChild(die[i]);
	}
}












/*  SUPPORTING FUNCTIONS	---------------------------------*/


function countCurrent(dice){
	
	tempVal = scoreDice(dice);
	
	pKeeper.innerHTML = tempVal;
	valDice.length = 0;
	resCounts();
	
	var rClick = htmlID("clicker");
	
	rClick.innerHTML = "ROLL!";
	rClick.setAttribute("onclick","rollDice(rdt);");
	
	dice.length = 0;
	
}

function keepCurrent(){
	
	var sClickR = htmlID("sClickR");

	while(rollArea.firstChild){
		keptDice[kdt] = 1 * rollArea.firstChild.getAttribute("data-value");
		keepArea.appendChild(rollArea.firstChild);
		kdt += 1;
		rdt = allDice;
	}	
	
	butDisable(sClickR);
}

function clearDice(loc){	
	while(loc.firstChild){
		loc.removeChild(loc.firstChild);
	}
}



function butDisable(btn){	
	btn.setAttribute("disabled", true);
	btn.setAttribute("style", "background-color:pink");	
}

function butEnable(btn){
	btn.removeAttribute("disabled");
	btn.setAttribute("style", "background-color:ivory");	
}

function keepRolling(){
	
	pKeeper.innerHTML = tempVal;

	var sClickL = htmlID("sClickL");
	var sClickR = htmlID("sClickR");
	var rClick = htmlID("clicker");
	
	clearDice(keepArea);
	
	rClick.innerHTML = "ROLL!";
	rClick.setAttribute("onclick", "rollDice(rdt);");
	rollDice(allDice);
	keptDice.length = 0;
	rdt = 5;
	kdt = 0;
}

function getAnother(dice){
	
	tempVal += scoreDice(dice);
	
	var count = countVals(dice);

	if (
		count[0] > 0 ||
		count[4] > 0 ||
		isStraight(count) ||
		fivesNonesRule(count) ||
		tripCount ||
		quadCount ||
		fivCount
	){
		return true;
	}
	else {
		return false;
	}	
}

function rollDice(rdt){
	
	var rClick = htmlID("clicker");
	var sClickL = htmlID("sClickL");
	var sClickR = htmlID("sClickR");
	
	clearDice(rollArea);
	
	butEnable(sClickL);
	butEnable(sClickR);
	
	if (kdt == 5){
		
		kdt = 0;
		keptDice.length = 0;
		clearDice(keepArea);
	}
	
	var die = new Array();
	for (var i = 0; i < rdt; i++){
			console.log("for..dice");
		var id = "die" + (i+1);
		var num = roll();
		
		valDice[i] = num;
		
		die[i] = document.createElement("BUTTON");	
		die[i].setAttribute("data-value",num);
		die[i].setAttribute("id", id);
		die[i].setAttribute("class", "dice");
		die[i].setAttribute("draggable",true);
		die[i].setAttribute("ondragstart","drag(event)");
		die[i].setAttribute("style", "background-image: url(img/D" + num + 
			".png);background-repeat: no-repeat;background-size: 100px 100px;border-radius:10px;");
		rollArea.appendChild(die[i]);
	}
	
	if(getAnother(valDice)){
		mesg.innerHTML = "You get another roll!";
	
	}
	else {
		mesg.innerHTML = "Boo, you lose!";
		tempVal = 0;
		butDisable(rClick);
		keepRest();
		sClickL.innerHTML = "Clear";
		sClickL.setAttribute("onclick", "loadDice();");
		
		sClickR.innerHTML = "Clear";
		sClickR.setAttribute("onclick", "keepCurrent();");
		
	}
	

	rClick.innerHTML = "COUNT";
	rClick.setAttribute("onclick", "countCurrent(keptDice);");
}

function stopRoll(){
	
	var sClickL = htmlID("sClickL");
	var sClickR = htmlID("sClickR");
	var rClick = htmlID("clicker");
	
	keepRest();
	
	pScore[p] += tempVal;
	tempVal = 0;
	pKeeper.innerHTML = tempVal;
	sKeeper.innerHTML = pScore;
	
	sClickL.innerHTML = "Clear";
	sClickL.setAttribute("onclick", "loadDice();");
	
	sClickR.innerHTML = "Clear";
	sClickR.setAttribute("onclick", "loadDice();");	
	
	butDisable(rClick);
}

function keepRest(){
	
	var rollArea = htmlID("roll_area") ;
	var keepArea = htmlID("middle");	
	
	while(rollArea.firstChild){
		keptDice[kdt] = 1 * rollArea.firstChild.getAttribute("data-value");
		keepArea.appendChild(rollArea.firstChild);
		kdt += 1;
	}	
	console.log(keptDice);
	keptDice.length = 0;
	rdt = allDice;
	kdt = 0;
}

function countVals(rc){
	var count = [0,0,0,0,0,0]
	
	for (var i = 0; i < rc.length; i++){
		if (rc[i] == 1){
			count[0] += 1;
		}
		if (rc[i] == 2){
			count[1] += 1;
		}
		if (rc[i] == 3){
			count[2] += 1;
		}
		if (rc[i] == 4){
			count[3] += 1;
		}
		if (rc[i] == 5){
			count[4] += 1;
		} 
		if (rc[i] == 6){
			count[5] += 1;
		}	
	}
	return count;
}

function roll(){
	var rNum = ((Math.random() * 6) + 1);
	rNum = Math.floor(rNum);
	return rNum;
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
	
	var num = 1 * htmlID(data).getAttribute("data-value");
	keptDice[kdt] = num;
	kdt += 1;
	rdt -= 1;
	
	if (kdt == allDice){
		var rClick = htmlID("clicker");
		
		rClick.innerHTML = "RELOAD!..";
		rClick.setAttribute("onclick", "keepRolling();");
	}
	
	console.log(keptDice);
}

//Scolling ...

function gotoBottom(id){
   var div = document.getElementById(id);
   div.scrollTop = div.scrollHeight - div.clientHeight;
}

function fivesNonesRule(count){
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

function isStraight(count){

	var straight1 = [0,1,1,1,1,1];
	var straight2 = [1,1,1,1,1,0];
	
	var st1 = straight1.toString();
	var st2 = straight2.toString();	
		
	var confSt = count.toString();
	
	var match1 = st1.localeCompare(confSt);
	var match2 = st2.localeCompare(confSt);
	
	if((match1 == 0 || match2 == 0)){
		return true;
	}else {
		return false;
	}	
}


function scoreDice(dice){
	var roundCount = new Array();
	for (var i = 0; i < dice.length; i++){
		roundCount[i] = dice[i];
	}
	document.getElementById("funcs").insertAdjacentHTML("beforeend", "dice = " + dice + "</br>");
	document.getElementById("funcs").insertAdjacentHTML("beforeend", "roundCount = " + roundCount);
	var counted = countVals(roundCount);
	roundCount.length = 0;
	document.getElementById("funcs").insertAdjacentHTML("beforeend", "</br> " + 
		"counted = " + counted + "</br>");
		
	var rollScore = scoring(counted);
	document.getElementById("funcs").insertAdjacentHTML("beforeend", "</br> " + 
		"rollScore = " + rollScore + "</br>");
	return rollScore;
}

function scoring(count){
	var s1 = 0;
	var s5 = 0;
	
	var result = 0;
	
	if (isStraight(count)){
		result = 1000;
	}
	else{
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
	return result + s1 + s5;
}




