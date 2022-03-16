/*
 * @Author: your name
 * @Date: 2022-03-15 18:34:46
 * @LastEditTime: 2022-03-16 10:17:25
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vuecli-preset-demo\generator.js
 */
module.exports = (api, options, rootOptions) => {
  api.extendPackage({
    // 命令
    scripts: {
      "serve": "vue-cli-service serve",
      "build": "vue-cli-service build",
      "lint": "vue-cli-service lint"
    },
    lintstaged: {
      "*.{js,vue}": [
        "vue-cli-service lint",
        "git add"
      ]
    },
    gitHooks: {
      "pre-commit": "lint-staged",
      "commit-msg": "node scripts/verifyCommitMsg.js"
    },
    dependencies: {
      "core-js": "^3.6.4",
      "terser-webpack-plugin": "^2.3.5",
      "vue": "^2.6.11",
      "vue-router": "^3.1.5",
      "vuex": "^3.1.2",
      "@mdi/font": "^5.1.45",
      "echarts": "^4.6.0",
      "roboto-fontface": "*",

    },
    devDependencies: {
      "@vue/cli-plugin-babel": "~4.2.0",
      "@vue/cli-plugin-eslint": "~4.2.0",
      "@vue/cli-plugin-router": "~4.2.0",
      "@vue/cli-plugin-vuex": "~4.2.0",
      "@vue/cli-service": "~4.2.0",
      "@vue/eslint-config-prettier": "^6.0.0",
      "babel-eslint": "^10.0.3",
      "eslint": "^6.7.2",
      "eslint-plugin-prettier": "^3.1.1",
      "eslint-plugin-vue": "^6.1.2",
      "sass": "^1.19.0",
      "sass-loader": "^8.0.0",
      "lint-staged": "^9.5.0",
      "prettier": "^1.19.1",
      "vue-template-compiler": "^2.6.11",
      "axios": "^0.19.0",
      "commitizen": "^4.1.2",
      "compression-webpack-plugin": "^3.0.1",
      "cz-conventional-changelog": "^3.1.0",
      "cz-customizable": "^6.2.0",
      "vue-cli-plugin-vuetify": "^2.0.2",
      "vuetify": "^2.3.13",
      "vuetify-loader": "^1.3.0"

    },
    config: {
      "commitizen": {
        "path": "./node_modules/cz-customizable"
      }
    }
  });
  // 复制template模版
  api.render('../template');
};

