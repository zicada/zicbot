let env = process.env.NODE_ENV || 'development';

let config = require('./config')[env];
let client = require('coffea')(config.IRC_OPTIONS)
let google = require('google').resultsPerPage = config.GOOGLE_OPTIONS.resultsPerPage

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
            Request.get(config.URL + config.TOKEN, (error, response, body) => {
                let total = JSON.parse(body).history.length
                if (error) {
                    event.reply("zicada: I broke. This is the error: " + error)
                }

                event.reply("Current rank: " 
                + getRank(JSON.parse(body)) 
                + "\n Current win percentage: " 
                + getWinRatio(JSON.parse(body), total)
                + "%\n Games played: " 
                + total)
            });

            break;
    }
    console.log(event.channel.name, event.user.nick, event.message);
});

client.on('message', function (event) {
    if (event.message.includes("zicbot:")) {
        let m = require('mitsuku-api')();
        m.send(event.message.replace(config.IRC_OPTIONS.nick, ''))
            .then(function (response) {
                event.reply(response.split('uku:').pop())
            });
    }
    console.log(event.channel.name, event.user.nick, event.message);
});

function getWinRatio(data, total) {
    let wins = 0
    if (data) {
        for (d of data.history) {
            if(d['result'] === 'win') 
                wins++
        }
        return ((wins / total) * 100).toFixed(2)
    }
    return 0;
}

function getRank(data) {
    if (data) {
        let result = data.history.pop()
        return result['rank']
    }
}
