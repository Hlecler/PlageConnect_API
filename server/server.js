require("dotenv").load();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const request = require("request");

import {User, users} from "./data/users";
import {sessions} from "./data/sessions";

const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post("/moodle/token", (req, res) => {
	var urlMoodleToken = process.env.MOODLEHOST+"/login/token.php?username="+ process.env.MOODLEAUTH+"&password="+process.env.MOODLEPWD+"&service="+process.env.MOODLESERVICE;
	request.post(urlMoodleToken, null, 
		(error, response1, body) => {

	  	if (error) {
	    	console.error(error)
	    	return
	  	}
	  	if(response1.statusCode === 200){
	  		var token = JSON.parse(body).token;
	  		var url = process.env.MOODLEHOST+"/webservice/rest/server.php?wstoken="
	  		+process.env.MOODLETOKENWEB+"&wsfunction=auth_userkey_request_login_url&moodlewsrestformat=json&user[email]="+req.body.id;

	  		request.post(url, null, (error, response2, body) => {
	  			if (error) 
	  			{
	  				console.error(error)
	  				return
	  			}
	  			var urlConnection = JSON.parse(body);
	  			res.data = body;
	  			if(response2.statusCode === 200)
				{
					res.writeHead(200, {"Content-Type": "application/json"})
 					res.end(JSON.stringify(res.data));
				}
			    else
				{
					res.writeHead(401, {"Content-Type": "application/json"})
					res.end();
				}
	  		})

	  	}
	})
});

app.post("/login", (req, res) => {
    const id = req.body.id;
    const pwd = req.body.pwd;
    if(users.findByLogin(id, pwd)){
        const token = sessions.connect(id);
        console.log(id + " just logged in with token " + token);

        const data = {"token": token, "userId": id};

        res.writeHead(200, {"Content-Type": "application/json"});
        res.data = data;
        res.end(JSON.stringify(data));
    } else {
    	console.log("Error connection")
        res.writeHead(401, {"Content-Type": "application/json"});
        res.end();
    }
});

app.post("/logout", (req, res) => {
    const id = req.body.id;
    const token = req.body.token;
    sessions.disconnect(id, token);
    console.log(id + " logged out");
    res.writeHead(200);
    res.end();
});

app.listen(port);
console.log("Listening on port " + port);
