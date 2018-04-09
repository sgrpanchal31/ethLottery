"use strict";
const  fs    = require('fs'),
        http = require("http");
console.log(__dirname);

http.createServer(function (request, response) {
  fs.createReadStream(`${__dirname}/src/index.html`}.pipe(response);
}).listen(8000);

console.log('Listening on port 8000.');