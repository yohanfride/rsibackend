"use strict";

const crypto = require('crypto');

exports.signature = function (val) {
	const key = crypto.createCipher(process.env.CRYPTO_SIGNATURE_CIPHER, process.env.CRYPTO_SIGNATURE_PASSWORD);
	var encrypted = key.update(String(val), process.env.CRYPTO_SIGNATURE_ENCODING, process.env.CRYPTO_SIGNATURE_OUTPUT);
	encrypted += key.final(process.env.CRYPTO_SIGNATURE_OUTPUT);

	return encrypted;
};

exports.encrypt = function (val) {
	const signature = module.exports.signature(val);
	const valFormat = String(val) + '[separator]' + signature;
	const key = crypto.createCipher(process.env.CRYPTO_CIPHER, process.env.CRYPTO_PASSWORD);
	var encrypted = key.update(valFormat, process.env.CRYPTO_ENCODING, process.env.CRYPTO_OUTPUT);
	encrypted += key.final(process.env.CRYPTO_OUTPUT);

	return encrypted;
};

exports.decrypt = function (encrypted) {
	const key = crypto.createDecipher(process.env.CRYPTO_CIPHER, process.env.CRYPTO_PASSWORD);
	var decrypted = key.update(encrypted, process.env.CRYPTO_OUTPUT, process.env.CRYPTO_ENCODING)
	decrypted += key.final(process.env.CRYPTO_ENCODING);

	return decrypted;
};

exports.extract = function (encrypted) {
	const decrypted = module.exports.decrypt(encrypted);
	const extracted = decrypted.split('[separator]');

	return extracted;
};