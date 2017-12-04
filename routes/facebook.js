const express = require('express');
const router = express.Router();
const config = require('../config/database');
const passport = require('passport');
const passportFacebook = require('passport-facebook').Strategy;
const request = require('request');
const Inbox = require('../models/inbox');
const User = require('../models/user');
const Company = require('../models/company');

const host = 'https://6c736ad3.ngrok.io';

// Get token and Select Page for team
router.get('/login-team-add-page/',
	function(req, res) {
		request('https://graph.facebook.com/v2.11/oauth/access_token?client_id=1559072617503035&redirect_uri='+host+'/oauth/facebook/login-team-add-page/&client_secret=46a43ca1303048b745cb3e312cff1b93&code='+req.query.code, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				const bodyData = JSON.parse(body);
				res.render('fb-select-team-page',{token: bodyData.access_token});
			}else{
				res.status(500).send('Error in facebok API');
			}
		});
	});

// Save Inbox facebook page for team
router.get('/add-team-page/', function (req, res){
	User.getUserbyUsername(req.query.username, (err, user)=>{
		if (err) throw err;
		if(!user){
			return res.json({success:false, msg: "User not found"});
		}else{
			Company.getCompanyByUser(user._id, (err, company)=>{
				if(!company){
					return res.json({success:false, msg: "Company not found"});
				}else{
					Inbox.getInboxBySourceAndUser('facebook-page',req.query.id, (err, inboxList)=>{
						if( intersect(company.inboxes, inboxList.map(inbox => inbox.id)).length < 1){
							let newPage = new Inbox({
								source: 'facebook-page',
								name: req.query.name+' - Fb Page',
								team: true,
								user: req.query.id,
								token: req.query.token,
								assigned: [user]
							});
							Inbox.addInbox(newPage, (err, page)=>{
								if(err){
									res.json({success: false, msg:'Faild to register the facebook page for the team'});
								}
								else{
									company.inboxes.push(newPage);
									Company.addInbox(company, (err, company)=>{
										if(err){
									res.json({success: false, msg:'Faild to register the facebook page for the team'});
								}
								else{
									res.send("<script>try {window.opener.HandlePopupResult('"+JSON.stringify(newPage)+"');}catch (err) {}window.close();</script>");
									}
								});
								}
							});
						}
						else{
							return res.json({success:false, msg: "Inbox really exist in the company"});
						}
					});
				}

			});
		}
	});	
});
// Get token and Select Page for personal
router.get('/login-personal-add-page/',
	function(req, res) {
		request('https://graph.facebook.com/v2.11/oauth/access_token?client_id=1559072617503035&redirect_uri='+host+'/oauth/facebook/login-personal-add-page/&client_secret=46a43ca1303048b745cb3e312cff1b93&code='+req.query.code, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				const bodyData = JSON.parse(body);
				res.render('fb-select-personal-page',{token: bodyData.access_token});
			}else{
				res.status(500).send('Error in facebok API');
			}
		});
	});

// Save Inbox facebook page for personal
router.get('/add-personal-page/', function (req, res){
	User.getUserbyUsername(req.query.username, (err, user)=>{
		if (err) throw err;
		if(!user){
			return res.json({success:false, msg: "User not found"});
		}else{
			Company.getCompanyByUser(user._id, (err, company)=>{
				if(!company){
					return res.json({success:false, msg: "Company not found"});
				}else{
					Inbox.getInboxBySourceAndUser('facebook-page',req.query.id, (err, inboxList)=>{
						if( intersect(company.inboxes, inboxList.map(inbox => inbox.id)).length < 1){
							let newPage = new Inbox({
								source: 'facebook-page',
								name: req.query.name+' - Fb Page',
								team: true,
								user: req.query.id,
								token: req.query.token,
								assigned: [user]
							});
							Inbox.addInbox(newPage, (err, page)=>{
								if(err){
									res.json({success: false, msg:'Faild to register the facebook page for the team'});
								}
								else{
									company.inboxes.push(newPage);
									Company.addInbox(company, (err, company)=>{
										if(err){
									res.json({success: false, msg:'Faild to register the facebook page for the team'});
								}
								else{
									res.send("<script>try {window.opener.HandlePopupResult('"+JSON.stringify(newPage)+"');}catch (err) {}window.close();</script>");
									}
								});
								}
							});
						}
						else{
							return res.json({success:false, msg: "Inbox really exist in the company"});
						}
					});
				}

			});
		}
	});
});



// For Facebook Verifcation
router.get('/webhook/', function (req, res){
	if(req.query['hub.verify_token']=='clirack_token_112592_pepperloop'){
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong Token');
});
router.post('/webhook/', function (req, res){
	console.log(req);
	res.status(200).send('EVENT_RECEIVED');
});

// intersection two arrays
function intersect(a, b) {
    var d = {};
    var results = [];
    for (var i = 0; i < b.length; i++) {
        d[b[i]] = true;
    }
    for (var j = 0; j < a.length; j++) {
        if (d[a[j]]) 
            results.push(a[j]);
    }
    return results;
}

module.exports = router;