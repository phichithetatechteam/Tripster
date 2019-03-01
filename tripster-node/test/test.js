
const request = require('supertest')
const mongodb = require('mongo-mock')
const assert = require('assert')

// MongoMock Connection
mongodb.max_delay = 0
const mongoMockClient = mongodb.MongoClient
mongoMockClient.persist = 'test/mongo_mock.js' // persist the data to disk
const mockURL = 'mongodb://someserver/mock_database'
const mockDB = 'EY_test'
const mockCollection = 'user profiles'
/* eslint-disable */
describe('Running Tests for ....', function () {
  var server
  var dbFunctions
  beforeEach(function () {
    server = require('../server')
    dbFunctions = require('../functions/db_functions')
  })
  it('Valid username, first_name, last_name, age', function () {
    const response = dbFunctions.post_new_profile_entity(mongoMockClient, mockURL, mockDB,
      mockCollection, 'johndoe1',
      'John', 'Doe', 32)
    response.then(function (resp) {
      assert.strictEqual(resp.status, 200)
    })
  })
  it('Non-alphanumeric username', (done) => {
    const response = dbFunctions.post_new_profile_entity(mongoMockClient, mockURL, mockDB,
      mockCollection, '~johndoe2',
      'John', 'Doe', 33)
    response.then(function (resp) {
      assert.strictEqual(resp.status, 422)
    }).finally(done)
  })
  it('Non-alphabetic first_name', (done) => {
    const response = dbFunctions.post_new_profile_entity(mongoMockClient, mockURL, mockDB,
      mockCollection, 'johndoe3',
      '123John~~', 'Doe', 33)
    response.then(function (resp) {
      assert.strictEqual(resp.status, 422)
    }).finally(done)
  })
  it('Non-alphabetic last_name', (done) => {
    const response = dbFunctions.post_new_profile_entity(mongoMockClient, mockURL, mockDB,
      mockCollection, 'johndoe4',
      'John', '123Doe~~', 33)
    response.then(function (resp) {
      assert.strictEqual(resp.status, 422)
    }).finally(done)
  })
  it('Age less than 0', (done) => {
    const response = dbFunctions.post_new_profile_entity(mongoMockClient, mockURL, mockDB,
      mockCollection, 'johndoe5',
      'John', 'Doe', -1)
    response.then(function (resp) {
      assert.strictEqual(resp.status, 422)
    }).finally(done)
  })
  it('Post the same user_name', (done) => {
    const response = dbFunctions.post_new_profile_entity(mongoMockClient, mockURL, mockDB,
      mockCollection, 'johndoe1',
      'John', 'Doe', 44)
    response.then(function (resp) {
      assert.strictEqual(resp.status, 409)
    }).finally(done)
  })
  it('Get Invalid UUID', (done) => {
    const response = dbFunctions.retrieve_data_by_id(mongoMockClient, mockURL, mockDB,
      mockCollection, 'randomUUID')
    response.then(function (resp) {
      assert.strictEqual(resp.status, 404)
    }).finally(done)
  })
  it('Get Valid UUID', (done) => {
    mongoMockClient.connect(mockURL)
      .then(function (client) { // <- db as first argument
        const db = client.db(mockDB)
        const collection = db.collection(mockCollection)
        collection.findOne({}, function (err, document) {
          if (err) {
            console.log(err)
          }
          validUUID = document.uuid
          const response = dbFunctions.retrieve_data_by_id(mongoMockClient, mockURL, mockDB,
            mockCollection, validUUID)
          response.then(function (resp) {
            assert.strictEqual(resp.status, 200)
          }).finally(done)
        })
      })
  })
  it('POST /profile/new Invalid key username as usernmr in params', (done) => {
    request(server)
      .post('/profile/new?usernmr=johndoe&first_name=John&last_name=Doe&age=44')
      .expect('Invalid Parameters')
      .expect(422, done)
  })
  it('POST /profile/new Invalid first_name as firstnmr in params', (done) => {
    request(server)
      .post('/profile/new?username=johndoe&firstnmr=John&last_name=Doe&age=44')
      .expect('Invalid Parameters')
      .expect(422, done)
  })
  it('POST /profile/new Invalid last_name as lastnmr in params', (done) => {
    request(server)
      .post('/profile/new?username=johndoe&first_name=John&lastnmr=Doe&age=44')
      .expect('Invalid Parameters')
      .expect(422, done)
  })
  it('POST /profile/new Invalid age as a in params', (done) => {
    request(server)
      .post('/profile/new?username=johndoe&first_name=John&last_name=Doe&a=44')
      .expect('Invalid Parameters')
      .expect(422, done)
  })
  it('POST /profile/new Missing params', (done) => {
    request(server)
      .post('/profile/new?last_name=Doe&age=44')
      .expect('Invalid Parameters')
      .expect(422, done)
  })
  it('GET /profile/invalidUUID UUID Not Found', (done) => {
    request(server)
      .get('/profile/invalidUUID')
      .expect('UUID Not Found')
      .expect(404, done)
  })
})
