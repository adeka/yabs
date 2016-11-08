module.exports = {
    entry: __dirname + "/app/main.js",
    output: {
        path: __dirname + "/build/",
        filename: "bundle.js"
    },
    resolve: {
      alias: {
        app: `${ __dirname }/app/`
      },
      extensions: ['', '.js', '.jsx', '.scss']
    },
    module: {
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
        }
      ]
    },
};
