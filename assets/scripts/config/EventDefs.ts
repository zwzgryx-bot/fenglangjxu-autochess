/**
 * 封狼居胥 - 事件常量定义
 * 
 * 集中管理所有事件名称
 * 避免硬编码和拼写错误
 */

// ==================== 游戏流程事件 ====================

/** 游戏启动完成 */
export const GAME_START = 'game:start'

/** 游戏结束 */
export const GAME_END = 'game:end'

/** 游戏暂停 */
export const GAME_PAUSE = 'game:pause'

/** 游戏恢复 */
export const GAME_RESUME = 'game:resume'

// ==================== 场景切换事件 ====================

/** 场景加载开始 */
export const SCENE_LOAD_START = 'scene:load_start'

/** 场景加载完成 */
export const SCENE_LOAD_END = 'scene:load_end'

/** 进入主菜单 */
export const SCENE_MAIN_MENU = 'scene:main_menu'

/** 进入大厅 */
export const SCENE_LOBBY = 'scene:lobby'

/** 进入战斗 */
export const SCENE_BATTLE = 'scene:battle'

// ==================== 回合流程事件 ====================

/** 回合开始 */
export const ROUND_START = 'round:start'

/** 准备阶段开始 */
export const PHASE_PREPARE_START = 'phase:prepare_start'

/** 准备阶段结束 */
export const PHASE_PREPARE_END = 'phase:prepare_end'

/** 战斗阶段开始 */
export const PHASE_BATTLE_START = 'phase:battle_start'

/** 战斗阶段结束 */
export const PHASE_BATTLE_END = 'phase:battle_end'

/** 结算阶段开始 */
export const PHASE_SETTLEMENT_START = 'phase:settlement_start'

/** 回合结束 */
export const ROUND_END = 'round:end'

// ==================== 战斗事件 ====================

/** 战斗开始 */
export const BATTLE_START = 'battle:start'

/** 战斗结束 */
export const BATTLE_END = 'battle:end'

/** 棋子攻击 */
export const BATTLE_ATTACK = 'battle:attack'

/** 棋子受到伤害 */
export const BATTLE_DAMAGE = 'battle:damage'

/** 棋子死亡 */
export const BATTLE_CHESS_DIED = 'battle:chess_died'

/** 技能释放 */
export const BATTLE_SKILL = 'battle:skill'

/** 战斗胜利 */
export const BATTLE_VICTORY = 'battle:victory'

/** 战斗失败 */
export const BATTLE_DEFEAT = 'battle:defeat'

// ==================== 棋子事件 ====================

/** 棋子选中 */
export const CHESS_SELECT = 'chess:select'

/** 棋子移动 */
export const CHESS_MOVE = 'chess:move'

/** 棋子放置 */
export const CHESS_PLACE = 'chess:place'

/** 棋子出售 */
export const CHESS_SELL = 'chess:sell'

/** 棋子合并 */
export const CHESS_MERGE = 'chess:merge'

/** 棋子升星 */
export const CHESS_STAR_UP = 'chess:star_up'

/** 棋子转职 */
export const CHESS_CLASS_CHANGE = 'chess:class_change'

/** 棋子升级 */
export const CHESS_LEVEL_UP = 'chess:level_up'

// ==================== 商店事件 ====================

/** 商店刷新 */
export const SHOP_REFRESH = 'shop:refresh'

/** 刷新商店 */
export const SHOP_REFRESH_REQUEST = 'shop:refresh_request'

/** 购买棋子 */
export const SHOP_BUY_CHESS = 'shop:buy_chess'

/** 商店锁定 */
export const SHOP_LOCK = 'shop:lock'

/** 商店解锁 */
export const SHOP_UNLOCK = 'shop:unlock'

/** 升级人口 */
export const SHOP_LEVEL_UP = 'shop:level_up'

// ==================== 经济事件 ====================

/** 金币变化 */
export const GOLD_CHANGE = 'gold:change'

/** 获得金币 */
export const GOLD_GAIN = 'gold:gain'

/** 消耗金币 */
export const GOLD_SPEND = 'gold:spend'

/** 利息结算 */
export const GOLD_INTEREST = 'gold:interest'

/** 连胜奖励 */
export const GOLD_STREAK_WIN = 'gold:streak_win'

/** 连败奖励 */
export const GOLD_STREAK_LOSE = 'gold:streak_lose'

// ==================== 羁绊事件 ====================

/** 羁绊激活 */
export const SYNERGY_ACTIVATE = 'synergy:activate'

/** 羁绊失效 */
export const SYNERGY_DEACTIVATE = 'synergy:deactivate'

/** 羁绊更新 */
export const SYNERGY_UPDATE = 'synergy:update'

// ==================== UI 事件 ====================

/** 打开面板 */
export const UI_OPEN_PANEL = 'ui:open_panel'

/** 关闭面板 */
export const UI_CLOSE_PANEL = 'ui:close_panel'

/** 面板切换 */
export const UI_SWITCH_PANEL = 'ui:switch_panel'

/** 显示提示 */
export const UI_SHOW_TOAST = 'ui:show_toast'

/** 隐藏提示 */
export const UI_HIDE_TOAST = 'ui:hide_toast'

/** 显示对话框 */
export const UI_SHOW_DIALOG = 'ui:show_dialog'

/** 隐藏对话框 */
export const UI_HIDE_DIALOG = 'ui:hide_dialog'

/** UI 更新 */
export const UI_UPDATE = 'ui:update'

/** 主题切换 */
export const UI_THEME_CHANGE = 'ui:theme_change'

// ==================== 加载事件 ====================

/** 显示加载界面 */
export const SHOW_LOADING = 'show_loading'

/** 隐藏加载界面 */
export const HIDE_LOADING = 'hide_loading'

/** 加载进度 */
export const LOAD_PROGRESS = 'load:progress'

// ==================== 玩家事件 ====================

/** 玩家经验变化 */
export const PLAYER_EXP_CHANGE = 'player:exp_change'

/** 玩家升级 */
export const PLAYER_LEVEL_UP = 'player:level_up'

/** 玩家金币变化 */
export const PLAYER_GOLD_CHANGE = 'player:gold_change'

/** 玩家血量变化 */
export const PLAYER_HP_CHANGE = 'player:hp_change'

/** 玩家死亡 */
export const PLAYER_DIED = 'player:died'

// ==================== 音效事件 ====================

/** 播放 BGM */
export const AUDIO_PLAY_BGM = 'audio:play_bgm'

/** 暂停 BGM */
export const AUDIO_PAUSE_BGM = 'audio:pause_bgm'

/** 恢复 BGM */
export const AUDIO_RESUME_BGM = 'audio:resume_bgm'

/** 停止 BGM */
export const AUDIO_STOP_BGM = 'audio:stop_bgm'

/** 播放音效 */
export const AUDIO_PLAY_SFX = 'audio:play_sfx'

/** 设置静音 */
export const AUDIO_SET_MUTED = 'audio:set_muted'

/** 设置 BGM 音量 */
export const AUDIO_SET_BGM_VOLUME = 'audio:set_bgm_volume'

/** 设置 SFX 音量 */
export const AUDIO_SET_SFX_VOLUME = 'audio:set_sfx_volume'

// ==================== 存档事件 ====================

/** 保存游戏 */
export const SAVE_GAME = 'save:game'

/** 加载游戏 */
export const LOAD_GAME = 'load:game'

/** 保存成功 */
export const SAVE_SUCCESS = 'save:success'

/** 保存失败 */
export const SAVE_FAILED = 'save:failed'

/** 加载成功 */
export const LOAD_SUCCESS = 'load:success'

/** 加载失败 */
export const LOAD_FAILED = 'load:failed'

// ==================== 系统事件 ====================

/** 显示设置 */
export const SYSTEM_SHOW_SETTINGS = 'system:show_settings'

/** 隐藏设置 */
export const SYSTEM_HIDE_SETTINGS = 'system:hide_settings'

/** 显示收藏 */
export const SYSTEM_SHOW_COLLECTION = 'system:show_collection'

/** 显示战记 */
export const SYSTEM_SHOW_RECORD = 'system:show_record'

/** 匹配开始 */
export const SYSTEM_MATCH_START = 'system:match_start'

/** 匹配成功 */
export const SYSTEM_MATCH_SUCCESS = 'system:match_success'

/** 匹配失败 */
export const SYSTEM_MATCH_FAILED = 'system:match_failed'

// ==================== 事件映射表 ====================

/**
 * 事件分类映射
 * 用于日志和调试
 */
export const EVENT_CATEGORY: { [key: string]: string } = {
  // 游戏流程
  'game:start': 'Game',
  'game:end': 'Game',
  'game:pause': 'Game',
  'game:resume': 'Game',
  
  // 场景
  'scene:load_start': 'Scene',
  'scene:load_end': 'Scene',
  'scene:main_menu': 'Scene',
  'scene:lobby': 'Scene',
  'scene:battle': 'Scene',
  
  // 回合
  'round:start': 'Round',
  'round:end': 'Round',
  'phase:prepare_start': 'Phase',
  'phase:battle_start': 'Phase',
  
  // 战斗
  'battle:start': 'Battle',
  'battle:end': 'Battle',
  'battle:attack': 'Battle',
  'battle:damage': 'Battle',
  'battle:chess_died': 'Battle',
  
  // 棋子
  'chess:select': 'Chess',
  'chess:move': 'Chess',
  'chess:sell': 'Chess',
  'chess:merge': 'Chess',
  
  // 商店
  'shop:refresh': 'Shop',
  'shop:buy_chess': 'Shop',
  
  // 经济
  'gold:change': 'Economy',
  'gold:gain': 'Economy',
  'gold:spend': 'Economy',
  
  // UI
  'ui:open_panel': 'UI',
  'ui:show_toast': 'UI',
  
  // 音效
  'audio:play_bgm': 'Audio',
  'audio:play_sfx': 'Audio',
  
  // 存档
  'save:game': 'Save',
  'load:game': 'Save',
  
  // 系统
  'system:match_start': 'System',
  'system:show_settings': 'System'
}

// ==================== 事件接口定义 ====================

/**
 * 通用事件数据接口
 */
export interface IEventData {
  [key: string]: any
}

/**
 * 金币变化事件数据
 */
export interface IGoldChangeEvent extends IEventData {
  gold: number          // 变化后的金币数量
  change: number        // 变化量 (正数=获得，负数=消耗)
  reason?: string       // 变化原因
}

/**
 * 战斗伤害事件数据
 */
export interface IBattleDamageEvent extends IEventData {
  attacker: any         // 攻击者
  target: any           // 目标
  damage: number        // 伤害值
  isCrit?: boolean      // 是否暴击
  isDodge?: boolean     // 是否闪避
}

/**
 * 商店刷新事件数据
 */
export interface IShopRefreshEvent extends IEventData {
  slots: any[]          // 刷新后的商店格子
  cost: number          // 刷新费用
}

/**
 * 棋子购买事件数据
 */
export interface IShopBuyEvent extends IEventData {
  slotIndex: number     // 格子索引
  chessId: string       // 棋子 ID
  cost: number          // 购买费用
}

/**
 * 加载事件数据
 */
export interface ILoadingEvent extends IEventData {
  message?: string      // 加载提示文字
  progress?: number     // 加载进度 (0-1)
  nextScene?: string    // 下一个场景
}

// ==================== 事件助手 ====================

/**
 * 获取事件分类
 */
export function getEventCategory(eventName: string): string {
  return EVENT_CATEGORY[eventName] || 'Unknown'
}

/**
 * 检查事件是否有效
 */
export function isValidEvent(eventName: string): boolean {
  return !!EVENT_CATEGORY[eventName]
}

/**
 * 获取所有事件名称
 */
export function getAllEventNames(): string[] {
  return Object.keys(EVENT_CATEGORY)
}

/**
 * 按分类获取事件
 */
export function getEventsByCategory(category: string): string[] {
  return Object.entries(EVENT_CATEGORY)
    .filter(([_, cat]) => cat === category)
    .map(([name, _]) => name)
}

// 默认导出所有事件常量
export default {
  // 游戏流程
  GAME_START,
  GAME_END,
  GAME_PAUSE,
  GAME_RESUME,
  
  // 场景
  SCENE_LOAD_START,
  SCENE_LOAD_END,
  SCENE_MAIN_MENU,
  SCENE_LOBBY,
  SCENE_BATTLE,
  
  // 回合
  ROUND_START,
  ROUND_END,
  PHASE_PREPARE_START,
  PHASE_PREPARE_END,
  PHASE_BATTLE_START,
  PHASE_BATTLE_END,
  
  // 战斗
  BATTLE_START,
  BATTLE_END,
  BATTLE_ATTACK,
  BATTLE_DAMAGE,
  BATTLE_CHESS_DIED,
  BATTLE_SKILL,
  
  // 棋子
  CHESS_SELECT,
  CHESS_MOVE,
  CHESS_PLACE,
  CHESS_SELL,
  CHESS_MERGE,
  CHESS_STAR_UP,
  CHESS_CLASS_CHANGE,
  
  // 商店
  SHOP_REFRESH,
  SHOP_REFRESH_REQUEST,
  SHOP_BUY_CHESS,
  SHOP_LOCK,
  SHOP_UNLOCK,
  SHOP_LEVEL_UP,
  
  // 经济
  GOLD_CHANGE,
  GOLD_GAIN,
  GOLD_SPEND,
  GOLD_INTEREST,
  
  // 羁绊
  SYNERGY_ACTIVATE,
  SYNERGY_UPDATE,
  
  // UI
  UI_OPEN_PANEL,
  UI_CLOSE_PANEL,
  UI_SHOW_TOAST,
  UI_THEME_CHANGE,
  
  // 加载
  SHOW_LOADING,
  HIDE_LOADING,
  LOAD_PROGRESS,
  
  // 玩家
  PLAYER_EXP_CHANGE,
  PLAYER_LEVEL_UP,
  PLAYER_HP_CHANGE,
  
  // 音效
  AUDIO_PLAY_BGM,
  AUDIO_PLAY_SFX,
  AUDIO_SET_MUTED,
  
  // 存档
  SAVE_GAME,
  LOAD_GAME,
  
  // 系统
  SYSTEM_MATCH_START,
  SYSTEM_SHOW_SETTINGS
}

/**
 * 使用示例:
 * 
 * 1. 导入单个事件:
 *    import { GOLD_CHANGE, SHOP_BUY_CHESS } from './EventDefs'
 *    EventSystem.emit(GOLD_CHANGE, { gold: 50 })
 * 
 * 2. 导入全部事件:
 *    import Events from './EventDefs'
 *    EventSystem.emit(Events.GOLD_CHANGE, { gold: 50 })
 * 
 * 3. 使用接口定义事件数据:
 *    import { IGoldChangeEvent } from './EventDefs'
 *    const data: IGoldChangeEvent = { gold: 50, change: +5, reason: '利息' }
 *    EventSystem.emit(GOLD_CHANGE, data)
 * 
 * 4. 检查事件有效性:
 *    import { isValidEvent } from './EventDefs'
 *    if (isValidEvent(eventName)) {
 *      EventSystem.emit(eventName, data)
 *    }
 */
