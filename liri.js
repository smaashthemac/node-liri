// ======== INTIAL STUFF ======== //

// npm & key requirements
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

var keys = require('./keys.js');


// ======== TWITTER STUFF ======== // 

// function to get tweets; arguments come from runThis below
var getTweets = function() {
	console.log('Tweet function: ACTIVATE');
	// makes sure we've got the twitter keys from the keys.js file
	var client = new twitter(keys.twitterKeys);
	// hard codes twitter username and will return 20 tweets
	var params = { screen_name: 'smaashthemaac', count: 20 };
	// "ajax" call, essentially, that gets the information from twitter
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		// returns response
		if (!error) {
	      for (var i = 0; i < tweets.length; i++) {
	        console.log(tweets[i].created_at);
	        console.log("");
	        console.log(tweets[i].text);
	        console.log("-----------------------------------");
	      }
    	} // end if loop
	}); // end get request
}; // end getTweets function


// ======== SPOTIFY STUFF ======== // 

// function to return artist(s) name(s)
var getArtistNames = function(artist) {
	return artist.name;
};

// begin function
var getMeSpotify = function(songName) {
	// if the user doesn't enter a song, it will find Toto's Africa
	if (songName == undefined) {
		songName = 'Toto';
	};
	// "ajax" call that gets information from spotify api
	spotify.search({ type: 'track', query: songName }, function (error, data) {
		// if there is an arror, return it
		if (error) {
			console.log('Error occured: ' + error);
			return;
		}

		// creates variable for the song
		var songs = data.tracks.items;
		// array into which the song data will be pushed
		var data = [];

		// loops through data, adds commentary
		for (var i = 0; i < songs.length; i++) {
	      console.log(i);
	      console.log("artist(s): " + songs[i].artists.map(getArtistNames));
	      console.log("song name: " + songs[i].name);
	      console.log("preview song: " + songs[i].preview_url);
	      console.log("album: " + songs[i].album.name);
	      console.log("-----------------------------------");
	    }
	}); // end get request
}; // end getMeSpotify function


// ======== OMDB STUFF ======== // 

// begin getMeMovie function
var getMeMovie = function(movieName) {

	// if the user doesn't enter a movie, it will return Some Like it Hot
	if (movieName == undefined) {
		movieName = 'Some Like it Hot';
	}

	// omdb query url
	var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

		// request info
	  request(urlHit, function(error, response, body) {
	  	// log error, if any
	    if (!error && response.statusCode === 200) {
	      var jsonData = JSON.parse(body);
	      // display all this data junk
	      console.log("Title: " + jsonData.Title);
	      console.log("Year: " + jsonData.Year);
	      console.log("Rated: " + jsonData.Rated);
	      console.log("IMDB Rating: " + jsonData.imdbRating);
	      console.log("Country: " + jsonData.Country);
	      console.log("Language: " + jsonData.Language);
	      console.log("Plot: " + jsonData.Plot);
	      console.log("Actors: " + jsonData.Actors);
	      console.log("Rotten Tomatoes Rating: " + jsonData.tomatoRating);
	      console.log("Rotton Tomatoes URL: " + jsonData.tomatoURL);
	    }
  });
}; // end getMeMovie function


// ======== DO WHAT IT SAYS STUFF ======== // 

// begin doWhatItSays function
var doWhatItSays = function() {
	// use npm fs to read external file
	fs.readFile('random.txt', 'utf8', function(error, data) {
		// prints returned data to bash
		console.log(data);
		// splits info from text file at the comma
		var dataArr = data.split(',');
		// if the array has 2 arguments in it, those are applied to pick (and will either be spotify or movie)
		if (dataArr.length == 2) {
			pick(dataArr[0], dataArr[1]);
		// otherwise, if there is only 1 argument, that is applied to pick
		} else if (dataArr.length == 1) {
			pick(dataArr[0]);
		} // end else
	}) // end fs function
}; // end doWhatItSays function


// ======== TAKE IN USER ARGUMENTS STUFF ======== // 

// case-switch statement; thanks Daniel!
var pick = function(caseData, functionData) {
	switch (caseData) {
		// if the case - the user's first argument - is "my-tweets"...
		case 'my-tweets':
			// then run the getTweets function (with no argument)
			getTweets();
			// jumps out of the loop
			break;
		// if the case - the user's first argument - is "spotify-this-song"...
		case 'spotify-this-artist':
			// then run the getMeSpotify function (with the user's second argument - the song name)
			getMeSpotify(functionData);
			// jumps out of the loop
			break;
		// if the case - the user's first argument - is "movie-this"...
		case 'movie-this':
			// then run the getMeMovie function (with the user's second argument - the movie name)
			getMeMovie(functionData);
			// jumps out of the loop
			break;
		// if the case - the user's first argument - is "do-what-it-says"...
		case 'do-what-it-says':
			// then run the doWhatItSays function (with no argument)
			doWhatItSays();
			// jumps out of the loop
			break;
		// if no arguments are provided, print this
		default: 
			console.log("Sorry, LIRI doesn't know that.");
	}
}

// function takes in user arguments and applies them to pick
var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

// intitially runs runThis; taking in the user commands after "node liri.js" (which are the function command and the argument; ex: spotify-this-song, hotel-california)
runThis(process.argv[2], process.argv[3]);
