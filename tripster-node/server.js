const express = require('express')
const fs = require('fs')
const mongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID;
var cors = require('cors')
var request = require("request");
var clientid = '682367fe3a8a41a0b81f34dc5c6fe936'
var clientsecret = '96b5123b508a42f4b450b9b600341ab6'
var bodyParser = require('body-parser');
const dbFunctions = require('./functions/db_functions')
const url = "mongodb+srv://pctzetatechteam:chiragiscool@tripster-602op.gcp.mongodb.net/test?retryWrites=true"; //connection path to gcp mongo instance
const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
const server = app.listen(8888, () => console.log('Listening on Port 8888'))
module.exports = server

const back_url = 'http://localhost:8888';
const front_url = 'http://localhost:3000';

app.get('/status', function (req, res) {
	res.send("app is running")
});

app.post('/new-trip', function (req, res) {
    const user_id = req.body.user_id;
    const email = req.body.email;
    const response = dbFunctions.doesAccountExist(mongoClient, url, 'Tripster', 'accounts', user_id, email);
    response.then(function(doesAccountExist){
        if (doesAccountExist){
            const resp = dbFunctions.create_new_trip(mongoClient, url, 'Tripster', 'trips', user_id, email);
            resp.then(function (trip_id) {
                res.send(trip_id)
            })
        } else {
            res.send("NO ACCOUNT EXISTS, STOP TRYING TO HACK ME")
        }
    })
});

app.post('/delete-trip', function (req, res) {
    const user_id = req.body.user_id;
    const email = req.body.email;
    const trip_id = new ObjectID(req.body.trip_id);
    const response = dbFunctions.delete_trip(mongoClient, url, 'Tripster', 'trips', user_id, email, trip_id);
    response.then(function(message){
        const resp = dbFunctions.view_trips(mongoClient, url, 'Tripster', 'trips', email, user_id);
        resp.then(function(trips){
            res.send({data: trips})
        })
    })
});

app.post('/save-trip', function(req, res){
    const _id = new ObjectID(req.query.trip_id);
    const email = req.query.email;
    const user_id = req.query.user_id;
    const response = dbFunctions.save_trip(mongoClient, url, 'Tripster', 'trips', _id, email, user_id, req.body);
    response.then(function(message){
        res.send(message)
    })
});

app.get('/view-trips', function(req, res){
    const email = req.query.email;
    const user_id = req.query.user_id;
    const response = dbFunctions.view_trips(mongoClient, url, 'Tripster', 'trips', email, user_id);
    response.then(function(trips){
        res.send({data: trips})
    })
});

app.get('/view-trip', function(req, res){
    const email = req.query.email;
    const user_id = req.query.user_id;
    const trip_id = new ObjectID(req.query.trip_id);
    const response = dbFunctions.view_trip(mongoClient, url, 'Tripster', 'trips', email, user_id, trip_id);
    response.then(function(trip){
        res.send(trip)
    })
});

app.post('/authenticate', function(req, res){
    const response = dbFunctions.post_new_profile_entity(mongoClient, url, 'Tripster', 'accounts', req.body.name, req.body.email, req.body.picture, req.body.user_id);
    response.then(function(resp){
        res.status(resp.status)
        res.send(resp.message)
    }).catch(function (error){
        res.send(error)
    })
})
app.get('/calculate-distance', function (req, res) {
    const origin_lat = req.query.origin_lat;
    const origin_lng = req.query.origin_lng;
    const destination_lat = req.query.destination_lat;
    const destination_lng = req.query.destination_lng;
    const sort_by = req.query.sort_by;
    const price = req.query.price;
    const categories = req.query.stops;

    const middlepoint = middlePoint(parseFloat(origin_lat), parseFloat(origin_lng), parseFloat(destination_lat), parseFloat(destination_lng))
    const middlepoint_lat = middlepoint[1];
    const middlepoint_lng = middlepoint[0];


    var options = { method: 'GET',
        url: 'https://api.yelp.com/v3/businesses/search',
        qs: {
            latitude: middlepoint_lat.toString(),
            longitude: middlepoint_lng.toString(),
            radius: '30000',
            categories: categories,
            limit: '5',
            open_now: 'true',
            sort_by: sort_by,
            price: price
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

            let dict = {'name':currObj['name'], 'image_url':currObj['image_url'], 'coordinates':currObj['coordinates'], 'rating':currObj['rating'], 'url':currObj['url'], 'review_count':currObj['review_count'], 'phone':currObj['phone']}
            results['stops'].push(dict)
        }
        res.send(results);


    });

})

app.get('/spotifunk', function(req, res){
    var code = req.query.code || null
    var authOptions = {
        code: code,
        url: 'https://accounts.spotify.com/api/token',
        form: {
            redirect_uri: `${back_url}/callback`,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer('682367fe3a8a41a0b81f34dc5c6fe936' + ':' + '96b5123b508a42f4b450b9b600341ab6').toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        let refresh_token = '';
        if (!error && response.statusCode === 200) {
            refresh_token = body.refresh_token;
        } else {
            refresh_token = "invalid refresh token";
        }
        res.redirect(`${front_url}/plan-trip?refresh_token=${refresh_token}`)
    });

})

app.get('/callback', function(req, res){
    var code = req.query.code || null

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: `${back_url}/callback`,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(clientid + ':' + clientsecret).toString('base64'))
        },
        json: true
    };
    request.post(authOptions, function(error, response, body) {
        let refresh_token = '';
        if (!error && response.statusCode === 200) {
            refresh_token = body.refresh_token;
        } else {
            refresh_token = "invalid refresh token";
        }
        res.redirect(`${front_url}/plan-trip?refresh_token=${refresh_token}`)
    });
});

app.get('/top-10', function(req,res){
    let refreshToken = req.query.refreshToken || null;
    let accessTokenPromise = spotifunkRocks(refreshToken);

    let finalAccess;

    accessTokenPromise.then(access_token => {
        finalAccess = access_token;
        var uid = getUserid(finalAccess)
            uid.then(id => {
                var playlistObj = createPlaylist(id['id'], finalAccess)
                playlistObj.then( playlist => {
                        var top_songs = topTen(access_token)
                        top_songs.then( tenSongs => {
                            var finalPlaylist = addSongs(makePlaylist(tenSongs), playlist['id'], finalAccess)
                            finalPlaylist.then(final =>{
                                res.send({'playlist_id':playlist.id,'user_id': id['id']})

                            })
                        })
                    })
            })
    });
});

function addSongs (track_uri, playlist_id, access_token){
    var options = { method: 'POST',
        url: 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks',
        headers:
            { 'Postman-Token': '973d0e0f-584c-41ca-8d12-0d5ce597d8a7',
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                scope: 'playlist-modify-public playlist-modify-private',
                Authorization: `Bearer ${access_token}`},
        body:
            { uris:
                    track_uri },
        json: true };

    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
            resolve(body);
        });
    });
}

function createPlaylist(userid, access_token) {
    var options = { method: 'POST',
        url: 'https://api.spotify.com/v1/users/'+userid+'/playlists',
        headers:
            { 'Postman-Token': '15314122-a613-4148-96c8-0d212014d639',
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
                scope: 'playlist-modify-public playlist-modify-private',
                Authorization: `Bearer ${access_token}`},
        body: { name: 'Your Roadtripping Playlist', public: 'true' },
        json: true };

    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
            resolve(body);
        });
    });

}


function getUserid(access_token) {
    var options = { method: 'GET',
        json: true,
        url: 'https://api.spotify.com/v1/me',
        headers:
            { 'Postman-Token': 'e51da337-9c1b-4aec-86f0-71eecc8ecdca',
                'cache-control': 'no-cache',
                Authorization: `Bearer ${access_token}`,
                scope: 'user-read-email user-read-private user-read-birthdate' } };

    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
            resolve(body);
        });
    });
}



function spotifunkRocks(refresh_token) {
    //token swap from refresh to access
    const encodedClient = Buffer.from(`${clientid}:${clientsecret}`).toString('base64');
    var options = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${encodedClient}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            refresh_token: refresh_token,
            grant_type: 'refresh_token'
        }
    };
    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
            if (response.statusCode === 400){
                reject(JSON.parse(body))
            } else {
                const new_access_token = JSON.parse(body).access_token
                resolve(new_access_token)
            }
        });
    })
}

function topTen(access_token){
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
    };
    var options = {
        method: 'GET',
        headers: headers,
        url: `https://api.spotify.com/v1/me/top/tracks?limit=10`,
    };
    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
            resolve(body)
        });
    });
}

function makePlaylist(x) {
    let obj = JSON.parse(x);
    var items = obj['items'];
    var uris = [];
    for (var i = 0; i < obj['total']; i++){
        var currUri = items[i]['uri'];
        uris.push(currUri)
    }
    return uris
}




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
