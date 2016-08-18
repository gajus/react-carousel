/* eslint-disable no-process-env, id-match, no-var, object-shorthand, import/no-commonjs */

const path = require('path');
const webpack = require('webpack');

const devServer = {
    colors: true,
    contentBase: path.join(__dirname, '/src/endpoint'),
    historyApiFallback: true,
    host: '127.0.0.1',
    hot: false,
    noInfo: false,
    port: 8000,
    publicPath: '/static/',
    quiet: false
};

module.exports = {
    context: __dirname,
    debug: true,
    devServer,
    devtool: 'eval-source-map',
    entry: {
        app: ['./src/']
    },
    module: {
        loaders: [
            {
                include: [path.resolve(__dirname, 'src'), /react-carousel\/src/],
                loader: 'babel',
                test: /\.js$/
            },
            {
                loaders: ['style', 'css'],
                test: /\.css$/
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '/dist'),
        publicPath: devServer.publicPath
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.OldWatchingPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        alias: {
            react: path.resolve(__dirname, './node_modules/react'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom')
        },
        fallback: path.resolve(__dirname, './node_modules')
    }
};
