window.onload = function(){
	
	var player = document.getElementById("video"),
		play   = document.getElementById("play"),
		pause  = document.getElementById("pause"),
		backward = document.getElementById("backward"),
		forward  = document.getElementById("forward"),
		state    = document.getElementById("state"),
		getinfo  = document.getElementById("getinfo"),
		info = document.getElementById("info"),
		interval;
	
	getInfo();
	
	play.onclick = function(e){
		player.play();
		interval = setInterval(getInfo, 1000);
	}
	
	pause.onclick = function(e){
		player.pause();
	}
	
	backward.onclick = function(e){
		player.currentTime -= 5;
	}
	
	forward.onclick = function(e){
		player.currentTime += 5;
	}
		
	
	// Events
	player.addEventListener("play", function(e){
		state.innerText = "Play";
	});
				 
	player.addEventListener("canplay", function(e){
		state.innerText = "Playing";
	});
	
	player.addEventListener("waiting", function(e){
		state.innerText = "Buffering";
	});
	
	player.addEventListener("pause", function(e){
		state.innerText = "Pausing";
	});
	
	player.addEventListener("seeking", function(e){
		state.innerText = "Start seeking";
	});
	
	player.addEventListener("seeked", function(e){
		state.innerText = "End seeking";
	});
	
	player.addEventListener("ended", function(e){
		state.innerText = "End of video";
		clearInterval(interval);
	});
	
	function getInfo(){
		
		info.innerHTML = 
			'error: '+player.error+'<br />'+
			'readyState: '+player.readyState+'<br />'+
			'currentTime: '+player.currentTime+'<br />'+
			'duration: '+player.duration;
	}
	
	document.getElementById("drmtype").onchange = function(e){
		drmdata = drm[e.target.value];
	};
}