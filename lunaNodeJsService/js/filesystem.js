window.addEventListener('load', function(e){
	
	document.getElementById('start_node').addEventListener('click', getChildNodes, false);
});

function getChildNodes( e ){
	
	console.log('click');
	e.stopPropagation();
	
	if( e.target.childElementCount > 0 ){
		
		for( var i = e.target.childElementCount-1; i >= 0; i-- ){
			
			if( typeof e.target.children[i] === 'object' )
				e.target.removeChild(e.target.children[i]);
		}
	
	}else if( e.target.innerText != 'forbidden' ){
		
		var loading = document.createElement('marquee');
			loading.innerText = 'III';
			e.target.appendChild(loading);
		
		
		console.log("call service");	
		webOS.service.request("luna://com.sample.nodejsfs.service/", {
	        method: "getNode",
	        parameters: {
	        	path: e.target.title
	        },    
	        onFailure: function(inResponse){
	        	console.log(inResponse);
	        },
	        onComplete: function( inResponse ){
	        	
	        	
	        	e.target.removeChild(loading);
	        	console.log(inResponse);
	        	
	        	if( !inResponse.returnValue ){	        		
	        		inResponse.data = ['forbidden'];
	        	}
	        		
	        	
	        	if( inResponse.data.length == 0 )
	        		inResponse.data = ['empty'];
	        	
	        	inResponse.data.forEach(function(value, key){
	    			
	    			var new_node = document.createElement('div');
	    			
	    				new_node.addEventListener('click', getChildNodes, false);
	    				new_node.innerText = value;
	    				new_node.title = e.target.title + value + '/';
	    				new_node.className = 'fs_node ' + value; //+ (inResponse.info[key] ? ' file':' dir');

	    			e.target.appendChild(new_node);
	    		});
	        }
	    });		
	}
}