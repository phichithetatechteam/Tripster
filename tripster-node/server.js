// npm packages
const express = require('express')
const fs = require('fs')
const mongoClient = require('mongodb').MongoClient

const dbFunctions = require('./functions/db_functions')
const databaseConnection = JSON.parse(fs.readFileSync('./mongo_settings.json', 'utf8'))

// constants
const app = express()

// start express server
const server = app.listen(8888, () => console.log('Listening on Port 8888'))
module.exports = server

// Retrieves username, first name, last name, age if the user exists in the data source.
app.get('/get-route', function (req, res) {
  let origin = req.query.origin;
  let destination = req.query.destination;
  res.send({origin, destination});
})
