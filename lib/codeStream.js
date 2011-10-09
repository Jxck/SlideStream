var child_process = require('child_process')
  , fs = require('fs')
  , util = require('util')
  , events = require('events')
  ;

function CodeStream(file) {
  this.file = file || 'src/app.js';
  this.cache = '';
  events.EventEmitter.call(this);
}
util.inherits(CodeStream, events.EventEmitter);

CodeStream.prototype.readCode = function() {
  fs.readFile(this.file, 'utf8', function(err, data) {
    if (err) {
      return console.err(err);
    }
    if (data !== this.cache) {
      this.cache = data;
      this.emit('code', data);
    }
    this.readCode();
  }.bind(this));
};

CodeStream.prototype.readResult = function() {
  fs.readFile(this.file, 'utf8', function(err, data) {
    if (err) {
      return console.err(err);
    }
    if (data !== this.cache) {
      this.cache = data;
      this.emit('code', data);
    }
    this.readCode();
  }.bind(this));
};


module.exports = CodeStream;
