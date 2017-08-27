const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge'); 
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;

module.exports = (env) => {
    // Configuration in common to both client-side and server-side bundles
    const isDevBuild = !(env && env.prod);
    const sharedConfig = {
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: ['.js', '.ts'] },
        output: {
            filename: '[name].js',
            publicPath: 'assets/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        devtool: "source-map",
        module: {
            rules: [
                { test: /\.ts$/, include: /Assets/, use: 'awesome-typescript-loader' },
                isDevBuild ?
                    { test: /\.sass$/, loader: 'style-loader!css-loader?sourceMap&sourceComments!sass-loader?sourceMap&sourceComments'  } :
                    {
                        test: /\.sass$/,
                        use: ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            //resolve-url-loader may be chained before sass-loader if necessary
                            use: ['css-loader?sourceMap&minify', 'sass-loader?sourceMap']
                        })
                    },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [new CheckerPlugin()]
    };

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/assets';
    const clientBundleConfig = merge(sharedConfig, {
        entry: { 'main': './Assets/index' },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: isDevBuild ?
            [
                // Plugins that apply in development builds only
                new webpack.SourceMapDevToolPlugin({
                    filename: '[file].map', // Remove this line if you prefer inline source maps
                    moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
                }),
                new ExtractTextPlugin({filename:'main.css', disable: true}),
            ] : [
                new webpack.SourceMapDevToolPlugin({
                    filename: '[file].map', // Remove this line if you prefer inline source maps
                    moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
                }),
                // Plugins that apply in production builds only
                new webpack.DefinePlugin({
                    "process.env": {
                        "NODE_ENV":  JSON.stringify("production")
                    }
                }),
                new ExtractTextPlugin('main.css'),
                new webpack.optimize.UglifyJsPlugin()
            ]
    });

    return clientBundleConfig;
};