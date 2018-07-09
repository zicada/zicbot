var m = require('mitsuku-api')();

m.send("whats up")
.then(function (response) {
    console.log(response.split('ku:').pop());
});