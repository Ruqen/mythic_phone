//import webpack from 'webpack';
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './js/src/app.js',
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'libs'),
                ],
                loader: 'babel-loader'
            }
        ]
    }
};