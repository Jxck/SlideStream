var readline = require('readline'),
  spawn = require('child_process').spawn,
  fs = require('fs'),
  path = require('path'),
  env = process.env.NODE_ENV,
  config = require('../config/' + (env ? env : 'default') + '.json'),
  host = config.socket.host,
  port = config.socket.port,
  socket = require('socket.io-client').connect('http://' + host + ':' + port),
  log = console.log,
  rl = readline.createInterface(process.stdin, process.stdout);
  prefix = 'Jxck$ ';

var worker;

rl.on('line', function(line) {
  socket.emit('readline', prefix + line + '\n');

  var lines = line.split(' ');
  var command = lines.shift();
  worker = spawn(command, lines);

  worker.stdout.on('data', function(rawdata) {
    var data = rawdata.toString().trim().replace(/\n(\s)*/g, '\n'); // triming
    data = data.replace('production', 'development'); // force output to development mode
    console.log(data);
    data = data.replace(/\[\w*?m/g, '');
    socket.emit('readline', data + '\n');
  });

  worker.stderr.on('data', function(rawdata) {
    var data = rawdata.toString().trim();
    console.error(data);
    socket.emit('readline', data + '\n');
  });

  worker.on('exit', function(code, signal) {
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
  });
}).on('close', function() {
  if (worker) worker.kill();
  process.exit(0);
});

rl.setPrompt(prefix, prefix.length);
rl.prompt();
