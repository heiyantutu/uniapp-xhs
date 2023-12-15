# songzan

松赞定制项目uniapp

## 技术栈
基于uniapp开发的多平台小程序,H5项目.使用vue3+typeScript+vite.

1.uniapp文档地址:https://uniapp.dcloud.net.cn/
2.vue3文档地址:https://vuejs.org/
3.typescript文档地址:https://www.typescriptlang.org/

## 文件目录结构

src为源代码目录 pages到pagesF为页面 base为基础组件 components是业务组件 hooks为vue3组件复用代码 interface为类型定义
jsonEnv为不同环境的json配置 配合switchEnv 构建不同环境的松赞小程序或者H5的环境产出

## 构建脚本

1.运行代码
微信:npm run dev:mp-weixin
小红书:npm run dev:mp-xhs
h5:npm run dev:h5

2.打包代码
微信:npm run build:mp-weixin
小红书:npm run build:mp-xhs
h5:npm run build:h5

产出的文件在 dist文件下的 build或者dev文件夹内