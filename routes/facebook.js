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

const host = 'https://2f1892be.ngrok.io';
// I need to implement JWT and Token authentication


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
							let name = req.query.name+' - facebook'
							let newPage = new Inbox({
								source: 'facebook-page',
								name: name,
								slug: name.replace(/\s+/g, '').toLowerCase(),
								team: true,
								user: req.query.id,
								token: req.query.token,
								assigned: [user]
							});
							Inbox.addInbox(newPage, (err, page)=>{
								if(err){
									return res.json({success: false, msg:'Faild to register the facebook page for the team'});
								}
								else{
									company.inboxes.push(newPage);
									Company.updateCompany(company, (err, company)=>{
										if(err){
											return res.json({success: false, msg:'Faild to register the facebook page for the team'});
										}
										else{
											let options = {
												url: 'https://graph.facebook.com/v2.11/'+req.query.id+'/subscribed_apps?client_id=1559072617503035&client_secret=46a43ca1303048b745cb3e312cff1b93&access_token='+req.query.token,
												method: 'POST',
												headers: {
													'Content-Type': 'application/json'
												}
											};
											request(options, function (error, response, body) {
												jsonBody = JSON.parse(body)
												if(!jsonBody.success){
													return res.json({success: false, msg:'Faild Suscribe facebook page'});
												}else{
													return res.send("<script>try {window.opener.HandlePopupResult('"+JSON.stringify(newPage)+"');}catch (err) {}window.close();</script>");

												}
											});
										}
									});
								}
							});
						}
						else{
							newPage = '{success:false, msg: "Inbox really exist in the company"}';
							return res.send("<script>try {window.opener.HandlePopupResult('"+JSON.stringify(newPage)+"');}catch (err) {}window.close();</script>");
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
							let name = req.query.name+' - facebook'
							let newPage = new Inbox({
								source: 'facebook-page',
								name: name,
								slug: name.replace(/\s+/g, '').toLowerCase(),
								team: false,
								user: req.query.id,
								token: req.query.token,
								assigned: [user]
							});
							Inbox.addInbox(newPage, (err, page)=>{
								if(err){
									return res.json({success: false, msg:'Faild to register the facebook page for the team'});
								}
								else{
									company.inboxes.push(newPage);
									Company.updateCompany(company, (err, company)=>{
										if(err){
											return res.json({success: false, msg:'Faild to register the facebook page for the team'});
										}
										else{
											let options = {
												url: 'https://graph.facebook.com/v2.11/'+req.query.id+'/subscribed_apps?client_id=1559072617503035&client_secret=46a43ca1303048b745cb3e312cff1b93&access_token='+req.query.token,
												method: 'POST',
												headers: {
													'Content-Type': 'application/json'
												}
											};
											request(options, function (error, response, body) {
												jsonBody = JSON.parse(body)
												if(!jsonBody.success){
													return res.json({success: false, msg:'Faild Suscribe facebook page'});
												}else{
													return res.send("<script>try {window.opener.HandlePopupResult('"+JSON.stringify(newPage)+"');}catch (err) {}window.close();</script>");

												}
											});
										}
									});
								}
							});
						}
						else{
							newPage = '{success:false, msg: "Inbox really exist in the company"}';
							return res.send("<script>try {window.opener.HandlePopupResult('"+JSON.stringify(newPage)+"');}catch (err) {}window.close();</script>");
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
	response = req.body;
	console.log(JSON.stringify(response));
	if (response.hasOwnProperty('object')){
		let object = response.object;
		if (response.hasOwnProperty('entry')){
			if (response.entry[0].hasOwnProperty('changes')){
				if (response.entry[0].changes[0].hasOwnProperty('field')){
					let field = response.entry[0].changes[0].field;
					if (object == 'page') {
						if(field == 'conversations'){
							let id = response.entry[0].id;
							let thread_id = response.entry[0].changes[0].value.thread_id;
							Inbox.getInboxBySourceAndUser('facebook-page',id, (err, inboxList)=>{
								inbox = inboxList[0];
								let options = {
									url: 'https://graph.facebook.com/v2.11/'+thread_id+'?fields=messages.limit(10){created_time,from,id,message,sticker,attachments{name,file_url}},id,updated_time,unread_count,link,participants&access_token='+inbox.token,
									method: 'GET',
									headers: {
										'Content-Type': 'application/json'
									}
								};
								request(options, function (error, response, body) {
									jsonBody = JSON.parse(body);
									var conversation = {
										inbox: inbox._id,
										name: jsonBody.participants.data[0].name,
										unread: jsonBody.messages.data[0].from.id==id ? 0 : jsonBody.unread_count,
										preview: jsonBody.messages.data[0].message,
										lastTime: jsonBody.messages.data[0].created_time,
										api:{
											id: jsonBody.id,
											participantId: jsonBody.participants.data[0].id,
											link: 'https://facebook.com'+ jsonBody.link
										}
									}

									Conversation.updateConvesation(conversation,(err,conversation)=>{
										jsonMessages = jsonBody.messages.data;
										var messages = [];

										for(var i = 0; i < jsonMessages.length; i++){
											let message = {
												conversation: conversation,
												response: (jsonMessages[i].from.id==id) ? true:false,
												message: jsonMessages[i].message,
												time: jsonMessages[i].created_time,
												comment: false,
												id: jsonMessages[i].id
											}
											Message.updateMessage(message,(err,conversation)=>{

											});
										}
									});
								});

							});
						}
					}
				}
			}
		}
	}
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