// config-overrides.js
module.exports = {
    // New config, e.g. config.plugins.push...

    devServer: function(configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function(proxy, allowedHost) {
        // Create the default config by calling configFunction with the proxy/allowedHost parameters
            const config = configFunction(proxy, allowedHost);

            console.log("Overriding config...", config);

            const headers = config.headers || {};

            headers["Access-Control-Allow-Origin"] = "*";
            headers["Access-Control-Allow-Credentials"] = "true";
            headers["Access-Control-Allow-Methods"] = "POST, PUT, GET, OPTIONS, DELETE";
            headers["Access-Control-Allow-Headers"] = "Content-Type, Accept, X-Requested-With, Authorization";
            headers["Access-Control-Max-Age"] = "359998";

            config.headers = headers;
            console.log("Config...", config);

            // Return your customised Webpack Development Server config.
            return config;
        };
    }
}
