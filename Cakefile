log = console.log
{ exec } = require 'child_process'

files = [
  'package.json'
  'socket.server.js'
  'static.server.js'
  'config/*'
  'lib/*'
  'public/javascripts/client.js'
  'spec/diff_launch.test.js'
]

commands = [
 "fixjsstyle #{ files.join ' ' }"
 "rm -rf lib/sample"
 "rm public/javascripts/deck.core.js && cp ../core/deck.core.js public/javascripts/"
 "rm public/stylesheets/deck.core.css && cp ../core/deck.core.css public/stylesheets/"
 "rm -rf public/extensions && cp -r ../extensions public/ "
 "rm -rf public/themes && cp -r ../themes public/ "
]

commands.map (command) ->
  exec command, (err, stdout, stderr)->
    throw err if err
    log stdout + stderr
