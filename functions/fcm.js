'use strict';
const moment = require('moment');
var fcm = require('../config/firebase-config');

var admin = fcm.admin

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };

exports.send = function(req,callback){
    // setup email data with unicode symbols
    var output = new Object;
    const  registrationToken = req.body.registrationToken
    const message = req.body.message
    const options =  notification_options
    admin.messaging().sendToDevice(registrationToken, message, options)
    .then( response => {
        output = {
            code : '00',
            message : "Notification sent successfully",
            data : {
                token:registrationToken,
                message:message
            }
        }
        callback(null,output);
    })
    .catch( error => {
        console.log(error);
        output = {
            code : 'FIREBASE_FAILED', //error.code
            info : error.message
        }
        callback(output);
    });
}
