var fs = require("fs"),
  Metrics = require("./metrics"),
  Firewall = require("./firewall");

function main(config) {
  var ws = require("./ws"),
    WorldServer = require("./worldserver"),
    Log = require("log"),
    _ = require("underscore"),
    server = new ws.socketIOServer(config.host, config.port),
    metrics = config.metrics_enabled ? new Metrics(config) : null,
    firewall = new Firewall();

  setInterval(function () {
    firewall.cleanupOldEntries();
  }, 3600000);

  (worlds = []),
    (lastTotalPlayers = 0),
    (checkPopulationInterval = setInterval(function () {
      if (metrics && metrics.isReady) {
        metrics.getTotalPlayers(function (totalPlayers) {
          if (totalPlayers !== lastTotalPlayers) {
            lastTotalPlayers = totalPlayers;
            _.each(worlds, function (world) {
              world.updatePopulation(totalPlayers);
            });
          }
        });
      }
    }, 1000));

  switch (config.debug_level) {
    case "error":
      log = new Log(console.error);
      break;
    case "debug":
      log = new Log(console.debug);
      break;
    case "info":
      log = new Log(console.info);
      break;
  }

  console.info("Starting BrowserQuest game server...");

  server.onConnect(function (connection) {
    if (!firewall.checkIP(connection._connection.remoteAddress)) {
      connection.close("IP is blacklisted");
      return;
    }

    var world,
      connect = function () {
        if (world) {
          world.connect_callback(new Player(connection, world, firewall));
        }
      };

    if (metrics) {
      metrics.getOpenWorldCount(function (open_world_count) {
        // choose the least populated world among open worlds
        world = _.min(_.first(worlds, open_world_count), function (w) {
          return w.playerCount;
        });
        connect();
      });
    } else {
      // simply fill each world sequentially until they are full
      world = _.detect(worlds, function (world) {
        return world.playerCount < config.nb_players_per_world;
      });
      world.updatePopulation();
      connect();
    }
  });

  server.onError(function () {
    console.error(Array.prototype.join.call(arguments, ", "));
  });

  var onPopulationChange = function () {
    metrics.updatePlayerCounters(worlds, function (totalPlayers) {
      _.each(worlds, function (world) {
        world.updatePopulation(totalPlayers);
      });
    });
    metrics.updateWorldDistribution(getWorldDistribution(worlds));
  };

  _.each(_.range(config.nb_worlds), function (i) {
    var world = new WorldServer(
      "world" + (i + 1),
      config.nb_players_per_world,
      server
    );
    world.run(config.map_filepath);
    worlds.push(world);
    if (metrics) {
      world.onPlayerAdded(onPopulationChange);
      world.onPlayerRemoved(onPopulationChange);
    }
  });

  server.onRequestStatus(function () {
    return JSON.stringify(getWorldDistribution(worlds));
  });

  if (config.metrics_enabled) {
    metrics.ready(function () {
      onPopulationChange();
    });
  }

  process.on("uncaughtException", function (e) {
    console.error("uncaughtException: " + e);
  });
}

function getWorldDistribution(worlds) {
  var distribution = [];

  _.each(worlds, function (world) {
    distribution.push(world.playerCount);
  });
  return distribution;
}

function getConfigFile(path, callback) {
  fs.readFile(path, "utf8", function (err, json_string) {
    if (err) {
      console.error("Could not open config file:", err.path);
      callback(null);
    } else {
      callback(JSON.parse(json_string));
    }
  });
}

var defaultConfigPath = "./server/config.json",
  customConfigPath = "./server/config_local.json";

process.argv.forEach(function (val, index, array) {
  if (index === 2) {
    customConfigPath = val;
  }
});

getConfigFile(defaultConfigPath, function (defaultConfig) {
  getConfigFile(customConfigPath, function (localConfig) {
    if (localConfig) {
      main(localConfig);
    } else if (defaultConfig) {
      main(defaultConfig);
    } else {
      console.error("Server cannot start without any configuration file.");
      process.exit(1);
    }
  });
});
