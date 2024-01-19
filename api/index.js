var config = require('./config');
var Express = require("express");
const mongodb = require("mongodb");
const path = require("path");
var MongoClient = mongodb.MongoClient;
// Allows any traffic from any IP address
var cors = require("cors");
// Handles form data for uploading files
const multer = require("multer");

var app = Express();
app.use(cors());


var CONNECTION_STRING = "mongodb+srv://" + config.username + ":" + config.password + "@cluster0.0s6fyy3.mongodb.net/?retryWrites=true&w=majority";
console.log(CONNECTION_STRING);

let db = null;
var DATABASE_NAME = "MonsterClassifier";
var database;

//Setting storage engine for multer
// ./potentialMonsters will be available for users to upload images to
// Using Date.now() for file upload
// Req = request, file = file, cb = callback which determines the uploaded file's name
const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './potentialMonsters');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});

// Upload limits on types of file a user can upload
// We also defined a function that filters on 
const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 15000000 },
    fileFilter: function (req, file, callback) {
        console.log("in check!");
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
});


const checkFileType = function(file,cb) {
    //Regex ecpression containing allowed file extensions
  const fileTypes = /jpeg|jpg|png/;

  console.log("in check!");


  // Check extension names
  const extensionName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimeType)

  console.log("in check!");

    if (mimeType && extensionNames) {
        cb(null,true);
    } else {
        cb("Error! You can only upload images! (,,>﹏<,,)")
    }

}



app.listen(5038, () => {
    MongoClient.connect(CONNECTION_STRING, (error, client) => {
        if (error) {
            throw error;
        }
        db = client.db(DATABASE_NAME);
        console.log("Mongo DB Connection Successful");
    });
})

app.get('/humans', (request, response) => {
    db.collection("Human").find({}).toArray((error, result) => {
        response.send(result);
    });
})

app.post('/postMonster', multer().none(), (request, response) => {
    console.log(request.body.classification);
    db.collection("Human").count({}, function (error, numOfDocs) {
        db.collection("Human").insertOne({
            id: (numOfDocs + 1).toString(),
            classification: request.body.classification,
            image_url: request.body.image
        });
        response.json("Added Succesfully");
    })
})

app.post("/postMe", upload.single("file"), (req, res) => {

    console.log("Ouch! You hit me!");
    console.log(res);
    if (req.file) {
      res.send("Single file uploaded successfully");
    } else {
      res.status(400).send("Please upload a valid image");
    }
    res.json("Uploaded image successfully");
  });
