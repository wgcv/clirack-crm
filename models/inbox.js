const mongoose = require('mongoose');
const config = require('../config/database');

// Inbox Schema
const InboxSchema = mongoose.Schema({
	source:{
		type: String,
		require: true
	},
	name:{
		type: String,
		require: true
	},
	slug:{
		type: String,
		require: true
	},
	team:{
		type: Boolean,
		require: true
	},
	user:{
		type: String
	},
	token:{
		type: String
	},
	assigned:{
		type: [mongoose.Schema.ObjectId]
	}
});

const Inbox = module.exports = mongoose.model('Inbox',InboxSchema);

module.exports.addInbox = function(newInbox, callback){
	newInbox.save(callback);  
}

module.exports.getInboxBySourceAndUser = function(source,user, callback){
	const query = {source: source,user: user};
	Inbox.find(query,callback);
}
module.exports.getInboxBySlug = function(slug, ids, userId, callback){
	const query = {slug: slug, _id: {$in: ids}, assigned: userId};
	Inbox.find(query,callback);
}

module.exports.getInboxes = function(ids,userId, callback){
	const query = {_id: {$in: ids}, assigned: userId};
	Inbox.find(query,callback);
}

module.exports.addAssigned = function(id, userId, callback){
		inbox = Inbox.findById(id);
		inbox.assigned.append(userId);
		let query = {_id:id};
		Inbox.findOneAndUpdate(query, inbox, {upsert:false}, callback);  
}

module.exports.getInboxById = function(id, callback){
	Inbox.findById(id,callback);
}