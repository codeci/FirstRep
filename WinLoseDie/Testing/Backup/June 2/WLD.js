/* set players */

var extraRounds = false;
var p = 0;
var pNum = 1;
var pScore = new Array();
var thresh = new Array();

for (var i = 0;i < pNum;i++){
	pScore[i] = 0;
	thresh[i] = false;
}		

var MAXROLL = 3;
var allDice = 5;
var rollDieTrack = allDice;

var kgTrack = new Array();
var kgRollDice = new Array();
var kgKeepDice = new Array();
var keepDice = [0,0,0,0,0];

var kgrd = 5;
var anotTrack = 5;
var keepDieTrack = 0;
var kgt = 0;
var rkct = 0;
var rollCount = 0;
var kgkd = 0;



var tripCount = false;
var quadCount = false;
var fivCount = false;
var oneCount = 0;
var fivesCount = 0;

var tempVal = 0;

window.onload = function(){
	diceGame();
}

function diceGame(){
	console.log("diceGame()");
	loadButtons();
	loadDice(allDice);	
}

/* Function to create and load Buttons for rolling and stop rolling */

function loadButtons(){
	console.log("loadButtons()");
	// Create Roll button to roll dice
	var rolDiv = document.getElementById("roller");
	
	var rollButton = document.createElement("BUTTON");	
	rollButton.setAttribute("id","clicker");
	rollButton.setAttribute("class", "test");
	rollButton.setAttribute("onclick","rollDice();");
	rollButton.innerHTML="ROLL!";
	rolDiv.appendChild(rollButton);		

	// Create stop roll button to pass next roll(s)
	var stopDiv = document.getElementById("stopper");
	
	var stopButton = document.createElement("BUTTON");	
	stopButton.setAttribute("id","stopclicker");
	stopButton.setAttribute("class", "test");
	stopButton.setAttribute("onclick","stopRoll(rollDieTrack);");
	stopButton.setAttribute("disabled",true);
	stopButton.innerHTML="STOP!";
	stopButton.setAttribute("style","background-color:pink");
	stopDiv.appendChild(stopButton);	
}

/* Function to load Dice before actually rolling... */

function loadDice(dice){
	document.getElementById("funcs").insertAdjacentHTML("beforeend", "---------------Round Seperation---------------</br>");

	// reset keep dice trackers to 0 or allDice as all should be in rolling area after load
	
	kgRollDice.length = 0;
	keepDice.length = 0;
	kgTrack.length = 0;
	
	keepDieTrack = 0;
	kgt = 0;
	rkct = 0;
	kgkd = 0;	
	anotTrack = 5;
	kgrd = allDice;
	
	extraRounds = false;
	
	console.log("loadDice(" + dice + ")");
	pScore[p] += tempVal;
	document.getElementById("total_count").innerHTML = pScore[p];	
	// Ensure roll area is cleared for dice...
	clearDice("roll_area");
	// Ensure roll clicker is enabled, and action set to roll function...
	document.getElementById("clicker").removeAttribute("disabled");
	document.getElementById("clicker").setAttribute("style", "background-color:ivory");
	document.getElementById("clicker").setAttribute("onclick", "rollDice();");
	document.getElementById("clicker").innerHTML = "ROLL!";	
	
	// Ensure stop clicker is disabled and ensure Stop clicker action is to stop roll function...
	document.getElementById("stopclicker").setAttribute("disabled", true);
	document.getElementById("stopclicker").setAttribute("style", "background-color:pink");
	document.getElementById("stopclicker").innerHTML = "STOP!";	
	document.getElementById("stopclicker").setAttribute("onclick", "stopRoll(rollDieTrack);");	
	
	// Reset visual roll counter to 0...
	rollCount = 0;	
	document.getElementById("roll_count").innerHTML = rollCount;
	
	// Make sure counters for tripples, quads, Fivers, and ones and fives comboes are reset to 0...

	
	// Roll tracker set back to 5 as passed thorugh loadDice function
	rollDieTrack = dice;
	
	// Clear keep area of all dice
	clearDice("middle");

	// reset temp score as load dice signifies new roll or player, update temp point counter
	tempVal = 0;
	document.getElementById("point_count").innerHTML = tempVal;
	
	/* load 5 dice into rolling area */	
	var diceToRoll = document.getElementById("roll_area");
	var die = new Array();
	for (var i = 0; i < dice; i++){
			console.log("for..dice");
		var id = "die" + (i+1);
		die[i] = document.createElement("BUTTON");	
		die[i].setAttribute("data-value",i+1);
		die[i].setAttribute("id", id);
		die[i].setAttribute("class", "dice");
		die[i].setAttribute("draggable",false);
		die[i].setAttribute("ondragstart","drag(event)");
		die[i].setAttribute("style", "border-color:rgb(255,0,0);background-image: url(img/D" + (i+1) + 
			".png);background-repeat: no-repeat;background-size: 100px 100px;border-radius:10px;");
		diceToRoll.appendChild(die[i]);
	}
}


function rollDice(){
	resCounts();	
	console.log("rollDice()");
	
	tempVal += scoreDice(keepDice);
	document.getElementById("point_count").innerHTML = tempVal;	
	
	keepDice.length = 0;
	keepDieTrack = 0;
	// only roll if rollCount is less than 3
	if (rollCount < MAXROLL){
			console.log("if rollCount<MAXROLL");

		// roll count incrementor..
		rollCount += 1;
		document.getElementById("roll_count").innerHTML = rollCount;
		
		// Clear existing dice from rolling area...
		clearDice("roll_area");
		
		// Roll new dice to rolling area...
		var diceToRoll = document.getElementById("roll_area");
		var die = new Array();
		// Roll starts with 5 dice
		for (var i = 0; i < rollDieTrack; i++){		
				console.log("for...rollDieTrack");

			var num = roll();
			die[i] = document.createElement("BUTTON");	
			die[i].setAttribute("data-value",num);
			die[i].setAttribute("class", "dice");
			die[i].setAttribute("style", "background-image: url(img/D" + num + 
				".png);background-repeat: no-repeat;background-size: 100px 100px;border-radius:10px;");			
			if (rollCount == 3){
				console.log("if rollCount == 3");
				keepDice[keepDieTrack] = num;
				kgTrack[kgt] = num;
				var id = "k_die" + (i+1);
				die[i].setAttribute("id", id);
				die[i].setAttribute("draggable",false);	
				document.getElementById("middle").appendChild(die[i]);
				keepDieTrack += 1;
				kgt += 1;
				console.log("keepDieTrack = " + keepDieTrack);
				console.log("kgt = " + kgt);
				if (kgt == 5){
					/* ---------- */
					console.log("rollCount = 3 : kgt = 5 : keepDice = " + keepDice);
					console.log ("tempVal:" + tempVal + " scoreDice(keepDice:" + scoreDice(keepDice));
					tempVal += scoreDice(keepDice);
					document.getElementById("point_count").innerHTML = tempVal;
					keepDice.length = 0;
					keepDieTrack = 0;
					/* ------------ */
					console.log("if kgt == 5");
					var counted = countVals(kgTrack);
					kgTrack.length = 0;
					if (keepGoing(counted)){
/* 						rollDieTrack = allDice;
 *//* 						anotTrack = allDice; */
						kgkd = 0;	
						kgRollDice.length = 0;
						console.log("if keepGoing");
						document.getElementById("clicker").innerHTML = "KEEP GOING!?!";
						document.getElementById("clicker").setAttribute("onclick", "kgRules(kgrd);");
						document.getElementById("stopclicker").removeAttribute("disabled");
						document.getElementById("stopclicker").setAttribute("style", "background-color:ivory");
						document.getElementById("stopclicker").setAttribute("onclick", "stopRoll2();");	
					}			
					else {
						console.log("else keepGoing");
						document.getElementById("clicker").innerHTML = "Clear";
						document.getElementById("clicker").setAttribute("onclick", "loadDice(allDice);");	
						document.getElementById("stopclicker").setAttribute("disabled", true);
						document.getElementById("stopclicker").setAttribute("style", "background-color:pink");
						document.getElementById("stopclicker").setAttribute("onclick", "stopRoll();");
					}
					kgt = 0;
				}
			} 
			else {
				console.log("else rollCount == 3");
				var id = "die" + (i+1);
				die[i].setAttribute("id", id);
				die[i].setAttribute("draggable",true);
				die[i].setAttribute("ondragstart","drag(event)");
/* 				die[i].setAttribute("ondblclick", "dClickAdd(this.id);");
 */				diceToRoll.appendChild(die[i]);
				document.getElementById("stopclicker").removeAttribute("disabled");
				document.getElementById("stopclicker").setAttribute("style", "background-color:ivory");
			}
		}		
		console.log(keepDice);
		console.log(kgTrack);
		if (keepDieTrack != 0){
			console.log("if keepDieTrack != 0");
			console.log ("tempVal:" + tempVal + " scoreDice(keepDice:" + scoreDice(keepDice));
			tempVal += scoreDice(keepDice);
			document.getElementById("point_count").innerHTML = tempVal;		
			keepDice.length = 0;
			keepDieTrack = 0;
		}				
				
	}
//	tempVal = 0;
	gotoBottom("funcs");
	console.log(keepDice);
	console.log("keepDieTrack = " + keepDieTrack);
	console.log(kgTrack);
	console.log("kgt = " + kgt);
}

/* 
function dClickAdd(id){
	var child = document.getElementById(id);
	var keepDie = document.getElementById("middle");
	
	keepDie.appendChild(child);
	child.setAttribute("ondblclick", "dClickRemove(this.id);");
}

function dClickRemove(){
	var putBack = document.getElementById("roll_area");
	
} */

function stopRoll(rdt){
	console.log("stopRoll(" + rdt + ")");
	document.getElementById("clicker").setAttribute("disabled", true);
	document.getElementById("clicker").setAttribute("style", "background-color:pink");
	var diceLeft = document.getElementById("roll_area");
	
	while(diceLeft.firstChild){
		console.log("while diceLeft.firstChild");
		keepDice[keepDieTrack] = 1 * diceLeft.firstChild.getAttribute("data-value");
		document.getElementById("middle").appendChild(diceLeft.firstChild);	
		keepDieTrack += 1;
		kgt += 1;
	}
	console.log ("tempVal:" + tempVal + " scoreDice(kgRollDice:" + scoreDice(kgRollDice));
	tempVal += scoreDice(kgRollDice);

	document.getElementById("point_count").innerHTML = tempVal;		
	document.getElementById("stopclicker").innerHTML = "Clear and Count";
	document.getElementById("stopclicker").setAttribute("onclick", "loadDice(allDice);");
	
//	pScore[p] += tempVal;
//	document.getElementById("total_count").innerHTML = pScore[p];
	
}

function stopRoll2(){
	console.log("stopRoll2()");
	document.getElementById("clicker").setAttribute("disabled", true);
	document.getElementById("clicker").setAttribute("style", "background-color:pink");
	kgrd = 0;
	kgRollDice.length = 0;
	var diceLeft = document.getElementById("roll_area");	
	while(diceLeft.firstChild){
		console.log("while diceLeft.firstChild");
		kgRollDice[kgrd] = 1 * diceLeft.firstChild.getAttribute("data-value");
		document.getElementById("middle").appendChild(diceLeft.firstChild);	
		kgrd += 1;
	}	
	console.log ("tempVal:" + tempVal + " scoreDice(kgRollDice:" + scoreDice(kgRollDice));
	tempVal += scoreDice(kgRollDice);
	document.getElementById("point_count").innerHTML = tempVal;		
	kgRollDice.length = 0;

	document.getElementById("stopclicker").innerHTML = "Clear and Count";
	document.getElementById("stopclicker").setAttribute("onclick", "loadDice(allDice);");
	
//	pScore[p] += tempVal;
//	document.getElementById("total_count").innerHTML = pScore[p];
	
}

function scoreDice(dice){
	console.log("scoreDice(" + dice + ")");
	var roundCount = new Array();
	for (var i = 0; i < dice.length; i++){
		console.log("for dice.length");
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
	console.log("scoring(" + count + ")");
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
	console.log("Scoring = " + (result + s1 + s5));
	return result + s1 + s5;
}


function isStraight(count){
	console.log("isStraight()");
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


		
function countVals(rc){
	console.log("countVals(" + rc + ")");
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
	console.log("countVals = " + count);
	return count;
}


function clearDice(loc){
	console.log("clearDice(" + loc + ")");
	var keepArea = document.getElementById(loc);
	
	while(keepArea.firstChild){
		keepArea.removeChild(keepArea.firstChild);
		rkct += 1;
	}
//	pScore[p] += tempVal;
//	document.getElementById("total_count").innerHTML = pScore[p];
}

function keepGoing(counted){	
	console.log("keepGoing(" + counted + ")");
	if (
		(tripCount && (oneCount == 2 || fivesCount == 2 || (oneCount == 1 && fivesCount == 1))) ||		
		(quadCount && (oneCount == 1 || fivesCount == 1)) || 
		fivCount || 
		fivesNonesRule(counted) || 
		isStraight(counted)
		 ){
		console.log("keepGoing = true");
		return true;
	}else{
		console.log("keepGoing = false");
		return false;
	}
}

function kgRules(rdt){
	resCounts();
	console.log("rollDieTrack = " + rollDieTrack);
	if (extraRounds == false){
		console.log("rollDieTrack = " + rollDieTrack);
		console.log("kgRollDice = " + kgRollDice);
		console.log("kgRules(" + rdt + ")");
		kgRollDice.length = 0;
		document.getElementById("clicker").setAttribute("onclick", "kgRules(kgrd);");
		if (rdt == 5){
			console.log("if rdt == 5");
			clearDice("middle");
		}
		var diceToRoll = document.getElementById("roll_area");
		var die = new Array();
		clearDice("roll_area");
		kgRollDice.length = 0;
		for (var i = 0; i < rdt; i++){	
			console.log("for < rdt");
			var id = "die" + (i+1);
			var num = roll();
			kgRollDice[i] = num;
	/* 		kgrd += 1; */
			die[i] = document.createElement("BUTTON");	
			die[i].setAttribute("data-value",num);
			die[i].setAttribute("class", "dice");
			die[i].setAttribute("style", "background-image: url(img/D" + num +
				".png);background-repeat: no-repeat;background-size: 100px 100px;border-radius:10px;");
			die[i].setAttribute("id", id);
			die[i].setAttribute("draggable",true);
			die[i].setAttribute("ondragstart","drag(event)");
			diceToRoll.appendChild(die[i]);
		}		
		if (kgPoints(kgRollDice)){
			console.log("if kgPoints(" + kgRollDice + ")");
/* 			clearDice("middle"); */
			document.getElementById("clicker").innerHTML = "Whew! Take your Points...</br>Keep Going?..";
			extraRounds = true;
		}
		else {
			console.log("else kgPoints");
			document.getElementById("clicker").innerHTML = "Oops!..</br>Click to Clear";
			document.getElementById("clicker").setAttribute("onclick", "loadDice(allDice);");
			document.getElementById("stopclicker").setAttribute("disabled", true);
			document.getElementById("stopclicker").setAttribute("style", "background-color:pink");
			tempVal = 0;
		}
		console.log("rollDieTrack = " + rollDieTrack);
	}
	else {
		console.log ("tempVal:" + tempVal + " scoreDice(kgKeepDice:" + scoreDice(kgKeepDice));
/* 		tempVal += scoreDice(kgKeepDice); */
		console.log("rollDieTrack = " + rollDieTrack);
		var diceToRoll = document.getElementById("roll_area");
		var die = new Array();
		if (rdt == 5){
			console.log("if rdt == 5");
			clearDice("middle");
		}
		clearDice("roll_area");	
		
		console.log ("tempVal:" + tempVal + " scoreDice(kgKeepDice:" + scoreDice(kgKeepDice));
		tempVal += scoreDice(kgKeepDice);
		kgKeepDice.length = 0;
		kgkd = 0;
		document.getElementById("point_count").innerHTML = tempVal;		
		kgRollDice.length = 0;
		for (var i = 0; i < rdt; i++){
			console.log("for < rdt");
			var id = "die" + (i+1);
			var num = roll();
			kgRollDice[i] = num;
			die[i] = document.createElement("BUTTON");	
			die[i].setAttribute("data-value",num);
			die[i].setAttribute("class", "dice");
			die[i].setAttribute("style", "background-image: url(img/D" + num +
				".png);background-repeat: no-repeat;background-size: 100px 100px;border-radius:10px;");
			die[i].setAttribute("id", id);
			die[i].setAttribute("draggable",true);
			die[i].setAttribute("ondragstart","drag(event)");
			diceToRoll.appendChild(die[i]);
		}
		if (kgPoints(kgRollDice)){
			console.log("if kgPoints(" + kgRollDice + ")");			
			document.getElementById("clicker").innerHTML = "Whew! Take your Points...</br>Keep Going?..";
			resCounts();
			
		}
		else {
			console.log("else kgPoints");
			document.getElementById("clicker").innerHTML = "Oops!..</br>Click to Clear";
			document.getElementById("clicker").setAttribute("onclick", "loadDice(allDice);");
			document.getElementById("stopclicker").setAttribute("disabled", true);
			document.getElementById("stopclicker").setAttribute("style", "background-color:pink");
			tempVal = 0;
		}
		console.log("rollDieTrack = " + rollDieTrack);
	}
	console.log("kgRollDice = " + kgRollDice);
	gotoBottom("funcs");
}

function kgPoints(dice){
	console.log("kgPoints(" + dice + ")");
	
	var count = countVals(dice);
	console.log("count = " + count + " on dice = " + dice);
	if (
		count[0] > 0 ||
		count[4] > 0 ||
		isStraight(count) ||
		fivesNonesRule(count) ||
		tripCount ||
		quadCount ||
		fivCount
	){
		console.log("kgPoints = true");
		console.log("If count[0] > 0 : count[0] = " + count[0]);
		console.log("If count[4] > 0 : count[4] = " + count[4]);
		console.log("If IsStraight(count) : count = " + count);
		console.log("If fivesNonesRule : count = " + count);
		console.log("If tripCount : tripCount = " + tripCount);
		console.log("If quadCount : quadCount = " + quadCount);
		console.log("If fivCount : fivCount = " + fivCount);
		return true;
	}
	else {
		console.log("kgPoints = false");
		return false;
	}
}

function fivesNonesRule(count){
	console.log("fivesNonesRule(" + count + ")");
	/* All single fives, or all single ones, or mixtures of both... */
	
	if ((1 * count[0]) + (1 * count[4]) == 5){
		console.log("fivesNonesRule = true");
		return true;
	}
	else {
		console.log("fivesNonesRule = false");
		return false;
	}
}


function resCounts(){
	console.log("resCounts()");
	tripCount = false;
	quadCount = false;
	fivCount = false;

	oneCount = 0;
	fivesCount = 0;	
}

/* Function to roll dice */

function roll(){
	console.log("roll()");
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
	if (extraRounds == false){
		console.log("rollDieTrack = " + rollDieTrack);
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		ev.target.appendChild(document.getElementById(data));
		var num = 1 * document.getElementById(data).getAttribute("data-value");
		keepDice[keepDieTrack] = num;
		kgTrack[kgt] = num;
		keepDieTrack += 1;
		kgt += 1;
		anotTrack -= 1;
		document.getElementById(data).setAttribute("id", "k_die" + kgt)
		rollDieTrack -= 1;
		console.log("keepDieTrack = " + keepDieTrack);
		if (kgt == 5){
			console.log("if kgt == 5");
			var count = countVals(kgTrack);
			if (keepGoing2(count)){
				console.log("if keepGoing2(" + count + ")");
				console.log ("tempVal:" + tempVal + " scoreDice(keepDice:" + scoreDice(keepDice));
				tempVal += scoreDice(keepDice);
				keepDice.length = 0;
				document.getElementById("point_count").innerHTML = tempVal;
				document.getElementById("clicker").innerHTML = "KEEP GOING!?!";
				document.getElementById("clicker").setAttribute("onclick", "kgRules(kgrd);");
			}
			else {
				console.log("else keepGoing2");
				document.getElementById("clicker").innerHTML = "Clear";
				document.getElementById("clicker").setAttribute("onclick", "loadDice(allDice);");
			}
			keepDieTrack = 0;
			kgt = 0;
			anotTrack = 5;
			rollDieTrack = allDice;
		}	
		console.log("rollDieTrack = " + rollDieTrack);
	}
	else {
		console.log("rollDieTrack = " + rollDieTrack);
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		ev.target.appendChild(document.getElementById(data));
		var num = 1 * document.getElementById(data).getAttribute("data-value");
		kgKeepDice[kgkd] = num;
		kgkd += 1;
		kgrd -= 1;
		document.getElementById(data).setAttribute("id", "k_die" + kgkd)
		rollDieTrack -= 1;
		console.log("kgKeepDice = " + kgKeepDice);
		if (kgrd == 0){
			console.log("if kgrd == 0");
			var count = countVals(kgRollDice);
			if (keepGoing2(count)){
				console.log("if keepGoing2(" + count + ")");
/* 				console.log ("tempVal:" + tempVal + " scoreDice(kgKeepDice:" + scoreDice(kgKeepDice));
				tempVal += scoreDice(kgKeepDice);
				kgKeepDice.length = 0;
				document.getElementById("point_count").innerHTML = tempVal; */
				document.getElementById("clicker").innerHTML = "KEEP GOING!?!";
				document.getElementById("clicker").setAttribute("onclick", "kgRules(rollDieTrack);");
				kgRollDice.length = 0;
			}
			else {
				console.log("else keepGoing2");
				document.getElementById("clicker").innerHTML = "Clear";
				document.getElementById("clicker").setAttribute("onclick", "loadDice(allDice);");
			}
/* 			kgKeepDice.length = 0;
			kgkd = 0; */
			rollDieTrack = allDice;
			kgrd = 5;
		}		
		console.log("rollDieTrack = " + rollDieTrack);
	}
	console.log("keepDice = " + keepDice);
	console.log("tempVal = " + tempVal);
	console.log("kgTrack = " + kgTrack);
	console.log("kgt = " + kgt);
}

function keepGoing2(count){
	console.log("keepGoing2(" + count + ")");
	if (
/* 	if any are a 1 or a 5 */
			(
				count[0] > 0 || 
				count[4] > 0
			) ||
/* 	if tripple */
/* 	if quad  */
/* 	if fiver  */	
			(
				count[1] > 2 ||
				count[2] > 2 ||
				count[3] > 2 ||
				count[5] > 2
			) ||
/*  if straight */
			isStraight(count)
	
	){
		console.log("keepGoing2 is true");
		return true;		
	}
	else {
		console.log("keepGoing2 is false");
		return false;
	}

}

//Scolling ...

function gotoBottom(id){
   var div = document.getElementById(id);
   div.scrollTop = div.scrollHeight - div.clientHeight;
     
   
}