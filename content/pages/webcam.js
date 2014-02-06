var fs = require('fs');
var exec = require('child_process').exec;
var im = require('imagemagick');
var WunderNode = require("wundernode");
var wunder = new WunderNode("APIKEYAPIKEYAPIKEY");

setInterval(function(){
	// Download recent pictures from the phone
	exec("adb pull /sdcard/dailyroads/Photos Photos", function(){
		var pics = fs.readdirSync("./Photos");
		if(pics.length === 0)
			return; // Don't continue if there are no new pictures

		// Sort by filename, so the newest image will be at the end
		pics.sort();
		var recent = pics.pop();
		var ctime = fs.statSync("./Photos/" + recent).ctime;
		fs.renameSync("./Photos/" + recent, "./webcam.jpg");
		for(var i in pics)
			fs.unlinkSync("./Photos/" + pics[i]);

		// Wipe the images on the phone
		exec("adb shell rm /sdcard/dailyroads/Photos/*", function(){

			// Pull the current weather
			wunder.conditions("61761", function(err, obj){
				var weather = "";
				if(!err){
					var obs = JSON.parse(obj).current_observation;
					var temp = Math.round(obs.temp_f);
					var feelsLike = obs.feelslike_f;
					weather = Math.round(temp) + "°F";
					if(temp != feelsLike)
						weather += Math.round(temp) + " (" + feelsLike + "°F)";
				}

				var img = "webcam.jpg";
				// Scale the image and add text
				var args = [img,
					// Images are higher quality when taken at a higher
					// resolution and then scaled down
					'-resize', '1280x960>',

					'-fill', 'white', '-stroke', 'black',
					'-font', 'Arial', '-pointsize', 24,
					'-gravity', 'southwest', '-draw', "text 0,0 '" + ctime  + "'",

					'-gravity', 'southeast', '-draw', "text 0,0 '" + weather  + "'",
				img];

				im.convert(args, function(){
					// Move the final image to the web server
					var is = fs.createReadStream("./webcam.jpg");
					var os = fs.createWriteStream("./web/webcam/webcam.jpg");
					is.pipe(os);
				});
			});
		});
	});
}, 60 * 1000); // Run once a minute
