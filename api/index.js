var config = require('./config');
//log_in(config.username, config.password);
var Express = require("express");
const mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
// Allows any traffic from any IP address
var cors=require("cors");
// Handles form data for uploading files
const multer=require("multer"); 

var app=Express();
app.use(cors());


var CONNECTION_STRING="mongodb+srv://"+config.username+":"+config.password+"@cluster0.0s6fyy3.mongodb.net/?retryWrites=true&w=majority";
console.log(CONNECTION_STRING);


let db = null;

var DATABASE_NAME="MonsterClassifier";
var database;

app.listen(5038,()=>{
    MongoClient.connect(CONNECTION_STRING,(error,client)=>{
        if(error){
            throw error;
        }
        db=client.db(DATABASE_NAME);
        console.log("Mongo DB Connection Successful");
    });
})

app.get('/humans',(request,response)=>{
    db.collection("Human").find({}).toArray((error,result)=> {
        response.send(result);
    });
})

app.post('/postMonster',multer().none(),(request,response)=>{
    db.collection("Human").count({},function(error,numOfDocs)=>{
        db.collection("Human").insertOne({
            id:(numOfDocs+1).toString(),
            classification:request.body.classification,
            image_url: request.body.url
        });
        response.json("Added Succesfully");
    })
})

