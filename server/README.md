# BrowserQuest server documentation

The game server currently runs on NodeJS and requires the latest versions of the following npm libraries:

- underscore
- socket.io
- sanitizer
- memcached (only if you want metrics)

All of them can be installed via `npm install -d` (this will install a local copy of all the dependencies in the node_modules directory)

## Configuration

The server settings (number of worlds, number of players per world, etc.) can be configured.
Copy `config_local.json-dist` to a new `config_local.json` file, then edit it. The server will override default settings with this file.

## Deployment

For local deployement, simply run `node server/js/main.js` in order to start the server.
But you can also run it with docker!

## Monitoring

The server has a status URL which can be used as a health check or simply as a way to monitor player population.

Send a GET request to: `http://[host]:[port]/status`

It will return a JSON array containing the number of players in all instanced worlds on this game server.
