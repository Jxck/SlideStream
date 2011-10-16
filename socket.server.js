var log = console.log,
    io = require('socket.io'),
    config = require('config'),
    parseCookie = require('connect').utils.parseCookie,
    sessionStore = require('./static.server.js').sessionStore,
    CodeStream = require('./lib/codeStream'),
    make_patch = require('./lib/diff_launch').make_patch;

var port = config.socket.port;

io = io.listen(port);

io.configure(function() {
  io.set('authorization', function(handshakeData, callback) {
    if (handshakeData.headers.cookie) {
      var cookie = handshakeData.headers.cookie;
      var sessionID = parseCookie(cookie)['connect.sid'];
      // check the express session store
      sessionStore.get(sessionID, function(err, session) {
        if (err) {
          // not found
          callback(err.message, false);
        } else {
          // found
          handshakeData.session = session;
          callback(null, true);
        }
      });
    } else {
      return callback(null, true);
      // socket.io-client from node process dosen't has cookie
      // return callback('Cookie dosen\'t found', false);
    }
  });
});

io.configure('production', function() {
  // io.enable('browser client etag');
  // io.set('log level', 1);

  // io.set('transports', [
  //   'websocket'
  // , 'flashsocket'
  // , 'htmlfile'
  // , 'xhr-polling'
  // , 'jsonp-polling'
  // ]);
});


io.configure('development', function() {
  io.set('transports', ['websocket']);
});

var codeStream = new CodeStream('./sample/app.js'),
    resultStream = new CodeStream('lib/result'),
    resultCache = '';

// start to read files
codeStream.readCode();
resultStream.readResult();

io.sockets.on('connection', function(socket) {
  socket.on('disconnect', function() {
    log('disconnected');
  });

  // move slide by admin
  socket.on('go', function(to) {
    if (!socket.handshake.session.admin) return false;
    socket.broadcast.emit('go', to);
  });

  codeStream.on('code', function(data) {
    socket.volatile.emit('code', data);
  });

  socket.on('readline', function(data) {
    log('server', data);
    socket.volatile.emit('result', data);
    socket.volatile.broadcast.emit('result', data);
  });
});
