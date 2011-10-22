var log = console.log,
    io = require('socket.io'),
    parseCookie = require('connect').utils.parseCookie,
    app = require('./static.server.js').app,
    sessionStore = require('./static.server.js').sessionStore,
    make_patch = require('./lib/diff_launch').make_patch;

io = io.listen(app);

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
  io.set('log level', 1);
  io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.configure('development', function() {
  io.set('transports', ['websocket']);
});

var resultCache = '',
    codeCache = '';

io.sockets.on('connection', function(socket) {
  socket.on('disconnect', function() {
    log('disconnected');
  });

  // move slide by admin
  socket.on('go', function(to) {
    if (!socket.handshake.session) return false;
    if (!socket.handshake.session.admin) return false;
    socket.broadcast.emit('go', to);
  });

  // realtime coding
  socket.on('app', function(data) {
    socket.volatile.emit('app', data);
    socket.volatile.broadcast.emit('app', data);
  });

  // realtime commandline
  socket.on('readline', function(data) {
    socket.volatile.emit('result', data);
    socket.volatile.broadcast.emit('result', data);
  });

  socket.on('empty1', function(data) {
    socket.volatile.emit('empty1', data);
    socket.volatile.broadcast.emit('empty1', data);
  });

  socket.on('empty2', function(data) {
    socket.volatile.emit('empty2', data);
    socket.volatile.broadcast.emit('empty2', data);
  });
});
