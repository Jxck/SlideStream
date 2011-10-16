var log = console.log.bind(console);
// Client
var host = document.domain,
    port = 4000,
    url = 'http://' + host + ':' + port;

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
    codeRender('code', data);
  });

  socket.on('result', function(patch) {
    buildResult('result', patch);
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

function buildResult(target, patch) {
  var $target = $('#' + target);
  var old_text = $target.text();
  var result = apply_patch(old_text, patch);
  codeRender(target, result);

log('old_text', old_text);
log('result', result);
log('result', patch);
}
