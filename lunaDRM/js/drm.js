var drm = {
	
	playready: {
		video_src:   "http://playready.directtaps.net/smoothstreaming/SSWSS720H264PR/SuperSpeedway_720.ism/Manifest",
		drm_server:  "http://playready.directtaps.net/pr/svc/rightsmanager.asmx",
		drmSystemId: "urn:dvb:casystemid:19219",
		drmType:     "playready",
		
		msg:'<?xml version="1.0" encoding="utf-8"?>' + 
				'<PlayReadyInitiator xmlns="http://schemas.microsoft.com/DRM/2007/03/protocols/">' + 
					'<LicenseServerUriOverride>' +
						'<LA_URL>http://playready.directtaps.net/pr/svc/rightsmanager.asmx</LA_URL>' + 
					'</LicenseServerUriOverride>' +
				'</PlayReadyInitiator>',
		
		msgType:   "application/vnd.ms-playready.initiator+xml",
		videoType: "application/vnd.ms-sstr+xml;mediaOption=",
		mediaTransportType: "URI"
	},
	
	widevine: {
		video_src:   "insert you widevine link here...",
		drm_server:  "https://pmweb.widevine.net/cgi-bin/test/proxy_rutube.cgi",
		drmSystemId: "urn:dvb:casystemid:19156",
		drmType:     "widevine",
		 
		msg: '<?xml version="1.0" encoding="utf-8"?>' +
			    '<WidevineCredentialsInfo xmlns="http://www.smarttv-alliance.org/DRM/widevine/2012/protocols/">' +
			        '<ContentURL>http://devcasts.ru/video/fizruk_enc.wvm</ContentURL>' +
					'<DeviceID></DeviceID>'+
					'<StreamID></StreamID>'+
					'<ClientIP></ClientIP>'+
					'<DRMServerURL>https://pmweb.widevine.net/cgi-bin/test/proxy_rutube.cgi</DRMServerURL>' +
					'<DRMAckServerURL></DRMAckServerURL>'+
					'<DRMHeartBeatURL>0</DRMHeartBeatURL>'+
					'<DRMHeartBeatPeriod></DRMHeartBeatPeriod>'+
					'<UserData>lovefilm</UserData>'+
					'<Portal></Portal>'+
					'<StoreFront></StoreFront>'+
					'<BandwidthCheckURL></BandwidthCheckURL>'+
					'<BandwidthCheckInterval></BandwidthCheckInterval>'+
			    '</WidevineCredentialsInfo>',
    
		msgType:   "application/widevine+xml",
		videoType: "video/mp4;mediaOption=",
		mediaTransportType: "WIDEVINE"
	}
},

logStash,clientId,

isDrmClientLoaded = false,
appId = "com.sample.drm",
tagsToReplace = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;'
};

var drmdata = drm.widevine;

function loadDrmClient() {

    logStash = document.getElementById('log_stash'),
	logStash.innerHTML += "loadDrmClient function:" + "<br>";

    webOS.service.request("luna://com.webos.service.drm", {
			method:"load",
			parameters: {
				drmType: drmdata.drmType,
				appId: appId
			},
			onSuccess: function (result) {
				clientId            = result.clientId;
				isDrmClientLoaded   = true;
				logStash.innerHTML += "load method. onSuccess."  + "<br>";
				logStash.innerHTML += "clientId: " + clientId  + "<br>";
				
				logStash.innerHTML += safe_tags_replace(JSON.stringify(result)) + "<br>";
			},
			onFailure: function (result) {
				logStash.innerHTML += "[load][" + result.errorCode + "] " + result.errorText  + "<br>";
			}
		});
}

function isLoaded() {
    
	logStash.innerHTML += "<br>" + "isLoaded function: " + "<br>";
	
	webOS.service.request("luna://com.webos.service.drm", {
        method:"isLoaded",
        parameters: {
            appId: appId
        },
        onSuccess: function (result) {
            logStash.innerHTML += "isLoaded method. onSuccess." + "<br>";
            logStash.innerHTML += "clientId: " + result.clientId + "<br>";
        },
        onFailure: function (result) {
            logStash.innerHTML += "[isLoaded][" + result.errorCode + "] " + result.errorText + "<br>";
        }
	});
}

function sendRightInformation() {
	
    logStash.innerHTML += "<br>" + "sendRightInformation function:" + "<br>";	
    logStash.innerHTML += "clientId used to send message: " + clientId + "<br>";
	
	 webOS.service.request("luna://com.webos.service.drm", {
        method:"sendDrmMessage",
        parameters: {
            clientId:    clientId,
            msgType:     drmdata.msgType,
            msg:         drmdata.msg,
            drmSystemId: drmdata.drmSystemId,
        },
        onSuccess: function (result) {
            
			console.log(result);
			
			msgId = result.msgId;
            logStash.innerHTML += "sendDrmMessage method. onSuccess." + "<br>";
            logStash.innerHTML += "result.resultCode: " + result.resultCode + "<br>";
            logStash.innerHTML += "result.resultMsg: " + result.resultMsg + "<br>";
            logStash.innerHTML += "result.msgId: " + result.msgId + "<br><br />";
            setPlaybackOptions();
        },
        onFailure: function (result) {
            logStash.innerHTML += "sendDrmMessage method. onFailure." + "<br>";
            logStash.innerHTML += "result.returnValue: " + result.returnValue + "<br>";
            logStash.innerHTML += "result.errorCode: " + result.errorCode + "<br>";
            logStash.innerHTML += "result.errorText: " + result.errorText + "<br><br />";
        }
    });
}

function unloadDrmClient() {
    
	if (isDrmClientLoaded) {
		logStash.innerHTML += "<br />Unloading client function" + "<br>";
		webOS.service.request("luna://com.webos.service.drm", {
            method:"unload",
            parameters: {
                clientId: clientId
            },
            onSuccess: function (result) {
                logStash.innerHTML += "client Id: " + clientId + "<br><br />";
                isDrmClientLoaded = false;
            },
            onFailure: function (result) {
            	logStash.innerHTML += "[" + result.errorCode + "]" + result.errorText + "<br><br />";
            }
        });
        logStash.innerHTML += "Unloading client..." + "<br>";
    }
}

function setPlaybackOptions() {
		
    var options = {
    	mediaTransportType: drmdata.mediaTransportType,
    	option: {
    		drm: {
    			type:     drmdata.drmType,
    			clientId: clientId
    		}
    	}
    };
    
	var source = document.createElement("source");
		source.setAttribute('src',  drmdata.video_src);
		source.setAttribute('type', drmdata.videoType + escape(JSON.stringify(options)) );

    var video = document.getElementById('video');
    	video.innerText = '';
    	video.appendChild(source);
    	
    logStash.innerHTML += safe_tags_replace(JSON.stringify(options)) + "<br>";
}




// --- Service functions ---
function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

function clearStash(){ 
	logStash.innerHTML = ''; 
}
