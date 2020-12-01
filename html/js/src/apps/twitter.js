import App from '../app';
import Config from '../config';
import Utils from '../utils';
import Data from '../data';

var tweets = null;

$('#new-tweet').on('submit', function(e) {
    e.preventDefault();

    let data = $(this).serializeArray();

    let tweet = {
        author: 'PleaseWork',
        message: data[0].value,
        time: Date.now()
    }

    tweets.push(tweet);
    Data.StoreData('tweets', tweets);

    var pattern = /\B@[a-z0-9_-]+/gi;
    let mentions = tweet.message.match(pattern);
    $.each(mentions, function(index2, mention) {
        tweet.message = tweet.message.replace(mention, `<span class="mention" data-mention="${mention.replace('@', '')}">${mention}</span>`);
    });

    pattern = /\B#[a-z0-9_-]+/gi;
    let hashtags = tweet.message.match(pattern);
    $.each(hashtags, function(index2, hashtag) {
        tweet.message = tweet.message.replace(hashtag, `<span class="hashtag" data-hashtag="${hashtag.replace('#', '')}">${hashtag}</span>`);
    });

    $.post(Config.ROOT_ADDRESS + '/NewTweet', JSON.stringify({
        message: data[0].value,
        mentions: mentions,
        hashtags: hashtags
    }), function(status) {
        if (status) {

        } else {
            
        }
    })

    $('.twitter-body').prepend(`
        <div class="tweet">
            <div class="avatar other-${tweet.author[0].toString().toLowerCase()}">${tweet.author[0]}</div>
            <div class="author">${tweet.author}</div>
            <div class="body">${tweet.message}</div>
            <div class="time" data-tooltip="${moment().format('MM/DD/YYYY')} ${moment().format('hh:mmA')}">${moment().fromNowOrNow()}</div>
        </div>`
    );

    $('.twitter-body .tweet:first-child .time').tooltip( {
        enterDelay: 0,
        exitDelay: 0,
        inDuration: 0,
    });

    $('.twitter-body .tweet:first-child').data('data', tweet);

    var modal = M.Modal.getInstance($('#send-tweet-modal'));
    modal.close();
    $('#new-tweet-msg').val('');
    M.toast({html: 'Tweet Sent'});
})

$('.twitter-body').on('click', '.tweet .mention', function() {
    let user = $(this).data('mention');

    $('#new-tweet-msg').val('@' + user + ' ');

    var modal = M.Modal.getInstance($('#send-tweet-modal'));
    modal.open();
});

function SetupTwitter() {
    tweets = Data.GetData('tweets');

    if (tweets == null) {
        tweets = new Array();
    }

    tweets.sort(Utils.DateSortOldest);

    $('.twitter-body').html('');
    $.each(tweets, function(index, tweet) {

        var pattern = /\B@[a-z0-9_-]+/gi;
        let data = tweet.message.match(pattern);
        $.each(data, function(index2, mention) {
            tweet.message = tweet.message.replace(mention, `<span class="mention" data-mention="${mention.replace('@', '')}">${mention}</span>`);
        });

        pattern = /\B#[a-z0-9_-]+/gi;
        data = tweet.message.match(pattern);
        $.each(data, function(index2, hashtag) {
            tweet.message = tweet.message.replace(hashtag, `<span class="hashtag" data-hashtag="${hashtag.replace('#', '')}">' + hashtag + '</span>`);
        });

        pattern = /https?[^<"]+/g;
        data = tweet.message.match(pattern);
        $.each(data, function(index2, hashtag) {
            console.log(hashtag);
            //tweet.message = tweet.message.replace(hashtag, `<span class="hashtag" data-hashtag="${hashtag.replace('#', '')}">' + hashtag + '</span>`);
        });

        

        $('.twitter-body').prepend(`
            <div class="tweet">
                <div class="avatar other-${tweet.author[0].toString().toLowerCase()}">${tweet.author[0]}</div>
                <div class="author">${tweet.author}</div>
                <div class="body">${tweet.message}</div>
                <div class="time" data-tooltip="${moment(tweet.time).format('MM/DD/YYYY')} ${moment(tweet.time).format('hh:mmA')}">${moment(tweet.time).fromNowOrNow()}</div>
            </div>`
        );

        $('.twitter-body .tweet:first-child .time').tooltip( {
            position: top
        });
        $('.twitter-body .tweet:first-child').data('data', tweet);
    });
}

export default { SetupTwitter }