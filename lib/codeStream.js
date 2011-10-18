var child_process = require('child_process'),
    fs = require('fs'),
    util = require('util'),
    events = require('events'),
    log = console.log;

var make_patch = require('./diff_launch').make_patch,
    env = process.env.NODE_ENV,
    config = require('../config/' + (env ? env : 'default') + '.json'),
    host = config.socket.host,
    port = config.socket.port,
    socket = require('socket.io-client').connect('http://' + host + ':' + port);

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

var codeStream = new CodeStream(process.argv[2]),
    codeCache = '';

// start to read files
codeStream.readCode();

socket.on('connect', function() {
  codeStream.on('code', function(data) {
    var patch = make_patch(codeCache, data);
    codeCache = data;
    socket.emit('code', patch);
  });
});
