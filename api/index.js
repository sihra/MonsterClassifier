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

    const runClassifier = () => {
        return new Promise((resolve, reject) => {
            const { spawn } = require('child_process');
            const pythonProcess = spawn('python3', ['./src/monsterClassifier.py', req.file.filename]);
            
            let resultData = "";
            let errorData = "";

            pythonProcess.stdout.on('data', (data) => {
                resultData += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorData += data.toString();
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(errorData || `Process exited with code ${code}`);
                } else {
                    resolve(resultData);
                }
            });
        });
    };
    try {
        const modelResults = await runClassifier();
        console.log("Found data: " + modelResults);
        if (modelResults.includes("Human")) {
            const humanProbs = (parseFloat(modelResults.substring(modelResults.indexOf(':') + 2, modelResults.lastIndexOf(','))) * 100).toFixed(2);
            const monsterProbs = (parseFloat(modelResults.substring(modelResults.lastIndexOf(':') + 2, modelResults.lastIndexOf('}'))) * 100).toFixed(2);
    
            let message = (parseFloat(humanProbs) > parseFloat(monsterProbs)) 
                ? `Human Probability: ${humanProbs}% change this is a Human` 
                : `Jeepers! Monster Probability ${monsterProbs}%`;
    
            return res.json(message); 
        } 
        
        return res.status(400).send("Unexpected model output format.");
    
    } catch (e) {
        console.error("Classification Error:", e);
        if (!res.headersSent) {
            return res.status(500).send("Error processing image: " + e.toString());
        }
    } finally {
        if (req.file) {
            await unlinkAsync(req.file.path).catch(err => console.error("Cleanup error:", err));
        }
    }
    
});