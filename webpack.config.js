module.exports = {
    entry: "./build/test.js",
    output: {
        path: __dirname + "/build/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
        ]
    }
};
