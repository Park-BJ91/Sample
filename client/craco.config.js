const path = require('path'); // EMS 지원 X


module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensions.push('.json');
      return webpackConfig;
    },
    alias: {
      "@components": path.resolve(__dirname, "src/components/"),
      "@pages": path.resolve(__dirname, "src/pages/"),
      "@hooks": path.resolve(__dirname, "src/hooks/"),
      "@utils": path.resolve(__dirname, "src/utils/"),
      "@api": path.resolve(__dirname, "src/api/"),
      "@root": path.resolve(__dirname, "src/"),
      "@models": path.resolve(__dirname, "src/models/"),
    },
  },
  devServer: {
    proxy: {
      "/api": "http://localhost:4000",

    }
  }
};