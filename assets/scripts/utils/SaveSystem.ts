/**
 * 封狼居胥 - 存档系统
 * 
 * 本地数据存储：
 * - 玩家数据 (等级/金币/战绩)
 * - 棋子收藏
 * - 设置选项
 * - 游戏进度
 */

import { _decorator } from 'cc'

const { ccclass } = _decorator

// ==================== 接口定义 ====================

/** 玩家数据 */
export interface IPlayerData {
  playerId: string                // 玩家 ID
  playerLevel: number             // 玩家等级
  playerName: string              // 玩家名称
  gold: number                    // 金币
  diamond: number                 // 钻石
  totalWins: number               // 总胜场
  totalMatches: number            // 总场次
  maxWinStreak: number            // 最大连胜
  favoriteChess: string[]         // 喜欢棋子 ID 列表
  unlockThemes: string[]          // 已解锁主题
  currentTheme: string            // 当前主题
  createTime: number              // 创建时间
  lastLoginTime: number           // 最后登录时间
}

/** 棋子收藏数据 */
export interface IChessCollection {
  [chessId: string]: {
    owned: number                 // 拥有数量
    star: number                  // 最高星级
    classChanged: boolean         // 是否已转职
    favorite: boolean             // 是否收藏
  }
}

/** 游戏设置 */
export interface IGameSettings {
  bgmVolume: number               // BGM 音量 (0-1)
  sfxVolume: number               // 音效音量 (0-1)
  musicEnabled: boolean           // 是否开启音乐
  soundEnabled: boolean           // 是否开启音效
  lowGraphics: boolean            // 低画质模式
  showTips: boolean               // 显示提示
  autoBattle: boolean             // 自动战斗
}

/** 存档数据结构 */
export interface ISaveData {
  version: string                 // 存档版本
  player: IPlayerData             // 玩家数据
  chessCollection: IChessCollection // 棋子收藏
  settings: IGameSettings         // 游戏设置
  battleHistory: IBattleRecord[]  // 战斗历史
  lastSaveTime: number            // 最后保存时间
}

/** 战斗记录 */
export interface IBattleRecord {
  battleId: string                // 战斗 ID
  timestamp: number               // 时间戳
  result: 'win' | 'lose'          // 结果
  ranking: number                 // 排名
  damageDealt: number             // 造成伤害
  damageTaken: number             // 承受伤害
  duration: number                // 持续时间 (秒)
}

// ==================== 存档管理类 ====================

@ccclass('SaveSystem')
export class SaveSystem {
  // ==================== 单例模式 ====================
  
  private static instance: SaveSystem | null = null
  
  public static getInstance(): SaveSystem {
    if (!this.instance) {
      this.instance = new SaveSystem()
    }
    return this.instance
  }
  
  // ==================== 常量定义 ====================
  
  /** 存档键名 */
  private static readonly SAVE_KEY = 'fenglangjxu_save_data'
  
  /** 存档版本 */
  private static readonly SAVE_VERSION = '1.0.0'
  
  // ==================== 属性定义 ====================
  
  /** 当前存档数据 */
  private saveData: ISaveData | null = null
  
  /** 自动保存开关 */
  public autoSaveEnabled: boolean = true
  
  /** 自动保存间隔 (毫秒) */
  public autoSaveInterval: number = 60000
  
  /** 上次保存时间 */
  private lastSaveTime: number = 0
  
  // ==================== 初始化 ====================
  
  /**
   * 初始化存档系统
   */
  public initialize(): void {
    console.log('[SaveSystem] 初始化...')
    
    // 加载存档
    this.load()
    
    // 如果没有存档，创建新存档
    if (!this.saveData) {
      this.createNewSave()
    }
    
    console.log('[SaveSystem] 初始化完成')
  }
  
  /**
   * 创建新存档
   */
  private createNewSave(): void {
    console.log('[SaveSystem] 创建新存档')
    
    const now = Date.now()
    
    this.saveData = {
      version: SaveSystem.SAVE_VERSION,
      player: {
        playerId: this.generatePlayerId(),
        playerLevel: 1,
        playerName: '玩家_' + Math.floor(Math.random() * 10000),
        gold: 100,
        diamond: 0,
        totalWins: 0,
        totalMatches: 0,
        maxWinStreak: 0,
        favoriteChess: [],
        unlockThemes: ['han_default'],
        currentTheme: 'han_default',
        createTime: now,
        lastLoginTime: now
      },
      chessCollection: {},
      settings: {
        bgmVolume: 0.7,
        sfxVolume: 0.7,
        musicEnabled: true,
        soundEnabled: true,
        lowGraphics: false,
        showTips: true,
        autoBattle: false
      },
      battleHistory: [],
      lastSaveTime: now
    }
    
    // 保存新存档
    this.save()
  }
  
  // ==================== 存档操作 ====================
  
  /**
   * 加载存档
   * 
   * @returns 是否成功
   */
  public load(): boolean {
    try {
      const saveStr = wx.getStorageSync(SaveSystem.SAVE_KEY)
      
      if (!saveStr) {
        console.log('[SaveSystem] 未找到存档')
        this.saveData = null
        return false
      }
      
      this.saveData = JSON.parse(saveStr) as ISaveData
      
      // 版本检查
      if (this.saveData.version !== SaveSystem.SAVE_VERSION) {
        console.warn('[SaveSystem] 存档版本不匹配，可能需要迁移')
        // TODO: 实现存档迁移逻辑
      }
      
      console.log('[SaveSystem] 存档加载成功')
      console.log(`  - 玩家：${this.saveData.player.playerName}`)
      console.log(`  - 等级：${this.saveData.player.playerLevel}`)
      console.log(`  - 金币：${this.saveData.player.gold}`)
      
      return true
    } catch (error) {
      console.error('[SaveSystem] 加载存档失败', error)
      this.saveData = null
      return false
    }
  }
  
  /**
   * 保存存档
   * 
   * @returns 是否成功
   */
  public save(): boolean {
    if (!this.saveData) {
      console.error('[SaveSystem] 没有存档数据')
      return false
    }
    
    try {
      this.saveData.lastSaveTime = Date.now()
      
      const saveStr = JSON.stringify(this.saveData)
      wx.setStorageSync(SaveSystem.SAVE_KEY, saveStr)
      
      this.lastSaveTime = Date.now()
      console.log('[SaveSystem] 存档已保存')
      
      return true
    } catch (error) {
      console.error('[SaveSystem] 保存存档失败', error)
      return false
    }
  }
  
  /**
   * 删除存档
   * 
   * @returns 是否成功
   */
  public delete(): boolean {
    try {
      wx.removeStorageSync(SaveSystem.SAVE_KEY)
      this.saveData = null
      console.log('[SaveSystem] 存档已删除')
      return true
    } catch (error) {
      console.error('[SaveSystem] 删除存档失败', error)
      return false
    }
  }
  
  // ==================== 玩家数据操作 ====================
  
  /**
   * 获取玩家数据
   */
  public getPlayerData(): IPlayerData | null {
    return this.saveData?.player || null
  }
  
  /**
   * 更新玩家数据
   * 
   * @param updates 更新字段
   */
  public updatePlayerData(updates: Partial<IPlayerData>): void {
    if (!this.saveData) return
    
    Object.assign(this.saveData.player, updates)
    
    // 自动保存
    this.tryAutoSave()
  }
  
  /**
   * 添加金币
   * 
   * @param amount 数量
   */
  public addGold(amount: number): void {
    if (!this.saveData) return
    this.saveData.player.gold += amount
    this.tryAutoSave()
  }
  
  /**
   * 消费金币
   * 
   * @param amount 数量
   * @returns 是否成功
   */
  public spendGold(amount: number): boolean {
    if (!this.saveData) return false
    if (this.saveData.player.gold < amount) return false
    
    this.saveData.player.gold -= amount
    this.tryAutoSave()
    return true
  }
  
  /**
   * 记录战绩
   * 
   * @param isWin 是否胜利
   * @param ranking 排名
   */
  public recordBattle(isWin: boolean, ranking: number): void {
    if (!this.saveData) return
    
    this.saveData.player.totalMatches += 1
    
    if (isWin) {
      this.saveData.player.totalWins += 1
    }
    
    // 更新最大连胜
    // TODO: 实现连胜计算
    
    console.log('[SaveSystem] 战绩已记录')
    this.tryAutoSave()
  }
  
  // ==================== 棋子收藏操作 ====================
  
  /**
   * 获取棋子收藏
   */
  public getChessCollection(): IChessCollection | null {
    return this.saveData?.chessCollection || null
  }
  
  /**
   * 添加棋子
   * 
   * @param chessId 棋子 ID
   * @param star 星级
   */
  public addChess(chessId: string, star: number = 1): void {
    if (!this.saveData) return
    
    const collection = this.saveData.chessCollection
    
    if (!collection[chessId]) {
      collection[chessId] = {
        owned: 0,
        star: 1,
        classChanged: false,
        favorite: false
      }
    }
    
    collection[chessId].owned += 1
    collection[chessId].star = Math.max(collection[chessId].star, star)
    
    console.log(`[SaveSystem] 添加棋子：${chessId} (${star}星)`)
    this.tryAutoSave()
  }
  
  /**
   * 移除棋子
   * 
   * @param chessId 棋子 ID
   */
  public removeChess(chessId: string): void {
    if (!this.saveData) return
    
    const collection = this.saveData.chessCollection
    
    if (collection[chessId]) {
      collection[chessId].owned = Math.max(0, collection[chessId].owned - 1)
    }
    
    console.log(`[SaveSystem] 移除棋子：${chessId}`)
    this.tryAutoSave()
  }
  
  // ==================== 设置操作 ====================
  
  /**
   * 获取设置
   */
  public getSettings(): IGameSettings {
    return this.saveData?.settings || this.getDefaultSettings()
  }
  
  /**
   * 更新设置
   * 
   * @param updates 更新字段
   */
  public updateSettings(updates: Partial<IGameSettings>): void {
    if (!this.saveData) return
    
    Object.assign(this.saveData.settings, updates)
    this.tryAutoSave()
  }
  
  /**
   * 获取默认设置
   */
  public getDefaultSettings(): IGameSettings {
    return {
      bgmVolume: 0.7,
      sfxVolume: 0.7,
      musicEnabled: true,
      soundEnabled: true,
      lowGraphics: false,
      showTips: true,
      autoBattle: false
    }
  }
  
  // ==================== 战斗记录操作 ====================
  
  /**
   * 添加战斗记录
   * 
   * @param record 战斗记录
   */
  public addBattleRecord(record: IBattleRecord): void {
    if (!this.saveData) return
    
    this.saveData.battleHistory.push(record)
    
    // 保留最近 100 场
    if (this.saveData.battleHistory.length > 100) {
      this.saveData.battleHistory.shift()
    }
    
    this.tryAutoSave()
  }
  
  /**
   * 获取战斗历史
   * 
   * @param limit 数量限制
   */
  public getBattleHistory(limit: number = 20): IBattleRecord[] {
    if (!this.saveData) return []
    
    return this.saveData.battleHistory.slice(-limit)
  }
  
  // ==================== 辅助方法 ====================
  
  /**
   * 生成玩家 ID
   */
  private generatePlayerId(): string {
    return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
  
  /**
   * 尝试自动保存
   */
  private tryAutoSave(): void {
    if (!this.autoSaveEnabled) return
    
    const now = Date.now()
    if (now - this.lastSaveTime >= this.autoSaveInterval) {
      this.save()
    }
  }
  
  /**
   * 导出存档 (用于备份)
   */
  public exportSave(): string | null {
    if (!this.saveData) return null
    return JSON.stringify(this.saveData)
  }
  
  /**
   * 导入存档 (从备份恢复)
   * 
   * @param saveStr 存档 JSON 字符串
   * @returns 是否成功
   */
  public importSave(saveStr: string): boolean {
    try {
      this.saveData = JSON.parse(saveStr) as ISaveData
      this.save()
      console.log('[SaveSystem] 存档导入成功')
      return true
    } catch (error) {
      console.error('[SaveSystem] 存档导入失败', error)
      return false
    }
  }
  
  // ==================== 清理 ====================
  
  /**
   * 清理存档系统
   */
  public cleanup(): void {
    // 最后保存一次
    if (this.autoSaveEnabled) {
      this.save()
    }
    
    this.saveData = null
    
    console.log('[SaveSystem] 已清理')
  }
}

// ==================== 便捷函数 ====================

/**
 * 全局存档系统实例
 */
export const save = SaveSystem.getInstance()

/**
 * 便捷函数
 */
export const getPlayerData = () => save.getPlayerData()
export const addGold = (amount: number) => save.addGold(amount)
export const updateSettings = (updates: any) => save.updateSettings(updates)

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * import { save, addGold, updateSettings } from './SaveSystem'
 * 
 * // 初始化
 * save.initialize()
 * 
 * // 获取玩家数据
 * const player = save.getPlayerData()
 * console.log(`玩家：${player?.playerName}, 金币：${player?.gold}`)
 * 
 * // 添加金币
 * addGold(100)
 * 
 * // 消费金币
 * if (save.spendGold(50)) {
 *   console.log('购买成功')
 * }
 * 
 * // 更新设置
 * updateSettings({ bgmVolume: 0.5 })
 * 
 * // 添加棋子
 * save.addChess('huoqubing', 3)
 * 
 * // 记录战绩
 * save.recordBattle(true, 1)
 * 
 * // 导出存档
 * const backup = save.exportSave()
 * console.log('存档备份:', backup)
 * 
 * // 强制保存
 * save.save()
 * ```
 */
