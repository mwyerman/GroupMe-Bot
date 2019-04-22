
function Image(imageRegex, imageURL) {
	this.exp = new RegExp("(^|\\W)" + imageRegex + "($|\\W)")
	this.imageURL = imageURL;
}

Image.prototype.test = function(message) {
	return this.exp.test(message);
}

Image.prototype.getRegex = function() {
	return this.exp;
}

Image.prototype.getURL = function() {
	return this.imageURL;
}

module.exports = Image;