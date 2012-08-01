$(document).ready(function(){
        interval_id = setInterval(function(){
                            if ($('#arrow').text().length > 9) {
                                $('#arrow').text('->');
                            } else {
                                $('#arrow').text('-' + $('#arrow').text()) ;
                            }
                       }, 40);
        resource_url = 'http://api.twitter.com/1/statuses/user_timeline.json?callback=?';
        //$('#tw-icon').click(function(){$(window).unload( function () { alert("Bye now!"); } );})
        $.getJSON(
            resource_url, 
            {count:1, screen_name: 'groovesalad'}, 
            function(data){
                data[0].text.match(/\u266c\s(.+)\s-\s(.+)\s\u266c/);
                var song_title = RegExp.$2.replace('&amp;', '&'); 
                var artist = RegExp.$1.replace('&amp;', '&'); 
                if (song_title !== '' || artist !== '') {
                    var song_info = '\u266c ' + song_title + ' (by ' + artist + ') \u266c'; 
                    var song_info_url = song_info.replace('&', '%26');
                    var fixed_text = ' is now playing on GrooveSalad, SomaFM. Tune in to the cool song now!';
                    var url = 'http%3A%2F%2Fsoma.fm%2Fgroovesalad.pls'; 
                    $('#tw').attr('href','https://twitter.com/intent/tweet?source=tweetbutton&url=' + url + '&text=' + song_info_url + fixed_text);
                    //$('#tw').text(song_info);
                    $('#tw').text('Tweet song!');
                    $('#tw-icon').css('backgroundImage', 'url(/scripts/groovesalad_twt/img/tw-blue.png)');
                    clearInterval(interval_id);
                    $('#arrow').text('-------->');
                    $('#arrow').css('color', '#19BBF2');
                }
            }
        );
});
