//Load modules.
var https = require('https');
var io = require('socket.io').listen(3000);
var util = require('util');

// Twitter REST API
const tw_rest_api = {
    host : 'api.twitter.com',
    port : 443,
    method: 'GET',
    path : '/1/statuses/user_timeline.json?screen_name=groovesalad&count=1'
    //path : '/1/statuses/user_timeline.json?screen_name=hipnosis6666&count=1' //for testing
};

// Twitter Streaming API
const tw_stream_api = {
    host : 'stream.twitter.com',
    port : 443,
    method: 'POST',
    path : '/1/statuses/filter.json?follow=6681342', //@groovesalad ID.
    //path : '/1/statuses/filter.json?follow=223076456', //@hipnosis6666(test account)
    auth : 'dummy5123:qwerty12'
};

//sockets counter.
var clientCount = 0;

//Add listener.
io.sockets.on('connection', function (socket) {
    util.log('A user connected. current sockets: ' + ++clientCount);

    //Get newest tweeted text from Twitter REST API 
    //and push it to the connected socket. 
    pushTweetedText(tw_rest_api, socket);

    socket.on('disconnect', function () {
        util.log('A user disconnected. current sockets:' + --clientCount);
    });
});

//Reqest Twitter Stream API and keep pushing tweeted text.
pushTweetedText(tw_stream_api);


function pushTweetedText(api_request_options, socket) {
    //Get tweets by accessing Twitter API..
    var req = https.request(api_request_options, function(res) {
        util.log('Twitter API response code: ' + res.statusCode);
    });

    req.on('response', function(res) {
        res.on('data', function(chunk) {
            if(chunk.length > 2) { 
            //Twitter Stream API sometimes sends just a blank line with '\r\n'. 
            //Avoid parsing as a JSON. 
            
                util.log('Twitter API response body' + chunk);

                try {
                    var data = JSON.parse(chunk); 
                } catch (e) {
                    //Push newest tweet from REST API in case Sream API sends 
                    //broken JSON data.
                    pushTweetedText(tw_rest_api);
                    if (e.message && e.name) {
                        util.log('Caught Javascript Exception: [' + e.name + ']'); 
                    } else {
                        util.log('Caught Javascript Error: [' + e + ']');
                    }
                    return;
                }
                if (util.isArray(data)) {
                    //Twitter REST API returns array of tweets, get first one.
                    data = data[0]; 
                }
                if ('text' in data) { 
                    if (typeof(socket) == 'undefined') {
                        //push tweeted text to all socket. 
                        io.sockets.emit('new_song', data.text);
                    } else {
                        //push tweeted text to a specific socket. 
                        socket.emit('new_song', data.text);
                    }
                }
            }
        });
    });

    req.on('error', function(err){
        util.log('Request Error: ' + err); 
    });

    req.end();
}
