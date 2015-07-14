var Service = require('webos-service');
var service = new Service("com.sample.nodejsfs.service");

var fs   = require('fs');

service.register("getNode", function(message) {
	
	var node = fs.readdirSync(message.payload.path);
	message.respond({
		data: node
	});
});