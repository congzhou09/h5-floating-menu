var pkg = require('./package.json');
var Webpack = require("webpack");
var Path = require('path');

module.exports = {
    mode: "production",
    // mode: "development",
    entry: Path.resolve(__dirname, "./src/index.js"),
    output: {
        path: Path.resolve(__dirname, "./dist"),
        filename: "h5-floating-menu.min.js",
        library: 'H5FloatingMenu',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    "presets": [
                        ["@babel/preset-env", {
                            "modules": "umd",
                            "targets": {
                                "browsers": ["last 2 versions", "safari >= 7"]
                            }
                        }]
                    ],
                    "plugins": [
                        "@babel/plugin-proposal-class-properties",
                        "add-module-exports"
                    ]
                }
            }
        ]
    },
    plugins: [
        new Webpack.BannerPlugin([
            'h5-floating-menu v' + pkg.version + ' (' + pkg.homepage + ')',
            '',
            'Copyright (C) 2019. Free to use, very pleased to reserve my name: "Congzhou" ',
        ].join('\n'))
    ]
};