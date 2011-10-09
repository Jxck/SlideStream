var log = console.log;
var express = require('express')
  , config = require('config')
  ;


// defaults
var host = config.static.host || 'localhost';
var port = config.static.port || 3000;

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
  res.send(req.session.admin || false);
});

app.get('/admin', function(req, res) {
  res.send('<form method="POST" action="/admin">'
           + '<input type="text" name="user"/>'
           + '<input type="password" name="pass"/>'
           + '<input type="submit" value="ok"/>'
           + '</form>');
});

app.post('/admin', function(req, res) {
  req.session.admin = false;
  if (req.body.user === config.secret.user &&
     req.body.pass === config.secret.pass) {
    req.session.admin = true;
  }
  res.redirect('/');
});

app.listen(port);
console.log('Express server listening on port %d in %s mode', app.address().port, app.settings.env);
