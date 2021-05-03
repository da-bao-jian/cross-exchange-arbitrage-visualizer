const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname ,"./public"),
    watchContentBase: true,
    open: "Chrome", // use "chrome" for PC
  },
});