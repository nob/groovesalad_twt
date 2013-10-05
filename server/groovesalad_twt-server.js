/*
 * http://d.hatena.ne.jp/replication/20120318/1332044327
 */

/* jshint strict: false */
//Load modules.
var https = require('https');
var io = require('socket.io').listen(3000);
var util = require('util');
var twitter = require('ntwitter');
//sockets counter.
var clientCount = 0;

var twit = new twitter({
  consumer_key: 'PkSWP5YEO9VMMqbc4C19oQ',
  consumer_secret: 'azTETgrOi2tCBBj3KQTKEkSAYkANYZh2T3HPHwIk',
  access_token_key: '223076456-XKqsu00GTMpM0AyVuYQ4kqQojlnPeys1vMdY1gSK',
  access_token_secret: 'fIVeyymHO8z1uEHt7ARSt7MsqFRJZ1w0mvAjaBCIE'
});

//Add listener.
io.sockets.on('connection', function (socket) {
    util.log('A user connected. current sockets: ' + ++clientCount);

    twit.get('/statuses/user_timeline.json', {'screen_name': 'groovesalad', 'count': '1'}, function(err, data) {
        if (err) {
            util.log('Error received from Twitter REST API: ' + err);
        }
        if (util.isArray(data)) {
            //Twitter REST API returns array of tweets, get first one.
            data = data[0];
            if ('text' in data) {
                //push tweeted text to a specific socket.
                socket.emit('new_song', data.text);
            }
        }
    });

    socket.on('disconnect', function () {
        util.log('A user disconnected. current sockets:' + --clientCount);
    });
});
//Reqest Twitter Stream API and keep pushing tweeted text.
//twit.stream('statuses/filter', {'follow': '223076456'}, function(stream) { //Twitter ID for @hipnosis6666
twit.stream('statuses/filter', {'follow': '6681342'}, function(stream) { //Twitter ID for @groovesalad
  stream.on('data', function (data) {
    util.log('Twitter Stream API response body' + data);
//    if(data.length > 2) {
        //Twitter Stream API sometimes sends just a blank line with '\r\n'.
        //Avoid parsing as a JSON.
/*
        try {
            var data = JSON.parse(data);
        } catch (e) {
*/
/*
            if (e.message && e.name) {
                util.log('Caught Javascript Exception: [' + e.name + ']');
            } else {
                util.log('Caught Javascript Error: [' + e + ']');
            }
            return;
        }
*/
        if ('text' in data) {
            //push tweeted text to all socket.
            io.sockets.emit('new_song', data.text);
        }
//    }
  });
  stream.on('end', function (response) {
    // Handle a disconnection
  });
  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
// Disconnect stream after five seconds
//setTimeout(stream.destroy, 5000);
});
