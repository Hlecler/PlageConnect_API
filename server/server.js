require("dotenv").load();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const request = require("request");

import {User, users} from "./data/users";
import {sessions} from "./data/sessions";
import {accounts} from "./data/accounts";

const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

////////////////// PAGES ///////////////////
app.get("/", (req, res) => {
    fs.readFile("./pages/login.html", (err, data) => {
        if(err){
            res.writeHead(503);
            res.end();
        } else {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(data);
        }
    })
});

app.get("/home", (req, res) => {
    fs.readFile("./pages/home.html", (err, data) => {
        if(err){
            res.writeHead(503);
            res.end();
        } else {
            const id = req.body.id;
            const pwd = req.body.pwd;
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(data);
        }
    })
})

app.post("/moodle/token", (req, res) => {
	request.post(process.env.MOODLEHOST+"/login/token.php?username="+ process.env.MOODLEAUTH+"&password="+process.env.MOODLEPWD+"&service="+process.env.MOODLESERVICE, null, 
		(error, res, body) => {
	  	if (error) {
	    	console.error(error)
	    	return
	  	}
	  	if(res.statusCode === 200){
	  		var token = JSON.parse(body).token;
	  		var user = {
	  			idnumber : 2, email : "hugo.lecler@laposte.net"
	  		};
	  		var json = JSON.stringify(user);
	  		console.log("Token récupéré : " +token);

	  		var url = process.env.MOODLEHOST+"/webservice/rest/server.php?wstoken="+"fa389fae2dc5de43b81e1292477f2c64"+"&wsfunction=auth_userkey_request_login_url&moodlewsrestformat=json";
	  		console.log(url);
	  		request.post(url, json, (error, res, body) => {
	  			if (error) {
	  				console.error(error)
	  				return
	  			}
	  			console.log("hello");
	  			console.log(body);
	  		})
	  	}
	})

	const id = req.body.id;
	console.log("Identifiant : " + id);

 	res.writeHead(200, {"Content-Type": "text/html"})
 	res.end();
})

app.post("/moodle/connect", (req, res) => {
	var url = process.env.MOODLEHOST+"/webservice/rest/server.php?wstoken="+"fa389fae2dc5de43b81e1292477f2c64"+"&wsfunction=auth_userkey_request_login_url&moodlewsrestformat=json&email=hirose@hotmail.fr";
	var object =
	{
		'user' : {'email' : "hirose@hotmail.fr"}
	};
	var json = JSON.stringify(object);
	console.log(json);
	request.post(url, json, (error, result, body) => 
	{
		if (error) {
			console.error(error)
			return
		}
		console.log(body);
	})
	res.writeHead(200)
	res.end();
})

////////////////// API ////////////////////
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
