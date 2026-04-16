/**
 * 封狼居胥 - 游戏配置常量
 * 
 * 集中管理所有游戏配置参数
 * 便于调整和平衡性修改
 */

// ==================== 游戏基础配置 ====================

/** 游戏版本号 */
export const GAME_VERSION: string = '1.0.0'

/** 游戏名称 */
export const GAME_TITLE: string = '封狼居胥'

/** 设计分辨率 */
export const DESIGN_RESOLUTION = {
  width: 1280,
  height: 720
}

/** 帧率 */
export const FPS: number = 60

// ==================== 战斗配置 ====================

/** 战斗回合数 (准备阶段秒数) */
export const BATTLE_PREPARE_TIME: number = 30

/** 战斗阶段时长 (秒数) */
export const BATTLE_COMBAT_TIME: number = 60

/** 总回合数 */
export const TOTAL_ROUNDS: number = 20

/** 棋盘宽度 */
export const BOARD_WIDTH: number = 1200

/** 棋盘高度 */
export const BOARD_HEIGHT: number = 800

/** 攻击间隔 (秒) */
export const ATTACK_INTERVAL: number = 1.0

/** 移动速度 */
export const MOVE_SPEED: number = 100

// ==================== 经济配置 ====================

/** 玩家初始金币 */
export const INITIAL_GOLD: number = 50

/** 每回合基础收入 */
export const BASE_INCOME: number = 5

/** 最大利息 (每 10 金 +1，上限值) */
export const MAX_INTEREST: number = 5

/** 利息计算基数 */
export const INTEREST_BASE: number = 10

/** 商店刷新费用 */
export const SHOP_REFRESH_COST: number = 2

/** 升级人口基础费用 */
export const LEVEL_UP_BASE_COST: number = 4

/** 连胜/连败奖励范围 */
export const STREAK_REWARD_RANGE = {
  min: 1,  // 3 连胜/连败
  max: 3   // 5+ 连胜/连败
}

// ==================== 商店配置 ====================

/** 商店格子数量 */
export const SHOP_SLOT_COUNT: number = 5

/** 玩家最大等级 */
export const PLAYER_MAX_LEVEL: number = 10

/** 每级人口 (可上场的棋子数量) */
export const LEVEL_POPULATION: { [level: number]: number } = {
  1: 3,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
  9: 10,
  10: 10
}

/** 商店刷新概率权重 (按玩家等级) */
export const SHOP_PROBABILITY: { [level: number]: { [rarity: string]: number } } = {
  1: { common: 100, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 },
  2: { common: 80, uncommon: 20, rare: 0, epic: 0, legendary: 0, mythic: 0 },
  3: { common: 60, uncommon: 35, rare: 5, epic: 0, legendary: 0, mythic: 0 },
  4: { common: 45, uncommon: 40, rare: 15, epic: 0, legendary: 0, mythic: 0 },
  5: { common: 35, uncommon: 40, rare: 20, epic: 5, legendary: 0, mythic: 0 },
  6: { common: 25, uncommon: 40, rare: 25, epic: 10, legendary: 0, mythic: 0 },
  7: { common: 20, uncommon: 35, rare: 30, epic: 15, legendary: 0, mythic: 0 },
  8: { common: 15, uncommon: 30, rare: 30, epic: 20, legendary: 5, mythic: 0 },
  9: { common: 10, uncommon: 25, rare: 30, epic: 25, legendary: 10, mythic: 0 },
  10: { common: 5, uncommon: 17, rare: 26, epic: 30, legendary: 15, mythic: 7 }
}

// ==================== 棋子配置 ====================

/** 1 星棋子属性倍率 */
export const STAR_1_MULTIPLIER: number = 1.0

/** 2 星棋子属性倍率 */
export const STAR_2_MULTIPLIER: number = 1.5

/** 3 星棋子属性倍率 */
export const STAR_3_MULTIPLIER: number = 3.0

/** 一转属性倍率 */
export const CLASS_CHANGE_FIRST_MULTIPLIER: number = 1.3

/** 终极转职属性倍率 */
export const CLASS_CHANGE_ULTIMATE_MULTIPLIER: number = 1.5

/** 合成所需数量 (3 个 1 星 = 1 个 2 星) */
export const MERGE_COUNT: number = 3

// ==================== 羁绊配置 ====================

/** 阵营羁绊触发层级 */
export const CAMP_SYNERGY_LEVELS: number[] = [3, 5, 7]

/** 职业羁绊触发层级 */
export const PROFESSION_SYNERGY_LEVELS: number[] = [2, 4, 6]

/** 名将组合羁绊触发层级 */
export const HERO_SYNERGY_LEVELS: number[] = [2, 3, 4]

// ==================== 伤害公式配置 ====================

/** 物理伤害公式系数 */
export const PHYSICAL_DAMAGE_FACTOR: number = 1.0

/** 法术伤害公式系数 */
export const MAGIC_DAMAGE_FACTOR: number = 1.2

/** 护甲减免系数 */
export const ARMOR_REDUCTION_FACTOR: number = 0.6

/** 暴击伤害倍率 */
export const CRITICAL_DAMAGE_MULTIPLIER: number = 2.0

/** 闪避基础概率 */
export const DODGE_BASE_CHANCE: number = 0.2

// ==================== UI 配置 ====================

/** 自动隐藏 UI 超时 (毫秒) */
export const UI_AUTO_HIDE_TIMEOUT: number = 5000

/** 提示显示时长 (毫秒) */
export const TOAST_DURATION: number = 2000

/** 页面切换动画时长 (毫秒) */
export const PAGE_TRANSITION_DURATION: number = 300

// ==================== 音效配置 ====================

/** 默认 BGM 音量 */
export const DEFAULT_BGM_VOLUME: number = 0.7

/** 默认 SFX 音量 */
export const DEFAULT_SFX_VOLUME: number = 0.8

/** 音效预加载列表 */
export const PRELOAD_SFX_LIST: string[] = [
  'button_click',
  'chess_select',
  'chess_place',
  'attack_hit',
  'gold_gain',
  'shop_refresh'
]

/** BGM 预加载列表 */
export const PRELOAD_BGM_LIST: string[] = [
  'main_menu',
  'lobby',
  'battle'
]

// ==================== 存档配置 ====================

/** 自动保存间隔 (秒) */
export const AUTO_SAVE_INTERVAL: number = 30

/** 最大存档版本数 */
export const MAX_SAVE_VERSIONS: number = 5

/** 存档前缀 */
export const SAVE_PREFIX: string = 'fenglangjxu_'

// ==================== AI 配置 ====================

/** AI 决策间隔 (毫秒) */
export const AI_DECISION_INTERVAL: number = 500

/** AI 思考延迟最小值 (毫秒) */
export const AI_THINK_MIN_DELAY: number = 200

/** AI 思考延迟最大值 (毫秒) */
export const AI_THINK_MAX_DELAY: number = 800

// ==================== 性能配置 ====================

/** 对象池初始大小 */
export const OBJECT_POOL_INITIAL_SIZE: number = 50

/** 对象池最大大小 */
export const OBJECT_POOL_MAX_SIZE: number = 200

/** 资源加载超时 (毫秒) */
export const RESOURCE_LOAD_TIMEOUT: number = 10000

/** 最大 simultaneously 加载数 */
export const MAX_CONCURRENT_LOADS: number = 5

// ==================== 调试配置 ====================

/** 是否启用调试模式 */
export const DEBUG_MODE: boolean = false

/** 是否显示帧率 */
export const SHOW_FPS: boolean = false

/** 是否启用性能监控 */
export const ENABLE_PERFORMANCE_MONITOR: boolean = false

// ==================== 工具函数 ====================

/**
 * 获取玩家等级对应的人口
 */
export function getPopulationByLevel(level: number): number {
  return LEVEL_POPULATION[level] ?? 10
}

/**
 * 获取商店刷新概率
 */
export function getShopProbability(level: number, rarity: string): number {
  const probs = SHOP_PROBABILITY[level]
  if (!probs) return 0
  return probs[rarity] ?? 0
}

/**
 * 获取升级费用
 * 
 * @param currentLevel 当前等级
 * @param targetLevel 目标等级
 */
export function getLevelUpCost(currentLevel: number, targetLevel: number): number {
  const diff = targetLevel - currentLevel
  if (diff <= 0) return 0
  
  // 简化公式：4 + 每级 +2
  return LEVEL_UP_BASE_COST + (diff - 1) * 2
}

/**
 * 计算利息
 * 
 * @param gold 当前金币
 */
export function calculateInterest(gold: number): number {
  const interest = Math.floor(gold / INTEREST_BASE)
  return Math.min(interest, MAX_INTEREST)
}

/**
 * 计算连胜/连败奖励
 * 
 * @param streak 连胜/连败次数 (正数=连胜，负数=连败)
 */
export function calculateStreakReward(streak: number): number {
  const absStreak = Math.abs(streak)
  
  if (absStreak < 3) return 0
  if (absStreak >= 5) return STREAK_REWARD_RANGE.max
  
  return STREAK_REWARD_RANGE.min + (absStreak - 3)
}

/**
 * 检查是否满足羁绊条件
 * 
 * @param count 当前数量
 * @param levels 羁绊层级数组
 */
export function checkSynergyLevel(count: number, levels: number[]): number {
  let activeLevel = 0
  
  for (const level of levels) {
    if (count >= level) {
      activeLevel = level
    }
  }
  
  return activeLevel
}

// ==================== 导出配置对象 ====================

/**
 * 游戏配置对象
 */
export const GameConfig = {
  // 基础
  version: GAME_VERSION,
  title: GAME_TITLE,
  resolution: DESIGN_RESOLUTION,
  fps: FPS,
  
  // 战斗
  battlePrepareTime: BATTLE_PREPARE_TIME,
  battleCombatTime: BATTLE_COMBAT_TIME,
  totalRounds: TOTAL_ROUNDS,
  boardSize: { width: BOARD_WIDTH, height: BOARD_HEIGHT },
  
  // 经济
  initialGold: INITIAL_GOLD,
  baseIncome: BASE_INCOME,
  maxInterest: MAX_INTEREST,
  
  // 商店
  shopSlotCount: SHOP_SLOT_COUNT,
  refreshCost: SHOP_REFRESH_COST,
  
  // 棋子
  starMultipliers: [STAR_1_MULTIPLIER, STAR_2_MULTIPLIER, STAR_3_MULTIPLIER],
  classChangeMultipliers: {
    first: CLASS_CHANGE_FIRST_MULTIPLIER,
    ultimate: CLASS_CHANGE_ULTIMATE_MULTIPLIER
  },
  
  // 羁绊
  synergyLevels: {
    camp: CAMP_SYNERGY_LEVELS,
    profession: PROFESSION_SYNERGY_LEVELS,
    hero: HERO_SYNERGY_LEVELS
  },
  
  // 调试
  debugMode: DEBUG_MODE,
  showFps: SHOW_FPS,
  
  // 工具函数
  utils: {
    getPopulationByLevel,
    getShopProbability,
    getLevelUpCost,
    calculateInterest,
    calculateStreakReward,
    checkSynergyLevel
  }
}

// 默认导出
export default GameConfig

/**
 * 使用示例:
 * 
 * 1. 导入单个常量:
 *    import { INITIAL_GOLD, BASE_INCOME } from './GameConfig'
 * 
 * 2. 导入配置对象:
 *    import GameConfig from './GameConfig'
 *    const gold = GameConfig.initialGold
 * 
 * 3. 使用工具函数:
 *    import { calculateInterest, getShopProbability } from './GameConfig'
 *    const interest = calculateInterest(67) // 返回 5
 *    const prob = getShopProbability(5, 'rare') // 返回 20
 * 
 * 4. 调整游戏平衡:
 *    只需修改本文件中的常量值
 *    无需修改其他代码
 */
