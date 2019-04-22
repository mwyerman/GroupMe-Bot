
function Bot(botName, botID, groupName, groupID) {
	this.botName = botName;
	this.botID = botID;
	this.groupName = groupName;
	this.groupID = groupID;
}

Bot.prototype.getName = function() {
	return this.botName;
}

Bot.prototype.getGroupID = function() {
	return this.groupID;
}

Bot.prototype.getBotID = function() {
	return this.botID;
}



module.exports = Bot;
