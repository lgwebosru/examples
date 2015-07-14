var Service = require('webos-service');
var md5 = require('md5');

var service = new Service("com.sample.nodeextension.service");

service.register("encrypt", function(message) {
	console.log("Encryption Started");	

	var targetString = message.payload.targetString;
	var str = md5.digest_s(targetString);
	
	message.respond({
		returnValue: true,
		encryptedMsg: str
		//encryptedMsg: md5(targetString);
	});
});