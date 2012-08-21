$(document).ready(function(){
        resource_url = 'http://api.twitter.com/1/statuses/user_timeline.json?callback=?';
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
                    $('#song_info').text(song_info);
                    $('.loading').remove();
                    $('#tw').text('Tweet song!');
                    $('#tw').height(78);
                    $('#tw').width(88);
                    $('#tw').css('padding', '25px 20px');
                    $('#tw-icon').css('backgroundImage', 'url(img/tw-blue.png)');
                }
            }
        );

       $('.icon-info-sign').click(function(){  
          if($('#credit').width() === 30) { 
              $('#credit').animate({width: '400px'}, 400); 
          } else {
              $('#credit').animate({width: '30px'}, 400); 
          }
       });
});
