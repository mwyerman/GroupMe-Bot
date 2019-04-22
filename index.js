
const 	response         = require('./response.js'),
		Bot			= require('./Bot.js'),
		Image		= require('./Image.js')
		fs			= require('fs'),
		express 	= require('express'),
		app			= express(),
		path		= require('path'),
		exphbs		= require('express-handlebars');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('views',path.join(__dirname,"views"));
app.set("view engine","hbs");

response.updateBotList();
response.updateImageList();

app.get('/', (req,res)=>{
	let l = ['hi', 'this', 'is', 'a', 'test', 'list'];
	var commands = JSON.parse(fs.readFileSync('commands.json','utf8')).data;
	var commandTable = []
	for (var i = 0; i < commands.length; i++) {
		cmd = commands[i].command.replace('(^|\\W)','').replace('($|\\W)','').replace('\\','');
		rsp = commands[i].responses.join('<br>');
		commandTable.push( {'command': cmd, 'response': rsp} );
	}

	var imgs = JSON.parse(fs.readFileSync('images.json','utf8')).images;
	var imageTable = []
	for (var i = 0; i < imgs.length; i++) {
		cmd = imgs[i].title.replace('(^|\\W)','').replace('($|\\W)','').replace('\\','');
		rsp = imgs[i].url;
		imageTable.push( {'command': cmd, 'response': rsp} );
	}


	res.render('index', {list: l, textCommands: commandTable, imageCommands: imageTable});
});

app.post('/bot-messages', (req,res)=>{
	response.respond(req.body);
	res.end("k");
});

app.listen(process.env.PORT || 5000);