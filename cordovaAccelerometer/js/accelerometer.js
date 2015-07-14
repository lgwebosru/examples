// The watch id references the current `watchAcceleration`
var watchID = null;

// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// Cordova is ready
function onDeviceReady() {
    startWatch();
}

// Start watching the acceleration
function startWatch() {

    // Update acceleration every 0.05 seconds
    var options = { frequency: 50 };
    watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}

// Stop watching the acceleration
function stopWatch() {
    if (watchID) {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
}

// onSuccess: Get a snapshot of the current acceleration
function onSuccess(acceleration) {
    
	document.getElementById('accelerometer').innerHTML = 
		'Acceleration X: ' + Math.round(acceleration.x) + '<br />' +
        'Acceleration Y: ' + Math.round(acceleration.y) + '<br />' +
        'Acceleration Z: ' + Math.round(acceleration.z) + '<br />' + 
        'Timestamp: '      + acceleration.timestamp + '<br />';
}	

// onError: Failed to get the acceleration
function onError() {
	 document.getElementById('accelerometer').innerText("Error");
}