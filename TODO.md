# 📋 项目缺失项清单

**更新日期**: 2026-04-16  
**当前进度**: 65%

---

## ✅ 已完成 (65%)

### 1. 核心系统 (100%)
- [x] GameManager - 游戏状态机 ✅
- [x] EventSystem - 全局事件 ✅
- [x] ThemeManager - 换皮系统 ✅
- [x] ResourceManager - 资源管理 ✅
- [x] UIManager - UI 管理 ✅
- [x] SaveSystem - 存档系统 ✅

### 2. 棋子系统 (100%)
- [x] Chess.ts - 棋子基类 ✅
- [x] ChessData.ts -85+ 棋子数据 ✅
- [x] ClassChangeSystem -21 条转职路线 ✅

### 3. 战斗系统 (100%)
- [x] BattleSystem - 战斗逻辑 ✅
- [x] SynergyCalculator - 三维度羁绊 ✅

### 4. 经济商店 (100%)
- [x] EconomySystem - 金币/利息 ✅
- [x] ShopSystem - 刷新/概率/卡池 ✅

### 5. AI 系统 (100%)
- [x] BattleAI - 智能决策 ✅

### 6. 场景脚本 (30%)
- [x] MainMenuController - 主菜单 ✅
- [ ] LobbyController - 大厅 ⏳
- [ ] BattleController - 战斗 ⏳
- [ ] LoadingController - 加载 ⏳

---

## ⏭️ 待完成项目 (35%)

### P0 - 紧急缺失 (必须完成才能运行)

#### 1. 基础预制体 (0%) 🔴
**优先级**: 最高  
**预计时间**: 2-3 小时

- [ ] Chess.prefab - 棋子预制体
  - 需要：立绘 Sprite (可用占位图)
  - 需要：血条/能量条子节点
  - 需要：Chess 脚本绑定
  
- [ ] ShopSlot.prefab - 商店格子
  - 需要：购买按钮
  - 需要：费用显示
  - 需要：ShopSlot 脚本
  
- [ ] HPBar.prefab - 血条预制体
  - 需要：红色血条 Sprite
  
- [ ] EnergyBar.prefab - 能量条
  - 需要：蓝色能量条 Sprite

**如何创建**:
1. 打开 Cocos Creator
2. 参考 `PREFAB_GUIDE.md`
3. 手动创建节点结构
4. 保存为 Prefab

---

#### 2. 场景文件 (0%) 🔴
**优先级**: 最高  
**预计时间**: 每场景 1-2 小时

- [ ] loading.scene - 加载场景
  - 进度条 UI
  - LOGO 显示
  - LoadingController 脚本
  
- [ ] main_menu.scene - 主菜单
  - 背景图
  - 开始/设置/收藏按钮
  - 玩家信息显示
  - ✅ MainMenuController 脚本 (已完成)
  
- [ ] lobby.scene - 大厅
  - 匹配按钮
  - 玩家信息
  - 棋子展示
  - LobbyController 脚本
  
- [ ] battle.scene - 战斗场景
  - 棋盘背景 (1200x800)
  - 棋子放置区域
  - 商店 UI (左侧)
  - 羁绊面板 (右侧)
  - 顶部信息栏
  - BattleController 脚本

**如何创建**:
1. 在 Cocos Creator 中创建场景
2. 按照 `cocos-project-setup.md`配置
3. 添加 Canvas 和 UI 节点
4. 绑定对应的 Controller 脚本

---

#### 3. UI 预制体 (0%) 🟠
**优先级**: 高  
**预计时间**: 3-4 小时

- [ ] main_menu.prefab - 主菜单 UI
- [ ] lobby.prefab - 大厅 UI
- [ ] battle.prefab - 战斗界面
- [ ] shop.prefab - 商店面板
- [ ] settings.prefab - 设置面板
- [ ] chess_info.prefab - 棋子信息
- [ ] bond_info.prefab - 羁绊信息

---

### P1 - 重要缺失 (影响完整度)

#### 4. Controller 脚本 (70%)
**优先级**: 中  
**预计时间**: 2-3 小时

- [x] MainMenuController - 主菜单 ✅
- [ ] LobbyController - 大厅 ⏳
- [ ] BattleController - 战斗 ⏳
- [ ] ShopController - 商店控制 ⏳

---

#### 5. 音效系统 (0%) 🟡
**优先级**: 中  
**预计时间**: 1-2 小时

- [ ] AudioManager.ts
  - BGM 播放/暂停
  - SFX 触发
  - 音量控制

---

#### 6. 新手引导 (0%) ⚪
**优先级**: 低  
**预计时间**: 2-3 小时

- [ ] TutorialController
- [ ] 引导对话框
- [ ] 高亮提示

---

### P2 - 优化项 (加分项)

#### 7. 特效系统 (0%) ⚪
**优先级**: 低  
**预计时间**: 4-6 小时

- [ ] 技能特效预制体
- [ ] 战斗反馈特效
- [ ] Buff 图标

---

#### 8. 美术资源 (0%) ⚪
**优先级**: 中  
**预计时间**: 视资源获取方式

- [ ] 棋子立绘 (255 张)
- [ ] UI 图标 (50+ 个)
- [ ] 背景图 (8 种地形)
- [ ] 音频文件 (BGM + SFX)

**临时方案**: 使用占位图和内置资源

---

## 📊 缺失项统计

| 类别 | 待完成 | 预计时间 | 优先级 |
|------|--------|---------|--------|
| 预制体 | 10+ 个 | 4 小时 | 🔴 P0 |
| 场景 | 4 个 | 6 小时 | 🔴 P0 |
| Controller | 3 个 | 3 小时 | 🟠 P1 |
| 音效系统 | 1 个 | 2 小时 | 🟠 P1 |
| UI 预制体 | 7 个 | 4 小时 | 🟠 P1 |
| 新手引导 | 1 套 | 3 小时 | ⚪ P2 |
| 特效 | 若干 | 6 小时 | ⚪ P2 |
| 美术 | 大量 | 取决于方式 | 🟡 中 |

**总计**: 约 28 小时工作量

---

## 🎯 下一步建议

### 立即可做 (今天):

1. **创建 Chess.prefab** (30 分钟)
   - 使用占位图 (蓝色长方形)
   - 创建基本节点结构
   - 绑定 Chess.ts 脚本

2. **创建 ShopSlot.prefab** (20 分钟)
   - 创建购买按钮
   - 绑定 ShopSlot.ts 脚本

3. **创建 main_menu.scene** (1 小时)
   - 添加 Canvas
   - 创建背景 (纯色)
   - 放置按钮
   - 绑定 MainMenuController

### 本周完成:

4. **创建其他场景** (4 小时)
   - loading.scene
   - lobby.scene
   - battle.scene

5. **创建其他预制体** (3 小时)
   - HPBar
   - EnergyBar
   - UI 面板

6. **实现 AudioManager** (2 小时)

---

## 🛠️ 快速创建方法

### 方法 A: 手动创建 (推荐新手)
```
1. 打开 Cocos Creator
2. 新建空场景
3. 创建节点 → 添加组件 → 保存为 Prefab
```

### 方法 B: 使用脚本生成
```
参考 PREFAB_GUIDE.md 中的脚本示例
可以批量创建基础节点结构
```

### 方法 C: 导入资源包
```
Cocos Store 有免费 UI 包
可以直接导入使用
```

---

## ✅ 最小可运行版本标准

只要完成以下项目，游戏就可以运行:

- [ ] Chess.prefab (棋子能显示)
- [ ] ShopSlot.prefab (商店能刷 新)
- [ ] main_menu.scene (能进游戏)
- [ ] lobby.scene (能匹配)
- [ ] battle.scene (能战斗)
- [ ] BattleController (能控制流程)

**完成后功能**:
- 从主菜单开始游戏
- 进入大厅
- 进入战斗
- 看到棋子 (即使是方块)
- 能刷新商店
- 能买棋子
- 能进行自动战斗

---

## 📝 工作清单 (按顺序)

### 今天完成 (P0):
- [ ] Chess.prefab
- [ ] ShopSlot.prefab
- [ ] HPBar.prefab
- [ ] main_menu.scene
- [ ] 更新 Main.ts 集成所有系统

### 明天完成 (P0):
- [ ] loading.scene
- [ ] lobby.scene
- [ ] battle.scene
- [ ] LobbyController.ts
- [ ] BattleController.ts

### 后天完成 (P1):
- [ ] AudioManager.ts
- [ ] ShopController.ts
- [ ] 其他 UI 预制体
- [ ] 测试完整流程

---

## 💡 偷懒技巧

### 1. 使用占位符
```
美术资源没好？用纯色方块代替！
- 棋子: 蓝色方块
- 血条：红色长方形
- 按钮：灰色矩形
```

### 2. 使用 Cocos 内置资源
```
Cocos Creator 自带很多 UI 资源
可以直接拖到场景中使用
```

### 3. 分批实现
```
不要想一次做完所有东西
先做最小可运行版本
然后再慢慢完善
```

---

## 📞 需要帮助？

**参考文档**:
- `PREFAB_GUIDE.md` - 预制体详细指南
- `cocos-project-setup.md` - Cocos 配置
- 官方文档：https://docs.cocos.com/creator/3.8/

**代码示例**:
- `MainMenuController.ts` - 主菜单控制器示例
- 按照相同模式创建其他 Controller

---

**最后更新**: 2026-04-16  
**下次更新**: 完成预制体和场景后
