/* let env = process.env.NODE_ENV || 'production';*/
let env = process.env.NODE_ENV || 'production'

let config = require('./config')[env];
let client = require('coffea')(config.IRC_OPTIONS)

client.on('command', function (event) {
    switch (event.cmd) {
        case 'google':
            postGoogleLink(event, config.GOOGLE_OPTIONS.wild)
            break;
        case 'ping':
            event.reply('pong')
            break;
        case 'hs':
            postHsData(event)
            break;
    }
    console.log(event.channel.name, event.user.nick, event.message)
});

client.on('message', function (event) {
    if (event.message.includes(config.IRC_OPTIONS.nick + ":")) {
        postMitsuku(event)
    }
    if (Math.random() < config.LUCK_FACTOR) {
        postHsData(event)
    }
    console.log(event.channel.name, event.user.nick, event.message)
});

function postMitsuku(event) {
    let m = require('mitsuku-api')();
    m.send(event.message.replace(config.IRC_OPTIONS.nick, ''))
        .then(function (response) {
            response.length > 4 ? event.reply(response.split('uku:').pop()) : event.reply(config.DICK_REPLY)
        });
}

function postGoogleLink(event, wild = 2) {
    let google = require('google')
    google.resultsPerPage = config.GOOGLE_OPTIONS.resultsPerPage
    google(event.args, function (error, res) {
        if (error) event.reply(config.ERROR_MSG + " " + error)
        for (let i = 0; i < wild; ++i) {
            let link = res.links[getRandomInt(wild)];
            if (link && link.href) {
                event.reply(link.href);
                break;
            } else {
                event.reply(config.DICK_REPLY)
                break;
            }
        }
    })
}

function postHsData(event) {
    let Request = require("request")
    Request.get(config.URL + config.USERNAME + config.TOKEN, (error, response, body) => {
        let total = JSON.parse(body).history.length
        if (error) {
            event.reply(config.ERROR_MSG + " " + error)
        }
        event.reply("<< Wirum HS standings! (again) >> \nCurrent rank: "
            + getRank(JSON.parse(body))
            + ", Current win percentage: "
            + getWinRatio(JSON.parse(body), total)
            + "%, Games played: "
            + total)
    });
}

function getWinRatio(data, total) {
    let wins = 0
    if (data) {
        for (d of data.history) {
            if (d['result'] === 'win')
                wins++
        }
        return ((wins / total) * 100).toFixed(2)
    }
    return 0;
}

function getRank(data) {
    // TODO: make sure we're sorted and that the last object in the array is the latest and thus has the correct rank property.
    if (data) {
        let result = data.history.pop()
        return result['rank']
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}