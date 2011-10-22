var log = console.log.bind(console);
// Client
var socket = io.connect();

var resultCache = [];

function codeRender(target, data) {
  var $target = $('#' + target);
  $target.text(data);
  if (target === 'app') sh_highlightDocument('lang/', '.js');
  if (target === 'result') sh_highlightDocument('lang/', '.shell');
}

var codeCache = '';
function buildResult(target, patch) {
  var old_text = codeCache;
  var result = patch !== 'empty'? apply_patch(old_text, patch) : '';
  codeCache = result;
  codeRender(target, result);
log('result', patch.length);
}

function insertEmpty(target, html) {
  var $target = $('section.' + target);
  $target.html(html);
}

socket.on('connect', function() {
  log('connect');

  // move slide
  socket.on('go', function(to) {
    $.deck('go', to);
  });
  $(document).bind('deck.change', function(event, from, to) {
    if (from != to) socket.emit('go', to);
  });

  socket.on('app', function(data) {
    buildResult('app', data);
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
  var section_height = $('section').height();
  var h2_height = $('h2').height();
  $('iframe').height(section_height);
  $('pre.sh_javascript, pre.sh_sh').height(section_height - h2_height * 2);
  $('pre.full').height(section_height - h2_height / 2);
});
