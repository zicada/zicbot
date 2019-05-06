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
    }
    console.log(event.user.nick, event.message)
});

client.on('message', function (event) {
    console.log(event.user.nick, event.message)
});

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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}