// npm packages
const express = require('express')
const fs = require('fs')
const mongoClient = require('mongodb').MongoClient
var cors = require('cors')
var request = require("request");



const dbFunctions = require('./functions/db_functions')
const databaseConnection = JSON.parse(fs.readFileSync('./mongo_settings.json', 'utf8'))

// constants
const app = express()
app.use(cors())

// start express server
const server = app.listen(8888, () => console.log('Listening on Port 8888'))
module.exports = server

// Retrieves username, first name, last name, age if the user exists in the data source.
app.get('/get-route', function (req, res) {
  let origin = req.query.origin;
  let destination = req.query.destination;
    var options = { method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/directions/json',
        qs:
            { origin: origin,
                destination: destination,
                key: 'AIzaSyChbG4vc4a01alWP7RYrMvWd911uhGzOdo' },
        headers:
            { 'Postman-Token': '8165d1bf-56ab-41eb-9b8f-133c05afb214',
                'cache-control': 'no-cache' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const parsedBody = JSON.parse(body);
        const steps = parsedBody.routes[0].legs[0].steps
        const parsedSteps = [];
        for (step in steps){
          parsedSteps.push(steps[step].end_location)
        }
        res.send({'steps': parsedSteps});
    });

})
