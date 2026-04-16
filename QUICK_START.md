# 🚀 快速启动指南

**更新日期**: 2026-04-16  
**当前状态**: 代码 100% 完成，等待场景和预制体创建

---

## 📋 前置条件

### 必需软件

- ✅ **Cocos Creator 3.8.x** (或更高版本)
- ✅ **Node.js 16+** (如果需要通过 npm 安装依赖)

### 可选工具

- Git (用于版本控制)
- VS Code (用于代码编辑)

---

## 🎯 第一步：在 Cocos Creator 中打开项目

### 方法 A: 从 Cocos Creator 打开

1. 启动 Cocos Creator 3.8
2. 点击「打开项目」
3. 选择目录：`/workspace/fenglangjxu-autochess`
4. 等待项目加载完成

### 方法 B: 直接打开

```bash
# 在命令行中 (如果 Cocos Creator 已添加到 PATH)
creator /workspace/fenglangjxu-autochess
```

---

## 🏗️ 第二步：创建最小可运行场景

### 快速测试 (5 分钟)

如果你只是想快速测试代码是否能运行，按照以下步骤：

#### 1. 创建测试场景

```
1. File → New Scene → Empty
2. 保存为 assets/scenes/test.scene
```

#### 2. 添加 Canvas

```
1. 右键 Hierarchy → Create → 2D → Canvas
2. 设置 Design Resolution: 1280 x 720
```

#### 3. 添加一个按钮

```
1. 右键 Canvas → Create → 2D → Button
2. 修改按钮文字为「开始游戏」
3. Position: (0, 0, 0)
```

#### 4. 添加 GameManager

```
1. 创建空节点 "GameRoot"
2. 添加组件 → TypeScript → GameManager
3. 添加组件 → TypeScript → EventSystem
```

#### 5. 运行场景

```
1. 点击 Play 按钮 (Ctrl/Cmd + P)
2. 点击「开始游戏」按钮
3. 查看控制台输出
```

如果控制台有日志输出，说明代码运行正常！✅

---

## 🎨 第三步：创建核心场景 (推荐)

### 场景创建顺序

1. **loading.scene** (最简单，30 分钟)
2. **main_menu.scene** (中等，1 小时)
3. **lobby.scene** (中等，1 小时)
4. **battle.scene** (最复杂，2-3 小时)

### 详细教程

每个场景的详细创建步骤请参考：

- **SCENE_GUIDE.md** - 场景创建完整指南
- **PREFAB_GUIDE.md** - 预制体创建完整指南

### 简化版步骤 (以 main_menu 为例)

```bash
# 1. 创建场景
File → New Scene → Empty → Save as main_menu.scene

# 2. 添加 Canvas
Create → 2D → Canvas

# 3. 添加背景
Create → 2D → Sprite → 设置颜色为深蓝色

# 4. 添加标题
Create → 2D → Label → 文字:"封狼居胥" → Font Size: 72

# 5. 添加按钮
Create → 2D → Button → 修改文字为「开始游戏」

# 6. 添加脚本
创建空节点"MainMenu" → Add Component → MainMenuController

# 7. 绑定属性
拖拽按钮节点到脚本的 btnStart 属性

# 8. 保存并测试
Ctrl + S 保存 → 点击 Play
```

---

## 🧱 第四步：创建基础预制体

### 必须创建的预制体 (P0 优先级)

1. **Chess.prefab** - 棋子预制体
2. **ShopSlot.prefab** - 商店格子
3. **HPBar.prefab** - 血条
4. **EnergyBar.prefab** - 能量条

### 棋子预制体创建步骤

```bash
# 1. 创建节点结构
Chess (Node)
  ├── spriteChess (Node)
  │   └── icon (Sprite)
  ├── hpBar (Node)
  │   ├── bg (Sprite)
  │   └── bar (Sprite)
  ├── energyBar (Node)
  ├── starNode (Node) * 3
  └── lblName (Label)

# 2. 添加组件
- 选中 Chess 节点 → Add Component → TypeScript → Chess

# 3. 绑定属性
- 将对应节点拖到 Chess 脚本的属性面板

# 4. 保存为预制体
- 右键 Chess 节点 → Create → Prefab
- 保存到 assets/prefabs/chess/Chess.prefab
```

---

## ⚙️ 第五步：项目配置

### 1. 检查项目设置

```
Project → Project Settings

- 确保 TypeScript 已启用
- 检查分辨率设置为 1280 x 720
- 确认方向为 Landscape (横屏)
```

### 2. 配置启动场景

```
Project → Build → Scenes

1. 添加所有场景:
   - loading.scene
   - main_menu.scene
   - lobby.scene
   - battle.scene

2. 设置 loading.scene 为第一个 (启动场景)
```

### 3. 微信小游戏配置

如果发布到微信小游戏：

```json
// game.json (已配置好)
{
  "deviceOrientation": "landscape",
  "showStatusBar": false
}
```

---

## 🧪 第六步：测试游戏

### 测试清单

- [ ] 加载场景能显示进度条
- [ ] 主菜单按钮能点击
- [ ] 能进入大厅场景
- [ ] 能看到棋子 (即使是方块)
- [ ] 商店能刷新
- [ ] 战斗能自动进行

### 调试技巧

1. **打开控制台**: Cocos Creator 底部面板 → Console
2. **查看日志**: 所有系统都有 console.log 输出
3. **使用断点**: Chrome DevTools → Sources → 设置断点

---

## 🎨 临时美术方案

在正式美术资源完成前，使用以下替代方案：

### 方案 A: 纯色背景

```typescript
// 使用 Sprite 的 Color 属性
sprite.color = new Color(30, 30, 60) // 深蓝色
```

### 方案 B: 占位图

```
使用简单的几何图形:
- 棋子：蓝色方块
- 血条：红色长方形
- 按钮：灰色矩形
```

### 方案 C: Cocos 内置资源

```
Cocos Creator 自带很多 UI 资源：
- 内置按钮样式
- 内置 SpriteFrame
- 可以直接使用
```

---

## 📞 常见问题

### Q1: 代码导入后找不到脚本？

**A**: 检查以下几点：
1. 确认 scripts 目录结构正确
2. 重启 Cocos Creator
3. 检查 TypeScript 编译是否完成

### Q2: 组件添加后属性绑定不了？

**A**: 
1. 确保先保存场景
2. 确保预制体已保存
3. 重新拖拽节点到属性面板

### Q3: 运行时提示找不到模块？

**A**: 
1. 检查 import 路径是否正确
2. 确保文件扩展名是 .ts
3. 清理缓存后重新编译

### Q4: 如何查看完整的代码示例？

**A**: 
- 每个文件的底部都有「使用示例」注释
- 参考 SCENE_GUIDE.md 和 PREFAB_GUIDE.md
- 查看 TYPESCRIPT_COMPLETION_SUMMARY.md

---

## 📚 文档索引

### 设计文档
- `requirements.md` - 需求文档 (EARS 规范)
- `design.md` - 技术设计文档
- `tasklist-full.md` - 16 周开发任务清单

### UI 设计
- `ui-design.md` - UI 设计文档 (9 个页面)
- `SCENE_GUIDE.md` - 场景创建指南 ⭐
- `PREFAB_GUIDE.md` - 预制体创建指南 ⭐

### 游戏系统
- `chess-system.md` - 兵种职业体系 (10 职业 85 棋子)
- `upgrade-system.md` - 升星系统
- `upgrade-advanced-system.md` - 转职系统 (核心特色)

### 美术相关
- `ai-prompt-complete-fixed.md` - AI 绘画提示词 v5 (透明背景版) ⭐
- `skin-system-design.md` - 可换皮架构设计

### 代码相关
- `TYPESCRIPT_COMPLETION_SUMMARY.md` - 代码实现总结 ⭐
- `README.md` - 项目总览
- `TODO.md` - 待办清单

### 工具脚本
- `import-code.sh` - 代码导入脚本
- `github-push.sh` - GitHub 推送脚本

---

## 🎉 完成后的效果

完成所有场景和预制体后，你应该能够：

1. **从加载场景开始游戏**
2. **看到主菜单页面** (有开始/设置/收藏按钮)
3. **进入大厅** (显示匹配按钮和玩家信息)
4. **开始战斗** (看到棋盘和棋子)
5. **刷新商店** (购买棋子)
6. **自动战斗** (AI 自动作战)

即使只有简单的色块，游戏的完整流程应该能够跑通！✅

---

## 🚀 下一步

### 本周目标 (P0)

- [ ] 创建 4 个核心场景
- [ ] 创建 4 个基础预制体
- [ ] 绑定所有脚本
- [ ] 测试游戏流程

### 下周目标 (P1)

- [ ] 使用 AI 生成棋子立绘 (85+ 张)
- [ ] 导入 UI 资源
- [ ] 导入音频资源
- [ ] 完善 UI 细节

### 长期目标

- [ ] 新手引导系统
- [ ] 特效系统
- [ ] 平衡性调整
- [ ] 多人联机测试

---

**祝你开发顺利！🎊**

如有问题，请查看对应的详细指南文档或检查控制台日志。
