var log = console.log
  , io = require('socket.io')
  , config = require('config')
  , parseCookie = require('connect').utils.parseCookie
  , sessionStore = require('./static.server.js').sessionStore
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

io.sockets.on('connection', function(socket) {
  socket.on('disconnect', function() {
    log('disconnected');
  });

  socket.on('go', function(to) {
    socket.broadcast.emit('go', to);
  });
});

