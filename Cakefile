log = console.log
{ exec } = require 'child_process'

files = [
  'package.json'
  'socket.server.js'
  'static.server.js'
  'config/*'
  'public/javascripts/client.js'
]

exec "fixjsstyle #{ files.join ' ' }", (err, stdout, stderr)->
  throw err if err
  log stdout + stderr