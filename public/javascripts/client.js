var log = console.log.bind(console);
// Client
var socket = io.connect();

function render(target) {
  this.target = target;
  this.$target = $(target);
  this.cache = '';
}

render.prototype.codeRender = function() {
  this.$target.text(this.cache);
  if (this.target === '#result') {
    return sh_highlightDocument('lang/', '.shell');
  }
  sh_highlightDocument('lang/', '.js');
};

render.prototype.htmlRender = function(html) {
  this.$target.html(html);
};

render.prototype.rawRender = function(rawdata) {
  if (rawdata) this.cache = rawdata;
  if (rawdata === '') this.cache = '';
  this.codeRender();
};

// render.prototype.patchRender = function(patch) {
//   var result = patch !== 'empty' ? apply_patch(this.cache, patch) : '';
//   this.rawRender(result);
// log('result', patch.length);
// };

var appRender = new render('#app'),
//    routesRender = new render('#routes'),
    socketserverRender = new render('#socketserver'),
    resultRender = new render('#result'),
    clientRender = new render('#client'),
    layoutRender = new render('#layout'),
    indexRender = new render('#index'),
    empty1Render = new render('#empty1'),
    empty2Render = new render('#empty2');

socket.on('connect', function() {
  log('connect');

  // initialize view source
  // if network dosen't work
  // slide shows default codes
  // marked up in html.
  appRender.rawRender('// app.js');
//  routesRender.rawRender('// routes/index.js');
  socketserverRender.rawRender('// server.js');
  resultRender.rawRender();
  clientRender.rawRender('// public/javascripts/client.js');
  layoutRender.rawRender('// views/layout.jade');
  indexRender.rawRender('// views/index.jade');

  // move slide
  socket.on('go', function(to) {
    $.deck('go', to);
  });
  $(document).bind('deck.change', function(event, from, to) {
    if (from != to) socket.emit('go', to);
  });

  socket.on('result', function(data) {
    resultRender.cache += data;
    resultRender.codeRender();
  });

  socket.on('app', function(data) {
    appRender.rawRender(data);
  });

  socket.on('routes', function(data) {
//    routesRender.rawRender(data);
  });

  socket.on('socketserver', function(data) {
    socketserverRender.rawRender(data);
  });

  socket.on('client', function(data) {
    clientRender.rawRender(data);
  });

  socket.on('layout', function(data) {
    layoutRender.rawRender(data);
  });

  socket.on('index', function(data) {
    indexRender.rawRender(data);
  });

  socket.on('review', function(data) {
    var $li = $('<li>').text(data);
    $('#review').append($li);
  });

  socket.on('empty1', function(html) {
    empty1Render.htmlRender(html);
  });

  socket.on('empty2', function(html) {
    empty2Render.htmlRender(html);
  });

  socket.on('disconnect', function() {
    log('disconnected');
  });
});

$(function() {
  var section_height = $('section').height();
  var h2_height = $('h2').height();
  $('iframe').height(section_height);
  $('pre.sh_javascript, pre.sh_sh').height(section_height - h2_height * 2);
  $('pre.half').height(section_height / 2.7);
  $('pre.full').height(section_height - h2_height / 2);
  // $('#app').height(section_height * 0.7);
  // $('#routes').height(section_height * 0.2);
});
