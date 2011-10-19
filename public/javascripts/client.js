var log = console.log.bind(console);
// Client
var resultCache = [];

var socket = io.connect();

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
    buildResult('code', data);
  });

  socket.on('result', function(data) {
    resultCache.push(data);
    codeRender('result', resultCache.join(''));
  });

  socket.on('disconnect', function() {
    log('disconnected');
  });

  socket.on('empty1', function(html) {
    insertEmpty('empty1', html);
  });

  socket.on('empty2', function(html) {
    insertEmpty('empty2', html);
  });
});

$(function() {
});

function codeRender(target, data) {
  var $target = $('#' + target);
  $target.text(data);
  if (target === 'code') sh_highlightDocument('lang/', '.js');
  if (target === 'result') sh_highlightDocument('lang/', '.shell');
}

var codeCache = '';
function buildResult(target, patch) {
  var old_text = codeCache;
  var result = apply_patch(old_text, patch);
  codeCache = result;
  codeRender(target, result);
log('result', patch.length);
}

function insertEmpty(target, html) {
  var $target = $('#' + target);
  $target.html(html);
}
