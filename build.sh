#!/bin/bash

# 通过命令行参数传递环境参数
ENVIRONMENT="$1"

# 检查环境参数是否为空
if [ -z "$ENVIRONMENT" ]; then
  echo "请提供环境参数，例如：./build.sh prod"
  exit 1
fi

# 运行命令
node switchEnv $ENVIRONMENT && npx uni build -p mp-weixin && node miniprogram-ci