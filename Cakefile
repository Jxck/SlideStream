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

exec "fixjsstyle #{ files.join ' ' }", (err, stdout, stderr)->
  throw err if err
  log stdout + stderr

exec "rm -rf lib/sample", (err, stdout, stderr)->
  throw err if err
  log stdout + stderr
