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
};

// Twitter Streaming API
const tw_stream_api = {
    host : 'stream.twitter.com',
    port : 443,
    method: 'POST',
    path : '/1/statuses/filter.json?follow=6681342', //@groovesalad ID.
    auth : 'dummy5123:qwerty12'
};

//sockets counter.
var clientCount = 0;


//Add listener.
io.sockets.on('connection', function (socket) {
  util.log('A user connected. current sockets: ' + ++clientCount);

  //push tweet text from Twitter REST API for initial display.
  pushTweetText(tw_rest_api);
  //...and keep pushing tweet text from Twitter Stream API.
  pushTweetText(tw_stream_api);

  socket.on('disconnect', function () {
    util.log('A user disconnected. current sockets:' + --clientCount);
  });
  

});

hunction pushTweetText(api_request_options) {
  //get tweets by accessing Twitter API..
  var req = https.request(api_request_options, function(res) {
    util.log('Twitter API response code: ' + res.statusCode);
  });

  req.on('response', function(res) {
    res.on('data', function(chunk) {
        if(chunk.length > 2) { 
            util.log('Twitter API response body' + chunk);
            var data = JSON.parse(chunk); 
            if (util.isArray(data)) {
                //Twitter REST API returns array of tweets, get first one.
                data = data[0]; 
            }
            if ('text' in data) { 
                //push tweet text to clients. 
                io.sockets.emit('new_song', data.text);
            }
        }
    });
  });

  req.on('error', function(err){
    util.log('Request Error: ' + err); 
  });
  
  req.end();
}
