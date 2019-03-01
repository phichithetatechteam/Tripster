// npm packages
const express = require('express')
const fs = require('fs')
const mongoClient = require('mongodb').MongoClient

const dbFunctions = require('./functions/db_functions')
const databaseConnection = JSON.parse(fs.readFileSync('./mongo_settings.json', 'utf8'))

// constants
const app = express()

// start express server
const server = app.listen(3000, () => console.log('Listening on Port 3000'))
module.exports = server

// Creates the Profile entity
app.post('/profile/new', function (req, res) {
  const response = dbFunctions.post_new_profile_entity(mongoClient, databaseConnection.dbURL, databaseConnection.dbName,
    databaseConnection.collectionName, req.query.username,
    req.query.first_name, req.query.last_name, req.query.age)
  response.then(function (resp) {
    res.status(resp.status)
    res.send(resp.message)
  }).catch(function (error) {
    res.send(error)
  })
})

// Retrieves username, first name, last name, age if the user exists in the data source.
app.get('/profile/:id', function (req, res) {
  const response = dbFunctions.retrieve_data_by_id(mongoClient, databaseConnection.dbURL, databaseConnection.dbName,
    databaseConnection.collectionName, req.params.id)
  response.then(function (resp) {
    res.status(resp.status)
    res.send(resp.message)
  }).catch(function (error) {
    res.send(error)
  })
})
