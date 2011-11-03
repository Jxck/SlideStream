log = console.log
{ exec } = require 'child_process'

task 'build', 'build scripts', (options) ->
  files = [
    'package.json'
    'server.js'
    'static.server.js'
    'config/*'
    'lib/*'
    'public/javascripts/client.js'
    'spec/diff_launch.test.js'
  ]

  js = [
    "public/javascripts/deck.core.js"
    "public/extensions/hash/deck.hash.js"
    "public/extensions/menu/deck.menu.js"
    "public/extensions/status/deck.status.js"
  ]
  js = js.join(' --js=')

  commands = [
   "fixjsstyle #{ files.join ' ' }"
#   "rm public/javascripts/deck.core.js && cp ../core/deck.core.js public/javascripts/"
   "rm public/stylesheets/deck.core.css && cp ../core/deck.core.css public/stylesheets/"
   "rm -rf public/extensions && cp -r ../extensions public/ "
   "rm -rf public/themes && cp -r ../themes public/ "
    "java -jar compiler.jar --js=#{js} --js_output_file=public/javascripts/deck.compiled.js"
    "java -jar compiler.jar --js=public/javascripts/client.js --js_output_file=public/javascripts/client.min.js"
  ]

  commands.map (command) ->
    exec command, (err, stdout, stderr)->
      throw err if err
      log stdout + stderr

task 'demo', 'prepare for demo', (options) ->
  commands = [
    "rm -rf lib/sample"
    "rm -rf sample"
    "express sample"
    "touch sample/server.js"
    "touch sample/public/javascripts/client.js"
    "touch sample/question1"
    "touch sample/question2"
  ]
  command = commands.join(' && ')

  exec command, (err, stdout, stderr)->
    throw err if err
    log stdout + stderr

option '-p', '--page [page]'
task 'png', 'build png', (options) ->
  page = options.page
  command = 'phantomjs'
  script = 'rasterize.js'
  uri = ''
  width = 1366
  height = 768
  paperwidth = '48.77cm'
  paperheight = '17.43cm'
  commands = []

  for i in [0..page]
    uri = "http://localhost:3000/slide.html#slide-#{i}"
    output = uri.split('#')[1] + '.png'
    commands.push "#{command} #{script} #{uri} #{output} #{width} #{height} #{paperwidth} #{paperheight}"

  build = (c) ->
    exec c.shift() , (err, stdout, stderr)->
      throw err if err
      log stdout + stderr

    if c.length isnt 0
      setTimeout () ->
        build(c)
      , 1000
  build(commands)


option '-p', '--page [page]'
task 'pdf', 'build pdf', (options) ->
  slides = []
  page = options.page
  for i in [0..page]
    exec "echo 'sam2p slide-#{i}.png sliede-#{i}.pdf'" , (err, stdout, stderr)->
      throw err if err
      log stdout + stderr
    slides.push "slide-#{i}.pdf"


  slides = slides.join(' ')
  commands =  "pdftk #{slides} cat output slide.pdf"

  exec commands, (err, stdout, stderr)->
    throw err if err
    log stdout + stderr
