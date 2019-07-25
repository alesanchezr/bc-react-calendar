const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './src/calendar/index.js'
  ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/, use: {
                    loader: 'file-loader',
                    options: { name: '[name].[ext]' }
                }
            }, //for images
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                use: 'url-loader'
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'index.js',
        library: '@breathecode/ui-components',
        globalObject: 'typeof self !== \'undefined\' ? self : this',
        libraryTarget: 'umd'
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    devServer: {
        contentBase: './dist'
    }
};