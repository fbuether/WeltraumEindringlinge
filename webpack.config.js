const CompressionWebpackPlugin = require("compression-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const modeConfig = env => {
  if (env == "development") {
    return {
      devtool: "inline-source-map",
      devServer: {
        contentBase: "./dist",
        port: 32011,
        clientLogLevel: "warn"
      },
    };
  }
  else {
    return {
      plugins: [
        new UglifyJSPlugin({
          sourceMap: true
        }),
        new CompressionWebpackPlugin(),
      ]
    };
  }
}

let excludes = /(\.#)/;

module.exports = ({ mode, presets } = { mode: "production", presets: [] }) => {
  return webpackMerge({
    entry: "./src/index.html",
    mode,
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: excludes,
          use: ["source-map-loader"],
          exclude: [
            excludes,
            path.resolve(__dirname,"node_modules/excalibur")
          ],
          enforce: "pre",
        },
        {
          test: /\.tsx?$/,
          exclude: [
            excludes,
              /node_modules/
          ],
          use: "ts-loader",
        },
        {
          test: /\.css$/i,
          exclude: excludes,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.html$/i,
          exclude: excludes,
          loader: "html-loader",
        },
        {
          test: /\.(png|jpg)$/,
          exclude: excludes,
          use: [{
            loader: "file-loader",
            options: {
              emitFile: true,
              name: "[name]-[contenthash].[ext]"
            }
          }]
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"]
    },
    output: {
      filename: "[name]-[contenthash].js",
      sourceMapFilename: "[file].map",
      path: path.resolve(__dirname, "dist"),
    },
    optimization: {
      splitChunks: {
        chunks: "all"
      }
    },
    plugins: [
      new CleanWebpackPlugin({}),
      new HtmlWebPackPlugin({
        favicon: 'src/favicon.ico'
      })
    ]
  },
                      modeConfig(mode)
                     );
};
