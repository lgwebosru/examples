window.onload = function(){
	historyCount();
}

window.addEventListener("popstate", function(inEvent){
		
	if( inEvent.state && inEvent.state.url ){
		var target_url = inEvent.state.url;
		location.href = target_url;
		console.log(inEvent);		
	}
});

function addHistory(){
		history.pushState({"url":"http://www.lge.com"},'','');
		historyCount();
}

function historyCount(){
		var temp = history.length;
		document.getElementById("result").innerHTML = temp;
}