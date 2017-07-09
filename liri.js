var fs = require("fs");
var twitter = require('twitter');
var request = require('request');
var spotify = require('node-spotify-api');
var keysExport = require('./keys');
var twitterClient = new twitter(keysExport.twitterKeys);
var spotifyClient = new spotify(keysExport.spotifyKeys);

var nodeArgs = process.argv;
var userCommand = process.argv[2];
var userQuery = process.argv[3];

switch (userCommand) {
	case "my-tweets":
		twitterFunction();
		break;
	case "spotify-this-song":
		spotifyFunction();
		break;
	case "movie-this":
		omdbFunction();
		break;
	case "do-what-it-says":
		logFunction();
		break;
}

function twitterFunction() {
	var params = {screen_name: 'natevillegas'};
	twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
  		if (!error) {
    		for (var i = 0; i < tweets.length; i++) {
    			console.log("Tweet #"+[i+1]+" from @"+tweets[i].user.screen_name);
    			console.log(tweets[i].created_at);
    			console.log(tweets[i].text);
    			console.log("--------------------------------------");
    		}
    	}
  	})
}

function printSong(x) {
	spotifyClient.search({ type: 'track', query: x }, function(error, data) {
			if (!error) {
				console.log("*Artist(s): " + data.tracks.items[0].artists[0].name); 
				console.log("*Song Name: " + data.tracks.items[0].name); 
				console.log("*Spotify Preview: " + data.tracks.items[0].artists[0].external_urls.spotify); 
				console.log("*Album: " + data.tracks.items[0].album.name); 
			}
	})
}

function spotifyFunction() {
	if (nodeArgs.length == 4) {
		printSong (userQuery);
	} else {
		printSong ('The Sign Ace of Base');
	};
}

function omdbFunction() {
	function printMovie(x) {
		var queryUrl = "http://www.omdbapi.com/?t=" + x + "&y=&plot=short&apikey=40e9cece";
		request(queryUrl, function(error, response, body){
			if (!error && response.statusCode === 200) {
		        console.log("*Title: " + JSON.parse(body).Title); 
				console.log("*Year: " + JSON.parse(body).Year); 
				console.log("*IMDB Rating: " + JSON.parse(body).Ratings[0].Value); 
				console.log("*Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value); 
				console.log("*Country: " + JSON.parse(body).Country); 
				console.log("*Language: " + JSON.parse(body).Language);
				console.log("*Plot: " + JSON.parse(body).Plot);
				console.log("*Actors: " + JSON.parse(body).Actors);  
		    }
		})
	};
	if (nodeArgs.length == 4) {
		var newUserQuery = userQuery.replace(' ','+');
		printMovie (newUserQuery);
	} else
		printMovie ('Mr. Nobody');
}

function logFunction() {
	fs.readFile("random.txt","utf8",function(error,data){
		if (!error) {
			data = data.split(",");
			printSong(data[1]);
			// switch (data[0]) {
			// 	case "my-tweets":
			// 		twitterFunction();
			// 		break;
			// 	case "spotify-this-song":
			// 		spotifyFunction(data[1]);
			// 		break;
			// 	case "movie-this":
			// 		omdbFunction();
			// 		break;
			// 	case "do-what-it-says":
			// 		logFunction();
			// 		break;
			// }
		}	
	})
}

