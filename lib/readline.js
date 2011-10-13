var readline = require('readline'),
  spawn = require('child_process').spawn,
  fs = require('fs'),
  path = require('path'),
  log = console.log,
  rl = readline.createInterface(process.stdin, process.stdout);
  result = 'result',
  prefix = '$ ';

var worker;

if (!path.existsSync(result)) result = '../result';
var stream = fs.createWriteStream(result, {flags: 'a'});

rl.on('line', function(line) {
  stream.write(prefix + line + '\n');

  var lines = line.split(' ');
  var command = lines.shift();
  worker = spawn(command, lines);

  worker.stdout.on('data', function(rawdata) {
    var data = rawdata.toString().trim().replace(/\n(\s)*/g, '\n'); // triming
    console.log(data);
    data = data.replace(/\[\w*?m/g, '');
    stream.write(data);
    stream.write('\n');
  });

  worker.stderr.on('data', function(rawdata) {
    var data = rawdata.toString().trim();
    console.log(data);
    stream.write(data);
  });

  worker.on('exit', function(code, signal) {
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
  });
}).on('close', function() {
  if (worker) worker.kill();
  stream.destroySoon();
  process.exit(0);
});

rl.setPrompt(prefix, prefix.length);
rl.prompt();
