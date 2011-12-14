log = console.log;
var io = require('socket.io'),
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
  , 'xhr-polling'
  , 'htmlfile'
  , 'jsonp-polling'
  ]);
  io.set('browser client minification', true);
  io.set('browser client gzip', true);
});

io.configure('development', function() {
  io.set('transports', ['websocket']);
});

var viewer = 0;

io.sockets.on('connection', function(socket) {
  viewer++;
  socket.broadcast.emit('viewer', viewer);
  socket.on('disconnect', function() {
    viewer > 2 ? viewer--: false;
    socket.broadcast.emit('viewer', viewer);
    log('disconnected');
  });

  // move slide by admin
  socket.on('go', function(to) {
    if (!socket.handshake.session) return false;
    if (!socket.handshake.session.admin) return false;
    socket.broadcast.emit('go', to);
  });

  // realtime commandline
  socket.on('readline', function(data) {
    socket.volatile.broadcast.emit('result', data);
  });

  // realtime coding
  socket.on('appStream000', function(data) {
    socket.volatile.broadcast.emit('app', data);
  });

  socket.on('routesStream000', function(data) {
    socket.volatile.broadcast.emit('routes', data);
  });

  socket.on('socketserverStream000', function(data) {
    socket.volatile.broadcast.emit('socketserver', data);
  });

  socket.on('clientStream000', function(data) {
    socket.volatile.broadcast.emit('client', data);
  });

  socket.on('layoutStream000', function(data) {
    socket.volatile.broadcast.emit('layout', data);
  });

  socket.on('indexStream000', function(data) {
    socket.volatile.broadcast.emit('index', data);
  });

  socket.on('review', function(data) {
    socket.volatile.emit('review', data);
    socket.volatile.broadcast.emit('review', data);
  });

  // realtime questions
  socket.on('empty1Stream000', function(data) {
    socket.volatile.broadcast.emit('empty1', data);
  });

  socket.on('empty2Stream000', function(data) {
    socket.volatile.broadcast.emit('empty2', data);
  });
});

process.on('uncaughtException', function(err) {
  console.error('uncoughtException: ' + err);
});
