const path = require('path');

module.exports = {
    output:{
        path: path.join(__dirname, 'dist'), 
        filename:'index.bundle.js',
    },
    devServer:{
        port: 8080,
        watchContentBase: true,
    },
    module:{
        rules: [
            { 
                test: /\.(js|jsx)?$/,
                use:{
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            },
            { 
                test: /\.scss?$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    }
};