var log = console.log.bind(console);
// Client
var host = document.domain
  , port = 4000
  , url = 'http://' + host + ':' + port;

var socket = io.connect(url);

socket.on('connect', function() {
  log('connect');
  // move slide
  socket.on('go', function(to) {
    $.deck('go', to);
  });

  $(document).bind('deck.change', function(event, from, to) {
    if (from != to) socket.emit('go', to);
  });

  socket.on('code', function(data) {
    codeRender(data);
  });

  socket.on('disconnect', function() {
    log('disconnected');
  });
});

$(function() {
});

function codeRender(data) {
  var $code = $('#code');
  $code.text(data);
  sh_highlightDocument('lang/', '.js');
}
