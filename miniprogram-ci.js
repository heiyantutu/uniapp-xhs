const ci = require('miniprogram-ci')
const path = require('path')
const project = new ci.Project({
	appid: 'wx4e7176eb9d8c5ea4',
	type: 'miniProgram',
	projectPath: path.resolve(__dirname,'./dist/build/mp-weixin'),
	privateKeyPath: path.resolve(__dirname,'./ci-private.key'),
	ignores: ['node_modules/**/*'],
})
ci.upload({
	project,
	version: '3.8.1',
	desc: 'ci自动构建测试',
	setting: {
		minify: true, // 压缩所有代码，对应开发者工具的“压缩代码”
		es6: false, // 对应小程序开发者工具的 “es6 转 es5”
		minifyJS: true, // 压缩 JS 代码
		minifyWXML: true, // 压缩 WXML 代码
		minifyWXSS: true, // 压缩 WXSS 代码
		autoPrefixWXSS: false // 对应小程序开发者工具的 “样式自动补全”
	},
	onProgressUpdate: console.log,
}).then(res=>{
  console.log(res)
})
  