'use strict';
const usersController = require('../controllers/usersController.js');

module.exports = basicAuth;

function basicAuth(req, res, next){
    if (req.path === '/auth/login/') {
        return next();
    }
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':'); 
    usersController.login(req.APP, {body:{ username:username,password:password }}, (err, result) => {
        if (err){
            return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }
        req.user = result.data;
        return next();
    });
}