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
app.get('/calculate-distance', function (req, res) {
    const origin_lat = req.query.origin_lat;
    const origin_lng = req.query.origin_lng;
    const destination_lat = req.query.destination_lat;
    const destination_lng = req.query.destination_lng;
    const stops = req.query.stops;

    const middlepoint = middlePoint(parseFloat(origin_lat), parseFloat(origin_lng), parseFloat(destination_lat), parseFloat(destination_lng))
    const middlepoint_lat = middlepoint[1];
    const middlepoint_lng = middlepoint[0];

    console.log(middlepoint_lat);
    console.log(middlepoint_lng);


    var options = { method: 'GET',
        url: 'https://api.yelp.com/v3/businesses/search',
        qs: {
            latitude: middlepoint_lat.toString(),
            longitude: middlepoint_lng.toString(),
            radius: '30000',
            categories: 'restaurants',
            limit: '5',
            open_now: 'true'
        },
        headers: {
            Authorization: 'Bearer gT_aQFG6tpHRNWakUP1lGp7QjJk-hL8CUz0XirR6-L3TkJdXJUj8dmmQ-ye4y7y4OW_v_D6DWXW200yOQVkAlvqkrgokTQ59j9ptwfh6vqJwVBuI1KiE7ANIhpGeXHYx'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        let obj = JSON.parse(body)
        obj = obj['businesses']

        let results = {'stops': []}

        var i;
        for (i = 0; i < obj.length; i+=1){
            let currObj = obj[i];

            //console.log(currObj);
            //console.log(currObj['name'], currObj['image_url'], currObj['coordinates'], currObj['rating'], currObj['url'], currObj['review_count'], currObj['price'], currObj['phone']);
            let dict = {'name':currObj['name'], 'image_url':currObj['image_url'], 'coordinates':currObj['coordinates'], 'rating':currObj['rating'], 'url':currObj['url'], 'review_count':currObj['review_count'], 'phone':currObj['phone']}
            //console.log(dict)
            results['stops'].push(dict)
        }
        console.log(results);
        res.send(results);

        //console.log(obj);
    });




})


function middlePoint(lat1, lng1, lat2, lng2) {

    if (typeof (Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        }
    }

//-- Define degrees function
    if (typeof (Number.prototype.toDeg) === "undefined") {
        Number.prototype.toDeg = function () {
            return this * (180 / Math.PI);
        }
    }

    //-- Longitude difference
    var dLng = (lng2 - lng1).toRad();

    //-- Convert to radians
    lat1 = lat1.toRad();
    lat2 = lat2.toRad();
    lng1 = lng1.toRad();

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    //-- Return result
    return [lng3.toDeg(), lat3.toDeg()];
}