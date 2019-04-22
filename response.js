// JewBot 2
let Bot = require('./Bot.js');
let Image = require('./Image.js')
let https = require('https');
let fs = require('fs');

var bots = [];
var images = [];

/**** Fill these out yourself ****/
let imgurClientID = ""; //insert imgur API client ID - used for access to imgur album if using images
let groupmeToken = ""; //insert groupme token - used for access to groupme bot to send commands

var imgurAlbumID = ""; //imgur album ID - used to poll imgur album to find images

/*****************************************************************************
rand
  Selects a random number within set bounds.

  min (int) - minimum random value
  max (int) - maximum random value
*****************************************************************************/

function rand(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

/*****************************************************************************
respond
  Handles responding to message recieved from GroupMe.

*****************************************************************************/
function respond(message) {
	for (var i = 0; i < bots.length; i++) {
		if (message.group_id == bots[i].getGroupID()) {
			if(message.name != bots[i].getName()) {
				checkTextCommands(message.text.toLowerCase(), bots[i].getBotID(), message.group_id);
				if(imgurClientID != "" && imgurAlbumID != "") {
					checkImages(message.text.toLowerCase(), bots[i].getBotID());
				}
				
			}
		}
	}
}




/*****************************************************************************
updateBotList
  Updates bot array from GroupMe.

*****************************************************************************/
function updateBotList() {
	var options = {
		host: 'api.groupme.com',
		path: '/v3/bots?token=' + groupmeToken,
		method: 'GET'
	};
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		var body = '';

		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end',function(){
			if (res.statusCode != 200) {
				console.log("Api call failed with response code " + res.statusCode);
			} else {
				b = JSON.parse(body).response;
				for (var i = 0; i < b.length; i++) {
					bots.push(new Bot(b[i].name, b[i].bot_id, b[i].group_name, b[i].group_id))
					console.log(b[i].group_name + ': ' + b[i].group_id);
				}
			}
			console.log('Updated bot list with ' + bots.length + ' bots.');
		  });
	});
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	
	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end();
}


/*****************************************************************************
updateImageList
  Updates image array from Imgur.

*****************************************************************************/
function updateImageList() {
	if(imgurAlbumID == "" || imgurClientID == "") {
		console.log("Imgur album ID or imgur client ID missing, no images will be sent.")
		return;
	}
	var options = {
		host: 'api.imgur.com',
		path: '/3/album/' + imgurAlbumID + '/images',
		method: 'GET',
		headers: {
			Authorization: "Client-ID " + imgurClientID
		}
	};
	
	var req = https.request(options, function(res) {
		res.setEncoding('utf8');
		var body = '';

		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end',function(){
			if (res.statusCode != 200) {
				console.log("Api call failed with response code " + res.statusCode);
			} else {
				b = JSON.parse(body).data;
				var j = {images:[ ]};
				for (var i = 0; i < b.length; i++) {
					images.push(new Image(b[i].title, b[i].link));
					j.images.push({title: b[i].title, url: b[i].link})
				}
				fs.writeFile('images.json', JSON.stringify(j), 'utf8', function() {});
				console.log('Updated image list with ' + images.length + ' images.');
			}
		  });
	});
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	
	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end();
}


/*****************************************************************************
checkTextCommands
  Looks for commands within a string and sends a response for any that are found.

  text (string) - the string to search for commands within
*****************************************************************************/

function checkTextCommands(message, botID, groupID) {
	var commands = JSON.parse(fs.readFileSync('commands.json','utf8')).data; // load json file with commands and responses

	// check for each command from JSON file in the message
	for (i = 0; i < commands.length; i++) {
		var command = new RegExp('(^|\\W)' + commands[i].command + '($|\\W)','i');

		if (command.test(message) && !commands[i].disabledGroups.includes(groupID)) {
			var responseNum = rand(0,commands[i].responses.length - 1); // select random response from array
			postMessage(commands[i].responses[responseNum], botID);
		} else if (commands[i].disabledGroups.includes(groupID)) {
		} else {
		}
	}
}


/*****************************************************************************
checkImages
  Looks for image commands within a string and sends an image for any that are found.

  text (string) - the string to search for commands within
*****************************************************************************/

function checkImages(text, botID) {
	for (i = 0; i < images.length; i++) {
		if(images[i].test(text)) {
			postMessage(images[i].getURL(), botID);
		}
	}
}



/*****************************************************************************
postMessage
  Sends a text message to the group.

  msg (string) - the message to be sent to the group
*****************************************************************************/

function postMessage(msg, botID) {
	var options, body, botReq;

	options = {
		hostname: 'api.groupme.com',
		path: '/v3/bots/post',
		method: 'POST'
	};

	body = {
		"bot_id" : botID,
		"text" : msg,
	};

	botReq = https.request(options, function(res) {
		if(res.statusCode == 202) {
		} else {
			console.log('failed bot id: ' + botID);
			console.log('rejecting bad status code ' + res.statusCode);
		}
	});

	botReq.on('error', function(err) {
		console.log('error posting message '  + JSON.stringify(err));
	});
	botReq.on('timeout', function(err) {
		console.log('timeout posting message '  + JSON.stringify(err));
	});
	botReq.end(JSON.stringify(body));
}

exports.respond = respond;
exports.updateBotList = updateBotList;
exports.updateImageList = updateImageList;
exports.bots = bots;
exports.images = images;
