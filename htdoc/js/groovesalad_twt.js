$(document).ready(function(){
   
    //app-info section effect.
    $('.icon-info-sign').click(function(){  
        if($('#app-info').width() === 30) { 
          $('#app-info').animate({width: '350px'}, 500); 
          $('#credit').fadeIn(500); 
        } else {
          $('#app-info').animate({width: '30px'}, 500); 
          $('#credit').fadeOut(500); 
        }
    });
     
    //Disable hover effect for iOS.
    if((navigator.userAgent.match(/iPhone/i)) || 
       (navigator.userAgent.match(/iPod/i)) || 
       (navigator.userAgent.match(/iPad/i))) 
    {
        $('#app-info i, #app-info a').click(function(){  
                $(this).css('color', '#575656');
        });
    }
    
    //Load Socket.IO client script.
    var node_server_host = window.location.hostname + ':3000';
    $.getScript('http://' + node_server_host + '/socket.io/socket.io.js')
    .done(function(){
        //Socket.IO client loaded. Establish Socket.IO connection 
        //, and keep receiving new song tweets. 
        var socket = io.connect('http://' + node_server_host);

        socket.on('connect', function (message) {
            console.log('Socket.IO connected.');
        });

        socket.on('new_song', function (message) {
            showLoading();
            setTimeout(function() {
                //deley displaying song info to show 'loading...' effect on purpose. 
                showSongInfo(message);
            }, 1000);
        });

        socket.on('disconnect', function (message) {
            console.log('Socket.IO disconnected.');
            showLoading();
        });
    })
    .fail(function(){
        //Failed to load Socket.IO client. 
        console.log("Error: Node server doesn't seem to be running.");
    });

});

function showSongInfo(tweeted_text) {
    var fixed_tweet_text = ' is now playing on GrooveSalad, SomaFM. Tune in to the cool song now!';
    var play_url = 'http%3A%2F%2Fsoma.fm%2Fplay%2Fgroovesalad'; 

    tweeted_text.match(/\u266c\s(.+)\s-\s(.+)\s\u266c/);
    var song_title = RegExp.$2.replace('&amp;', '&'); 
    var artist = RegExp.$1.replace('&amp;', '&'); 
    if (song_title !== '' || artist !== '') {
        var song_info = '\u266c ' + song_title + ' (by ' + artist + ') \u266c'; 
        //set song info.
        $('#song-info-text').text(song_info);
        //prepare 'Tweet Song!' button.
        tweet_text = song_info.replace('&', '%26') + fixed_tweet_text; //url encoding for '&'.
        $('#tw').attr('href','https://twitter.com/intent/tweet?source=tweetbutton&url=' + play_url + '&text=' + tweet_text);
        $('#tw').text('Tweet song!');
        $('#tw').height(78);
        $('#tw').width(88);
        $('#tw').css('padding', '25px 20px');
        $('#tw-icon').css('backgroundImage', 'url(img/tw-blue.png)');
        $('.loading').hide();
    }
}

function showLoading() {
        $('#song-info-text').text('');
        $('#tw').attr('href','');
        $('#tw').text('');
        $('#tw').height(0);
        $('#tw').width(0);
        $('#tw').css('padding', '0px 0px');
        $('#tw-icon').css('backgroundImage', 'url(img/tw-white.png)');
        $('.loading').show();
}
