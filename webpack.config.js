const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env = {}) => ({
  entry: path.resolve(__dirname, "src/main.ts"),

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|woff2|wav)$/,
        loader: "file-loader",
        options: { name: "[name]-[contenthash].[ext]" },
      }
    ],
  },

  devtool: env.production ? "" : "cheap-module-eval-source-map",
  mode: env.production ? "production" : "development",

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
    clientLogLevel: "warn"
  },

  plugins: [
    new HtmlWebPackPlugin({
      favicon: "assets/favicon.ico",
      template: "src/index.html"
    }),
  ],

  node: false,

  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      minChunks: 1,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: function(module) {
            return "package-" +
              module.context
              .match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              .replace("@", "");
          },
        },
      },
    },
  }
});
