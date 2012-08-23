$(document).ready(function(){

    //app-info section effect.
    $('.icon-info-sign').click(function(){  
        if($('#app-info').width() === 30) { 
          $('#app-info').animate({width: '400px'}, 400); 
        } else {
          $('#app-info').animate({width: '30px'}, 400); 
        }
    });

    //Establish Socket.IO connection to keep receiving new song message. 
    var socket = io.connect('http://exp.nnusunn.jp:3000');
    socket.on('new_song', function (data) {
        showLoading();
        setTimeout(function() {
            displaySong(data);
        }, 1500);
    });

});

function displaySong(tweet) {
    tweet.match(/\u266c\s(.+)\s-\s(.+)\s\u266c/);
    song_title = RegExp.$2.replace('&amp;', '&'); 
    artist = RegExp.$1.replace('&amp;', '&'); 
    if (song_title !== '' || artist !== '') {
        song_info = '\u266c ' + song_title + ' (by ' + artist + ') \u266c'; 
        $('#song-info-text').text(song_info);
        song_info_url = song_info.replace('&', '%26');
        fixed_text = ' is now playing on GrooveSalad, SomaFM. Tune in to the cool song now!';
        url = 'http%3A%2F%2Fsoma.fm%2Fgroovesalad.pls'; 
        $('#tw').attr('href','https://twitter.com/intent/tweet?source=tweetbutton&url=' + url + '&text=' + song_info_url + fixed_text);
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
