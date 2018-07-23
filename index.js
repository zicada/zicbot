let token = '4Aw_P9-xAvsx7XhPNdQd'
let trackOBotUrl = 'https://trackobot.com/profile/history.json?username=cool-void-terror-8832&token=' + token

let google = require('google')
let client = require('coffea')({
    host: 'irc.freenode.net',
    port: 6667, // default value: 6667
    ssl: false, // set to true if you want to use ssl
    ssl_allow_invalid: false, // set to true if the server has a custom ssl certificate
    prefix: '!', // used to parse commands and emit on('command') events, default: !
    channels: ['#planet.e'], // autojoin channels, default: []
    nick: 'zicbot', // default value: 'coffea' with random number
    throttling: 250 // default value: 250ms, 1 message every 250ms, disable by setting to false
});
google.resultsPerPage = 10


client.on('command', function (event) {
    switch (event.cmd) {
        case 'google':
            google(event.args, function (err, res) {
                if (err) console.error(err)
                for (let i = 0; i < res.links.length; ++i) {
                    let link = res.links[i];
                    if (link.href) {
                        event.reply(link.href);
                        break;
                    }
                }
            })
            break;
        case 'ping':
            event.reply('pong');
            break;
        case 'hs':
            let Request = require("request");
            Request.get(trackOBotUrl, (error, response, body) => {
                if (error) {
                    return console.dir(error)
                }
                function getWinRatio(data) {
                    let winRatio
                    if (data) {
                        let wins = 0
                        let losses = 0
                        let total = data.history.length
                        for (d of data.history) {
                            d['result'] === 'win' ? wins++ : losses++
                        }
                        return winRatio = (wins / total) * 100
                    }
                }
                function getRank(data) {
                    if (data) {
                        let total = data.history.length
                        let result = data.history.pop()
                        return result['rank']
                    }
                }
                event.reply("Current rank: " + getRank(JSON.parse(body)) + ". Current win percentage: " + getWinRatio(JSON.parse(body)).toPrecision(2) + "%");
            });

            break;
    }
    console.log(event.channel.name, event.user.nick, event.message);
});

client.on('message', function (event) {
    if (event.message.includes("zicbot:")) {
        let m = require('mitsuku-api')();
        m.send(event.message.replace('zicbot:', ''))
            .then(function (response) {
                event.reply(response.split('uku:').pop())
            });
    }
    console.log(event.channel.name, event.user.nick, event.message);

});
