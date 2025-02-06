// @ts-check

// 引入 Node.js 的 path 模块，用于处理和转换文件路径
const path = require("path");

const { CopyRspackPlugin, HtmlRspackPlugin, library, javascript } = require("@rspack/core");

// 判断是否是开发环境
const isDev = process.env.NODE_ENV === "development";

/**
 * @type {import('@rspack/cli').Configuration}
 */

module.exports = {
  context: __dirname,
  entry: "./src/index.tsx",

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },

  plugins: [
    new CopyRspackPlugin({ patterns: [{ from: "./public", to: "." }] }),

    new HtmlRspackPlugin({
      filename: "index.html",
      template: "./public/index.html",
    }),
  ],

  resolve: {
    "@": path.resolve(__dirname, "src"),
    "sketching-core": path.resolve(__dirname, "../core/src"),
    "sketching-delta": path.resolve(__dirname, "../delta/src"),
    "sketching-plugin": path.resolve(__dirname, "../plugin/src"),
    "sketching-utils": path.resolve(__dirname, "../utils/src"),
  },

  builtins: {
    pluginImport: [
      {
        libraryName: "@arco-design/web-react",
        customName: "@arco-design/web-react/es/{{member}}",
        style: true,
      },
      {
        libraryName: "@arco-design/web-react/icon",
        customName: "@arco-design/web-react/icon/es/{{member}}",
        style: false,
      },
    ],
  },

  module: {
    rules: [
      { test: /\.svg$/, type: "asset" },
      {
        test: /.scss$/,
        oneOf: [
          {
            resource: /(module|m)\.scss$/,
            use: "sass-loader",
            type: "css/module",
          },
          {
            use: "sass-loader",
            type: "css",
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                importLoaders: true,
                localIdentName: "[name]_[hash:base64:5]",
              },
            },
          },
        ],
        type: "css",
      },
    ],
  },
  target: isDev ? undefined : "es5",
  devtool: isDev ? "source-map" : false,
  output: {
    clean: true,
    chunkLoading: "jsonp",
    chunkFormat: "array-push",
    path: path.resolve(__dirname, "dist"),
    publicPath: isDev ? "/" : "./",
    // 配置输出文件名
    filename: isDev ? "[name].bundle.js" : "[name].[contenthash].js",
    // 配置 chunk 文件名
    chunkFilename: isDev ? "[name].chunk.js" : "[name].[contenthash].js",
    // 配置资源模块文件名
    assetModuleFilename: isDev ? "[name].[ext]" : "[name].[contenthash].[ext]",
  },
};
