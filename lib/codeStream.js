var child_process = require('child_process')
  , fs = require('fs')
  , util = require('util')
  , file = 'src/app.js'
  , events = require('events')
  ;
var is = fs.createReadStream(file, {
  encoding: 'utf-8',
  flags: 'r'
});
var cache = '';

function CodeStream() {
  events.EventEmitter.call(this);
}
util.inherits(CodeStream, events.EventEmitter);

var codeStream = new CodeStream();

code();
function code(socket) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      return console.err(err);
    }
    if (data !== cache) {
      cache = data;
      codeStream.emit('code', data);
    }
    code();
  });
}


module.exports = codeStream;
