var ObjectID = require('bson-objectid');

module.exports = {
  "someserver": {
    "databases": {
      "mock_database": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": []
          }
        ]
      },
      "EY_test": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              },
              {
                "name": "user profiles"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": [
              {
                "v": 1,
                "key": {
                  "_id": 1
                },
                "ns": "EY_test.user profiles",
                "name": "_id_",
                "unique": true
              }
            ]
          },
          {
            "name": "user profiles",
            "documents": [
              {
                "userName": "johndoe1",
                "firstName": "John",
                "lastName": "Doe",
                "age": 32,
                "uuid": "d874cfb0-b9c5-11e8-b7c3-53c96f72b76f",
                "_id": ObjectID("5b9e77c254f8140ae688c5df")
              }
            ]
          }
        ]
      }
    }
  }
}