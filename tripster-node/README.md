### Running the web server

1. Run ```npm install``` to install node modules
2. Run ``mongod`` to run a mongo server
3. Add the mongo url to "dbURL" in mongo settings
4. Run ```node server.js``` from the root directory to run node server
5. Visit localhost:3000 or import the postman endpoints

### Running test cases

##### Quick Note
 - I used mongomock to mock a local mongo database so when I test the functions, it doesn't actually hit the real database. That is only done with the endpoint testing which is optional, but I included it anyways. This was a design choice I learned from previous internships
 1. run ``npm test`` from the root directory

#### Styling:

##### JavaScript - Camel Case
- https://www.w3schools.com/js/js_conventions.asp

##### MongoDB - Camel Case
- http://arkusnexus.com/2016/09/12/coding-guidelines-mongodb/

##### Air B n B - Linting
- https://github.com/airbnb/javascript

#### NPM Packages
- express: hosting
- mongo-mock: mocking the database for function testing
- mongodb: database operations
- node: hosting
- request: unit testing the api endpoints (optional)
- supertest: unit testing
- uuid: generates a uuid

#### Cool Stuff to Import
- Postman endpoints: test GET and POST commands
- User profiles: sample user profiles collection to import into the EY mongodb

#### Design Choices
- Instead of printing errors, I would normally create a folder for logs that would capture the ip, time, etc of the web server. I did not implement because I thought it might be an overkill
- Database: I chose mongoDB because none of the data I am working with has any relationships.
- Passing in a mongo client to function: I chose this because when I am testing the functions that require a MongoClient, I can pass in a mocked client or a testing database to test the functions without hitting the real database
- mongo_settings.json- JSON file for database dependency. Should be .gitignored in production because you do not want to display any sensitive information. I would normally make this a .yaml file
- input_validation.js- modularize the codebase
- db_functions.js- nice to keep all database operations in one file
- POST /profile/new- will not insert the data if username already exists (Logical choice)
- GET /profile/:id- Assumed id = uuid
