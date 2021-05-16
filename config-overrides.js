// config-overrides.js
module.exports = function override(config, env) {
    // New config, e.g. config.plugins.push...

    console.log("Overriding config...", config);

    const devServer = config.devServer || {};
    const headers = devServer.headers || {};

    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Access-Control-Allow-Methods"] = "POST, PUT, GET, OPTIONS, DELETE";
    headers["Access-Control-Allow-Headers"] = "Content-Type, Accept, X-Requested-With, Authorization";
    headers["Access-Control-Max-Age"] = "360000";

    devServer.headers = headers;
    config.devServer = devServer;
    console.log("Config...", config);

    return config
}