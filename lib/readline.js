var readline = require('readline'),
  spawn = require('child_process').spawn,
  fs = require('fs'),
  path = require('path'),
  log = console.log,
  rl = readline.createInterface(process.stdin, process.stdout);
  result = 'result',
  prefix = '> ';

var worker;
var buf = [],
    bufstr = '';

if (!path.existsSync(result)) result = '../result';

rl.on('line', function(line) {
  buf.push(prefix + line);
  var lines = line.split(' ');
  var command = lines.shift();
  worker = spawn(command, lines);
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();

  worker.stdout.on('data', function(rawdata) {
    var data = rawdata.toString().trim().replace(/\n(\s)*/g, '\n'); // triming
    console.log(data);
    data = data.replace(/\[\w*?m/g, '').split('\n'); // remove like '[33m'
    buf = buf.concat(data); // merge
//    buf = buf.length > 12 ? buf.slice(buf.length - 12) : buf; // trim to 12 lines
    bufstr = buf.join('\n');
    fs.writeFile(result, bufstr, function(err) {
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
