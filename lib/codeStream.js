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
  this.readCode();
}
util.inherits(CodeStream, events.EventEmitter);

CodeStream.prototype.readCode = function() {
  fs.readFile(this.file, 'utf8', function(err, data) {
    if (err) {
      return console.error(err);
    }
    if (data !== this.cache) {
      this.emit('code', data);
      // if data is empty, send to empty flg instead of patch
      // var patch = (data === '') ? 'empty' : make_patch(this.cache, data);
      // this.emit('patch', patch);
      this.cache = data;
    }
    setTimeout(function() {
      this.readCode();
    }.bind(this), 500);
  }.bind(this));
};

module.exports = CodeStream;

// new stream obj with target file
var app = './app.js',//app = '../sample/app.js',
    routes = '../sample/routes/index.js',
    socketserver = '../sample/server.js',
    client = '../sample/public/javascripts/client.js',
    layout = '../sample/views/layout.jade',
    index = '../sample/views/index.jade',
    question1 = '../sample/question1',
    question2 = '../sample/question2';

var appStream = new CodeStream(app),
    routesStream = new CodeStream(routes),
    socketserverStream = new CodeStream(socketserver),
    clientStream = new CodeStream(client),
    layoutStream = new CodeStream(layout),
    indexStream = new CodeStream(index),
    question1Stream = new CodeStream(question1),
    question2Stream = new CodeStream(question2);

socket.on('connect', function() {
  appStream.on('code', function(data) {
    socket.emit('appStream000', data);
  });

  routesStream.on('code', function(data) {
    socket.emit('routesStream000', data);
  });

  socketserverStream.on('code', function(patch) {
    socket.emit('socketserverStream000', patch);
  });

  clientStream.on('code', function(data) {
    socket.emit('clientStream000', data);
  });

  layoutStream.on('code', function(data) {
    socket.emit('layoutStream000', data);
  });

  indexStream.on('code', function(data) {
    socket.emit('indexStream000', data);
  });

  question1Stream.on('code', function(data) {
    socket.emit('empty1Stream000', data);
  });

  question2Stream.on('code', function(data) {
    socket.emit('empty2Stream000', data);
  });
});
