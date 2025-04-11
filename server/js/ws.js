var cls = require("./lib/class"),
  url = require("url"),
  http = require("http"),
  Utils = require("./utils"),
  _ = require("underscore"),
  WS = {};

const rateLimit = {};
const MAX_CONNECTIONS_PER_IP = 10;

module.exports = WS;

/**
 * Abstract Server and Connection classes
 */
var Server = cls.Class.extend({
  _connections: {},
  _counter: 0,

  init: function (port) {
    this.port = port;
  },

  onConnect: function (callback) {
    this.connection_callback = callback;
  },

  onError: function (callback) {
    this.error_callback = callback;
  },

  broadcast: function (message) {
    throw "Not implemented";
  },

  forEachConnection: function (callback) {
    _.each(this._connections, callback);
  },

  addConnection: function (connection) {
    this._connections[connection.id] = connection;
  },

  removeConnection: function (id) {
    delete this._connections[id];
  },

  getConnection: function (id) {
    return this._connections[id];
  },

  connectionsCount: function () {
    return Object.keys(this._connections).length;
  },
});

var Connection = cls.Class.extend({
  init: function (id, connection, server) {
    this._connection = connection;
    this._server = server;
    this.id = id;
  },

  onClose: function (callback) {
    this.close_callback = callback;
  },

  listen: function (callback) {
    this.listen_callback = callback;
  },

  broadcast: function (message) {
    throw "Not implemented";
  },

  send: function (message) {
    throw "Not implemented";
  },

  sendUTF8: function (data) {
    throw "Not implemented";
  },

  close: function (logError) {
    console.info(
      "Closing connection to " +
        this._connection.remoteAddress +
        ". Error: " +
        logError
    );
    this._connection.close();
  },
});

WS.socketIOServer = Server.extend({
  init: function (host, port) {
    self = this;
    self.host = host;
    self.port = port;
    var app = require("express")();
    var http = require("http").Server(app);

    self.io = require("socket.io")(http, {
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ["websocket", "polling"],
    });

    self.io.on("connection", function (connection) {
      const ip = connection.handshake.address.address;

      if (!rateLimit[ip]) {
        rateLimit[ip] = {
          count: 0,
          timestamp: Date.now(),
        };
      }

      rateLimit[ip].count++;

      if (rateLimit[ip].count > MAX_CONNECTIONS_PER_IP) {
        self.firewall.logSuspiciousActivity(ip, "Too many connection attempts");
        connection.disconnect();
        return;
      }

      console.info("a user connected");
      connection.remoteAddress = ip;

      var c = new WS.socketIOConnection(self._createId(), connection, self);

      if (self.connection_callback) {
        self.connection_callback(c);
      }
      self.addConnection(c);
    });

    self.io.on("error", function (err) {
      log.error(err.stack);
      self.error_callback();
    });

    http.listen(port, function () {
      console.info("listening on *:" + port);
    });
  },

  _createId: function () {
    return "5" + Utils.random(99) + "" + this._counter++;
  },

  broadcast: function (message) {
    self.io.emit("message", message);
  },

  onRequestStatus: function (status_callback) {
    this.status_callback = status_callback;
  },
});

WS.socketIOConnection = Connection.extend({
  init: function (id, connection, server) {
    var self = this;

    this._super(id, connection, server);

    connection.on("dispatch", function (message) {
      self._connection.emit("dispatched", {
        status: "OK",
        host: server.host,
        port: server.port,
      });
    });

    connection.on("message", function (message) {
      console.info("Received: " + message);
      if (self.listen_callback) self.listen_callback(message);
    });

    connection.on("disconnect", function () {
      if (self.close_callback) {
        self.close_callback();
      }
      delete self._server.removeConnection(self.id);
    });
  },

  broadcast: function (message) {
    throw "Not implemented";
  },

  send: function (message) {
    this._connection.emit("message", message);
  },

  sendUTF8: function (data) {
    this.send(data);
  },

  close: function (logError) {
    console.info("Closing connection to socket" + ". Error: " + logError);
    this._connection.disconnect();
  },
});
