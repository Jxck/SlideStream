var readline = require('readline'),
  spawn = require('child_process').spawn,
  fs = require('fs'),
  log = console.log,
  rl = readline.createInterface(process.stdin, process.stdout);
  prefix = '> ';

var worker;
var buf = [];

rl.on('line', function(line) {
  if (line == 'stop') worker.kill('SIGHUP');
  var lines = line.split(' ');
  var command = lines.shift();
  worker = spawn(command, lines);
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();

  worker.stdout.on('data', function(rawdata) {
    var data = rawdata.toString().trim();
    buf.push(data);
    if (buf.length > 12) {
      buf.shift();
    }
    fs.writeFile('src/result', buf.join('\n'), function(err) {
      if (err) throw err;
    });
    console.log(data);
  });

  worker.stderr.on('data', function(rawdata) {
    var data = rawdata.toString().trim();
    console.log(data);
  });

  worker.on('exit', function(code, signal) {
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
  });
}).on('close', function() {
  worker.kill();
  process.exit(0);
});

rl.setPrompt(prefix, prefix.length);
rl.prompt();
