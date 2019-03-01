// npm packages
const uuidv1 = require('uuid/v1')

// import files
const validation = require('./input_validation')

function isMongoConnected (err) {
  if (err) {
    console.log('Unable to connect to MongoDB\nPlease ensure mongod is running and the url is correct')
    return false
  }
  return true
}

module.exports = {
  post_new_profile_entity: function (mongoClient, dbURL, dbName, dbCollection, userName, firstName, lastName, age) {
    return new Promise(function (resolve, reject) {
      mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
        if (isMongoConnected(err)) {
          // Connect to database and collection
          const db = client.db(dbName)
          const collection = db.collection(dbCollection)

          // Generates uuid timestamp
          const uuid = uuidv1()

          // Validates Inputs
          if (validation.isValidUserName(userName) && validation.isValidFirstOrLastName(firstName) && validation.isValidFirstOrLastName(lastName) && validation.isValidAge(age)) {
            collection.findOne({ userName }, function (collectionError, document) {
              if (collectionError) {
                reject(collectionError)
              }
              // if username not in collection - insert
              if (document === null) {
                collection.insertOne({ userName, firstName, lastName, age, uuid })
                resolve({ 'status': 200, 'message': { userName, firstName, lastName, age, uuid } }) // ok
              } else { // username already in collection - do not insert
                resolve({ 'status': 409, 'message': 'Username already in collection' }) // conflict
              }
            })
          } else { // Invalid Input
            resolve({ 'status': 422, 'message': 'Invalid Parameters' }) // unprocessable entity
          }
        }
      })
    })
  },

  retrieve_data_by_id: function (mongoClient, dbURL, dbName, dbCollection, uuid) {
    return new Promise(function (resolve, reject) {
      mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
        if (isMongoConnected(err)) {
          // Connect to database and collection
          const db = client.db(dbName)
          const collection = db.collection(dbCollection)
          collection.findOne({ uuid }, function (collectionError, document) {
            if (collectionError) {
              reject(collectionError)
            }
            // if uuid not in collection - 404
            if (document === null) {
              resolve({ 'status': 404, 'message': 'UUID Not Found' }) // not found
            } else { // uuid in collection - display data
              delete document._id // do not show _id
              delete document.uuid // do not uuid
              resolve({ 'status': 200, 'message': document }) //  okay
            }
          })
        }
      })
    })
  }
}
