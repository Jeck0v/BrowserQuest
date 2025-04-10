define(["text!../config/config_build.json"], function (build) {
  var config = {
    dev: { host: "localhost", port: 8000, dispatcher: false },
  };

  try {
    var buildConfig = JSON.parse(build);

    // Handle dynamic hostname if specified in build config
    if (buildConfig.host === "window.location.hostname") {
      buildConfig.host = window.location.hostname;
    }

    config.build = buildConfig;
  } catch (e) {
    console.error("Error parsing build config:", e);
    config.build = { host: window.location.hostname, port: 8000 };
  }

  //>>excludeStart("prodHost", pragmas.prodHost);
  require(["text!../config/config_local.json"], function (local) {
    try {
      var localConfig = JSON.parse(local);

      // Handle dynamic hostname if specified
      if (localConfig.host === "window.location.hostname") {
        localConfig.host = window.location.hostname;
      }

      config.local = localConfig;
    } catch (e) {
      // Exception triggered when config_local.json does not exist. Nothing to do here.
    }
  });
  //>>excludeEnd("prodHost");

  return config;
});
