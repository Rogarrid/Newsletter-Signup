require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const request=require('request');
const mailchimp = require("@mailchimp/mailchimp_marketing");


mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_KEY,
	server: process.env.MAILCHIMP_SERVER
});

const app=express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', function(req, res){
	res.sendFile(__dirname+'/public/signup.html')
})

app.post("/", function(req, res){
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const listId = "a86fcd1876";

//async -> función asincrona, espera a que conecte con el mailchimp, haga lo siguiente que se le indica y luego sigue

	async function run() {
		try{
			const response = await mailchimp.lists.addListMember(listId, {
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
			}
			});
			res.sendFile(__dirname + "/public/success.html");
		}
		catch (error) {
					console.log(error);
					res.sendFile(__dirname + "/public/failure.html");
		}
			console.log(`Successfully added contact as an audience member. The contact's id is ${response.id || "id no definida"}.`);
	}
  run();
});

app.listen(3000, function(){
    console.log("The server is running on port 3000")
});
