#!/bin/bash

# ============================================
# 发布到 npm 仓库的脚本
# ============================================
# 
# 使用方法:
#   ./publish.sh [patch|minor|major]
# 
# 参数说明:
#   patch - 补丁版本 1.0.0 -> 1.0.1 (默认)
#   minor - 次版本   1.0.0 -> 1.1.0
#   major - 主版本   1.0.0 -> 2.0.0
# 
# ============================================

set -e

# 从 .env 文件加载环境变量
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

NPM_TOKEN=${NPM_TOKEN:?'请在 .env 文件中设置 NPM_TOKEN'}

VERSION_TYPE=${1:-patch}

echo "准备发布 $VERSION_TYPE 版本..."

# 切换到 npm 官方源
npm config set registry https://registry.npmjs.org/

# 设置 token
npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN

# 发布完成后清理 token 和恢复镜像源
cleanup() {
  npm config delete //registry.npmjs.org/:_authToken 2>/dev/null
  npm config set registry https://registry.npmmirror.com
}
trap cleanup EXIT

# 先更新版本号
npm version $VERSION_TYPE --no-git-tag-version

NEW_VERSION=$(node -p "require('./package.json').version")
echo "新版本: $NEW_VERSION"

# 发布，失败则回退版本号
if npm publish; then
  echo "发布成功: md2ui@$NEW_VERSION"
else
  echo "发布失败，回退版本号..."
  git checkout package.json 2>/dev/null || true
  exit 1
fi

echo "完成"
