function isMongoConnected (err) {
  if (err) {
    console.log('Unable to connect to MongoDB\nPlease ensure mongod is running and the url is correct')
    return false
  }
  return true
}

module.exports = {
  post_new_profile_entity: function (mongoClient, dbURL, dbName, dbCollection, name, email, picture, user_id) {
    return new Promise(function (resolve, reject) {
      mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
        if (isMongoConnected(err)) {
          const db = client.db(dbName)
          const collection = db.collection(dbCollection)
            collection.findOne({user_id}, function (collectionError, document) {
              if (collectionError) {
                reject(collectionError)
              }
              if (document === null) {
                collection.insertOne({name, user_id, email, picture})
                resolve({ 'status': 200, 'message': {name, user_id, email, picture} }) // ok
              } else { // username already in collection -
                collection.updateOne({user_id}, {$set:{'name': name,'email': email, 'picture':picture}} )
                resolve({ 'status': 409, 'message': 'updated value' }) // conflict
              }
            })
          //} else { // Invalid Input
            //resolve({ 'status': 422, 'message': 'Invalid Parameters' }) // unprocessable entity
          //}
        }
      })
    })
  },
    save_trip: function (mongoClient, dbURL, dbName, dbCollection, _id, email, user_id, body) {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
                if (isMongoConnected(err)) {
                    const db = client.db(dbName);
                    const collection = db.collection(dbCollection);
                    const query = {"_id": _id, "email": email, "user_id": user_id};
                    console.log("Query", query);
                    console.log("BODY", body);
                    collection.updateOne(query, {$set: body}, {upsert: true}, function(err, resp) {
                        resolve("Your trip has been saved");
                    });
                }
            })
        })
    },
    view_trip: function (mongoClient, dbURL, dbName, dbCollection, email, user_id, trip_id) {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
                if (isMongoConnected(err)) {
                    const db = client.db(dbName);
                    const collection = db.collection(dbCollection);
                    collection.findOne({email, user_id, _id: trip_id}).then(trip => {
                        resolve(trip)
                    })
                }
            })
        })
    },
    view_trips: function (mongoClient, dbURL, dbName, dbCollection, email, user_id) {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
                if (isMongoConnected(err)) {
                    const db = client.db(dbName);
                    const collection = db.collection(dbCollection);
                    collection.find({email, user_id}).toArray(function(err, result) {
                        resolve(result);
                    });
                }
            })
        })
    },
    doesAccountExist: function (mongoClient, dbURL, dbName, dbCollection, user_id, email) {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
                if (isMongoConnected(err)) {
                    const db = client.db(dbName)
                    const collection = db.collection(dbCollection)
                    db.collection("accounts").findOne({"email": email, "user_id": user_id}, function (collectionError, document) {
                        if (document == null) {
                            resolve(false)
                        } else {
                            resolve(true)
                        }
                    });
                }
            })
        })
    },
    create_new_trip: function (mongoClient, dbURL, dbName, dbCollection, user_id, email) {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
                if (isMongoConnected(err)) {
                    const db = client.db(dbName)
                    const collection = db.collection(dbCollection)
                    db.collection("trips").insertOne({"email": email, "user_id": user_id}).then(resp => {
                        resolve(resp.insertedId)
                    })
                }
            })
        })
    },
    delete_trip: function (mongoClient, dbURL, dbName, dbCollection, user_id, email, trip_id) {
        return new Promise(function (resolve, reject) {
            mongoClient.connect(dbURL, { useNewUrlParser: true }, function (err, client) {
                if (isMongoConnected(err)) {
                    const db = client.db(dbName)
                    const collection = db.collection(dbCollection)
                    db.collection("trips").deleteOne({"email": email, "user_id": user_id, "_id": trip_id}, function (collectionError, document) {
                        if (document.deletedCount == 0) {
                            resolve("Trip does not exist")
                        } else {
                            resolve("Trip has been deleted")
                        }
                    });
                }
            })
        })
    }
};
