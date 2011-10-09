var log = console.log
  , io = require('socket.io')
  , config = require('config')
  ;

var port = config.development.socket.port;

io = io.listen(port);
io.sockets.on('connection', function(socket) {
  socket.on('disconnect', function() {
    log('disconnected');
  });

  socket.on('go', function(to) {
    socket.broadcast.emit('go', to);
  });
});

