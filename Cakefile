fs = require 'fs'

{print} = require 'util'
{spawn} = require 'child_process'

COFFEE = if process.platform is 'win32'
  'C:/Users/Norbert/AppData/Roaming/npm/coffee.cmd'
else
  'coffee'

HANDLEBARS = if process.platform is 'win32'
  'C:/Users/Norbert/AppData/Roaming/npm/handlebars.cmd'
else
  'handlebars'

HANDLEBARS = if process.platform is 'win32'
  'C:/Users/Norbert/AppData/Roaming/npm/codo.cmd'
else
  'codo'

spawner = (cmd, opts, callback) ->
  coffee = spawn cmd, opts
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback?() if code is 0

spawnCoffee = (opts, callback) ->
  spawner(COFFEE, opts, callback)

spawnHandlebars = (opts, callback) ->
  spawner(HANDLEBARS, opts, callback)

spawnCodo = (opts, callback) ->
  spawner(HANDLEBARS, opts, callback)

task 'build', 'Build build/ from src/', ->
  spawnCoffee ['-c', '-o', 'build/server', 'src/server']
  spawnCoffee ['-c', '-o', 'build/client', 'src/client']
  spawnCoffee ['-c', '-o', 'build/test', 'tests']

task 'watch', 'Build build/ from src/', ->
  spawnCoffee ['-w', '-c', '-o', 'build/server', 'src/server']
  spawnCoffee ['-w', '-c', '-o', 'build/client', 'src/client']
  spawnCoffee ['-w', '-c', '-o', 'build/tests', 'tests']

task 'precompile', 'Precompile handlebars templates', ->
  spawnHandlebars ['templates', '-f', 'build/client/templates.js']

task 'doc', 'Compile docs', ->
  spawnCodo ['--readme', 'README.txt', '-o', 'doc', 'src/client']
