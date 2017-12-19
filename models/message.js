const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const config = require('../config/database');

// Inbox Schema
const MessageSchema = mongoose.Schema({
	conversation:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	sendBy:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	response:{
		type: Boolean,
		require: true
	},
	message:{
		type: String,
		require: true
	},
	time:{
		type : Date, 
		default: Date.now,
		require: true
	},
	comment:{
		type: Boolean,
		require: true
	},
	id:{
		type: String,
		require: true
	}
});

MessageSchema.plugin(mongoosePaginate);

const Message = module.exports = mongoose.model('Message',MessageSchema);

module.exports.addMessage = function(newMessage, callback){
	newMessage.save(callback);  
}
module.exports.getMessage = function(conversation, page, callback){
	const query = {conversation: conversation};
	Message.paginate(query, {sort: { time: -1 }, page: page, limit: 20 },callback);
}
module.exports.updateMessage = function(message, callback){
		let query = {id:message.id};
		Message.findOneAndUpdate(query, message, {upsert:true}, callback);  
}
