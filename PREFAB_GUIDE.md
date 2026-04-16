# 封狼居胥 - 预制体创建指南

**创建日期**: 2026-04-16  
**Cocos Creator 版本**: 3.8.x

---

## 📋 待创建的预制体 (P0 优先级)

### 1. Chess.prefab (棋子预制体) ⭐⭐⭐

**文件路径**: `assets/prefabs/chess/Chess.prefab`

**节点结构**:
```
Chess (Node) [Chess.ts]
├── spriteChess (Node) [Sprite]
│   └── icon (Sprite)          # 棋子立绘
├── starNode (Node)
│   ├── star1 (Sprite)
│   ├── star2 (Sprite)
│   └── star3 (Sprite)
├── hpBar (Node)
│   ├── bg (Sprite)
│   └── bar (Sprite)           # 红色血条
├── energyBar (Node)
│   ├── bg (Sprite)
│   └── bar (Sprite)           # 蓝色能量条
├── buffNode (Node)            # Buff 图标容器
├── effectNode (Node)          # 特效容器
└── lblName (Label)            # 名称标签

组件:
- Chess (自定义脚本)
- Sprite (立绘)
- BoxCollider2D (碰撞)
```

**Chess.ts 脚本属性**:
```typescript
@property
chessId: string = ''           // 棋子 ID

@property
star: number = 1               // 星级

@property
team: 'friendly' | 'enemy' = 'friendly'

// 显示组件
@property
spriteIcon: Sprite = null

@property
hpBar: Sprite = null

@property
energyBar: Sprite = null

@property
starNodes: Node[] = []

@property
lblName: Label = null
```

---

### 2. ShopSlot.prefab (商店格子) ⭐⭐⭐

**文件路径**: `assets/prefabs/ui/ShopSlot.prefab`

**节点结构**:
```
ShopSlot (Node) [ShopSlot.ts]
├── bg (Sprite)                # 背景框
├── chessIcon (Node)
│   └── icon (Sprite)          # 棋子图标
├── costNode (Node)
│   └── lblCost (Label)        # 费用 (金色)
├── countNode (Node)
│   └── lblCount (Label)       # 棋子池数量
├── lockIcon (Sprite)          # 锁定图标 (隐藏)
└── btnBuy (Button)
    ├── Background (Sprite)
    └── Label (Label)          # "购买"

组件:
- ShopSlot (自定义脚本)
- Button (购买按钮)
```

**ShopSlot.ts 脚本**:
```typescript
@property
lblCost: Label = null

@property
lblCount: Label = null

@property
spriteIcon: Sprite = null

@property
btnBuy: Button = null

@property
lockIcon: Sprite = null

// 数据
private chessId: string = ''
private cost: number = 0
private count: number = 0
```

---

### 3. HPBar.prefab (血条预制体) ⭐⭐

**文件路径**: `assets/prefabs/ui/HPBar.prefab`

**节点结构**:
```
HPBar (Node)
├── bg (Sprite)                # 背景 (灰色)
└── bar (Sprite)               # 血条 (红色/绿色)

组件:
- HPBar (自定义脚本)
- Sprite (bar)
```

**HPBar.ts 脚本**:
```typescript
@property
barSprite: Sprite = null

@property
barColorFull: Color = RED

@property
barColorLow: Color = YELLOW

setPercent(value: number) {
  // 0-1 之间的百分比
}

setCurrent(current: number, max: number) {
  const percent = current / max
  this.setPercent(percent)
}
```

---

### 4. EnergyBar.prefab (能量条) ⭐⭐

**文件路径**: `assets/prefabs/ui/EnergyBar.prefab`

**节点结构**:
```
EnergyBar (Node)
├── bg (Sprite)                # 背景 (深蓝色)
└── bar (Sprite)               # 能量条 (浅蓝色)
```

---

### 5. ChessInfo.prefab (棋子信息面板) ⭐

**文件路径**: `assets/prefabs/ui/ChessInfo.prefab`

**节点结构**:
```
ChessInfo (Node)
├── bg (Sprite)                # 背景框
├── chessIcon (Sprite)         # 棋子大图
├── lblName (Label)            # 名称
├── lblCamp (Label)            # 阵营
├── lblProfession (Label)      # 职业
├── starNode (Node)            # 星级显示
├── statsNode (Node)           # 属性面板
│   ├── lblHP (Label)
│   ├── lblAttack (Label)
│   ├── lblDefense (Label)
│   ├── lblSpeed (Label)
│   └── lblRange (Label)
├── skillNode (Node)
│   ├── lblSkillName (Label)
│   └── lblSkillDesc (Label)
├── bondNode (Node)            # 羁绊列表
└── btnClose (Button)          # 关闭按钮
```

---

### 6. BondPanel.prefab (羁绊面板) ⭐

**文件路径**: `assets/prefabs/ui/BondPanel.prefab`

**节点结构**:
```
BondPanel (Node)
└── bondList (Node)            # 羁绊列表容器
    └── BondItem (Prefab) * N  # 羁绊项预制体

BondItem:
├── lblName (Label)            # 羁绊名称
├── lblRequirement (Label)     # 需求 (3/5/7)
├── lblEffect (Label)          # 效果描述
└── progressBar (ProgressBar)  # 进度条
```

---

### 7. GoldPanel.prefab (金币面板) ⭐

**文件路径**: `assets/prefabs/ui/GoldPanel.prefab`

**节点结构**:
```
GoldPanel (Node)
├── iconGold (Sprite)          # 金币图标
├── lblGold (Label)            # 金币数量
├── btnRefresh (Button)        # 刷新按钮
│   └── lblCost (Label)        # 刷新费用 (2)
└── btnLevelUp (Button)        # 升级按钮
    └── lblCost (Label)        # 升级费用
```

---

## 🎨 美术资源需求

### 创建预制体前需要准备的美术资源

**UI 基础资源** (临时可用 Cocos 内置资源代替):
```
assets/resources/ui/
├── btn_normal.png             # 按钮背景
├── btn_pressed.png            # 按钮按下
├── panel_bg.png               # 面板背景
├── frame_common.png           # 普通边框
├── frame_rare.png             # 稀有边框
├── frame_epic.png             # 史诗边框
├── frame_legendary.png        # 传说边框
└── frame_mythic.png           # 神话边框
```

**棋子立绘** (临时占位):
```
assets/resources/chess/
└── placeholder.png            # 占位图 (蓝色方块)
```

**图标资源**:
```
assets/resources/icons/
├── icon_gold.png              # 金币图标
├── icon_diamond.png           # 钻石图标
├── icon_lock.png              # 锁定图标
├── star_1.png                 # 1 星图标
├── star_2.png                 # 2 星图标
└── star_3.png                 # 3 星图标
```

---

## 🔧 创建步骤 (Cocos Creator 3.8)

### 步骤 1: 准备场景

1. 打开 Cocos Creator
2. 打开项目 `fenglangjxu-autochess`
3. 创建空场景: `File → New Scene → Empty`
4. 保存为 `assets/scenes/prefab_work.scene`

### 步骤 2: 创建 Chess 预制体

```
1. 在层级管理器创建空节点 "Chess"
2. 添加子节点:
   - spriteChess (空节点)
     └─ icon (Sprite 组件)
   - starNode (空节点, 3 个子节点)
   - hpBar (2 个 Sprite 子节点)
   - energyBar (2 个 Sprite 子节点)
   - buffNode (空节点)
   - effectNode (空节点)
   - lblName (Label 组件)

3. 添加组件:
   - 选中 Chess 节点
   - 添加组件 → TypeScript → Chess
   
4. 绑定属性:
   - 将对应节点拖到属性面板
   
5. 保存为预制体:
   - 右键 Chess 节点 → Create → Prefab
   - 保存到 assets/prefabs/chess/Chess.prefab
```

### 步骤 3: 创建 ShopSlot 预制体

```
1. 创建空节点 "ShopSlot"
2. 添加子节点 (bg, chessIcon, costNode, countNode, lockIcon, btnBuy)
3. 添加 ShopSlot.ts 脚本
4. 绑定所有属性
5. 保存为预制体
```

### 步骤 4: 创建其他预制体

重复上述步骤，创建:
- HPBar.prefab
- EnergyBar.prefab
- ChessInfo.prefab
- BondPanel.prefab
- GoldPanel.prefab

---

## ⚡ 快速创建脚本

在 Cocos Creator 中，可以使用以下脚本快速创建:

```typescript
// 在任意脚本中调用
import { _decorator, Node, Sprite, Label, Button } from 'cc'

function createChessPrefab() {
  const node = new Node('Chess')
  
  // 创建子节点
  const spriteNode = new Node('spriteChess')
  const icon = spriteNode.addComponent(Sprite)
  spriteNode.parent = node
  
  // ... 继续创建其他子节点
  
  // 添加 Chess 组件
  node.addComponent(Chess)
  
  return node
}
```

---

## 📝 临时方案 (美术资源未完成时)

### 临时方案 A: 使用 Cocos 内置资源

```typescript
// 使用内置 SpriteFrame
const spriteFrame = new SpriteFrame()
spriteFrame.rect = new Rect(0, 0, 100, 100)
```

### 临时方案 B: 使用颜色代替

```typescript
// 创建纯色背景
const node = new Node()
const sprite = node.addComponent(Sprite)
sprite.color = new Color(255, 0, 0, 255) // 红色
```

### 临时方案 C: 创建占位资源

```bash
# 在 assets/resources/下创建文件夹
mkdir -p assets/resources/chess
mkdir -p assets/resources/ui

# 创建占位说明文件
echo "待导入美术资源" > assets/resources/chess/README.md
```

---

## ✅ 验收标准

创建完成后应满足:

- [ ] Chess.prefab 可在场景中实例化
- [ ] 棋子能正确显示星级/血条/能量条
- [ ] ShopSlot.prefab 的购买按钮可点击
- [ ] 血条能根据当前值更新显示
- [ ] 所有预制体有正确的 TypeScript 脚本
- [ ] 属性已绑定到对应节点
- [ ] 无控制台错误

---

## 📚 参考文档

- [Cocos Creator 预制体文档](https://docs.cocos.com/creator/3.8/manual/zh/asset/prefab.html)
- [Chess.ts 源码](../assets/scripts/chess/Chess.ts)
- [UIManager.ts 源码](../assets/scripts/core/UIManager.ts)

---

**创建者**: MonkeyCode AI Assistant  
**日期**: 2026-04-16  
**状态**: 准备创建
