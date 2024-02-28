var Express = require("express");
const path = require("path");
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
// Allows any traffic from any IP address
var cors = require("cors");
// Handles form data for uploading files
const multer = require("multer");

var app = Express();
app.use(cors());
app.listen(process.env.PORT || 10000, () => { 
    console.log(`MonsterClassifier listening on port ${process.env.PORT}`)
})

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
// File Filter will ensure that only the relevant image file types are uploaded
const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 15000000 },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    },
});

app.get('/', function (req, res) {
    res.send("Hello World")
  });

app.post("/classify", upload.single("file"), async function (req, res) {
    console.log(`Hit classify with request ${req.file.filename}`)
    try {
        const { spawn } = require('child_process');
        console.log(`Going to spawn a process`)
        const pythonProcess = await spawn('python3', ['./src/monsterClassifier.py', req.file.filename]);
        console.log(`Waiting console output`)
        pythonProcess.stdout.on('data', async (data) => {
            modelResults = data.toString();
            console.log(" Found data " + modelResults);
            if (modelResults.includes("Human")) {
                humanProbs = parseFloat(modelResults.substring(modelResults.indexOf(':') + 2, modelResults.lastIndexOf(','))).toFixed(2) * 100;
                monsterProbs = parseFloat(modelResults.substring(modelResults.lastIndexOf(':') + 2, modelResults.lastIndexOf('}'))).toFixed(2) * 100;
                if (humanProbs > monsterProbs) {
                    res.write(JSON.stringify("Human Probability: " + humanProbs + "% change this is a Human"))
                } else {
                    res.write(JSON.stringify("Jeepers! Monster Probability " + monsterProbs + "%"))
                }
                console.log(JSON.stringify(data.toString()))
                await unlinkAsync(req.file.path)
                res.end();

            }
        });
    } catch (e) {
        res.end(e.message || e.toString());
    }
});
