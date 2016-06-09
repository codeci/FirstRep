// jQuery Javascript file

$(document).ready(function(){
	
	var sqrSize = $("#kheart").css("width");
	console.log(sqrSize);
	console.log(sqrSize.length);
	
	var num = convNum(sqrSize);
	console.log(num);
	
	console.log(sqrSize);
	console.log(num);
	
/* 	$("#kheart").click(function(){
		$("#kheart").animate({width: sqrSize + "px", height:(sqrSize * 2) + "px"}, "slow");
		sqrSize = 1 * sqrSize/1.8;
		console.log(sqrSize);
	}); */
	
});

function convNum(x){
	var n = x.length;
	var res = new Array();
		for (var i = (n); i > 0;i--){
			res[i] = 1 * x[i];
			console.log(res[i]);
		}
	
	return res;
}