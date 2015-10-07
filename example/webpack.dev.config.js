/* eslint-disable no-process-env, id-match, no-var, object-shorthand */

var ExtractTextPlugin,
    devServer,
    path,
    webpack;

webpack = require('webpack');
path = require('path');
ExtractTextPlugin = require('extract-text-webpack-plugin');

devServer = {
    contentBase: path.join(__dirname, '/src/endpoint'),
    colors: true,
    quiet: false,
    noInfo: false,
    publicPath: '/static/',
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 8000,
    hot: true
};

module.exports = {
    devtool: 'eval-source-map',
    debug: true,
    devServer: devServer,
    context: __dirname,
    entry: {
        app: [
            `webpack-dev-server/client?http://${devServer.host}:${devServer.port}`,
            'webpack/hot/only-dev-server',
            './src/'
        ]
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
        publicPath: devServer.publicPath
    },
    plugins: [
        new ExtractTextPlugin('app.css', {
            allChunks: true
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.OldWatchingPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, '../src')
                ],
                loader: 'react-hot'
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, '../src')
                ],
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass')
            }
        ]
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, './node_modules/react'),
            '@applaudience/react-carousel': path.resolve(__dirname, '../src')
        }
    }
};
