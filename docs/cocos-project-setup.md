# 封狼居胥 - Cocos Creator 项目配置指南

**创建日期**: 2026-04-16  
**Cocos Creator 版本**: 3.8.x  
**平台**: 微信小游戏

---

## 项目结构

```
fenglangjxu-autochess/
├── assets/                           # 资源目录
│   ├── scripts/                      # TypeScript 脚本
│   │   ├── core/                     # 核心系统
│   │   │   ├── GameManager.ts        # 游戏管理器
│   │   │   ├── EventSystem.ts        # 事件系统
│   │   │   └── ThemeManager.ts       # 换皮系统
│   │   ├── chess/                    # 棋子相关
│   │   │   ├── ChessData.ts          # 棋子数据
│   │   │   ├── Chess.ts              # 棋子基类
│   │   │   └── ClassChangeSystem.ts  # 转职系统
│   │   ├── battle/                   # 战斗相关
│   │   │   ├── SynergyCalculator.ts  # 羁绊计算
│   │   │   └── BattleSystem.ts       # 战斗系统
│   │   ├── economy/                  # 经济相关
│   │   │   └── EconomySystem.ts      # 经济系统
│   │   ├── shop/                     # 商店相关
│   │   │   └── ShopSystem.ts         # 商店系统
│   │   ├── ai/                       # AI 相关
│   │   │   └── BattleAI.ts           # AI 系统
│   │   └── utils/                    # 工具类
│   │       └── ResourceManager.ts    # 资源管理器
│   ├── resources/                    # Resources 目录 (可加载资源)
│   │   ├── chess/                    # 棋子立绘
│   │   │   ├── han/                  # 汉军棋子
│   │   │   └── xiongnu/              # 匈奴棋子
│   │   ├── ui/                       # UI 资源
│   │   │   ├── buttons/              # 按钮
│   │   │   ├── panels/               # 面板
│   │   │   └── icons/                # 图标
│   │   ├── bg/                       # 背景
│   │   │   ├── chessboard/           # 棋盘背景
│   │   │   └── menu/                 # 菜单背景
│   │   ├── audio/                    # 音频
│   │   │   ├── bgm/                  # 背景音乐
│   │   │   └── sfx/                  # 音效
│   │   └── effects/                  # 特效
│   ├── themes/                       # 主题资源 (可换皮)
│   │   ├── han/                      # 汉军主题
│   │   │   ├── chess/                # 棋子
│   │   │   ├── ui/                   # UI
│   │   │   ├── bg/                   # 背景
│   │   │   └── audio/                # 音频
│   │   └── xiongnu/                  # 匈奴主题
│   │       ├── chess/
│   │       ├── ui/
│   │       ├── bg/
│   │       └── audio/
│   ├── prefabs/                      # 预制体
│   │   ├── chess/                    # 棋子预制体
│   │   ├── ui/                       # UI 预制体
│   │   └── effects/                  # 特效预制体
│   ├── scenes/                       # 场景
│   │   ├── loading.scene             # 加载场景
│   │   ├── main_menu.scene           # 主菜单
│   │   ├── battle.scene              # 战斗场景
│   │   └── lobby.scene               # 大厅场景
│   └── fonts/                        # 字体
├── profiles/                         # 项目配置
│   ├── v2/
│   │   └── project.json              # 项目设置
├── settings/                         # 项目设置
│   ├── v2/
│   │   └── project.json
└── project.json                      # 项目配置文件
```

---

## 项目配置文件

### project.json

```json
{
  "engine": "cocos-creator-js",
  "packages": "packages",
  "name": "封狼居胥",
  "id": "fenglangjxu-autochess",
  "version": "1.0.0",
  "creator": {
    "version": "3.8.2"
  }
}
```

### projectSettings.json

```json
{
  "modules": {
    "choice": {
      "2d": true,
      "physics-cannon": false,
      "physics-builtin": false,
      "physics-ammo": false,
      "ui": true,
      "particle": true,
      "tween": true,
      "terrain": false,
      "webview": false,
      "videoplayer": false,
      "spine": false,
      "dragon-bones": false
    }
  },
  "scriptingDefineOptions": {
    "WECHAT_GAME": true
  },
  "startScene": "assets/scenes/loading.scene",
  "scriptPreload": [],
  "screenOrientation": "landscape",
  "resolution": {
    "policy": 0,
    "width": 1280,
    "height": 720
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ESNext",
    "lib": ["ES2015"],
    "outDir": "./temp/declarations",
    "rootDir": "./assets/scripts",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "typeRoots": [
      "./temp/declarations",
      "./node_modules/@types"
    ],
    "types": [
      "cc",
      "cc-editor"
    ],
    "paths": {
      "@core/*": ["./assets/scripts/core/*"],
      "@chess/*": ["./assets/scripts/chess/*"],
      "@battle/*": ["./assets/scripts/battle/*"],
      "@economy/*": ["./assets/scripts/economy/*"],
      "@shop/*": ["./assets/scripts/shop/*"],
      "@ai/*": ["./assets/scripts/ai/*"],
      "@utils/*": ["./assets/scripts/utils/*"]
    }
  },
  "include": [
    "assets/scripts/**/*"
  ],
  "exclude": [
    "node_modules",
    "temp",
    "build",
    "library"
  ]
}
```

---

## 微信小游戏配置

### game.json

```json
{
  "deviceOrientation": "landscape",
  "showStatusBar": false,
  "networkTimeout": {
    "request": 5000,
    "connectSocket": 5000,
    "uploadFile": 5000,
    "downloadFile": 5000
  }
}
```

### project.config.json

```json
{
  "description": "封狼居胥自走棋",
  "packOptions": {
    "ignore": [
      {
        "type": "folder",
        "value": "temp"
      },
      {
        "type": "folder",
        "value": "library"
      },
      {
        "type": "folder",
        "value": "local"
      }
    ]
  },
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": true,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": true,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    }
  },
  "compileType": "game",
  "libVersion": "2.19.4",
  "appid": "wx_xxxxxxxxxxxxxxxx",
  "projectname": "fenglangjxu-autochess",
  "simulatorType": "wechat",
  "simulatorPluginLibVersion": {},
  "condition": {}
}
```

---

## 场景配置

### 1. loading.scene (加载场景)

**功能**:
- 资源预加载
- 初始化游戏系统
- 显示加载进度

**组成**:
- LoadingCanvas (2D Canvas)
  - ProgressBar (进度条)
  - lblProgress (进度文字)
  - imgLogo (游戏 LOGO)

### 2. main_menu.scene (主菜单)

**功能**:
- 开始游戏
- 设置
- 换皮选择

**组成**:
- UICanvas
  - bgMain (主背景)
  - btnStart (开始游戏按钮)
  - btnSettings (设置按钮)
  - btnSkin (换肤按钮)
  - lblTitle (标题文字)

### 3. lobby.scene (大厅场景)

**功能**:
- 匹配对手
- 查看战绩
- 棋子收藏

**组成**:
- UICanvas
  - pnlTop (顶部面板)
    - lblPlayerLevel (玩家等级)
    - lblGold (金币数量)
  - pnlCenter (中央面板)
    - btnMatch (匹配按钮)
  - pnlBottom (底部面板)
    - btnChessCollection (棋子收藏)
    - btnBattleRecord (战绩)

### 4. battle.scene (战斗场景)

**功能**:
- 棋盘显示
- 棋子操作
- 商店界面
- 战斗表现

**组成**:
- BattleCanvas (棋盘层)
  - chessboard (棋盘)
  - chessList (棋子实例)
  - effects (特效层)
- UICanvas (UI 层)
  - pnlTop (顶部信息)
    - lblRound (回合数)
    - lblTimer (倒计时)
  - pnlLeft (左侧面板)
    - chessListPanel (棋子列表)
  - pnlBottom (底部面板)
    - shopPanel (商店)
    - operationPanel (操作按钮)
  - pnlRight (右侧面板)
    - bondPanel (羁绊信息)
    - playerInfoPanel (玩家信息)

---

## 预制体规范

### Chess.prefab (棋子预制体)

**结构**:
```
Chess (Node)
├── spriteChess (Sprite)          # 棋子立绘
├── starNode (Node)               # 星级节点
│   ├── star1 (Sprite)
│   ├── star2 (Sprite)
│   └── star3 (Sprite)
├── hpBar (Node)                  # 血条
│   ├── bg (Sprite)
│   └── bar (Sprite)
├── energyBar (Node)              # 能量条
│   ├── bg (Sprite)
│   └── bar (Sprite)
├── buffNode (Node)               # Buff 图标节点
└── lblName (Label)               # 名称标签
```

**组件**:
- Chess.ts (棋子脚本)
- Sprite (立绘)
- Animation (动画)

### ShopSlot.prefab (商店格子预制体)

**结构**:
```
ShopSlot (Node)
├── bg (Sprite)                   # 背景
├── chessIcon (Sprite)            # 棋子图标
├── lblCost (Label)               # 费用
├── lblCount (Label)              # 棋子池数量
├── lockIcon (Sprite)             # 锁定图标
└── btnBuy (Button)               # 购买按钮
```

---

## 图层管理规范

### Layer 排序 (从底到顶)

```
1. BG_LAYER (-1000)      - 背景层
2. CHESSBOARD_LAYER (0)  - 棋盘层
3. CHESS_LAYER (100)     - 棋子层
4. EFFECT_LAYER (200)    - 特效层
5. UI_LAYER (1000)       - UI 层
6. POPUP_LAYER (2000)    - 弹窗层
7. DIALOG_LAYER (3000)   - 对话框层
8. LOADING_LAYER (4000)  - 加载层
```

---

## 资源命名规范

### 通用规范
- 全部使用小写字母
- 单词间用下划线分隔
- 使用有意义的英文名称

### 分类命名

**棋子立绘**:
- 汉军：`chess_han_{chessId}_{star}`
  - 例：`chess_han_huoqubing_1`, `chess_han_huoqubing_3`
- 匈奴：`chess_xiongnu_{chessId}_{star}`
  - 例：`chess_xiongnu_chanyu_1`

**UI 资源**:
- 按钮：`btn_{name}_{state}`
  - 例：`btn_start_normal`, `btn_start_pressed`
- 面板：`pnl_{name}`
  - 例：`pnl_shop`, `pnl_settings`
- 图标：`icon_{name}`
  - 例：`icon_gold`, `icon_refresh`

**背景**:
- 棋盘：`bg_chessboard_{terrain}`
  - 例：`bg_chessboard_grass`, `bg_chessboard_desert`
- 菜单：`bg_{menuName}`
  - 例：`bg_main_menu`, `bg_lobby`

**音频**:
- BGM: `bgm_{scene}_{theme}`
  - 例：`bgm_main_han`, `bgm_battle_xiongnu`
- 音效：`sfx_{type}_{name}`
  - 例：`sfx_ui_click`, `sfx_battle_attack`

---

## 构建配置

### 微信小游戏构建设置

```json
{
  "platform": "wechatgame",
  "packageName": "fenglangjxu.autochess",
  "title": "封狼居胥",
  "orientation": "landscape",
  "resolution": {
    "width": 1280,
    "height": 720
  },
  "startScene": "assets/scenes/loading.scene",
  "debug": false,
  "md5Cache": true,
  "separateEngine": false,
  "compressBundle": true,
  "mergeJson": true
}
```

### 构建优化建议

1. **Texture**:
   - 使用 PVRTC/ETC2 压缩格式
   - 启用 Texture Atlas
   - 设置合适的 Filter Mode

2. **Audio**:
   - BGM 使用 MP3 (64kbps)
   - SFX 使用 AAC 或 MP3 (128kbps)
   - 短音效使用单声道

3. **Bundle**:
   - 按场景分包
   - 首包控制在 4MB 以内
   - 使用分包预下载

4. **代码**:
   - 启用代码压缩
   - 移除未使用模块
   - Tree Shaking 优化

---

## 开发建议

### 性能优化

1. **DrawCall 控制**:
   - 使用自动图集 (Auto Atlas)
   - 同材质合并
   - 控制同屏精灵数量

2. **内存管理**:
   - 及时释放不用的资源
   - 使用对象池管理棋子
   - 避免频繁创建/销毁节点

3. **更新频率**:
   - 战斗逻辑使用固定时间步长
   - UI 更新按需进行
   - 使用 LOD 技术

### 调试技巧

1. **性能分析**:
   - 使用 Cocos Profiler
   - 查看 DrawCall 统计
   - 监控内存占用

2. **日志系统**:
   - 使用 eventBus 记录关键事件
   - 实现分级日志 (INFO/WARN/ERROR)
   - 生产环境关闭 Debug 日志

---

**文档版本**: v1.0  
**最后更新**: 2026-04-16
