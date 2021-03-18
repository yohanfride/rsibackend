'use strict';
var nodemailer = require('nodemailer');
const moment = require('moment');
// create reusable transporter object using the default SMTP transport
    if (process.env.EMAIL_SECURE == 'true') {
      var email_secure = true;
    } else {
       var email_secure = false;
    }

    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: email_secure, // secure:true for port 465, secure:false for port 587        
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }       
    });

exports.send = function(req,callback){
    // setup email data with unicode symbols

    var output = new Object;

    var mailOptions = {
        from: process.env.EMAIL_SENDER, // sender address
        to: req.body.email, // list of receivers
        subject: req.body.subject, // Subject line
       // text: 'Hello world ?', // plain text body
        html: req.body.body_email,
         // html body
    };

    if(req.body.path != undefined){
        mailOptions.attachments = [{
            path : req.body.path
         }]
    }
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error,info){
        if (error) {
            console.log(error)
            output = {
                code : 'MAIL_FAILED', //error.code
                info : error.message
            }
            callback(output);
        }else{
            output = {
                code : '00',
                message : info.messageId,
                data : info
            }
            
            callback(null,output);

        }
    });
}

exports.struct_transaction = function(req,callback){
    // setup email data with unicode symbols
    var data = req.body.data;
    var total = (data.pay).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    data.date_finish = (data.date_finish).toISOString().replace("Z","");
    var total       = (data.pay).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var price       = (data.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var total_fuel  = (data.total_fuel).toFixed(2).replace(".",",").replace(/\d(?=(\d{3})+\,)/g, '$&.');
    var date        = (days[new Date(data.date_finish).getDay() ]) + ", " + moment(data.date_finish).format('DD') +' '+ (months[ new Date(data.date_finish).getMonth() ]) +' '+moment(data.date_finish).format('YYYY');
    var time        = moment(data.date_finish).format('HH:mm');
    var subtotal    = (data.total_fuel * data.price).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var tax         = (data.tax).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    if(data.payment_method){
        var payment_method = data.payment_method
    } else {
        var payment_method = 'E-Money';
    }   

    if(data.fb_link){
        var fb_link = data.fb_link
    } else {
        var fb_link = '#';
    }   

    if(data.twitter_link){
        var twitter_link = data.twitter_link
    } else {
        var twitter_link = '#';
    } 

    if(data.instagram_link){
        var instagram_link = data.instagram_link
    } else {
        var instagram_link = '#';
    } 

    if(data.linkedin_link){
        var linkedin_link = data.linkedin_link
    } else {
        var linkedin_link = '#';
    } 

    var body = '<div style="font-family:\'Helvetica\',Arial,sans-serif">'+
    '<table width="100%" align="center" border="0" cellspacing="0" cellpadding="0">'+
    '   <tbody><tr>'+
    '       <td align="center" valign="top">'+
    '           <table width="600" align="center" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #ededed">'+
    '               <tbody><tr>'+
    '                   <td bgcolor="#ffffff">                        '+
    '                       <table style="max-width:100%;border-spacing:0;width:100%;background-color:transparent;margin:0;padding:20px; background:#AD0000;">'+
    '                           <tbody>'+
    '                               <tr style="margin:0;padding:0; ">'+
    '                                   <td>'+
    '                                       <img src="http://147.139.171.136/easy-customer/assets/img/logo-white.svg" alt="" style="height: 42;" class="CToWUd">'+
    '                                   </td>'+
    '                                   <td style="text-align: right;">'+
    '                                       <h5 style="line-height:32px;color:white;font-weight:700;font-size:22px;margin:0px;padding:0">Transaction Receipt</h5>'+
    '                                   </td>'+
    '                               </tr>'+
    '                           </tbody>'+
    '                       </table>                       '+
    '                       <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">'+
    '                           <tbody><tr>'+
    '                               <td valign="top" width="45"></td>'+
    '                               <td valign="top" style="font-family:Helvetica,\'Arial\',sans-serif;color:#000000;font-size:11px">'+
    '                                   <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                       <tbody>'+
    '                                       <tr>'+
    '                                           <td height="15"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="15" border="0" class="CToWUd"></td>'+
    '                                       </tr>'+
    '                                       <tr>'+
    '                                           <td>'+
    '                                               <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                                   <tbody><tr>'+
    '                                                       <td width="44%" align="left" valign="top" style="font-size:12px;line-height:21px;font-weight:bold">TOTAL<br>'+
    '                                                           <span style="font-size:28px;line-height:32px;font-weight:bold;color:#AD0000">'+ total+' (IDR)</span></td>'+
    '                                                       <td width="56%" align="left" valign="top" style="font-size:12px;line-height:21px;font-weight:bold">'+
    '                                                           '+
    '                                                           DATE &nbsp;&nbsp;|&nbsp; TIME'+
    '                                                           '+
    '                                                           <br>'+
    '                                                           <span style="font-size:18px;font-weight:bold;color:#AD0000">'+date+' | '+time+'</span></td>'+
    '                                                   </tr>'+
    '                                               </tbody></table>'+
    '                                               <table width="100%" border="0" cellpadding="0" cellspacing="0">'+
    '                                                   <tbody><tr>'+
    '                                                       <td height="12"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="12" border="0" class="CToWUd"></td>'+
    '                                                   </tr>'+
    '                                               </tbody></table>'+
    '                                           </td>'+
    '                                       </tr>'+
    '                                   </tbody></table>'+
    '                               </td>'+
    '                               <td valign="top" width="45"></td>'+
    '                           </tr>'+
    '                       </tbody></table>'+
    '                       <table width="100%" border="0" cellpadding="0" cellspacing="0">'+
    '                           <tbody><tr>'+
    '                               <td height="5"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="10" height="5" border="0" class="CToWUd"></td>'+
    '                           </tr>'+
    '                       </tbody></table>'+
    '                       <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4">'+
    '                           <tbody><tr>'+
    '                               <td valign="top" width="45"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="10" border="0" class="CToWUd"></td>'+
    '                               <td align="center" valign="top">'+
    '                                   <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                       <tbody><tr>'+
    '                                           <td align="left" height="20"></td>'+
    '                                       </tr>'+
    '                                   </tbody></table>'+
    '                                   <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                       <tbody><tr>'+
    '                                           <td width="55%" align="left" style="font-size:14px;font-weight:bold;color:#AD0000"></td>'+
    '                                       </tr>'+
    '                                   </tbody></table>'+
    '                                   <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                       <tbody><tr>'+
    '                                           <td valign="top" width="200">'+
    '                                               <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                                   <tbody><tr>'+
    '                                                       <td align="left" valign="top" style="font-size:14px;font-weight:bold;color:#AD0000">Summary</td>'+
    '                                                   </tr>'+
    '                                                   <tr>'+
    '                                                       <td align="center" valign="middle" height="10"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="170" height="10" border="0" class="CToWUd"></td>'+
    '                                                   </tr>'+
    '                                                   <tr>'+
    '                                                       <td valign="top">'+
    '                                                           <table width="100%" border="0" cellpadding="0" cellspacing="0">'+
    '                                                               <tbody><tr>'+
    '                                                                   <td align="left" valign="top" style="padding:0cm 0cm 0cm 0cm">'+
    '                                                                       <table width="100%" border="0" cellpadding="0" cellspacing="0">'+
    '                                                                           <tbody><tr>'+
    '                                                                               <td valign="top">'+
    '                                                                                   <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                                                                       <tbody><tr>'+
    '                                                                                           <td align="left" valign="top">'+
    '                                                                                               <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                                                                                   <tbody><tr>'+
    '                                                                                                       <td align="left" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:10px;color:#9e9e9e;line-height:16px">'+
    '                                                                                                               '+
    '                                                                                                               Truck:'+
    '                                                                                                               '+
    '                                                                                                           </span><br>'+
    '                                                                                                           <span style="font-size:12px;line-height:16px;font-weight:bold">'+data.car.vehicle_number+'</span>'+
    '                                                                                                       </td>'+
    '                                                                                                   </tr>'+
    '                                                                                               </tbody></table>'+
    '                                                                                           </td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr><td height="3"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="3" border="0" class="CToWUd"></td></tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td align="left" valign="top">'+
    '                                                                                               <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                                                                                   <tbody><tr>'+
    '                                                                                                       <td align="left" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:10px;color:#9e9e9e;line-height:14px">'+
    '                                                                                                               '+
    '                                                                                                               Driver '+
    '                                                                                                               '+
    '                                                                                                           </span><br>'+
    '                                                                                                           <span style="font-size:12px;line-height:16px;font-weight:bold">'+data.driver.name+'</span>'+
    '                                                                                                       </td>'+
    '                                                                                                   </tr>'+
    '                                                                                               </tbody></table></td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td height="3"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="3" border="0" class="CToWUd"></td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td align="left" valign="top">'+
    '                                                                                               <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                                                                                   <tbody><tr>'+
    '                                                                                                       <td align="left" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;font-size:12px;line-height:16px;color:#000000">'+
    '                                                                                                           <span style="font-size:10px;color:#9e9e9e;line-height:16px">'+
    '                                                                                                               '+
    '                                                                                                               Customer Name'+
    '                                                                                                               '+
    '                                                                                                           </span><br>'+
    '                                                                                                           <span style="font-size:12px;line-height:16px;font-weight:bold">'+data.customer.name+'</span>'+
    '                                                                                                       </td>'+
    '                                                                                                   </tr>'+
    '                                                                                               </tbody></table>'+
    '                                                                                           </td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td height="3"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="5" border="0" class="CToWUd"></td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td align="left" valign="top">'+
    '                                                                                               <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                                                                                   <tbody><tr>'+
    '                                                                                                       <td align="left" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:10px;color:#9e9e9e;line-height:16px">Transaction ID</span><br>'+
    '                                                                                                           <span style="font-size:12px;line-height:16px;font-weight:bold">'+data.transaction_code+'</span>'+
    '                                                                                                       </td>'+
    '                                                                                                   </tr>'+
    '                                                                                               </tbody></table>'+
    '                                                                                           </td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td height="3"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="5" border="0" class="CToWUd"></td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td align="left" valign="top">'+
    '                                                                                               <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                                                                                   <tbody><tr>'+
    '                                                                                                       <td align="left" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:10px;color:#9e9e9e;line-height:16px">'+
    '                                                                                                               '+
    '                                                                                                               Refueling Location:'+
    '                                                                                                               '+
    '                                                                                                           </span><br>'+
    '                                                                                                           <span style="font-size:12px;line-height:16px;font-weight:bold"><b>'+data.location_label+'</b> - '+data.location_address+'</span>'+
    '                                                                                                       </td>'+
    '                                                                                                   </tr>'+
    '                                                                                               </tbody></table>'+
    '                                                                                           </td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td height="3"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="5" border="0" class="CToWUd"></td>'+
    '                                                                                       </tr>'+
    '                                                                                   </tbody></table>'+
    '                                                                               </td>'+
    '                                                                           </tr>'+
    '                                                                       </tbody></table>'+
    '                                                                   </td>'+
    '                                                               </tr>'+
    '                                                           </tbody></table></td>'+
    '                                                   </tr>'+
    '                                               </tbody></table>'+
    '                                           </td>'+
    '                                           <td valign="top" width="9"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="9" height="10" border="0" class="CToWUd"></td>'+
    '                                           <td valign="top" width="10" bgcolor="#f5f5f3"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="10" height="10" border="0" class="CToWUd"></td>'+
    '                                           <td valign="top" width="270">'+
    '                                               <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                                   <tbody><tr><td align="left" valign="top" style="font-size:14px;font-weight:bold;color:#AD0000">Payment Details</td></tr>'+
    '                                                   <tr>'+
    '                                                       <td align="center" valign="middle" height="10"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="170" height="10" border="0" class="CToWUd"></td>'+
    '                                                   </tr>'+
    '                                                   <tr>'+
    '                                                       <td valign="top"><table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #dddddd">'+
    '                                                               <tbody><tr>'+
    '                                                                   <td align="left" valign="top" style="padding:0 0 0 0">'+
    '                                                                       <table width="100%" border="0" cellpadding="0" cellspacing="0">'+
    '                                                                           <tbody><tr>'+
    '                                                                               <td valign="top">'+
    '                                                                                   <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                                                                       <tbody><tr>'+
    '                                                                                           <td align="left" valign="top">'+
    '                                                                                               <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                                                                                   <tbody><tr>'+
    '                                                                                                       <td height="10px" align="left"></td>'+
    '                                                                                                       <td height="10px" colspan="2" align="left"></td>'+
    '                                                                                                       <td height="10px" align="left"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td height="5px" align="left"></td>'+
    '                                                                                                       <td height="5px" colspan="2" align="left" style="font-size:11px;line-height:18px;font-family:\'Helvetica\',Arial,sans-serif;font-weight:normal;color:#9e9e9e">'+
    '                                                                                                           Payment Method:<br>'+
    '                                                                                                           <span style="font-weight:bold;color:#000000">'+payment_method+'</span>'+
    '                                                                                                       </td>'+
    '                                                                                                       <td height="5px" align="left"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td height="5px" align="left"></td>'+
    '                                                                                                       <td height="5px" colspan="2" align="left"></td>'+
    '                                                                                                       <td height="5px" align="left"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td height="3px" align="left"></td>'+
    '                                                                                                       <td height="3px" colspan="2" align="left" style="border-top:1px dashed #9e9e9e"></td>'+
    '                                                                                                       <td height="3px" align="left"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td align="left" width="15"></td>'+
    '                                                                                                       <td width="161" align="left" style="font-family:\'Helvetica\',Arial,sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:11px;color:#9e9e9e;line-height:21px">Order Detail:</span>'+
    '                                                                                                       </td>'+
    '                                                                                                       <td width="90" align="left" style="font-family:\'Helvetica\',Arial,sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:11px;color:#9e9e9e;line-height:28px">Amount:</span>'+
    '                                                                                                       </td>'+
    '                                                                                                       <td align="left" width="15"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td height="3px" align="left"></td>'+
    '                                                                                                       <td height="3px" colspan="2" align="left"></td>'+
    '                                                                                                       <td height="3px" align="left"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td height="5px" align="left"></td>'+
    '                                                                                                       <td height="5px" colspan="2" align="left" style="border-top:1px dashed #9e9e9e"></td>'+
    '                                                                                                       <td height="5px" align="left"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr style="color:#000000">'+
    '                                                                                                       <td align="left" width="15"></td>'+
    '                                                                                                       <td align="left" style="font-family:\'Helvetica\',\'Arial\',sans-serif;font-weight:normal">'+
    '                                                                                                           <span style="font-size:11px;font-weight:bold">'+data.fuel_type+'</span> <br/>'+
    '                                                                                                           '+
    '                                                                                                           <span style="font-size:11px;line-height:18px">'+total_fuel+' (liter) x '+price+' (IDR) </span>'+
    '                                                                                                           '+
    '                                                                                                       </td>'+
    '                                                                                                       <td align="right" style="font-family:\'Helvetica\',\'Arial\',sans-serif;font-weight:normal">'+
    '                                                                                                           <span style="font-size:11px;line-height:18px">'+subtotal+' (IDR)</span>'+
    '                                                                                                       </td>'+
    '                                                                                                       <td align="right" width="15"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td align="right" width="15"></td>'+
    '                                                                                                       <td align="right">&nbsp;</td>'+
    '                                                                                                       <td align="right">&nbsp;</td>'+
    '                                                                                                       <td align="right" width="15"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td align="left" width="15"></td>'+
    '                                                                                                       <td align="left" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000"><span style="font-size:11px;color:#000000;line-height:18px">Subtotal</span></td>'+
    '                                                                                                       <td align="right" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:11px;color:#000000;line-height:18px">'+subtotal+' (IDR) </span>'+
    '                                                                                                       </td>'+
    '                                                                                                       <td align="right" width="15"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#c5c5c5">'+
    '                                                                                                       <td align="left" width="15"></td>'+
    '                                                                                                       <td align="left"><span style="font-size:11px;line-height:18px">Tax</span></td>'+
    '                                                                                                       <td align="right">'+
    '                                                                                                           <span style="font-size:11px;line-height:18px">'+tax+' (IDR) </span>'+
    '                                                                                                       </td>'+
    '                                                                                                       <td align="right" width="15"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td height="10px" align="left"></td>'+
    '                                                                                                       <td height="10px" colspan="2" align="left"></td>'+
    '                                                                                                       <td height="10px" align="left"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td height="10px" align="left"></td>'+
    '                                                                                                       <td height="10px" colspan="2" align="left" style="border-top:1px dashed #9e9e9e"></td>'+
    '                                                                                                       <td height="10px" align="left"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                                   <tr>'+
    '                                                                                                       <td align="left" width="15"></td>'+
    '                                                                                                       <td align="right" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:12px;font-weight:bolder;color:#000000;line-height:28px">TOTAL (INCL. TAX)&nbsp;&nbsp;&nbsp;&nbsp;</span>'+
    '                                                                                                       </td>'+
    '                                                                                                       <td align="right" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000">'+
    '                                                                                                           <span style="font-size:12px;font-weight:bolder;line-height:28px">'+total+' (IDR)</span>'+
    '                                                                                                       </td>'+
    '                                                                                                       <td align="left" width="15"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                               </tbody></table>'+
    '                                                                                           </td>'+
    '                                                                                       </tr>'+
    '                                                                                       <tr>'+
    '                                                                                           <td align="left" valign="top">'+
    '                                                                                               <table border="0" cellspacing="0" cellpadding="0" width="100%">'+
    '                                                                                                   <tbody><tr>'+
    '                                                                                                       <td align="left" style="font-family:Helvetica,\'Arial\',sans-serif;font-weight:normal;color:#000000"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="10" border="0" class="CToWUd"></td>'+
    '                                                                                                   </tr>'+
    '                                                                                               </tbody></table>'+
    '                                                                                           </td>'+
    '                                                                                       </tr>'+
    '                                                                                   </tbody></table>'+
    '                                                                               </td>'+
    '                                                                           </tr>'+
    '                                                                       </tbody></table></td>'+
    '                                                               </tr>'+
    '                                                           </tbody></table></td>'+
    '                                                   </tr>'+
    '                                                   <tr>'+
    '                                                       <td align="center" valign="middle" height="10"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="170" height="10" border="0" class="CToWUd"></td>'+
    '                                                   </tr>'+
    '                                                   <tr>'+
    '                                                   </tr>'+
    '                                               </tbody></table>'+
    '                                           </td>'+
    '                                       </tr>'+
    '                                   </tbody></table>'+
    '                                   <table border="0" cellpadding="0" cellspacing="0" width="100%" ><tbody><tr><td height="20" align="center" style="font-size:14px; color: #AD0000; padding-top: 10px;">'+
    '                                       This Struct is Legal Proof of Payment'+
    '                                   </td></tr></tbody></table>'+
    '                                   <table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td height="20" ></td></tr></tbody></table>'+
    '                               </td>'+
    '                               <td valign="top" width="45"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="20" height="10" border="0" class="CToWUd"></td>'+
    '                           </tr>'+
    '                       </tbody></table>'+
    '                       <table width="100%" border="0" cellpadding="0" cellspacing="0">'+
    '                           <tbody><tr>'+
    '                               <td height="20"><img style="display:block" src="https://ci4.googleusercontent.com/proxy/pMR9jndPFoUQq6twaxszUaMbbshVQvuUmb-8xUpINRhgF3lzJ8gYehGNOn36hbnP2sL1Lof0tIbtxLHL33k-3x49CgJX5quOhGLr_5DULJ-kVpA=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/_blank.gif" alt="" width="10" height="30" border="0" class="CToWUd"></td>'+
    '                           </tr>'+
    '                       </tbody></table>'+
    '                       <table width="100%" align="center" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">'+
    '                           <tbody><tr>'+
    '                               <td valign="top" width="45"></td>'+
    '                               <td valign="top" style="font-family:\'Helvetica\',Arial,sans-serif;color:#000000;font-size:11px">'+
    '                                   <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                       <tbody><tr>'+
    '                                           <td align="left" style="font-family:\'Helvetica\',Arial,sans-serif;text-align:center"></td>'+
    '                                       </tr>'+
    '                                       <tr>'+
    '                                           <td align="left" style="font-family:\'Helvetica\',Arial,sans-serif;text-align:center">'+
    '                                               <table width="100%" border="0" cellspacing="0" cellpadding="0">'+
    '                                                   <tbody><tr>'+
    '                                                       <td width="55%" align="left" valign="top" style="font-family:\'Helvetica\',Arial,sans-serif;color:#666666;padding-right:10%">'+
    '                                                           <span style="color:#666666"> <a href="https://www.easybensin.com/en/home" style="font-size:10px;line-height:12px;font-weight:bold;color:#666666" target="_blank">'+
    '                                                                   Help Centre'+
    '                                                               </a></span><br>'+
    '                                                           <span style="color:#666666"> <a href="https://www.easybensin.com/en/home" style="font-size:10px;line-height:12px;font-weight:bold;color:#666666" target="_blank">If you need help, please use our Contact Us page</a> </span><br><br>'+
    '                                                           <span style="font-size:10px;font-weight:normal;line-height:16px">Copyright © 2020 PT. Easy Bensin<br> <u></u> <a href="#m_-7470417202469407977_m_-6820600256721759852_" style="color:#666666;text-decoration:underline;font-style:italic;line-height:21px"><u></u></a></span>'+
    '                                                       </td>'+
    '                                                       <td width="35%" align="left" valign="top" style="font-family:\'Helvetica\',Arial,sans-serif;color:#666666">'+
    '                                                           <span style="font-size:10px;line-height:12px;font-weight:bold">'+
    '                                                               Find out the latest Easy Bensin promos  '+
    '                                                           </span><br><br>'+
    '                                                           <a href="'+fb_link+'" target="_blank"><img width="30px" src="https://ci3.googleusercontent.com/proxy/H_aHBqY9saGpcxyMPgHAnU9FCyvqV0ZQKw68YOwETE7a97-A6a_Z2RjBDDV6KBhfjc64jreri7fpw_l-flu8pIVqHj8RW2xDmIMLbneHOH6rAkv9=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/icon-fb.png" class="CToWUd"></a>&nbsp;&nbsp;'+
    '                                                           <a href="'+twitter_link+'" target="_blank"><img width="30px" src="https://ci3.googleusercontent.com/proxy/iPIbCPU7H75LZ_hVc3HJ1EsgloziIsRZ_RyCSyuPAbF4WaHc5Qj9TYiixhbupfHpd_ZzNBCBg1puOmsw0RYcNKMZK8u-auv3M6gVth0gm5QVXTwyhgLGGbM=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/icon-twitter.png" class="CToWUd"></a>&nbsp;&nbsp;'+
    '                                                           <a href="'+instagram_link+'" target="_blank" ><img width="30px" src="https://ci5.googleusercontent.com/proxy/R3I4bglk_oXOLvpI_gXZkeEpHgAtsWjsajQygnbFLOVXUBfwJMreFP11brhdI-T4M2I8N5sZZBWgszMOLW4dpml84EhuT4OyUmNlbNJz9h5pRfGk2TzyjHMafg=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/icon-instagram.png" class="CToWUd"></a>&nbsp;&nbsp;'+
    '                                                           <a href="'+linkedin_link+'" target="_blank"><img width="30px" src="https://ci4.googleusercontent.com/proxy/GCOS4nvzllqfWZtVxTPPo4t-wQEB3DXRN0D_AB3_eV_lWMFwEYOcnSnJyDWqJ7oYR_8KgPQJdqPOIJ8h75O2MNjbgCigOeRQazh_xfGNr2_ovsL2KTwJZ1bo=s0-d-e1-ft#https://grabtaxi-marketing.s3.amazonaws.com/email/img/icon-linkedin.png" class="CToWUd"></a>'+
    '                                                           <br><br>'+
    '                                                       </td>'+
    '                                                   </tr>'+
    '                                               </tbody></table>'+
    '                                           </td>'+
    '                                       </tr>'+
    '                                       <tr>'+
    '                                           <td height="30"></td>'+
    '                                       </tr>'+
    '                                   </tbody></table></td>'+
    '                               <td valign="top" width="45"></td>'+
    '                           </tr>'+
    '                       </tbody></table>'+
    '                   </td>'+
    '               </tr>'+
    '           </tbody></table>'+
    '       </td>'+
    '   </tr>'+
    ' </tbody></table>'+
    ' <img alt="" src="https://ci6.googleusercontent.com/proxy/UOqIQ__UHWYzT78Ghow4tz3Q1OxBECD0WH1huZeLQgpSgcdTprgFTSQgqEdbMZBslOKchxN5ItW0yF_32WG3oV06OPMMT8avpOGMp4LvoUo_R9lafKl744GiIL75BKIqttdIyLBEbaQaff8erLYjS3Orf2iPNaoR3NPXbuudC985nryyto45BWVMX_RI0h1L0W5BO6jdc_GEZ3k=s0-d-e1-ft#http://v2dc3pjr.r.us-east-1.awstrack.me/I0/01000174549f2814-77b68d90-857e-4a0e-9b0a-2aa88fd5a7d1-000000/6JZDy1qSQQ-Kg3cKc0JatITUbGg=178" style="display:none;width:1px;height:1px" class="CToWUd"><div class="yj6qo"></div><div class="adL">'+
    ' </div></div>';

    return callback(null,body);
}

// var transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     secure: process.env.EMAIL_SECURE, // secure:true for port 465, secure:false for port 587
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASSWORD
    //     },
    //     debug : true,
    //     tls: {
    //     // do not fail on invalid certs
    //         rejectUnauthorized: false
    //     }
    // });