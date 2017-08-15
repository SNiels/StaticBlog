var path = require("path");
var webpack = require("webpack");
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var extractSass = new ExtractTextPlugin({
    filename: "index.[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

var rootPath = path.join(__dirname, "wwwroot/assets/");

module.exports = {
    entry: './Assets/index',
    output: {
        path: rootPath,
        publicPath: '/assets/',
        filename: "index.[hash].js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    devtool: "source-map", // any "source-map"-like devtool is possible
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
        rules: [{
            test: [/\.scss$/, /\.sass$/],
            use: extractSass.extract({
                fallback:[{
                    loader: "style-loader", // creates style nodes from JS strings
                    options: { sourceMaps: true }
                }],
                use: [{
                    loader: "css-loader", // translates CSS into CommonJS
                    options: { sourceMaps: true }
                }, {
                    loader: "sass-loader", // compiles Sass to CSS
                    options: {
                        sourceMaps: true,
                        indentedSyntax: true
                    }
                }]
            })
        }]
    },
    plugins: [
        new CleanWebpackPlugin(["*.js", "*.css", "*.js.map", "*.css.map"], { root: rootPath }),
        extractSass,
    ]
}