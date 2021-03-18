"use strict";
var mqtt = require('mqtt');
const trycatch = require('trycatch');

var client  = mqtt.connect({ host: process.env.MQTT_HOST, port: process.env.MQTT_PORT })
client.on('connect', function () {  
  	console.log("-------------");
  	console.log("connected");
  	console.log("-------------");
});

console.log(process.env.MQTT_HOST);
console.log(process.env.MQTT_PORT);

exports.send = function(req,callback){
	var output = new Object;
  	console.log("-------REQ------");
	console.log(req)
    try {						
	    var topic = req.topic;
	    var send = req.data
	    client.publish(topic,JSON.stringify(send));
	    var output = {
            code : '00', //error.code
            message : "Message sent successfully",
            data:req
        }
        callback(output);
	} catch (error) {
		var output = {
            code : 'MQTT_FAILED', //error.code
            info : error
        }
        callback(output);
	};

    // client.messaging().sendToDevice(registrationToken, message, options)
    // .then( response => {
    //     output = {
    //         code : '00',
    //         message : "Notification sent successfully",
    //         data : {
    //             token:registrationToken,
    //             message:message
    //         }
    //     }
    //     callback(null,output);
    // })
    // .catch( error => {
    //     console.log(error);
    //     output = {
    //         code : 'FIREBASE_FAILED', //error.code
    //         info : error.message
    //     }
    //     callback(output);
    // });
}