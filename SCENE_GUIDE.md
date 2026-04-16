/**
 * 封狼居胥 - 创建场景指南
 * 
 * 详细说明如何在 Cocos Creator 中创建 4 个核心场景
 */

# 场景创建指南

**创建日期**: 2026-04-16  
**Cocos Creator 版本**: 3.8.x

---

## 🎯 需要创建的场景

### 1. loading.scene (加载场景) - 简单
**用途**: 游戏启动后的第一个场景，显示 LOGO 和进度条

**节点结构**:
```
Canvas
├── bgImage (Sprite)              # 深色背景
├── gameLogo (Sprite)             # 游戏 LOGO
├── progressBar (ProgressBar)     # 进度条
│   ├── bar (Sprite)
│   └── label (Label)             # 百分比文字
└── lblLoading (Label)            # "加载中..."
```

**脚本**: LoadingController.ts

---

### 2. main_menu.scene (主菜单) - 中等 ⭐ 已创建脚本
**用途**: 游戏主菜单，显示开始/设置/收藏按钮

**节点结构**:
```
Canvas
├── bgImage (Sprite)              # 背景图
├── gameTitle (Label)             # 游戏标题
├── btnStart (Button)             # 开始游戏
│   ├── background (Sprite)
│   └── Label
├── btnSettings (Button)          # 设置按钮
├── btnCollection (Button)        # 收藏按钮
├── btnSkin (Button)              # 换肤按钮
└── playerInfo (Node)
    ├── lblPlayerName (Label)
    ├── lblPlayerLevel (Label)
    └── lblGold (Label)
```

**脚本**: MainMenuController.ts ✅ 已完成

---

### 3. lobby.scene (大厅) - 中等
**用途**: 匹配对手、查看棋子的地方

**节点结构**:
```
Canvas
├── pnlTop (Node)                 # 顶部信息栏
│   ├── lblPlayerLevel
│   ├── lblGold
│   └── btnSettings
├── pnlCenter (Node)              # 中央区域
│   ├── btnMatch (Button)         # 匹配按钮
│   ├── btnPractice (Button)      # 练习模式
│   └── lblChessDisplay           # 展示的棋子
├── pnlBottom (Node)              # 底部按钮
│   ├── btnChessCollection
│   ├── btnBattleRecord
│   └── btnShop
└── panelThemes (Node)            # 主题选择面板 (可隐藏)
```

**脚本**: LobbyController.ts (待创建)

---

### 4. battle.scene (战斗) - 复杂 ⭐⭐⭐
**用途**: 主要战斗场景，包含棋盘、商店、UI 等

**节点结构**:
```
Canvas
├── pnlTop (Node)                 # 顶部信息
│   ├── lblRound (Label)          # 回合数
│   ├── lblTimer (Label)          # 倒计时
│   └── playerList (Node)         # 玩家列表 (8 个玩家头像/血量)
├── pnlLeft (Node)                # 左侧
│   └── chessList (Node)          # 我方棋子列表 (替补席)
├── pnlRight (Node)               # 右侧
│   ├── pnlBond (Node)            # 羁绊信息面板
│   └── pnlPlayerInfo (Node)      # 玩家信息
├── pnlBottom (Node)              # 底部
│   ├── pnlShop (Node)            # 商店面板
│   │   ├── shopSlots (Node) * 5  # 5 个商店格子
│   │   ├── btnRefresh (Button)   # 刷新按钮
│   │   └── btnLevelUp (Button)   # 升级按钮
│   └── pnlOperation (Node)       # 操作按钮
│       ├── btnSell (Button)      # 卖出模式
│       └── btnLock (Button)      # 锁定商店
└── BattleCanvas (特殊 Canvas)    # 战斗层
    └── chessboard (Node)         # 棋盘 (1200x800)
        └── chessList (Node)      # 战场上的棋子容器
```

**脚本**: BattleController.ts (待创建)

---

## 🛠️ 创建步骤

### 步骤 1: 创建新场景

1. 在 Cocos Creator 中
2. `File → New Scene → Empty`
3. `File → Save As → assets/scenes/main_menu.scene`

### 步骤 2: 添加 Canvas

1. 右键 Hierarchy → `Create → 2D → Canvas`
2. 设置 Canvas 属性:
   - Design Resolution: 1280 x 720
   - Fit Height: ✓
   - Fit Width: ✓

### 步骤 3: 创建 UI 元素

1. 右键 Canvas → `Create → 2D → Sprite → Sprite`
2. 选中 Sprite，在 Inspector 中修改:
   - Color (纯色背景)
   - Size (宽高)

### 步骤 4: 创建按钮

1. 右键 Canvas → `Create → 2D → Button - Button`
2. 修改按钮文字:
   - 展开 Button 节点
   - 选中 Label 子节点
   - 修改 string 属性

### 步骤 5: 添加脚本

1. 右键节点 → `Add Component → TypeScript`
2. 选择对应的脚本 (如 MainMenuController)
3. 拖拽节点绑定属性

### 步骤 6: 保存场景

`File → Save Scene` (Ctrl/Cmd + S)

---

## 📝 详细创建教程 (以 main_menu 为例)

### 1. 创建场景

```bash
1. Cocos Creator → File → New Scene → Empty
2. File → Save As → assets/scenes/main_menu.scene
```

### 2. 添加 Canvas

```
Properties:
- Design Resolution: Width=1280, Height=720
- Fit Mode: Fit Width
```

### 3. 创建背景

```
1. 右键 Canvas → Create → 2D → Sprite
2. 重命名为 bgImage
3. 设置 Color: r=30, g=30, b=60 (深蓝色)
4. 设置 Size：Width=1280, Height=720
```

### 4. 创建标题

```
1. 右键 Canvas → Create → 2D → Label
2. 重命名为 gameTitle
3. 设置:
   - string: "封狼居胥"
   - Font Size: 72
   - Color: 金色 (255, 215, 0)
4. Position: (0, 250, 0)
```

### 5. 创建开始按钮

```
1. 右键 Canvas → Create → 2D → Button
2. 重命名为 btnStart
3. Position: (0, 50, 0)
4. Size: Width=200, Height=60
5. 修改 Label string: "开始游戏"
6. 修改 Label Font Size: 28
```

### 6. 创建其他按钮

重复步骤 5，创建:
- btnSettings (设置)
- btnCollection (收藏)
- btnSkin (换肤)

### 7. 创建玩家信息面板

```
1. 创建空节点 playerInfo
2. 添加 3 个 Label 子节点:
   - lblPlayerName
   - lblPlayerLevel
   - lblGold
3. 调整位置和文字
```

### 8. 添加脚本

```
1. 创建空节点 MainMenu
2. Add Component → TypeScript → MainMenuController
3. 绑定属性:
   - btnStart → drag btnStart node
   - btnSettings → drag btnSettings node
   - lblPlayerName → drag lblPlayerName node
   - ... etc
```

### 9. 保存并测试

```
1. Ctrl + S 保存场景
2. 点击 Play 按钮
3. 点击各个按钮测试
```

---

## 🎨 临时美术方案

如果还没有美术资源，使用以下临时方案:

### 1. 纯色背景
```typescript
Sprite.color = Color(30, 30, 60) // 深蓝色
```

### 2. 简单按钮
```typescript
使用 Cocos 默认按钮样式
Background: Sprite
Label: 白色文字
```

### 3. 占位图标
```
使用内置 SpriteFrame
或创建纯色矩形代替
```

---

## ⚡ 快捷键

- `Ctrl/Cmd + N` - 新建场景
- `Ctrl/Cmd + S` - 保存场景
- `Ctrl/Cmd + D` - 复制节点
- `Ctrl/Cmd + Shift + D` - 复制并添加后缀
- `F` - 聚焦选中节点
- `W/E/R` - 移动/缩放/旋转工具

---

## ✅ 场景清单

- [ ] loading.scene - 加载场景
- [ ] main_menu.scene - 主菜单 ✅ 脚本完成
- [ ] lobby.scene - 大厅
- [ ] battle.scene - 战斗

---

## 📚 参考

- [Cocos Creator 场景文档](https://docs.cocos.com/creator/3.8/manual/zh/asset/scene.html)
- [MainMenuController.ts](../assets/scripts/ui/MainMenuController.ts)
- [UIManager.ts](../assets/scripts/core/UIManager.ts)

---

**最后更新**: 2026-04-16
