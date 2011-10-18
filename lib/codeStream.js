var child_process = require('child_process'),
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    log = console.log;

function CodeStream(file) {
  this.file = file;
  this.cache = '';
  events.EventEmitter.call(this);
}
util.inherits(CodeStream, events.EventEmitter);

CodeStream.prototype.readCode = function() {
  fs.readFile(this.file, 'utf8', function(err, data) {
    if (err) {
      return console.error(err);
    }
    if (data !== this.cache) {
      this.cache = data;
      this.emit('code', data);
    }
    this.readCode();
  }.bind(this));
};

module.exports = CodeStream;

// new stream obj with target file
var make_patch = require('./diff_launch').make_patch;
var codeStream = new CodeStream(process.argv[2]),
    codeCache = '';

var env = process.env.NODE_ENV,
  config = require('../config/' + (env ? env : 'default') + '.json'),
  host = config.socket.host,
  port = config.socket.port,
  socket = require('socket.io-client').connect('http://' + host + ':' + port);

// start to read files
codeStream.readCode();

codeStream.on('code', function(data) {
  var patch = make_patch(codeCache, data);
  codeCache = data;
  socket.volatile.emit('code', patch);
});
