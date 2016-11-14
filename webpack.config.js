module.exports = {
    entry: __dirname + "/app/main.js",
    output: {
        path: __dirname + "/build/",
        filename: "bundle.js"
    },
    resolve: {
        alias: {
            app: `${ __dirname }/app/`,
            fa: 'font-awesome/scss/font-awesome.scss'
        },
        extensions: ['', '.js', '.jsx', '.scss']
    },
    eslint: {
        configFile: './.eslintrc.json',
        failOnWarning: false,
        failOnError: true
    },
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'file-loader'
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                    plugins: [
                        "transform-decorators-legacy",
                        "transform-object-rest-spread",
                        "syntax-class-properties",
                        "transform-class-properties"
                    ]
                }
            },
            {
                test: /\.scss$/,
                loader: "style!css!sass!"
            },
          {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader?mimetype=image/svg+xml'},
          {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
          {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/font-woff"},
          {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader?mimetype=application/octet-stream"},
          {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader"}
        ]
    },
};
