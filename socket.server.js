var log = console.log;
var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket) {
  socket.on('disconnect', function() {
    log('disconnected');
  });

  socket.on('go', function(to) {
    socket.broadcast.emit('go', to);
  });
});

