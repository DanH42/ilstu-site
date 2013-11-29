var fs = require('fs');
var ejs = require('ejs');
var template = fs.readFileSync('./template.ejs') + '';

var pages = [{"name": "Home",   "title": "",       "styles": []},
             {"name": "Search", "title": "", "styles": []},
             {"name": "Resume", "title": "Resume", "styles": [
             	"http://fonts.googleapis.com/css?family=Ubuntu:300,400,700",
             	"/~dhlaven/css/resume.css"
             ]}];

// General rule: pages governed by this script start with an uppercase letter;
// pages that are still internal but managed separately start in lowercase.
var tabs = [{"name": "Webcam", "link": "/~dhlaven/webcam"},
            {"name": "Resume", "link": "/~dhlaven/Resume"}];

var links = [{"name": "Personal Site", "link": "http://dan.hlavenka.me/"},
             {"name": "LinkedIn",      "link": "http://www.linkedin.com/in/danhlavenka"},
             {"name": "GitHub",        "link": "https://github.com/DanH42"},
             {"name": "StackOverflow", "link": "http://stackoverflow.com/users/802335"},
             {"name": "Facebook",      "link": "https://www.facebook.com/danh42"}];

for(var i = 0; i < pages.length; i++){
	var page = pages[i];
	var filename = "./pages/" + page['name'] + ".html";
	if(fs.existsSync(filename)){
		console.log("Building " + (page['name'] === "Home" ? "/" : "/" + page['name'] + "/"));
		var opts = page;
		if(page.title.length > 0)
			opts.title = "Dan Hlavenka - " + page.title + " - Illinois State University";
		else
			opts.title = "Dan Hlavenka - Illinois State University"
		if(page['name'] === "Home"){
			page.home = "current";
			page.links = links;
		}else
			page.home = "parent";
		page.tabs = tabs;
		for(var j = 0; j < page.tabs.length; j++)
			page.tabs[j].current = page['name'] === page.tabs[j]['name'] ? "current" : "";
		page.content = fs.readFileSync(filename) + '';
		var content = ejs.render(template, {$: page});
		fs.writeFileSync(".." + (page['name'] === "Home" ? "" : "/" + page['name']) + "/index.html", content);
	}else
		console.log('ERROR: Unable to build "' + page['name'] + '". Could not load page content.');
}
