var fs = require('fs');
var ejs = require('ejs');
var pageTemplate = fs.readFileSync('./template.ejs') + '';
var webcamTemplate = fs.readFileSync('./about.ejs') + '';
var hljs = require('highlight.js');

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
             {"name": "LinkedIn",      "link": "https://linkedin.com/in/DanHlavenka"},
             {"name": "GitHub",        "link": "https://github.com/DanH42"},
             {"name": "StackOverflow", "link": "https://stackoverflow.com/users/802335"},
             {"name": "Facebook",      "link": "https://www.facebook.com/DanHlavenka"},
             {"name": "Google+",       "link": "https://google.com/+DanHlavenka"}];

for(var i = 0; i < pages.length; i++){
	var page = pages[i];
	var filename = "./pages/" + page['name'] + ".html";
	if(fs.existsSync(filename)){
		console.log("Building " + (page['name'] === "Home" ? "/" : "/" + page['name'] + "/"));
		var opts = page;
		if(page.title.length > 0)
			opts.title = "Dan Hlavenka - " + page.title + " - Illinois State University";
		else
			opts.title = "Dan Hlavenka - Illinois State University";
		if(page['name'] === "Home"){
			page.home = "current";
			page.links = links;
		}else
			page.home = "parent";
		page.tabs = tabs;
		for(var j = 0; j < page.tabs.length; j++)
			page.tabs[j].current = page['name'] === page.tabs[j]['name'] ? "current" : "";
		page.content = fs.readFileSync(filename) + '';
		var content = ejs.render(pageTemplate, {$: page});
		fs.writeFileSync(".." + (page['name'] === "Home" ? "" : "/" + page['name']) + "/index.html", content);
	}else
		console.log('ERROR: Unable to build "' + page['name'] + '". Could not load page content.');
}

console.log("Building /webcam/about.html");
var code = fs.readFileSync("./pages/webcam.js") + '';
code = hljs.highlight("javascript", code);
var content = ejs.render(webcamTemplate, {code: code.value});
fs.writeFileSync("../webcam/about.html", content);
