#!/bin/bash

# 封狼居胥 - TypeScript 代码导入脚本
# 使用方法：bash import-code.sh

set -e

echo "================================="
echo "  封狼居胥 - TypeScript 代码导入"
echo "================================="
echo ""

# 设置目录
SOURCE_DIR="/workspace/assets/scripts"
TARGET_DIR="/workspace/fenglangjxu-autochess/assets/scripts"

# 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ 错误：源目录不存在 $SOURCE_DIR"
    exit 1
fi

# 检查目标目录是否存在
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ 错误：目标目录不存在 $TARGET_DIR"
    echo "请先创建 Cocos Creator 项目"
    exit 1
fi

echo "📁 源目录：$SOURCE_DIR"
echo "📁 目标目录：$TARGET_DIR"
echo ""

# 复制文件函数
copy_files() {
    local subdir=$1
    local source="$SOURCE_DIR/$subdir"
    local target="$TARGET_DIR/$subdir"
    
    if [ -d "$source" ]; then
        echo "📋 复制 $subdir/ ..."
        
        # 确保目标目录存在
        mkdir -p "$target"
        
        # 复制所有 .ts 文件
        cp -f "$source"/*.ts "$target/" 2>/dev/null || true
        
        # 统计数量
        local count=$(ls "$target"/*.ts 2>/dev/null | wc -l)
        if [ $count -gt 0 ]; then
            echo "   ✅ 复制了 $count 个文件"
        else
            echo "   ⚠️  没有找到 .ts 文件"
        fi
    else
        echo "   ⚠️  跳过 $subdir/ (不存在)"
    fi
}

# 逐个目录复制
echo "🚀 开始复制..."
echo ""

copy_files "core"
copy_files "chess"
copy_files "battle"
copy_files "economy"
copy_files "shop"
copy_files "ai"
copy_files "utils"

echo ""

# 复制 Main.ts
if [ -f "$SOURCE_DIR/../Main.ts" ]; then
    echo "📋 复制 Main.ts (游戏入口)..."
    cp -f "$SOURCE_DIR/../Main.ts" "$TARGET_DIR/"
    echo "   ✅ Main.ts 已复制"
    echo ""
fi

# 统计总数
echo "📊 统计:"
total=$(find "$TARGET_DIR" -name "*.ts" -type f | wc -l)
echo "   总计：$total 个 TypeScript 文件"
echo ""

# 验证核心文件
echo "🔍 验证核心文件:"

core_files=(
    "core/GameManager.ts"
    "core/EventSystem.ts"
    "core/ThemeManager.ts"
    "chess/ChessData.ts"
    "chess/Chess.ts"
    "chess/ClassChangeSystem.ts"
    "battle/SynergyCalculator.ts"
    "battle/BattleSystem.ts"
    "economy/EconomySystem.ts"
    "shop/ShopSystem.ts"
    "ai/BattleAI.ts"
    "utils/ResourceManager.ts"
)

all_exist=true
for file in "${core_files[@]}"; do
    if [ -f "$TARGET_DIR/$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (缺失)"
        all_exist=false
    fi
done

echo ""

if [ "$all_exist" = true ]; then
    echo "✅ 所有核心文件导入成功!"
    echo ""
    echo "================================="
    echo "  下一步:"
    echo "================================="
    echo "  1. 打开 Cocos Creator 3.8.x"
    echo "  2. 打开项目：fenglangjxu-autochess"
    echo "  3. 等待资源刷新完成"
    echo "  4. 创建场景并添加 Main 组件"
    echo "  5. 运行测试"
    echo "================================="
else
    echo "⚠️  部分文件缺失，请检查错误信息"
    exit 1
fi
