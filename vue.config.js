const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const version = JSON.parse(fs.readFileSync("package.json", "utf-8")).version;
process.env.VUE_APP_VERSION = version;
module.exports = {
  lintOnSave: false,
  outputDir: `dist/designer_static@${version}`,
  assetsDir: "static/",
  devServer: {
    historyApiFallback: true,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        // target: "https://www24.hicustom.com/",
        target: "https://sandbox2.zhiwendiy.com/",
        // target: "http://devlknew.zwdc.com:8016/",
        // target: `http://test.zwdc.com/`,
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader("Cookie", "thinkphp_show_page_trace=0|0; PHPSESSID=r70uj117scuoljolafdbss7ev2; _bl_uid=dbla46a44hdqtL6n5mna11Cb3s7X; thinkphp_show_page_trace=0|0; merchantInfo=%7B%22name%22%3A%22%5Cu5434%5Cu96ea%5Cu83b2++svip2%22%2C%22merchantSSID%22%3A%22r70uj117scuoljolafdbss7ev2%22%7D; kfInfo=%7B%22name%22%3A%22%5Cu4f01%5Cu4e1a%5Cu7248-%5Cu94c2%5Cu91d1-%5Cu5434%5Cu96ea%5Cu83b2++svip2-18022617167%22%2C%22metadata%22%3A%5B%7B%22name%22%3A%22%5Cu8d26%5Cu6237%5Cu7f16%5Cu53f7%22%2C%22value%22%3A%2218022617167%22%7D%2C%7B%22name%22%3A%22%5Cu7fa4%5Cu7ec4%5Cu7b49%5Cu7ea7%22%2C%22value%22%3A%22%5Cu4f01%5Cu4e1a%5Cu7248%22%7D%2C%7B%22name%22%3A%22%5Cu5b63%5Cu5ea6%5Cu4ef7%5Cu683c%5Cu7b49%5Cu7ea7%22%2C%22value%22%3A%22%5Cu94c2%5Cu91d1%22%7D%5D%7D; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2218022617167%22%2C%22first_id%22%3A%2218243d0f105dc5-0839975a3fe9868-1c525635-2073600-18243d0f106c08%22%2C%22props%22%3A%7B%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfbG9naW5faWQiOiIxODAyMjYxNzE2NyIsIiRpZGVudGl0eV9jb29raWVfaWQiOiIxODI0M2QwZjEwNWRjNS0wODM5OTc1YTNmZTk4NjgtMWM1MjU2MzUtMjA3MzYwMC0xODI0M2QwZjEwNmMwOCJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2218022617167%22%7D%2C%22%24device_id%22%3A%2218243d0f105dc5-0839975a3fe9868-1c525635-2073600-18243d0f106c08%22%7D; UCSK_LAST_OPERATE_TIME=1658999144135; UCSDK_ONLINE_HOUR=1; merchantToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJncm91cFR5cGUiOjEsImlzU3VwZXJNYW5hZ2VyIjpmYWxzZSwiZ3JvdXBJZCI6MjMxLCJjdXN0b21lcklkIjoyMzEsInNlc3Npb25JZCI6IjRkYjJkMWIzZThmNDQxMGQ4MjdhYTY3MDRhOTcxNzI2IiwiaXNTVmlwIjp0cnVlLCJ1c2VySWQiOjIzMSwicGxhdGZvcm0iOjEsInVzZXJuYW1lIjoid3V4dWVsaWFuIn0.3Up9-21HVDi2lzjkFJdYBAajyZo7n-sNtVrQgsYHGxbwCMWPt8bpd8BEwfcEQl2kdV_DyYgkiCLxdqc0uuDqtw; UCSDK_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJncm91cFR5cGUiOjEsImlzU3VwZXJNYW5hZ2VyIjpmYWxzZSwiZ3JvdXBJZCI6MjMxLCJjdXN0b21lcklkIjoyMzEsInNlc3Npb25JZCI6IjRkYjJkMWIzZThmNDQxMGQ4MjdhYTY3MDRhOTcxNzI2IiwiaXNTVmlwIjp0cnVlLCJ1c2VySWQiOjIzMSwicGxhdGZvcm0iOjEsInVzZXJuYW1lIjoid3V4dWVsaWFuIn0.3Up9-21HVDi2lzjkFJdYBAajyZo7n-sNtVrQgsYHGxbwCMWPt8bpd8BEwfcEQl2kdV_DyYgkiCLxdqc0uuDqtw; UCSDK_EXPIRES_TIME=1659002744419; bannerNotice=3");
        },
        pathRewrite: {
          "^/api/": "/",
        },
      },
      "/mockapi": {
        target: `http://192.168.3.31:3000/`,
        pathRewrite: {
          "^/mockapi/": "/mock/564/",
        }
      }
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/_handle.scss";`,
      },
    },
  },
  configureWebpack: {
    output: {
      filename: "static/js/[name].js",
      chunkFilename: "static/js/[name].js",
    },
    optimization: {
      // minimizer: false,
      minimizer: [
        new TerserPlugin({
          sourceMap: false,
        }),
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "public/static", to: `static` }],
      }),
    ],
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "development") return config;
    config.plugin("extract-css").tap(() => [
      {
        filename: "static/css/[name].css",
        chunkFilename: "static/css/[name].css",
      },
    ]);
    config.module
      .rule("svg")
      .use("file-loader")
      .tap((options) => {
        options.publicPath = (url, resourcePath, context) => {
          return `${process.env.PUBLIC_PATH}/${url}`;
        };
        return options;
      });
    config.module
      .rule("images")
      .use("url-loader")
      .tap((options) => {
        options.fallback.options.publicPath = (url, resourcePath, context) => {
          return `${process.env.PUBLIC_PATH}/${url}`;
        };
        return options;
      });
  },
};
