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
router.post('/:conversation/messages/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
	let newMessage = new Message({
		conversation: req.params.conversation,
		sendBye: req.query.sendBye,
		response: req.query.response,
		message: req.query.message,
		time: req.query.time,
		comment: req.query.comment
	});
	Message.addMessage(newMessage);
	res.json("{'result':'Ok'");
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