var log = console.log;
var express = require('express'),
    env = process.env.NODE_ENV,
    config = require('./config/' + (env ? env : 'default') + '.json'),
    crypto = require('crypto'),
    port = config.static.port;

var RedisStore = require('connect-redis')(express),
    // MemoryStore = express.session.MemoryStore,
    sessionStore = module.exports.sessionStore = new RedisStore();

var app = module.exports.app = express.createServer();

function pass(pass) {
  return crypto.createHash('sha1').update(pass).digest('hex');
}

// Configuration

app.configure(function() {
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.secret.pass,
    store: sessionStore
  }));
  app.use(express.logger());
  app.use(app.router);
  app.use(express.static(__dirname));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res) {
  res.redirect('index.html');
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
      pass(req.body.pass) === config.secret.pass) {
    req.session.admin = true;
  }
  res.redirect('/');
});

//if(require.main === module) {
  app.listen(port);
  console.log('Express server listening on port %d in %s mode'
              , app.address().port, app.settings.env);
//}
