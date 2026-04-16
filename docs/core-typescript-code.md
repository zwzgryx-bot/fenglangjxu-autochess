# 封狼居胥 - 核心 TypeScript 代码

## 已完成的 6 个核心系统

1. **ResourceManager** - 资源管理器 (支持换皮)
2. **GameManager** - 游戏管理器 (状态控制)
3. **Chess** - 棋子基类 (升星 + 转职)
4. **EventSystem** - 事件系统 (全局事件)
5. **BondSystem** - 羁绊系统 (阵营/职业/名将)
6. **BattleSystem** - 战斗系统 (自动战斗)

## 代码文件

详细代码请查看设计文档中的完整版本:

- `ThemeManager.ts` - 换皮系统核心
- `ResourceManager.ts` - 资源加载与管理
- `GameManager.ts` - 游戏流程控制
- `Chess.ts` - 棋子基类 (包含升星/转职/战斗逻辑)
- `EventSystem.ts` - 全局事件系统
- `BondSystem.ts` - 羁绊系统
- `BattleSystem.ts` - 战斗系统

## 文件结构

```
assets/scripts/
├── core/
│   ├── ThemeManager.ts      # 换皮管理器
│   ├── GameManager.ts       # 游戏管理
│   └── EventSystem.ts       # 事件系统
├── utils/
│   ├── ResourceManager.ts   # 资源管理
│   └── ResourceLoader.ts    # 资源加载器
├── chess/
│   ├── Chess.ts             # 棋子基类
│   ├── ChessData.ts         # 棋子数据 (待创建)
│   └── ChessSkill.ts        # 棋子技能 (待创建)
└── battle/
    ├── BattleSystem.ts      # 战斗系统
    └── BondSystem.ts        # 羁绊系统
```

## 下一步

1. 创建配置文件 (JSON)
2. 创建棋子数据配置
3. 创建技能系统
4. 创建经济系统
5. 创建商店系统

详见完整设计文档!
