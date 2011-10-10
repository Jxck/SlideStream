var readline = require('readline'),
  spawn = require('child_process').spawn,
  fs = require('fs'),
  path = require('path'),
  log = console.log,
  rl = readline.createInterface(process.stdin, process.stdout);
  result = 'result',
  prefix = '> ';

var worker;
var buf = [];

if (!path.existsSync(result)) result = '../result';

rl.on('line', function(line) {
  buf.push(prefix + line);
  var lines = line.split(' ');
  var command = lines.shift();
  worker = spawn(command, lines);
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();

  worker.stdout.on('data', function(rawdata) {
    var data = rawdata.toString().trim().replace(/\n(\s)*/g, '\n');
    console.log(data);
    var data = data.replace(/\[\w*?m/g, '');
    buf.push(data);
    if (buf.length > 12) {
      buf.shift();
    }
    fs.writeFile(result, buf.join('\n'), function(err) {
      if (err) throw err;
    });
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
  if (worker) worker.kill();
  process.exit(0);
});

rl.setPrompt(prefix, prefix.length);
rl.prompt();
