# 封狼居胥 - TypeScript 代码导入指南

**创建日期**: 2026-04-16  
**Cocos Creator 版本**: 3.8.x

---

## 📁 项目目录结构

```
fenglangjxu-autochess/
├── assets/
│   ├── scripts/
│   │   ├── core/          # ← 复制以下 core 目录文件
│   │   ├── chess/         # ← 复制以下 chess 目录文件
│   │   ├── battle/        # ← 复制以下 battle 目录文件
│   │   ├── economy/       # ← 复制以下 economy 目录文件
│   │   ├── shop/          # ← 复制以下 shop 目录文件
│   │   ├── ai/            # ← 复制以下 ai 目录文件
│   │   └── utils/         # ← 复制以下 utils 目录文件
│   └── ...
├── settings/
└── ...
```

---

## 📝 需要导入的 TypeScript 文件

### core/ 目录
```
/workspace/assets/scripts/core/
├── GameManager.ts          → 复制到 fenglangjxu-autochess/assets/scripts/core/
├── EventSystem.ts          → 复制到 fenglangjxu-autochess/assets/scripts/core/
└── ThemeManager.ts         → 复制到 fenglangjxu-autochess/assets/scripts/core/
```

### chess/ 目录
```
/workspace/assets/scripts/chess/
├── ChessData.ts            → 复制到 fenglangjxu-autochess/assets/scripts/chess/
├── Chess.ts                → 复制到 fenglangjxu-autochess/assets/scripts/chess/
└── ClassChangeSystem.ts    → 复制到 fenglangjxu-autochess/assets/scripts/chess/
```

### battle/ 目录
```
/workspace/assets/scripts/battle/
├── SynergyCalculator.ts    → 复制到 fenglangjxu-autochess/assets/scripts/battle/
└── BattleSystem.ts         → 复制到 fenglangjxu-autochess/assets/scripts/battle/
```

### economy/ 目录
```
/workspace/assets/scripts/economy/
└── EconomySystem.ts        → 复制到 fenglangjxu-autochess/assets/scripts/economy/
```

### shop/ 目录
```
/workspace/assets/scripts/shop/
└── ShopSystem.ts           → 复制到 fenglangjxu-autochess/assets/scripts/shop/
```

### ai/ 目录
```
/workspace/assets/scripts/ai/
└── BattleAI.ts             → 复制到 fenglangjxu-autochess/assets/scripts/ai/
```

### utils/ 目录
```
/workspace/assets/scripts/utils/
└── ResourceManager.ts      → 复制到 fenglangjxu-autochess/assets/scripts/utils/
```

---

## 🔧 快速复制命令

在终端中执行以下命令（Linux/Mac）：

```bash
# 设置源目录和目标目录
SOURCE_DIR="/workspace/assets/scripts"
TARGET_DIR="/workspace/fenglangjxu-autochess/assets/scripts"

# 复制 core 目录
cp "$SOURCE_DIR/core/GameManager.ts" "$TARGET_DIR/core/"
cp "$SOURCE_DIR/core/EventSystem.ts" "$TARGET_DIR/core/"
cp "$SOURCE_DIR/core/ThemeManager.ts" "$TARGET_DIR/core/"

# 复制 chess 目录
cp "$SOURCE_DIR/chess/ChessData.ts" "$TARGET_DIR/chess/"
cp "$SOURCE_DIR/chess/Chess.ts" "$TARGET_DIR/chess/"
cp "$SOURCE_DIR/chess/ClassChangeSystem.ts" "$TARGET_DIR/chess/"

# 复制 battle 目录
cp "$SOURCE_DIR/battle/SynergyCalculator.ts" "$TARGET_DIR/battle/"
cp "$SOURCE_DIR/battle/BattleSystem.ts" "$TARGET_DIR/battle/"

# 复制 economy 目录
cp "$SOURCE_DIR/economy/EconomySystem.ts" "$TARGET_DIR/economy/"

# 复制 shop 目录
cp "$SOURCE_DIR/shop/ShopSystem.ts" "$TARGET_DIR/shop/"

# 复制 ai 目录
cp "$SOURCE_DIR/ai/BattleAI.ts" "$TARGET_DIR/ai/"

# 复制 utils 目录
cp "$SOURCE_DIR/utils/ResourceManager.ts" "$TARGET_DIR/utils/"
```

---

## ✅ 验证导入

### 1. 检查文件数量

```bash
# 应该显示：12 个 TypeScript 文件
find fenglangjxu-autochess/assets/scripts -name "*.ts" | wc -l
```

### 2. 检查目录结构

```bash
# 查看完整目录树
tree fenglangjxu-autochess/assets/scripts

# 应该是这样的结构:
assets/scripts/
├── core/
│   ├── GameManager.ts
│   ├── EventSystem.ts
│   └── ThemeManager.ts
├── chess/
│   ├── ChessData.ts
│   ├── Chess.ts
│   └── ClassChangeSystem.ts
├── battle/
│   ├── SynergyCalculator.ts
│   └── BattleSystem.ts
├── economy/
│   └── EconomySystem.ts
├── shop/
│   └── ShopSystem.ts
├── ai/
│   └── BattleAI.ts
└── utils/
    └── ResourceManager.ts
```

---

## 🎮 在 Cocos Creator 中打开项目

### 1. 启动 Cocos Creator

```bash
# 打开 Cocos Creator 3.8.x
# 项目 → 打开 → 选择 fenglangjxu-autochess 目录
```

### 2. 等待资源刷新

- Cocos Creator 会自动导入 TypeScript 文件
- 控制台应该显示"编译成功"
- 检查"资源管理器"中的 scripts 目录

### 3. 验证 TypeScript 编译

- 打开 Cocos Creator 的"编辑器" → "偏好设置"
- 确保"TypeScript"已启用
- 查看"控制台"是否有编译错误

---

## 🔍 常见问题解决

### 问题 1: TypeScript 编译错误

**症状**: 控制台显示大量红色错误

**解决方法**:
```bash
# 1. 删除临时文件
rm -rf fenglangjxu-autochess/temp/
rm -rf fenglangjxu-autochess/library/

# 2. 重新打开 Cocos Creator
# 项目 → 刷新
```

### 问题 2: 模块找不到

**症状**: `Cannot find module 'cc'`

**解决方法**:
```bash
# 确保安装了 Cocos Creator 类型定义
cd fenglangjxu-autochess
npm install --save-dev @types/cc
```

### 问题 3: 路径别名不生效

**症状**: `@core/*` 等路径无法解析

**解决方法**:
1. 确认 tsconfig.json 在项目根目录
2. 重启 Cocos Creator
3. 检查 tsconfig.json 中的 paths 配置

---

## 📋 下一步工作

### 导入代码后的工作清单

1. **创建入口脚本**
   - 在 `assets/scripts/` 创建 `Main.ts`
   - 初始化 GameManager 和 EventSystem

2. **创建场景**
   - loading.scene - 加载场景
   - main_menu.scene - 主菜单
   - lobby.scene - 大厅
   - battle.scene - 战斗场景

3. **创建预制体**
   - Chess.prefab - 棋子预制体
   - ShopSlot.prefab - 商店格子
   - HPBar.prefab - 血条预制体

4. **导入美术资源**
   - 棋子立绘 (使用 AI 提示词生成)
   - UI 资源
   - 背景图片

---

## 📞 需要帮助？

如果遇到任何问题，请查看：
- `cocos-project-setup.md` - 完整的项目配置指南
- `typescript-implementation-summary.md` - 代码功能说明
- Cocos Creator 官方文档：https://docs.cocos.com/creator/3.8/

---

**文档版本**: v1.0  
**最后更新**: 2026-04-16
