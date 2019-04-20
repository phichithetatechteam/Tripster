// npm packages
const express = require('express')
const fs = require('fs')
const mongoClient = require('mongodb').MongoClient
var cors = require('cors')
var request = require("request");

var clientid = '682367fe3a8a41a0b81f34dc5c6fe936'
var clientsecret = '96b5123b508a42f4b450b9b600341ab6'



const dbFunctions = require('./functions/db_functions')
const databaseConnection = JSON.parse(fs.readFileSync('./mongo_settings.json', 'utf8'))
const url = 'mongodb://localhost:27017/tripster_users' //db currently on localhost
// constants
const app = express()
app.use(cors())


// start express server
const server = app.listen(8888, () => console.log('Listening on Port 8888'))
module.exports = server

app.get('/status', function (req, res) {
	res.send("app is running")
})

// Retrieves username, first name, last name, age if the user exists in the data source.
//test for mongo server
app.get('/testdb', function(req,res){
    const response = dbFunctions.retrieve_data_by_id(mongoClient, url, 'tripster_users', 'users') //temporary location of local db
    console.log("RESPONSE", response)
    response.then(function (resp) {
        console.log(resp)
        res.send(resp.message)
    }).catch(function (error) {
        res.send(error)
    })
    //console.log(response.collection.find())
})
app.post('/checkuser', function(req, res){
    const response = dbFunctions.post_new_profile_entity(mongoClient, url, 'tripster_users', 'users', req.query.username, req.query.pw);
    console.log(req.query.username);
    console.log(req.query.pw);
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
      //console.log(results);
        res.send(results);


    });

})

app.get('/spotifunk', function(req, res){
    var code = req.query.code || null
    var authOptions = {
        code: code,
        url: 'https://accounts.spotify.com/api/token',
        form: {
            redirect_uri: 'http://localhost:8888/callback',
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
        res.redirect(`http://localhost:3000/plan-trip?refresh_token=${refresh_token}`)
    });

})

app.get('/callback', function(req, res){
    var code = req.query.code || null
    console.log(code);

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: 'http://localhost:8888/callback',
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
        console.log(body);
        res.redirect(`${'http://localhost:3000/plan-trip'}?refresh_token=${refresh_token}`)
    });
});

app.get('/top-10', function(req,res){
    let refreshToken = req.query.refreshToken || null;
    let accessTokenPromise = spotifunkRocks(refreshToken);

    let finalAccess;

    accessTokenPromise.then(access_token => {
        console.log(access_token)
        finalAccess = access_token;
        var uid = getUserid(finalAccess)
            uid.then(id => {
                //console.log(id)
                var playlistObj = createPlaylist(id['id'], finalAccess)
                playlistObj.then( playlist => {
                        var top_songs = topTen(access_token)
                        top_songs.then( tenSongs => {
                            //console.log(playlist)
                            //console.log(makePlaylist(tenSongs))
                            var finalPlaylist = addSongs(makePlaylist(tenSongs), playlist['id'], finalAccess)
                            finalPlaylist.then(final =>{
                                //console.log(final)
                                console.log(playlist.id)
                                res.send({'playlist_id':playlist.id,'user_id': id['id']})

                            })
                        })
                    })
            })




    //     var y = topTen(access_token)
    //         y.then(top_songs => {
    //             //console.log(top_songs)
    //             let top_10_uris = makePlaylist(top_songs);
    //             res.send({data:top_10_uris});
    // })


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
            //console.log(body);
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
            //console.log(body);
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
            //console.log(body);
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

// var x = spotifunkRocks('AQDkcEWI0LY8KA8GuxvubvdGv3b-sHiZDKPzu-Va3LNplAI0_LpclhgVyJizE_yDy-rLrq48XtjF6oXVzTPIjDDPEk60oSkXoCivtGfwTTK8KahdrUPdOsrqNkf__BoPZLbALA')
// x.then(access_token => {
//     //console.log(access_token)
//     var y = topTen(access_token)
//     y.then(top_songs => {
//         console.log(top_songs)
//         console.log(makePlaylist(top_songs));
//     })
//
// })



function makePlaylist(x) {
    let obj = JSON.parse(x);
    var items = obj['items'];
    //console.log(items);
    var uris = [];
    for (var i = 0; i < obj['total']; i++){
        var currUri = items[i]['uri'];
        console.log(currUri)
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
