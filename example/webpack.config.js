/* eslint-disable no-process-env, id-match */

let ExtractTextPlugin,
    alias,
    devServer,
    path,
    srcDirs,
    webpack;

webpack = require('webpack');
path = require('path');
ExtractTextPlugin = require('extract-text-webpack-plugin');
srcDirs = [path.resolve(__dirname, 'src')];

if (process.env.NODE_ENV === 'DEV') {
    alias = {
        react: path.resolve(__dirname, './node_modules/react'),
        '@applaudience/react-carousel': path.resolve(__dirname, '../src')
    };

    srcDirs = srcDirs.concat([
        path.resolve(__dirname, '../src')
    ]);
}

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
    devServer,
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
                include: srcDirs,
                loader: 'react-hot'
            },
            {
                test: /\.js$/,
                include: srcDirs,
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
        alias
    }
};
