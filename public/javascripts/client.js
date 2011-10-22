var log = console.log.bind(console);
// Client
var socket = io.connect();

function render(target) {
  this.target = target;
  this.$target = $(target);
  this.cache = '';
}

render.prototype.codeRender = function(data) {
  this.$target.text(this.cache);
  if (this.target === '#result') {
    return sh_highlightDocument('lang/', '.shell');
  }
  sh_highlightDocument('lang/', '.js');
};

render.prototype.htmlRender = function(html) {
  this.$target.html(html);
};

render.prototype.buildResult = function(patch) {
  var result = patch !== 'empty' ? apply_patch(this.cache, patch) : '';
  this.cache = result;
  this.codeRender();
log('result', patch.length);
};

var appRender = new render('#app'),
    socketserverRender = new render('#socketserver'),
    resultRender = new render('#result'),
    empty1Render = new render('#empty1'),
    empty2Render = new render('#empty2');

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
    appRender.buildResult(data);
  });

  socket.on('socketserver', function(data) {
    socketserverRender.buildResult(data);
  });

  socket.on('result', function(data) {
    resultRender.cache += data;
    resultRender.codeRender();
  });

  socket.on('disconnect', function() {
    log('disconnected');
  });

  socket.on('empty1', function(html) {
    empty1Render.htmlRender(html);
  });

  socket.on('empty2', function(html) {
    empty2Render.htmlRender(html);
  });
});

$(function() {
  var section_height = $('section').height();
  var h2_height = $('h2').height();
  $('iframe').height(section_height);
  $('pre.sh_javascript, pre.sh_sh').height(section_height - h2_height * 2);
  $('pre.full').height(section_height - h2_height / 2);
});
