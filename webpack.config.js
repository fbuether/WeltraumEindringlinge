const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/main.ts"),

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  devtool: "inline-source-map",
  mode: "development",

  resolve: {
    extensions: [".ts", ".js"],
  },

  output: {
    filename: "[name]-[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 32011,
    clientLogLevel: "warn",
    writeToDisk: true,
  },

  plugins: [
    new HtmlWebPackPlugin({
      favicon: 'assets/favicon.ico'
    }),
    // new webpack.DefinePlugin({
    //   "typeof CANVAS_RENDERER": JSON.stringify(true),
    //   "typeof WEBGL_RENDERER": JSON.stringify(true),
    // }),
  ],

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "lib",
          chunks: "all",
        },
      },
    },
  },
};
