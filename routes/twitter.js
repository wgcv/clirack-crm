const express = require('express');
const router = express.Router();
const config = require('../config/database');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const request = require('request');
const Inbox = require('../models/inbox');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/user');
const Company = require('../models/company');
const crypto = require('crypto');

const host = 'https://f5acef3a.ngrok.io';


// For Twitter Verifcation
router.get('/webhook/', function (req, res){
    if(req.query['crc_token']){
        const hmac = crypto.createHmac('sha256', 'PUTuJ7CRivgVdUKGm1bRVf1sUtEjAZS0B08030YNUpezBnJrD2');
        hmac.update(req.query['crc_token']);
        res.send({'response_token': 'sha256=' + hmac.digest('base64')});
    }else{
        res.status(500).send('Error you need to add a param Twitter API');
    }
});
// Post events
router.post('/webhook/', function (req, res){
    console.log(req.body);
    response.send('200 OK');
});
module.exports = router;