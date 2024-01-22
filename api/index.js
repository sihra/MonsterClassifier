var config = require('./config');
var Express = require("express");
const mongodb = require("mongodb");
const path = require("path");
//const spawn = require("child_process");
//var MongoClient = mongodb.MongoClient;
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


app.listen(5038, () => {})

app.get('/humans', (request, response) => {
    db.collection("Human").find({}).toArray((error, result) => {
        response.send(result);
    });
})


app.post("/postMe", upload.single("file"), async function(req, res){

    try {
        const { spawn } = require('child_process');
        const pythonProcess = await spawn('python3', ['./src/monsterClassifier.py']);
    
        pythonProcess.stdout.on('data', async (data) => {
            modelResults = data.toString();
            console.log(" Found data " + modelResults);
            if (modelResults.includes("Human")) {
                humanProbs = parseFloat(modelResults.substring(modelResults.indexOf(':')+2,modelResults.lastIndexOf(',')));
                monsterProbs = parseFloat(modelResults.substring(modelResults.lastIndexOf(':')+2,modelResults.lastIndexOf('}')));
                console.log("Human Probability: " + humanProbs)
                console.log("Monster Probability: " + monsterProbs)


                if(humanProbs > monsterProbs) {
                    res.write(JSON.stringify("Human"))
                } else {
                    res.write(JSON.stringify("Monster"))
                }
                console.log(JSON.stringify(data.toString()))
                //res.json(data.toString())
                //res.write(JSON.stringify(data.toString()))
                //res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end();
            }
        });
    
        console.log("Result " + res)
    } catch (e) {
        res.end(e.message || e.toString());
    }
    console.log("Ouch! You hit me!!");
  });
