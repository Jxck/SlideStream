var log = console.log.bind(console);
// Client
var host = document.domain,
    port = 4000,
    url = 'http://' + host + ':' + port,
    resultCache = '';

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

  socket.on('code', function(patch) {
    codeRender('code', data);
  });

  socket.on('result', function(patch) {
    var result = apply_patch(resultCache, patch);
    resultCache = result;
    codeRender('result', result);
  });

  socket.on('disconnect', function() {
    log('disconnected');
  });
});

$(function() {
});

function codeRender(target, data) {
  var $target = $('#' + target);
  $target.text(data);
  sh_highlightDocument('lang/', '.js');
  sh_highlightDocument('lang/', '.shell');
}
