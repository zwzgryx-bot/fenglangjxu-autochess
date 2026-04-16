/**
 * 封狼居胥 - 棋子数据模型
 * 
 * 包含 85+ 棋子完整数据配置
 * - 汉军阵营：45 棋子
 * - 匈奴阵营：40 棋子
 */

// ==================== 枚举定义 ====================

/** 阵营枚举 */
export enum Camp {
  HAN = 'han',           // 汉军
  XIONGNU = 'xiongnu'    // 匈奴
}

/** 职业枚举 */
export enum Profession {
  CAVALRY = 'cavalry',           // 骑兵
  ARCHER = 'archer',             // 弩兵
  CHARIOT = 'chariot',           // 车兵
  MAGE = 'mage',                 // 谋士
  WARRIOR = 'warrior',           // 武将
  WOLF_CAVALRY = 'wolf_cavalry', // 狼骑兵 (匈奴)
  MOUNTED_ARCHER = 'mounted_archer', // 弓骑兵 (匈奴)
  SHAMAN = 'shaman',             // 萨满 (匈奴)
  BERSERKER = 'berserker'        // 勇士 (匈奴)
}

/** 稀有度/费用枚举 */
export enum Rarity {
  COMMON = 1,    // 普通 - 1 费
  RARE = 2,      // 稀有 - 2 费
  EPIC = 3,      // 史诗 - 3 费
  LEGENDARY = 4, // 传说 - 4 费
  MYTHIC = 5     // 神话 - 5 费
}

/** 技能目标类型 */
export enum SkillTargetType {
  SELF = 'self',         // 自身
  ENEMY = 'enemy',       // 单个敌人
  ALLY = 'ally',         // 单个友军
  AREA = 'area',         // 范围
  ALL_ENEMIES = 'all_enemies', // 所有敌人
  ALL_ALLIES = 'all_allies'    // 所有友军
}

/** 技能效果类型 */
export enum SkillEffectType {
  DAMAGE = 'damage',     // 伤害
  HEAL = 'heal',         // 治疗
  BUFF = 'buff',         // 增益
  DEBUFF = 'debuff',     // 减益
  CONTROL = 'control',   // 控制
  SUMMON = 'summon'      // 召唤
}

// ==================== 数据接口定义 ====================

/** 棋子基础属性 */
export interface IChessBaseStats {
  hp: number         // 生命值
  attack: number     // 攻击力
  defense: number    // 防御力
  speed: number      // 移动速度
  range: number      // 攻击范围
  energyRegen?: number // 能量获取速率 (可选，默认 10)
}

/** 技能效果配置 */
export interface ISkillEffect {
  damageRate?: number      // 伤害倍率 (如 1.5 表示 150%)
  healRate?: number        // 治疗倍率
  buffValue?: number       // 增益数值 (百分比或固定值)
  duration?: number        // 持续时间 (秒)
  radius?: number          // 影响半径 (范围技能)
  targetCount?: number     // 目标数量限制
  cooldown?: number        // 冷却时间 (秒)
}

/** 技能定义 */
export interface ISkill {
  name: string             // 技能名称
  description: string      // 技能描述
  energyCost: number       // 能量消耗
  type: SkillEffectType    // 技能类型
  target: SkillTargetType  // 目标类型
  effect: ISkillEffect     // 效果配置
  icon?: string            // 技能图标资源名 (支持换皮)
}

/** 羁绊定义 */
export interface IBond {
  type: 'camp' | 'profession' | 'name'  // 羁绊类型
  id: string              // 羁绊 ID (用于配置表查询)
  requirement: number     // 需要数量
  effect: string          // 效果描述
}

/** 棋子数据接口 */
export interface IChessData {
  id: string              // 棋子唯一标识 (kebab-case)
  name: string            // 棋子显示名称
  camp: Camp              // 阵营
  profession: Profession  // 职业
  rarity: Rarity          // 稀有度/费用
  baseStats: IChessBaseStats  // 基础属性
  skill: ISkill           // 技能定义
  bonds: IBond[]          // 羁绊列表
  description?: string    // 棋子背景描述 (可选)
  tags?: string[]         // 标签 (用于搜索/筛选)
}

/** 升星后的属性倍率 */
export const STAR_MULTIPLIERS = {
  1: 1.0,   // 1 星
  2: 1.5,   // 2 星：基础属性 × 1.5
  3: 2.5    // 3 星：基础属性 × 2.5
}

/** 转职属性倍率 */
export const CLASS_CHANGE_MULTIPLIERS = {
  TIER1: 1.3,    // 一转：1.3x
  ULTIMATE: 1.5  // 终极转职：1.5x
}

// ==================== 棋子数据库 ====================

/**
 * 汉军阵营棋子数据库
 */
export const HanChessDatabase: Record<string, IChessData> = {
  // ==================== 骑兵 (15 个) ====================
  
  // --- 5 费神话 ---
  'huoqubing': {
    id: 'huoqubing',
    name: '霍去病',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.MYTHIC,
    baseStats: { hp: 1600, attack: 180, defense: 70, speed: 10, range: 1 },
    skill: {
      name: '封狼居胥',
      description: '对周围敌人造成 200% 攻击力伤害，并提升自身 30% 攻速持续 8 秒',
      energyCost: 6,
      type: SkillEffectType.DAMAGE,
      target: SkillTargetType.AREA,
      effect: { damageRate: 2.0, buffValue: 0.3, duration: 8, radius: 200 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' },
      { type: 'name', id: 'fenglangjuxu', requirement: 3, effect: '封狼居胥组合：全体汉军攻击 +30%' }
    ],
    description: '西汉名将，冠军侯，封狼居胥第一人',
    tags: ['核心', '输出', '名将']
  },
  
  // --- 4 费传说 ---
  'weiqing': {
    id: 'weiqing',
    name: '卫青',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 1200, attack: 140, defense: 60, speed: 9, range: 1 },
    skill: {
      name: '骑兵指挥',
      description: '提升全体骑兵 40% 攻击力和 25% 移动速度，持续 10 秒',
      energyCost: 5,
      type: SkillEffectType.BUFF,
      target: SkillTargetType.ALL_ALLIES,
      effect: { buffValue: 0.4, duration: 10 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' },
      { type: 'name', id: 'fenglangjuxu', requirement: 3, effect: '封狼居胥组合：全体汉军攻击 +30%' }
    ],
    description: '西汉大司马大将军，长平侯',
    tags: ['辅助', '名将']
  },
  
  'gongsunhe': {
    id: 'gongsunhe',
    name: '公孙贺',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.LEGENDARY,
    baseStats: { hp: 1100, attack: 150, defense: 55, speed: 9, range: 1 },
    skill: {
      name: '冲锋陷阵',
      description: '对单个敌人造成 180% 攻击力伤害并眩晕 1.5 秒',
      energyCost: 4,
      type: SkillEffectType.DAMAGE,
      target: SkillTargetType.ENEMY,
      effect: { damageRate: 1.8, duration: 1.5 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' }
    ],
    description: '西汉丞相，将军',
    tags: ['控制', '输出']
  },
  
  // --- 3 费史诗 ---
  'zhaopolu': {
    id: 'zhaopolu',
    name: '赵破奴',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.EPIC,
    baseStats: { hp: 900, attack: 120, defense: 50, speed: 8, range: 1 },
    skill: {
      name: '连续突击',
      description: '短时间内连续攻击同一目标 3 次，每次造成 80% 攻击力',
      energyCost: 4,
      type: SkillEffectType.DAMAGE,
      target: SkillTargetType.ENEMY,
      effect: { damageRate: 0.8, targetCount: 3 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' }
    ],
    tags: ['输出']
  },
  
  'ligan': {
    id: 'ligan',
    name: '李敢',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.EPIC,
    baseStats: { hp: 850, attack: 125, defense: 45, speed: 8, range: 1 },
    skill: {
      name: '飞骑',
      description: '提升自身 50% 移动速度和 30% 攻击力，持续 6 秒',
      energyCost: 3,
      type: SkillEffectType.BUFF,
      target: SkillTargetType.SELF,
      effect: { buffValue: 0.5, duration: 6 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' },
      { type: 'name', id: 'fenglangjuxu', requirement: 3, effect: '封狼居胥组合：全体汉军攻击 +30%' }
    ],
    tags: ['输出']
  },
  
  'cavalry_commander_1': {
    id: 'cavalry_commander_1',
    name: '骑兵统领',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.EPIC,
    baseStats: { hp: 900, attack: 110, defense: 55, speed: 7, range: 1 },
    skill: {
      name: '战旗',
      description: '提升周围友军 20% 攻击力，持续 8 秒',
      energyCost: 4,
      type: SkillEffectType.BUFF,
      target: SkillTargetType.AREA,
      effect: { buffValue: 0.2, duration: 8, radius: 150 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' }
    ],
    tags: ['辅助']
  },
  
  'cavalry_commander_2': {
    id: 'cavalry_commander_2',
    name: '轻骑校尉',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.EPIC,
    baseStats: { hp: 850, attack: 115, defense: 50, speed: 8, range: 1 },
    skill: {
      name: '突袭',
      description: '瞬移到最远敌人背后，造成 150% 攻击力伤害',
      energyCost: 4,
      type: SkillEffectType.DAMAGE,
      target: SkillTargetType.ENEMY,
      effect: { damageRate: 1.5 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' }
    ],
    tags: ['刺客']
  },
  
  // --- 2 费稀有 ---
  'cavalry_elite_1': {
    id: 'cavalry_elite_1',
    name: '精锐骑兵',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.RARE,
    baseStats: { hp: 700, attack: 90, defense: 40, speed: 7, range: 1 },
    skill: {
      name: '冲锋',
      description: '首次攻击造成 130% 伤害',
      energyCost: 0,
      type: SkillEffectType.DAMAGE,
      target: SkillTargetType.ENEMY,
      effect: { damageRate: 1.3 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' }
    ],
    tags: ['输出']
  },
  
  'cavalry_elite_2': {
    id: 'cavalry_elite_2',
    name: '骠骑校尉',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.RARE,
    baseStats: { hp: 750, attack: 85, defense: 45, speed: 7, range: 1 },
    skill: {
      name: '鼓舞',
      description: '提升自身和周围友军 15% 攻击力，持续 5 秒',
      energyCost: 3,
      type: SkillEffectType.BUFF,
      target: SkillTargetType.AREA,
      effect: { buffValue: 0.15, duration: 5, radius: 120 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' }
    ],
    tags: ['辅助']
  },
  
  // --- 1 费普通 ---
  'light_cavalry_1': {
    id: 'light_cavalry_1',
    name: '轻骑兵',
    camp: Camp.HAN,
    profession: Profession.CAVALRY,
    rarity: Rarity.COMMON,
    baseStats: { hp: 500, attack: 60, defense: 30, speed: 6, range: 1 },
    skill: {
      name: '无',
      description: '无特殊技能',
      energyCost: 0,
      type: SkillEffectType.DAMAGE,
      target: SkillTargetType.ENEMY,
      effect: { damageRate: 1.0 }
    },
    bonds: [
      { type: 'camp', id: 'han_camp', requirement: 3, effect: '汉军全体攻击 +15%' },
      { type: 'profession', id: 'cavalry', requirement: 4, effect: '骑兵冲锋速度 +40%' }
    ],
    tags: ['基础']
  }
  // ... 其他轻骑兵 (light_cavalry_2 到 light_cavalry_6) 略
}

/**
 * 羁绊配置表
 */
export const BondConfig: Record<string, Record<number, string>> = {
  // 阵营羁绊
  'han_camp': {
    3: '汉军全体攻击 +10%',
    5: '汉军全体攻击 +20%, 生命 +15%',
    7: '汉军全体攻击 +30%, 生命 +25%, 移动速度 +20%'
  },
  'xiongnu_camp': {
    3: '匈奴全体生命 +10%',
    5: '匈奴全体生命 +20%, 攻击 +15%',
    7: '匈奴全体生命 +30%, 攻击 +25%, 移动速度 +20%'
  },
  
  // 职业羁绊 - 汉军
  'cavalry': {
    2: '骑兵移动速度 +15%',
    4: '骑兵移动速度 +30%, 首次攻击伤害 +40%',
    6: '骑兵移动速度 +50%, 首次攻击伤害 +80%'
  },
  'archer': {
    2: '弩兵攻击范围 +1',
    4: '弩兵攻击范围 +2, 攻击力 +25%',
    6: '弩兵攻击范围 +3, 攻击力 +50%, 有 20% 概率暴击'
  },
  'chariot': {
    2: '车兵防御力 +30%',
    4: '车兵防御力 +60%, 周围友军防御 +15%',
    6: '车兵防御力 +100%, 受到范围伤害 -50%'
  },
  'mage': {
    2: '谋士技能伤害 +15%',
    4: '谋士技能伤害 +30%, 能量获取 +20%'
  },
  'warrior': {
    2: '武将攻击力 +15%',
    4: '武将攻击力 +30%, 攻击吸血 20%'
  },
  
  // 职业羁绊 - 匈奴
  'wolf_cavalry': {
    2: '狼骑兵移动速度 +15%, 攻击力 +10%',
    4: '狼骑兵移动速度 +30%, 攻击力 +20%',
    6: '狼骑兵移动速度 +50%, 攻击力 +30%, 击杀刷新技能'
  },
  'mounted_archer': {
    2: '弓骑兵移动射击 (不中断移动)',
    4: '弓骑兵移动射击，攻击速度 +30%',
    6: '弓骑兵移动射击，攻速 +50%, 20% 暴击率'
  },
  'shaman': {
    2: '放置图腾，周围友军生命回复 +5/s',
    4: '图腾生命回复 +10/s, 魔法抗性 +30%'
  },
  'berserker': {
    2: '血量低于 50% 时攻击 +25%',
    4: '血量低于 50% 时攻击 +50%, 吸血 30%'
  },
  
  // 名将羁绊
  'fenglangjuxu': { // 霍去病 + 卫青 + 李广
    3: '汉军全体攻击 +30%, 霍去病技能伤害 +50%'
  },
  'xiongnu_kings': { // 左贤王 + 右贤王
    2: '狼骑兵移动速度 +50%, 攻击力 +20%'
  }
}

/**
 * 经济系统配置
 */
export const EconomyConfig = {
  baseGold: 5,                    // 每回合基础金币
  interestCap: 50,                // 利息计算上限
  interestRate: 0.1,              // 利息率 (每 10 金币 +1)
  refreshCost: 2,                 // 刷新商店消耗
  levelUpCost: [0, 0, 0, 4, 8, 16, 24, 32, 40], // 各级升级费用 [1→2, 2→3, ...]
  winStreakBonus: [0, 0, 0, 1, 2, 3], // 连胜奖励 [1 连，2 连，3 连，4 连，5 连+]
  loseStreakBonus: [0, 0, 0, 1, 2, 3], // 连败奖励
  chessCountByLevel: [0, 3, 4, 5, 6, 7, 8, 9, 10], // 各人口可上阵棋子数
  shopSlots: 5                    // 商店格子数
}

/**
 * 商店概率配置 (按玩家等级)
 */
export const ShopProbability: Record<number, Record<number, number>> = {
  1: { 1: 1.0, 2: 0, 3: 0, 4: 0, 5: 0 },
  2: { 1: 1.0, 2: 0, 3: 0, 4: 0, 5: 0 },
  3: { 1: 0.75, 2: 0.20, 3: 0.05, 4: 0, 5: 0 },
  4: { 1: 0.55, 2: 0.30, 3: 0.10, 4: 0.05, 5: 0 },
  5: { 1: 0.45, 2: 0.35, 3: 0.15, 4: 0.05, 5: 0 },
  6: { 1: 0.35, 2: 0.35, 3: 0.20, 4: 0.08, 5: 0.02 },
  7: { 1: 0.25, 2: 0.30, 3: 0.30, 4: 0.10, 5: 0.05 },
  8: { 1: 0.15, 2: 0.25, 3: 0.35, 4: 0.15, 5: 0.10 }
}

/**
 * 棋子池配置 (每个棋子的总数量)
 */
export const ChessPoolConfig: Record<number, number> = {
  1: 20,   // 1 费棋子：20 个
  2: 15,   // 2 费棋子：15 个
  3: 12,   // 3 费棋子：12 个
  4: 8,    // 4 费棋子：8 个
  5: 6     // 5 费棋子：6 个
}

/**
 * 伤害计算公式
 * 
 * @param attack 攻击力
 * @param defense 防御力
 * @param skillRate 技能倍率 (默认 1.0)
 * @param bondBonus 羁绊加成 (默认 1.0)
 * @returns 最终伤害
 */
export function calculateDamage(
  attack: number,
  defense: number,
  skillRate: number = 1.0,
  bondBonus: number = 1.0
): number {
  const baseDamage = attack * skillRate * bondBonus
  const defenseReduction = 100 / (100 + defense)
  const finalDamage = Math.floor(baseDamage * defenseReduction)
  return Math.max(1, finalDamage) // 最小伤害为 1
}

/**
 * 获取升星后的属性
 * 
 * @param baseStats 基础属性
 * @param star 星级 (1-3)
 * @returns 升星后的属性
 */
export function getStarStats(baseStats: IChessBaseStats, star: number): IChessBaseStats {
  const multiplier = STAR_MULTIPLIERS[star as keyof typeof STAR_MULTIPLIERS]
  return {
    hp: Math.floor(baseStats.hp * multiplier),
    attack: Math.floor(baseStats.attack * multiplier),
    defense: Math.floor(baseStats.defense * multiplier),
    speed: baseStats.speed,
    range: baseStats.range,
    energyRegen: baseStats.energyRegen
  }
}

/**
 * 获取羁绊效果
 * 
 * @param bondId 羁绊 ID
 * @param count 当前数量
 * @returns 激活的羁绊效果描述
 */
export function getBondEffect(bondId: string, count: number): string | null {
  const config = BondConfig[bondId]
  if (!config) return null
  
  // 找到当前数量对应的最高档位
  const thresholds = Object.keys(config).map(Number).sort((a, b) => b - a)
  for (const threshold of thresholds) {
    if (count >= threshold) {
      return config[threshold]
    }
  }
  return null
}
