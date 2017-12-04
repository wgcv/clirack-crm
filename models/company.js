const mongoose = require('mongoose');
const config = require('../config/database');

// Inbox Schema
const CompanySchema = mongoose.Schema({
	name:{
		type: String,
		require: true
	},
	users:{
		type: [mongoose.Schema.ObjectId]
	},
	inboxes:{
		type: [mongoose.Schema.ObjectId]
	}
});

const Company = module.exports = mongoose.model('Company',CompanySchema);

module.exports.addCompany = function(newCompany, callback){
	newCompany.save(callback);  
}

module.exports.getCompanyById = function(id, callback){
	Company.findById(id,callback);
}
module.exports.getCompanyByUser = function(userId, callback){
	const query = {users: { $in: [userId]}};
	Company.findOne(query, callback);
}


module.exports.getCompanyByname = function(name, callback){
	const query = {name: name};
	Company.findOne(query,callback);
}


module.exports.addInbox = function(company, callback){
		let query = {_id:company._id};
		Company.findOneAndUpdate(query, company, {upsert:false}, callback);  
}