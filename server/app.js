//https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs

// database config file
const connectDB = require('./config/db');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cors = require('cors');

// Enable CORS for all routes
app.use(cors());

// create application/json parser
var jsonParser = bodyParser.json()

// connect to database
connectDB();

// The database
//const MongoClient = require('mongodb').MongoClient;
const { MongoClient } = require("mongodb");
//const uri = "mongodb://test:password@127.0.0.1:27017/mydb";
// Unsecured database
const uri = "mongodb://127.0.0.1:27017";

var options = {
    index: "myWebPage.html"
  };

var dir = path.join(__dirname, '../frontend');

app.get('/api', function(req, res){
    res.send("Yes we have an API now")
});

app.use("/api/quote", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });
  

app.post('/api/quote', jsonParser, function(req, res){
    console.log("Storing quote number: "+req.body )
    console.log("Mongo URI is "+uri)

    // Database stuff
    // Create a new MongoClient
    const client = new MongoClient(uri);
    async function run() {
    try {
        console.log('Start the database stuff');
        //Write databse Insert/Update/Query code here..
        var dbo = client.db("mydb");
        await dbo.collection("quote").insertOne(req.body, function(err, res) {
            if (err) {
                console.log(err); 
                throw err;
            }
        }); 
        console.log('End the database stuff');

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    }
    run().catch(console.dir);
    res.send("stored "+req.body)
});

app.get('/api/quote', function(req, res){
    console.log("getting the quotes")
    console.log("Mongo URI is "+uri)
    const client = new MongoClient(uri);
    async function run() {
        try {
            const dbo = client.db("mydb");
            const query = {};
            const options = {
                sort: { todoNumber: 1  },
                projection: { todoNumber: 1, todoText: 1 },
            };
        
            const cursor = dbo.collection("quote").find(query);
            if ((await cursor.countDocuments) === 0) {
                console.log("No documents found!");
                response = ""
            }
            // prepare the response as an array
            const response = await cursor.toArray();
            res.send(response)
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});
app.delete('/api/quote', function(req, res){
    console.log("deleting the current quote")
    console.log("Mongo URI is "+uri)
    const client = new MongoClient(uri);
    async function run() {
        try {
            console.log("starting up the database")
            const dbo = client.db("mydb");
            const query = {};
           
            console.log("deleting the collection")
            await dbo.collection("quote").deleteMany(query, function(err, result) {
                if (err) throw err;
            });
 
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
    res.send("Deleted list")
});

app.use(express.static(dir, options));

// 404 page
app.use(function ( req, res, next) {
    res.send('This page does not exist!')
});

app.listen(8000, function () {
    console.log('Listening on http://localhost:8000/');
});
