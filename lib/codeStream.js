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
var app = process.argv[2] ? process.argv[2] : '../sample/app.js',
    question1 = '../sample/question1',
    question2 = '../sample/question2';

var appStream = new CodeStream(app),
    question1Stream = new CodeStream(question1),
    question2Stream = new CodeStream(question2),
    codeCache = '';

// start to read files
appStream.readCode();
question1Stream.readCode();
question2Stream.readCode();

socket.on('connect', function() {
  appStream.on('code', function(data) {
    var patch = make_patch(codeCache, data);
    codeCache = data;
    socket.emit('app', patch);
  });

  question1Stream.on('code', function(data) {
    socket.emit('empty1', data);
  });

  question2Stream.on('code', function(data) {
    socket.emit('empty2', data);
  });
});
