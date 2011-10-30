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
task 'pdf', 'build pdf', (options) ->
  slides = ""
  for i in [0..36]
    slides += " pdf/slide-#{i}.pdf"
  commands =  "pdftk #{slides} cat output pdf/nodefest2011.pdf"
  log commands
  exec commands, (err, stdout, stderr)->
    throw err if err
    log stdout + stderr
  # page = options.page.split('-')
  # if page.length == 2
  #   f = page[0]
  #   t = page[1]
  # else
  #   f = 0
  #   t = page[0]
  # log f,t
  # command = 'phantomjs'
  # script = 'rasterize.js'
  # width = 1366
  # height = 768
  # paperwidth = '48.77cm'
  # paperheight = '17.43cm'

  # log [f..t]
  # for i in [f..t]
  #   log i
    # url = "http://localhost:3001/nodefest2011.html#slide-#{i}"
    # dest = 'pdf/' +  url.split('#')[1] + '.png'
