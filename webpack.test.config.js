var Path = require('path');
var TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: "production",
    // mode: "development",
    entry: Path.resolve(__dirname, "./test/js/test.js"),
    output: {
        path: Path.resolve(__dirname, "./test/js"),
        filename: "test-bundle.js"
    },
    optimization:{
        minimizer: [
            new TerserPlugin({
              extractComments: false
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /h5-floating-menu.min.js/,
                loader: "babel-loader"
            }
        ]
    }
}
