var log = console.log.bind(console);
// Client
var host = location.host
  , port = 3000
  , url = 'http://' + host + ':' + port;

var socket = io.connect(url);

socket.on('connect', function() {
  log('connect');
  // move slide
  socket.on('go', function(to) {
    $.deck('go', to);
  });

  socket.on('disconnect', function() {
    log('disconnected');
  });
});

$(function() {
  $(document).bind('deck.change', function(event, from, to) {
    if (from != to) socket.emit('go', to);
  });
});
