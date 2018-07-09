var client = require('coffea')({
    host: 'irc.freenode.net',
    port: 6667, // default value: 6667
    ssl: false, // set to true if you want to use ssl
    ssl_allow_invalid: false, // set to true if the server has a custom ssl certificate
    prefix: '!', // used to parse commands and emit on('command') events, default: !
    channels: ['#planet.e'], // autojoin channels, default: []
    nick: 'zicbot', // default value: 'coffea' with random number
    username: 'zicbot', // default value: username = nick
    realname: 'zicbot', // default value: realname = nick
    //pass: 'dildo23', // by default no password will be sent
    /*nickserv: {
        username: 'test',
        password: 'l33tp455w0rD'
    },*/
    throttling: 250 // default value: 250ms, 1 message every 250ms, disable by setting to false
});

var google = require('google')
google.resultsPerPage = 10

client.on('command', function (event) {
    switch (event.cmd) {
        case 'google':
            google(event.args, function (err, res) {
                if (err) console.error(err)
                for (var i = 0; i < res.links.length; ++i) {
                    var link = res.links[i];
                    if (link.href) {
                        event.reply(link.href);
                        break;
                    } else {
                        continue;
                    }
                }
            })
            break;
        case 'ping':
            event.reply('pong');
            break;
    }
    console.log(event.channel.name, event.user.nick, event.message);
});



client.on('message', function (event) {
    if (event.message.includes("zicbot:")) {
        var m = require('mitsuku-api')();
        m.send(event.message.replace('zicbot:', ''))
            .then(function (response) {
                event.reply(response.split('uku:').pop())
            });
    }
    console.log(event.channel.name, event.user.nick, event.message);
});