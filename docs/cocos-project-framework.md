# 封狼居胥 - Cocos Creator 项目框架

## 项目概述

**项目名称**: 封狼居胥自走棋  
**游戏类型**: 自走棋策略游戏  
**目标平台**: 微信小程序  
**引擎版本**: Cocos Creator 3.8.x  
**项目风格**: 手绘涂鸦卡通 Q 版  

---

## 项目目录结构

```
fenglangjxu-autochess/
├── assets/
│   ├── animations/           # 动画资源
│   │   ├── ui/               # UI 动画
│   │   ├── chess/            # 棋子动画
│   │   ├── effects/          # 特效动画
│   │   └── battle/           # 战斗动画
│   │
│   ├── atlases/              # 图集
│   │   ├── ui_common.atlas   # 通用 UI
│   │   ├── ui_main.atlas     # 主界面
│   │   ├── ui_battle.atlas   # 战斗界面
│   │   ├── chess_cards.atlas # 棋子卡片
│   │   └── effects.atlas     # 特效图集
│   │
│   ├── audio/                # 音频资源
│   │   ├── bgm/              # 背景音乐
│   │   ├── sfx/              # 音效
│   │   │   ├── ui/           # UI 音效
│   │   │   ├── battle/       # 战斗音效
│   │   │   └── chess/        # 棋子音效
│   │   └── voice/            # 语音
│   │
│   ├── materials/            # 材质
│   │   ├── ui.mtl            # UI 材质
│   │   ├── chess.mtl         # 棋子材质
│   │   └── effects.mtl       # 特效材质
│   │
│   ├── models/               # 3D 模型 (如有)
│   │
│   ├── prefabs/              # 预制体
│   │   ├── ui/               # UI 预制体
│   │   │   ├── ChessCard.prefab
│   │   │   ├── BondItem.prefab
│   │   │   ├── PlayerInfo.prefab
│   │   │   ├── DialogBox.prefab
│   │   │   └── ShopItem.prefab
│   │   ├── chess/            # 棋子预制体
│   │   │   ├── ChessBase.prefab
│   │   │   ├── Han/          # 汉军棋子
│   │   │   └── Xiongnu/      # 匈奴棋子
│   │   └── effects/          # 特效预制体
│   │
│   ├── resources/            # 动态加载资源
│   │   ├── data/             # 配置数据
│   │   │   ├── chess.json    # 棋子数据
│   │   │   ├── bond.json     # 羁绊数据
│   │   │   ├── skill.json    # 技能数据
│   │   │   └── config.json   # 游戏配置
│   │   └── chess/            # 棋子立绘
│   │
│   ├── scenes/               # 场景
│   │   ├── loading.scene     # 加载场景
│   │   ├── lobby.scene       # 主界面场景
│   │   ├── battle.scene      # 战斗场景
│   │   └── preparation.scene # 备战场景
│   │
│   ├── scripts/              # 脚本
│   │   ├── core/             # 核心系统
│   │   │   ├── GameManager.ts
│   │   │   ├── GameState.ts
│   │   │   └── EventSystem.ts
│   │   ├── chess/            # 棋子逻辑
│   │   │   ├── Chess.ts
│   │   │   ├── ChessData.ts
│   │   │   ├── ChessSkill.ts
│   │   │   └── ChessStar.ts
│   │   ├── battle/           # 战斗系统
│   │   │   ├── BattleSystem.ts
│   │   │   ├── CombatSystem.ts
│   │   │   ├── DamageSystem.ts
│   │   │   └── TargetSystem.ts
│   │   ├── board/            # 棋盘系统
│   │   │   ├── Board.ts
│   │   │   ├── BoardTerrain.ts
│   │   │   └── Collision.ts
│   │   ├── economy/          # 经济系统
│   │   │   ├── EconomySystem.ts
│   │   │   ├── GoldSystem.ts
│   │   │   └── ShopSystem.ts
│   │   ├── ai/               # AI 系统
│   │   │   ├── AIController.ts
│   │   │   └── AIDecision.ts
│   │   ├── ui/               # UI 逻辑
│   │   │   ├── UILobby.ts
│   │   │   ├── UIBattle.ts
│   │   │   ├── UIShop.ts
│   │   │   └── UIChessDetail.ts
│   │   ├── evolution/        # 转职系统
│   │   │   ├── EvolutionSystem.ts
│   │   │   └── EvolutionUI.ts
│   │   └── utils/            # 工具类
│   │       ├── Utils.ts
│   │       ├── PoolManager.ts
│   │       └── ResourceManager.ts
│   │
│   └── textures/             # 纹理
│       ├── ui/               # UI 纹理
│       ├── chess/            # 棋子纹理
│       ├── backgrounds/      # 背景
│       └── effects/          # 特效纹理
│
├── settings/                 # 项目设置
│   ├── project.json
│   └── services.json
│
├── package.json
├── tsconfig.json
└── creator.d.ts
```

---

## 核心系统设计

### 1. GameManager (游戏管理器)

```typescript
// assets/scripts/core/GameManager.ts

import { GameState } from './GameState';
import { EventSystem } from './EventSystem';

const { ccclass, property } = cc._decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    // 单例模式
    private static instance: GameManager;
    public static get Instance(): GameManager {
        return GameManager.instance;
    }
    
    // 游戏状态
    private gameState: GameState;
    
    // 系统管理器
    private battleSystem: BattleSystem;
    private economySystem: EconomySystem;
    private boardSystem: Board;
    private aiSystem: AIController;
    
    onLoad() {
        GameManager.instance = this;
        EventSystem.init();
        this.initSystems();
    }
    
    private initSystems() {
        // 初始化各个系统
        this.battleSystem = this.getComponent< BattleSystem>(BattleSystem);
        this.economySystem = this.getComponent<EconomySystem>(EconomySystem);
        // ...
    }
    
    // 游戏流程控制
    public startGame() {
        this.gameState = GameState.LOBBY;
        EventSystem.emit('game_started');
    }
    
    public startRound(roundNum: number) {
        this.gameState = GameState.PREPARING;
        // 开始备战阶段
    }
    
    public startCombat() {
        this.gameState = GameState.COMBAT;
        this.battleSystem.startBattle();
    }
    
    public endRound() {
        this.gameState = GameState.ROUND_END;
        // 结算回合
    }
}
```

---

### 2. Chess (棋子类)

```typescript
// assets/scripts/chess/Chess.ts

import { ChessData } from './ChessData';
import { ChessSkill } from './ChessSkill';

const { ccclass, property } = cc._decorator;

@ccclass('Chess')
export class Chess extends Component {
    @property(ChessData)
    chessData: ChessData = null;
    
    // 基础属性
    @property
    id: string = '';
    
    @property
    name: string = '';
    
    @property
    camp: 'han' | 'xiongnu' = 'han';
    
    @property
    profession: string = '';
    
    @property
    cost: number = 1;
    
    @property
    star: number = 1; // 1-3 星
    
    // 战斗属性
    @property
    hp: number = 0;
    
    @property
    maxHp: number = 0;
    
    @property
    attack: number = 0;
    
    @property
    defense: number = 0;
    
    @property
    speed: number = 0;
    
    @property
    range: number = 1;
    
    // 战斗状态
    private currentHp: number = 0;
    private energy: number = 0;
    private target: Chess | null = null;
    private isMoving: boolean = false;
    private isAttacking: boolean = false;
    
    // 转职系统
    private isEvolved: boolean = false; // 是否已转职
    private evolutionLevel: number = 0; // 0=未转职，1=一转，2=终极
    
    onLoad() {
        this.currentHp = this.hp;
        this.initFromData();
    }
    
    private initFromData() {
        // 从配置数据初始化
        if (this.chessData) {
            this.hp = this.chessData.baseStats.hp;
            this.attack = this.chessData.baseStats.attack;
            // ...
        }
    }
    
    // 升星
    public upgradeStar() {
        if (this.star >= 3) return;
        this.star++;
        this.applyStarBonus();
    }
    
    private applyStarBonus() {
        const multiplier = this.star === 2 ? 1.5 : 2.5;
        this.hp = Math.floor(this.chessData.baseStats.hp * multiplier);
        this.attack = Math.floor(this.chessData.baseStats.attack * multiplier);
        this.defense = Math.floor(this.chessData.baseStats.defense * multiplier);
        this.currentHp = this.hp; // 回满血
    }
    
    // 转职
    public evolve(evolutionType: string) {
        if (this.star !== 3) return; // 必须 3 星才能转职
        if (this.evolutionLevel >= 2) return; // 已达终极
        
        this.isEvolved = true;
        this.evolutionLevel++;
        this.applyEvolutionBonus();
        this.changeModel(); // 更换模型
    }
    
    private applyEvolutionBonus() {
        const multiplier = this.evolutionLevel === 1 ? 1.3 : 1.5;
        this.hp = Math.floor(this.hp * multiplier);
        this.attack = Math.floor(this.attack * multiplier);
        this.defense = Math.floor(this.defense * multiplier);
        // 更换技能
        this.updateSkill();
    }
    
    // 移动
    public async moveTo(targetPos: Vec3) {
        this.isMoving = true;
        // 移动逻辑...
        await this.delay(0.5);
        this.isMoving = false;
    }
    
    // 攻击
    public async attackTarget(target: Chess) {
        this.target = target;
        this.isAttacking = true;
        // 攻击动画...
        const damage = this.calculateDamage(target);
        target.takeDamage(damage);
        this.gainEnergy(10); // 攻击获得能量
        await this.delay(0.3);
        this.isAttacking = false;
    }
    
    private calculateDamage(target: Chess): number {
        // 伤害公式
        let damage = this.attack * (100 / (100 + target.defense));
        // 羁绊加成...
        // 转职加成...
        return Math.floor(damage);
    }
    
    // 承受伤害
    public takeDamage(amount: number) {
        this.currentHp -= amount;
        EventSystem.emit('chess_damage', { chess: this, damage: amount });
        
        if (this.currentHp <= 0) {
            this.die();
        }
    }
    
    // 获得能量
    public gainEnergy(amount: number) {
        this.energy += amount;
        if (this.energy >= 100) {
            this.castSkill();
        }
    }
    
    // 释放技能
    public async castSkill() {
        if (!this.chessData.skill) return;
        
        this.energy = 0;
        // 播放技能动画...
        const skill = new ChessSkill(this.chessData.skill);
        await skill.execute(this);
    }
    
    private die() {
        EventSystem.emit('chess_death', { chess: this });
        // 死亡动画...
        this.node.destroy();
    }
}
```

---

### 3. BoardTerrain (棋盘地形系统)

```typescript
// assets/scripts/board/BoardTerrain.ts

const { ccclass, property } = cc._decorator;

@ccclass('BoardTerrain')
export class BoardTerrain extends Component {
    @property
    terrainType: 'grassland' | 'desert' | 'abyss' | 'cliff' | 
                 'river' | 'forest' | 'ice' | 'lava' = 'grassland';
    
    @property
    terrainEffects: TerrainEffect[] = [];
    
    // 地形效果定义
    private terrainConfig = {
        grassland: { speedMod: 1.0, defenseMod: 1.0 },
        desert: { speedMod: 0.8, defenseMod: 1.0 },
        abyss: { passable: false },
        cliff: { passable: false, rangedPassable: true },
        river: { speedMod: 1.0, defenseMod: 0.85 },
        forest: { speedMod: 0.9, evasionBonus: 0.1 },
        ice: { speedMod: 1.1, slipChance: 0.15 },
        lava: { speedMod: 1.0, damagePerSecond: 50 }
    };
    
    onLoad() {
        this.applyTerrain();
    }
    
    private applyTerrain() {
        const config = this.terrainConfig[this.terrainType];
        // 应用地形效果
        EventSystem.emit('terrain_applied', { 
            type: this.terrainType, 
            config 
        });
    }
    
    // 检查是否可通过
    public isPassable(position: Vec3, isRanged: boolean = false): boolean {
        const config = this.terrainConfig[this.terrainType];
        if (config.passable === false) {
            return isRanged && config.rangedPassable;
        }
        return true;
    }
    
    // 获取速度修正
    public getSpeedModifier(): number {
        const config = this.terrainConfig[this.terrainType];
        return config.speedMod || 1.0;
    }
    
    // 每帧更新 (持续效果)
    update(deltaTime: number) {
        if (this.terrainType === 'lava') {
            const config = this.terrainConfig.lava;
            // 对站在岩浆上的棋 子造成伤害
            const chessOnLava = this.getChessInArea();
            chessOnLava.forEach(chess => {
                chess.takeDamage(config.damagePerSecond * deltaTime);
            });
        }
    }
}
```

---

### 4. EvolutionSystem (转职系统)

```typescript
// assets/scripts/evolution/EvolutionSystem.ts

const { cccard, property } = cc._decorator;

@ccclass('EvolutionSystem')
export class EvolutionSystem extends Component {
    private static instance: EvolutionSystem;
    public static get Instance(): EvolutionSystem {
        return EvolutionSystem.instance;
    }
    
    @property
    evolutionItems: EvolutionItem[] = [];
    
    // 检查是否可以转职
    public canEvolve(chess: Chess): boolean {
        if (chess.star !== 3) return false;
        if (chess.evolutionLevel >= 2) return false;
        return true;
    }
    
    // 执行转职
    public async evolveChess(chess: Chess, cost: number): Promise<boolean> {
        if (!this.canEvolve(chess)) return false;
        
        // 检查资源
        if (!EconomySystem.instance.hasGold(cost)) {
            EventSystem.emit('evolution_failed', { reason: 'no_gold' });
            return false;
        }
        
        // 扣除资源
        EconomySystem.instance.spendGold(cost);
        
        // 播放转职动画
        await this.playEvolutionAnimation(chess);
        
        // 执行转职
        chess.evolve('evolution');
        
        // 保存数据
        this.saveEvolutionData(chess);
        
        EventSystem.emit('evolution_success', { chess });
        return true;
    }
    
    private async playEvolutionAnimation(chess: Chess) {
        // 转职特效
        const uiManager = UIManager.Instance;
        uiManager.showEvolutionEffect(chess.node.position);
        
        // 等待动画
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // 获取转职成本
    public getEvolutionCost(chess: Chess): number {
        if (chess.evolutionLevel === 0) {
            return 200; // 一转成本
        } else {
            return 500; // 终极成本
        }
    }
    
    private saveEvolutionData(chess: Chess) {
        // 保存到本地
        const data = {
            chessId: chess.id,
            evolutionLevel: chess.evolutionLevel,
            evolvedAt: Date.now()
        };
        localStorage.setItem(`evolution_${chess.id}`, JSON.stringify(data));
    }
}
```

---

### 5. ShopSystem (商店系统)

```typescript
// assets/scripts/economy/ShopSystem.ts

const { ccclass, property } = cc._decorator;

@ccclass('ShopSystem')
export class ShopSystem extends Component {
    @property
    shopItems: ShopItem[] = [];
    
    @property
    playerLevel: number = 1;
    
    // 商店概率配置
    private shopProbability = {
        1: [100, 0, 0, 0, 0],
        3: [75, 20, 5, 0, 0],
        5: [45, 35, 15, 5, 0],
        7: [25, 30, 30, 10, 5],
        8: [15, 25, 35, 15, 10]
    };
    
    // 刷新商店
    public refreshShop() {
        const cost = 2; // 刷新成本
        if (!EconomySystem.instance.hasGold(cost)) {
            return;
        }
        
        EconomySystem.instance.spendGold(cost);
        
        // 生成新商店
        this.generateShop();
        
        EventSystem.emit('shop_refreshed', { items: this.shopItems });
    }
    
    private generateShop() {
        const probability = this.getProbabilityByLevel();
        this.shopItems = [];
        
        // 生成 5 个商品
        for (let i = 0; i < 5; i++) {
            const cost = this.rollCost(probability);
            const chessId = this.getRandomChessByCost(cost);
            this.shopItems.push({
                index: i,
                chessId: chessId,
                cost: cost,
                available: true
            });
        }
    }
    
    private rollCost(probability: number[]): number {
        const rand = Math.random() * 100;
        let sum = 0;
        for (let i = 0; i < probability.length; i++) {
            sum += probability[i];
            if (rand < sum) {
                return i + 1;
            }
        }
        return 1;
    }
    
    // 购买棋子
    public buyChess(index: number): Chess | null {
        const item = this.shopItems[index];
        if (!item || !item.available) {
            return null;
        }
        
        if (!EconomySystem.instance.hasGold(item.cost)) {
            return null;
        }
        
        EconomySystem.instance.spendGold(item.cost);
        item.available = false;
        
        const chess = this.createChess(item.chessId);
        EventSystem.emit('chess_purchased', { chess, index });
        
        return chess;
    }
    
    private createChess(chessId: string): Chess {
        // 从预制体创建棋子
        const prefab = Resources.load(`prefabs/chess/${chessId}`);
        const node = new Node();
        const chess = node.addComponent(Chess);
        chess.id = chessId;
        return chess;
    }
}
```

---

## 数据配置文件

### chess.json (棋子配置)

```json
{
  "huoqubing": {
    "id": "huoqubing",
    "name": "霍去病",
    "camp": "han",
    "profession": "cavalry",
    "cost": 5,
    "baseStats": {
      "hp": 800,
      "attack": 120,
      "defense": 40,
      "speed": 8,
      "range": 1
    },
    "skill": {
      "name": "封狼居胥",
      "energyCost": 6,
      "type": "damage",
      "target": "area",
      "damageRate": 2.0,
      "buffValue": 0.3,
      "duration": 8
    },
    "evolution": {
      "evolvedName": "封狼居胥·觉醒",
      "evolvedStats": {
        "hp": 1040,
        "attack": 156,
        "defense": 52
      },
      "evolvedSkill": {
        "name": "封狼居胥·觉",
        "damageRate": 2.6,
        "buffValue": 0.4,
        "extraEffect": "aura_han_attack_10"
      }
    }
  },
  "li_guang": {
    // ... 其他棋子
  }
}
```

### bond.json (羁绊配置)

```json
{
  "han_camp": {
    "name": "汉军",
    "type": "camp",
    "levels": {
      "3": {
        "effect": "attack_bonus",
        "value": 0.1,
        "desc": "汉军全体攻击 +10%"
      },
      "5": {
        "effect": "attack_hp_bonus",
        "attackValue": 0.2,
        "hpValue": 0.15,
        "desc": "汉军全体攻击 +20%, 生命 +15%"
      },
      "7": {
        "effect": "full_bonus",
        "attackValue": 0.3,
        "hpValue": 0.25,
        "speedValue": 0.2,
        "desc": "汉军全体攻击 +30%, 生命 +25%, 移速 +20%"
      }
    }
  },
  "cavalry": {
    "name": "骑兵",
    "type": "profession",
    "levels": {
      "2": {
        "effect": "speed_bonus",
        "value": 0.15,
        "desc": "骑兵移动速度 +15%"
      },
      "4": {
        "effect": "speed_first_attack",
        "speedValue": 0.3,
        "firstAttackBonus": 0.4,
        "desc": "骑兵移动速度 +30%, 首次攻击伤害 +40%"
      },
      "6": {
        "effect": "speed_first_attack_extreme",
        "speedValue": 0.5,
        "firstAttackBonus": 0.8,
        "desc": "骑兵移动速度 +50%, 首次攻击伤害 +80%"
      }
    }
  }
}
```

---

## 场景管理

### 场景加载流程

```typescript
// assets/scripts/core/SceneManager.ts

const { ccclass, property } = cc._decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
    private static instance: SceneManager;
    
    // 场景枚举
    enum SceneType {
        LOADING = 'loading',
        LOBBY = 'lobby',
        PREPARATION = 'preparation',
        BATTLE = 'battle'
    }
    
    // 加载场景
    public async loadScene(sceneType: SceneType): Promise<void> {
        const sceneName = `${sceneType}.scene`;
        
        // 显示加载界面
        UIManager.Instance.showLoading();
        
        // 异步加载
        await cc.director.loadScene(sceneName, (error, scene) => {
            if (error) {
                console.error('Load scene failed:', error);
                return;
            }
            
            // 加载完成
            UIManager.Instance.hideLoading();
            this.onSceneLoaded(sceneType);
        });
    }
    
    private onSceneLoaded(sceneType: SceneType) {
        switch (sceneType) {
            case SceneType.LOBBY:
                GameManager.Instance.startGame();
                break;
            case SceneType.PREPARATION:
                GameManager.Instance.startRound();
                break;
            case SceneType.BATTLE:
                GameManager.Instance.startCombat();
                break;
        }
    }
}
```

---

## UI 预制体规范

### ChessCard.prefab

```
节点结构:
ChessCard (Node)
├── Background (Sprite)         # 背景框
├── ChessIcon (Sprite)          # 棋子立绘
├── CostBadge (Node)
│   └── CostText (Label)        # 费用数字
├── StarGroup (Node)
│   ├── Star1 (Sprite)          # 星星 1
│   ├── Star2 (Sprite)          # 星星 2
│   └── Star3 (Sprite)          # 星星 3
├── CampIcon (Sprite)           # 阵营图标
├── ProfessionIcon (Sprite)     # 职业图标
└── EvolutionMark (Sprite)      # 转职标识 (隐藏)

组件:
- ChessCard.ts (脚本)
- Button (按钮交互)

属性:
- chessId: string
- quality: 1-5 (影响边框颜色)
- star: 1-3
- isEvolved: boolean
```

---

## 性能优化

### 对象池管理

```typescript
// assets/scripts/utils/PoolManager.ts

const { ccclass, property } = cc._decorator;

@ccclass('PoolManager')
export class PoolManager extends Component {
    private static instance: PoolManager;
    
    private chessPool: NodePool;
    private effectPool: NodePool;
    private damageNumberPool: NodePool;
    
    public static get Instance(): PoolManager {
        return PoolManager.instance;
    }
    
    onLoad() {
        PoolManager.instance = this;
        this.initPools();
    }
    
    private initPools() {
        // 棋子池 (最多 100 个)
        this.chessPool = new NodePool('ChessPool');
        for (let i = 0; i < 100; i++) {
            const node = new Node();
            this.chessPool.putInstance(node);
        }
        
        // 特效池
        this.effectPool = new NodePool('EffectPool');
        // ...
    }
    
    public getChess(): Node {
        return this.chessPool.get();
    }
    
    public putChess(node: Node) {
        this.chessPool.putInstance(node);
    }
}
```

### 图集优化

```
建议分包策略:
1. ui_common.atlas    - 512x512, 通用 UI 元素
2. ui_main.atlas      - 1024x1024, 主界面资源
3. ui_battle.atlas    - 1024x1024, 战斗 UI
4. chess_cards.atlas  - 2048x2048, 棋子卡片
5. chess_evolved.atlas- 2048x2048, 转职棋子
6. effects.atlas      - 1024x1024, 特效

优化要点:
- 频繁合批的资源放在同一图集
- 大尺寸立绘单独图集
- 转棋 子独立图集 (避免污染普通棋子)
```

---

## 项目管理文件

### project.json 关键配置

```json
{
  "project_name": "封狼居胥自走棋",
  "resolution": {
    "width": 750,
    "height": 1334,
    "fitWidth": true,
    "fitHeight": true
  },
  "scriptConfig": {
    "useTypescript": true,
    "target": "es2015"
  },
  "platform": {
    "wechat": {
      "appid": "wx_xxxxxx",
      "subContext": false
    }
  }
}
```

---

这套 Cocos Creator 项目框架为开发提供了完整的结构！需要我：
1. 创建具体的 TypeScript 脚本实现？
2. 设计数据库 Schema？
3. 生成详细的开发任务清单？

你觉得哪个最优先？🎮
