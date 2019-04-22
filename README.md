# GroupMe-Bot

A basic chatbot for the GroupMe app. Responds to keywords with various responses. Text responses can be set in the commands.json file. Image responses set with an Imgur album - the title of each image is the keyword the image will respond to. All keywords in commands.json and Imgur support REGEX. Supports multiple bots simultaneously if desired. Also contains a basic web interface to show available commands.

Set Up:
1) Set up an account at https://dev.groupme.com/. Get your access token by clicking the button in the top right.
2) In the response.js file, set the groupmeToken variable on line 12 to your GroupMe access token.
3) If you want to use image commands, set the imgurAlbumID to the ID of the Imgur album you want to use. Also set the imgurClientID to the client ID you get from creating an account at https://api.imgur.com/.
4) Deploy the bot on a server. For a free option, I recommend https://heroku.com/. If you use heroku, make note of your application's domain.
5) Create a bot (or bots) at https://dev.groupme.com/bots/. Set the callback url to whatever url your server is located at (this would be your application's domain if you are using Heroku).
