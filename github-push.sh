#!/bin/bash

# 一键推送到 GitHub 脚本
# 使用方法：bash github-push.sh <repository-name> [--public|--private]

set -e

echo "================================="
echo "  推送到 GitHub"
echo "================================="
echo ""

# 检查是否提供了仓库名
if [ -z "$1" ]; then
    echo "❌ 错误：请提供 GitHub 仓库名"
    echo ""
    echo "使用方法:"
    echo "  bash github-push.sh <repository-name>"
    echo "  bash github-push.sh fenglangjxu-autochess"
    echo ""
    exit 1
fi

REPO_NAME="$1"
VISIBILITY="${2:---private}"

echo "📦 仓库名：$REPO_NAME"
echo "🔒 可见性：$VISIBILITY"
echo ""

# 检查是否已安装 gh 工具
if command -v gh &> /dev/null; then
    echo "✅ 检测到 GitHub CLI"
    echo ""
    
    # 检查是否已登录
    if gh auth status &> /dev/null; then
        echo "✅ 已登录 GitHub"
        echo ""
        
        # 创建仓库
        echo "🚀 创建 GitHub 仓库..."
        gh repo create "$REPO_NAME" $VISIBILITY --source=. --remote=origin --push
        
        echo ""
        echo "✅ 推送成功!"
        echo ""
        echo "📍 仓库地址:"
        echo "   https://github.com/$(gh api user | jq -r .login)/$REPO_NAME"
        echo ""
    else
        echo "⚠️  未登录 GitHub"
        echo ""
        echo "请先执行以下命令登录:"
        echo "  gh auth login"
        echo ""
        echo "或者使用手动推送方式，详见 GITHUB_PUSH_GUIDE.md"
        exit 1
    fi
else
    echo "⚠️  未检测到 GitHub CLI (gh)"
    echo ""
    echo "请使用手动推送方式:"
    echo ""
    echo "  1. 在 GitHub 上创建新仓库:"
    echo "     https://github.com/new"
    echo "     仓库名：$REPO_NAME"
    echo ""
    echo "  2. 执行以下命令:"
    echo "     git remote add origin https://github.com/<your-username>/$REPO_NAME.git"
    echo "     git push -u origin master"
    echo ""
    echo "详见：GITHUB_PUSH_GUIDE.md"
    echo ""
fi
