"use strict";

const validateJS = require('validate.js');

exports.username = function (str) {
	return (!str || str == '' || str.length < 4 || typeof str !== 'string' || / /g.test(str) || str.length > 20)
		? {
			code: 'INVALID_REQUEST',
			data: {
				invalid_parameter: 'username'
			}
		} : true;
};

exports.email = function (str) {
	return (!str || str == '' || str.length < 5 || typeof str !== 'string' || !/^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(str) || str.length > 80)
		? {
			code: 'INVALID_REQUEST',
			data: {
				invalid_parameter: 'email'
			}
		} : true;
};

exports.password = function (str) {
	return (!str || str == '' || str.length < 6 || (str && typeof str !== 'string') || / /g.test(str) || str.length > 20)
		? {
			code: 'INVALID_REQUEST',
			data: {
				invalid_parameter: 'password'
			}
		} : true;
};

exports.trim = function (str) {
	return str.trim();
};

exports.min_length = function (str,leng) {	
	return ( (str.length < leng) || (!str.length == leng) ) ? false : true;
};

exports.max_length = function (str,leng) {	
	return ( (str.length > leng) || (!str.length == leng) ) ? false : true;
};

exports.valid_email = function (str) {
	return (!/^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(str)) ? false : true;
};

exports.numeric = function (num) {
	return (isNaN(num)) ? false : true;
};

exports.isArray = (variable) => {
	return (!!variable) && (variable.constructor === Array);
}