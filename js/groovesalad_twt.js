$(document).ready(function(){
        setInterval(function(){
                        if ($('#msg').text().length > 7) {
                            $('#msg').text('->');
                        } else {
                            $('#msg').text('-' + $('#msg').text()) ;
                        }
                    }, 50);
        resource_url = 'http://api.twitter.com/1/statuses/user_timeline.json?callback=?';
        $.getJSON(
            resource_url, 
            {count:1, screen_name: 'groovesalad'}, 
            function(data){
                data[0].text.match(/\u266c\s(.+)\s-\s(.+)\s\u266c/);
                var song_info = '\u266c ' + RegExp.$2 + ' by ' + RegExp.$1 + ' \u266c'; 
                song_info = song_info.replace('&amp;', '%26');
                var fixed_text = ' is now playing on GrooveSalad, SomaFM. Tune in to the cool song now!';
                var url = 'http%3A%2F%2Fsoma.fm%2Fgroovesalad.pls'; 
                location.href='https://twitter.com/intent/tweet?source=tweetbutton&url=' + url + '&text=' + song_info + fixed_text;
            }
        );
});
