'use strict';

const fs = require('fs');
const path = require('path');

if (process.argv.length <= 2) {
  console.log('请输入输入指定的环境,具体可以查看env.js')
  return
}

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

let envMode = process.argv[2];
let envPath = "./src/jsonEnv/" + envMode + ".json";
envPath = resolve(envPath);

fs.exists(envPath, function (exists) {
  if (exists) {
    replaceJson(envPath, envMode)
  } else {
    console.log('指定的环境没有配置,请在jsonEnv文件夹下进行配置')
  }
});

function replaceJson(envPath, envMode) {
  let ext = fs.readFileSync(envPath);
  let extJSON = JSON.parse(ext);
  let appid = extJSON['ext']['appid'];
  let manifestPath = resolve('./src/manifest.json');
  let manifest = fs.readFileSync(manifestPath);
  let manifestJSON = JSON.parse(manifest);
  manifestJSON['mp-weixin']['appid'] = appid;
  let newManifestJSON = JSON.stringify(manifestJSON, "", "\t");
  let newextJSON = JSON.stringify(extJSON, "", "\t");
  let config = extJSON.ext;
  let configText = JSON.stringify(config, "", "\t");
  configText = `const config = ${configText};
  export default config;`
  fs.writeFileSync('./src/ext.json', newextJSON);
  fs.writeFileSync('./src/manifest.json', newManifestJSON);
  fs.writeFileSync('./src/utils/config.ts', configText);
  writeEnv(envMode);
  console.log('已经成功替换为' + envMode + "环境")
  process.exit(0)
}

function writeEnv(envMode) {
  let envpath = resolve('./src/utils/env.ts');
  let envText = `
	const env = {
		NODE_ENV: "${envMode}",
	}
	export default env`
  fs.writeFileSync(envpath, envText);
}