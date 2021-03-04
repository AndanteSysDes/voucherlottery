const { parsed: localEnv } = require("dotenv").config();
const withCSS = require("@zeit/next-css");

const webpack = require("webpack");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);

module.exports = withCSS({
  webpack: config => {
    const env = { API_KEY: apiKey };
    
    //custum config
    //   config.node = {
    //   fs: 'empty',
    //   child_process: 'empty',
    //   net: 'empty',
    //   dns: 'empty',
    //   tls: 'empty',
    //   module: 'empty',
    // };

    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  }
});
