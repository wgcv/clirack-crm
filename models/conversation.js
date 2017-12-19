const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const config = require('../config/database');

// Inbox Schema
const ConversationSchema = mongoose.Schema({
	inbox:{
		type: mongoose.Schema.ObjectId,
		require: true
	},
	name:{
		type: String,
		require: true
	},
	contact:{
		type: mongoose.Schema.ObjectId
	},
	assigned:{
		type: mongoose.Schema.ObjectId
	},
	preview:{
		type: String,
		require: true
	},
	unread:{
		type: Number
	},
	lastTime:{
		type : Date, 
		require: true
	},
	api:{
		id: { type:String},
		link: { type:String},
		participantId: { type:String},
		
		}
});
ConversationSchema.plugin(mongoosePaginate);

const Conversation = module.exports = mongoose.model('Conversation',ConversationSchema);

module.exports.addConversation = function(newConversation, callback){
	newConversation.save(callback);  
}
module.exports.getConversations = function(inbox,page, callback){
	const query = {inbox: inbox};
	Conversation.paginate(query, {sort: { lastTime: -1 }, page: page, limit: 20 },callback);
}
module.exports.updateConvesation = function(message, callback){
		let query = {'api.id' : message.api.id};
		Conversation.findOneAndUpdate(query, message, {upsert:true, new: true}, callback);  
}
