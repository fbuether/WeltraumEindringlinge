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
      {
        test: /\.png$/,
        loader: "file-loader",
        options: { name: "[name]-[contenthash].[ext]" },
      },
    ],
  },

  devtool: "inline-source-map",
  mode: "development",

  resolve: {
    extensions: [".ts", ".js"],
  },

  output: {
    filename: "[name]-[hash].js",
    path: path.resolve(__dirname, "dist"),
  },

  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 32011,
    clientLogLevel: "warn",
    writeToDisk: true,
  },

  watch: true,

  plugins: [
    new HtmlWebPackPlugin({
      favicon: "assets/favicon.ico",
      template: "src/index.html"
    }),
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
