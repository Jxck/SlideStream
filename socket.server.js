var log = console.log
  , io = require('socket.io')
  , config = require('config')
  , parseCookie = require('connect').utils.parseCookie
  , sessionStore = require('./static.server.js').sessionStore
  , CodeStream = require('./lib/codeStream')
  ;

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
      return callback('Cookie dosen\'t found', false);
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

var codeStream = new CodeStream('src/app.js')
  , resultStream = new CodeStream('src/result');

io.sockets.on('connection', function(socket) {
  socket.on('disconnect', function() {
    log('disconnected');
  });

  socket.on('go', function(to) {
    if (!socket.handshake.session.admin) return false;
    socket.broadcast.emit('go', to);
  });

  codeStream.on('code', function(data) {
    socket.emit('code', data);
  });

  resultStream.on('code', function(data) {
    socket.emit('result', data);
  });
});
