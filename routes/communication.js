const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
var mongoose = require('mongoose');

const request = require('request');
const User = require('../models/user');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const Inbox = require('../models/inbox');
const Company = require('../models/company');



router.get('/:inbox/conversations/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	var page = req.query.page;
	if(!req.query.page){
		page = 1
	}
	Conversation.getConversations(req.params.inbox,page=page, (err, conversations)=>{
		res.json(conversations);
	});
});

router.post('/:inbox/conversations/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	let newConversation = new Conversation({
		inbox: req.params.inbox,
		name: req.body.name,
		contact: req.body.contact,
		assigned: req.body.assigned,
		preview: req.body.preview,
		lastTime: req.body.lastTime,
		api: {
			id: req.body.api.id,
			link: req.body.api.link,
			participantId: req.body.api.participantId,
		}
	});
	Conversation.addConversation(newConversation, (err, conversation)=>{
		if(err){
			res.json({success: false, msg:'Faild to register conversation'});
		}
		else{
			res.json({success: true, msg:'Conversation register'});
		}
	});
});

router.get('/inboxes/', passport.authenticate('jwt', {session:false}), (req, res, next) => {

	Company.getCompanyByUser(req.user._id, (err, company)=>{
		if(!company){
			return res.json({success:false, msg: "Company not found"});
		}else{
			Inbox.getInboxes(company.inboxes, req.user._id, (err, inboxes)=>{
				return res.json(inboxes);
			});
		}
	});

	
});

router.get('/inbox/:slug', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	Company.getCompanyByUser(req.user._id, (err, company)=>{
		if(!company){
			return res.json({success:false, msg: "Company not found"});
		}else{
			Inbox.getInboxBySlug(req.params.slug, company.inboxes, req.user._id, (err, inbox)=>{
				return res.json(inbox);
			});
		}
	});

});

router.post('/:conversation/read/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	let conversation = req.body;
	console.log(conversation);
	Conversation.readConvesation(conversation, (err, conversation)=>{
		if(err){
			console.log(err);
			res.json({success: false, msg:'Faild to register conversation'});
		}else{
			res.json(conversation);

		}
	});
});
router.post('/:conversation/messages/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	let message = req.body.message;
	Conversation.getConvesationById(req.params.conversation, (err, conversation)=>{
		Inbox.getInboxById(conversation.inbox, (err, inbox)=>{
			if(inbox.source == 'facebook-page'){
				let options = {
					url: 'https://graph.facebook.com/v2.11/'+conversation.api.id+'/messages?message='+message+'&client_id=1559072617503035&client_secret=46a43ca1303048b745cb3e312cff1b93&access_token='+inbox.token,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}
				};
				request(options, function (error, response, body) {	
					let id = JSON.parse(body).id;

					if (!error && response.statusCode == 200) {
						let options = {
							url: 'https://graph.facebook.com/v2.11/'+id+'/?fields=created_time,from,message,id&client_id=1559072617503035&client_secret=46a43ca1303048b745cb3e312cff1b93&access_token='+inbox.token,
							method: 'GET',
							headers: {
								'Content-Type': 'application/json'
							}
						};
						request(options, function (error, response, body) {
							let messageFb = JSON.parse(body);

							if (!error && response.statusCode == 200) {
								let message = {
									conversation: conversation,
									response: (messageFb.from.id==inbox.user) ? true:false,
									message: messageFb.message,
									time: messageFb.created_time,
									comment: false,
									id: messageFb.id
								};
								console.log(message);
								Message.updateMessage(message,(err,conversation)=>{
									res.json(conversation);
								});
							}else{
								res.status(500).send('Error in facebok API - Getting the conversation');
							}
						});

					}else{
						res.status(500).send('Error in facebok API - Sending the conversation');
					}
				});
			}
		});
	});
	
});

router.get('/:conversation/messages/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	var page = req.query.page;
	if(!req.query.page){
		page = 1
	}
	Message.getMessage(req.params.conversation,page=page, (err, messages)=>{
		res.json(messages);
	});
});

module.exports = router;