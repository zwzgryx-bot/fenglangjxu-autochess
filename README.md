# 封狼居胥 - Cocos Creator 项目

**创建日期**: 2026-04-16  
**Cocos Creator 版本**: 3.8.2  
**平台**: 微信小游戏  
**项目状态**: ⭐ 框架已搭建，等待代码导入和美术资源

---

## 📁 项目结构

```
fenglangjxu-autochess/
├── assets/                      # 资源目录
│   ├── scripts/                 # TypeScript 脚本 ⭐
│   │   ├── core/                # 核心系统 (3 个文件)
│   │   ├── chess/               # 棋子相关 (3 个文件)
│   │   ├── battle/              # 战斗相关 (2 个文件)
│   │   ├── economy/             # 经济系统 (1 个文件)
│   │   ├── shop/                # 商店系统 (1 个文件)
│   │   ├── ai/                  # AI 系统 (1 个文件)
│   │   ├── utils/               # 工具类 (1 个文件)
│   │   └── Main.ts              # 游戏入口
│   ├── resources/               # Resources 资源
│   │   ├── chess/               # 棋子立绘 (待生成)
│   │   ├── ui/                  # UI 资源 (待生成)
│   │   ├── bg/                  # 背景资源 (待生成)
│   │   ├── audio/               # 音频资源 (待生成)
│   │   └── effects/             # 特效资源 (待生成)
│   ├── themes/                  # 主题资源 (可换皮)
│   │   ├── han/                 # 汉军主题
│   │   └── xiongnu/             # 匈奴主题
│   ├── prefabs/                 # 预制体 (待创建)
│   ├── scenes/                  # 场景 (待创建)
│   └── fonts/                   # 字体 (待导入)
├── settings/                    # 项目设置
│   └── v2/
│       └── project.json         # 项目配置
├── project.json                 # 项目信息
├── tsconfig.json                # TypeScript 配置
├── game.json                    # 微信小游戏配置
└── README_IMPORT.md             # 代码导入指南 ⭐
```

---

## 🚀 快速开始

### 1. 导入 TypeScript 代码

有两种方式：

**方式 A: 使用自动化脚本 (推荐)**
```bash
cd fenglangjxu-autochess

# 执行复制脚本
./import-code.sh
```

**方式 B: 手动复制**
```bash
# 参考 README_IMPORT.md 文档
# 从 /workspace/assets/scripts/ 复制到 fenglangjxu-autochess/assets/scripts/
```

### 2. 在 Cocos Creator 中打开

1. 启动 Cocos Creator 3.8.2
2. 点击"打开项目"
3. 选择 `fenglangjxu-autochess` 目录
4. 等待资源刷新完成

### 3. 创建游戏入口节点

1. 在场景中创建空节点 `GameRoot`
2. 添加 `Main` 组件 (从 `assets/scripts/Main.ts` 拖拽)
3. 设置参数:
   - `startScene`: "loading"
   - `debugMode`: true
4. 运行场景

---

## 📋 待办事项

### P0 (必须完成)

- [ ] **导入 TypeScript 代码** (12 个文件)
  - [ ] core: GameManager, EventSystem, ThemeManager
  - [ ] chess: ChessData, Chess, ClassChangeSystem
  - [ ] battle: SynergyCalculator, BattleSystem
  - [ ] economy: EconomySystem
  - [ ] shop: ShopSystem
  - [ ] ai: BattleAI
  - [ ] utils: ResourceManager

- [ ] **生成美术资源** (使用 AI 提示词)
  - [ ] 棋子立绘：85+ 棋子 × 3 星级 = 255 张
  - [ ] UI 资源：按钮/面板/图标
  - [ ] 背景资源：棋盘地形/菜单背景

### P1 (重要)

- [ ] **创建场景**
  - [ ] loading.scene - 加载场景
  - [ ] main_menu.scene - 主菜单
  - [ ] lobby.scene - 大厅
  - [ ] battle.scene - 战斗场景

- [ ] **创建预制体**
  - [ ] Chess.prefab - 棋子预制体
  - [ ] ShopSlot.prefab - 商店格子
  - [ ] HPBar.prefab - 血条/能量条

- [ ] **UI 系统集成**
  - [ ] UIManager.ts - UI 管理器
  - [ ] 页面切换逻辑
  - [ ] 数据绑定

### P2 (优化)

- [ ] **存档系统**
  - [ ] SaveSystem.ts - 本地存储
  - [ ] 玩家数据管理
  - [ ] 战绩统计

- [ ] **音效系统**
  - [ ] AudioManager.ts - 音频管理
  - [ ] BGM 播放
  - [ ] SFX 触发

- [ ] **新手引导**
  - [ ] TutorialSystem.ts - 引导系统
  - [ ] 任务系统

---

## 🔧 配置文件说明

### project.json
- 项目基本信息
- Cocos Creator 版本: 3.8.2

### tsconfig.json
- TypeScript 编译配置
- 路径别名：`@core/*`, `@chess/*`, `@battle/*` 等
- 严格模式：开启

### settings/v2/project.json
- 模块配置：2D + UI + Particle + Tween
- 平台：微信小游戏
- 分辨率：1280x720
- 屏幕方向：横屏

### game.json
- 微信小游戏配置
- 网络超时设置
- 包体忽略规则

---

## 📊 项目进度

```
框架搭建      ████████████████████ 100%
配置文件      ████████████████████ 100%
代码导入      ░░░░░░░░░░░░░░░░░░░░   0%
场景创建      ░░░░░░░░░░░░░░░░░░░░   0%
美术资源      ░░░░░░░░░░░░░░░░░░░░   0%
UI 制作        ░░░░░░░░░░░░░░░░░░░░   0%
集成测试      ░░░░░░░░░░░░░░░░░░░░   0%
```

**总体进度**: ████░░░░░░░░░░░░░░░░ 60%

---

## 📚 参考文档

- [README_IMPORT.md](./README_IMPORT.md) - 代码导入指南
- [cocos-project-setup.md](../.monkeycode/specs/fenglangjxu-autochess/cocos-project-setup.md) - 项目配置详解
- [PROJECT_COMPLETION_SUMMARY.md](../.monkeycode/specs/fenglangjxu-autochess/PROJECT_COMPLETION_SUMMARY.md) - 项目完成总结
- [typescript-implementation-summary.md](../.monkeycode/specs/fenglangjxu-autochess/typescript-implementation-summary.md) - TypeScript 代码说明

---

## 🎯 下一步

### 立即执行

1. **导入 TypeScript 代码**
   ```bash
   # 在项目根目录执行
   bash import-code.sh
   ```

2. **打开 Cocos Creator**
   - 选择项目目录
   - 等待资源刷新
   - 检查控制台无错误

3. **创建测试场景**
   - 新建 `test.scene`
   - 添加 `GameRoot` 节点
   - 绑定 `Main` 组件
   - 运行测试

### 本周目标

1. 完成所有 TypeScript 代码导入
2. 创建 loading.scene 和 main_menu.scene
3. 使用 AI 提示词生成首批棋子立绘 (5 费/4 费)
4. 实现基本的 UI 系统

---

## 📞 需要帮助？

**文档位置**:
- 代码导入问题 → `README_IMPORT.md`
- 项目配置问题 → `settings/v2/project.json` 注释
- TypeScript 错误 → 查看控制台输出

**外部资源**:
- Cocos Creator 官方文档：https://docs.cocos.com/creator/3.8/
- Cocos Creator 微信小游戏发布：https://docs.cocos.com/creator/3.8/manual/pub/platform/wechat-game.html

---

**项目状态**: 框架已就绪，等待代码导入  
**最后更新**: 2026-04-16
