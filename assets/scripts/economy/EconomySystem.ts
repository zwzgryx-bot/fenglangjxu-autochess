/**
 * 封狼居胥 - 经济系统
 * 
 * 管理游戏内经济：
 * - 金币获取 (基础收入/利息/连胜连败)
 * - 金币消费 (刷新商店/升级人口/购买棋子)
 * - 利息计算
 */

import { EconomyConfig } from './ChessData'

// ==================== 枚举和接口定义 ====================

/** 金币来源类型 */
export enum GoldSource {
  BASE_INCOME = 'base_income',           // 基础收入
  INTEREST = 'interest',                 // 利息
  WIN_STREAK = 'win_streak',             // 连胜奖励
  LOSE_STREAK = 'lose_streak',           // 连败奖励
  CHESS_SELL = 'chess_sell',             // 售卖棋子
  ROUND_BONUS = 'round_bonus',           // 回合奖励
  CHEST = 'chest'                        // 宝箱/野怪
}

/** 金币消费类型 */
export enum GoldSpendType {
  REFRESH_SHOP = 'refresh_shop',         // 刷新商店
  LEVEL_UP = 'level_up',                 // 升级人口
  BUY_CHESS = 'buy_chess',               // 购买棋子
  REROLL = 'reroll'                      // 重新刷新
}

/** 金币记录 */
export interface IGoldRecord {
  amount: number              // 金额
  type: GoldSource | GoldSpendType  // 类型
  timestamp: number           // 时间戳
  description?: string        // 描述
}

/** 经济系统数据结构 */
export interface IEconomyData {
  gold: number                // 当前金币
  totalIncome: number         // 总收入 (累计)
  totalSpend: number          // 总支出 (累计)
  winStreak: number           // 当前连胜
  loseStreak: number          // 当前连败
  lastRoundResult?: 'win' | 'lose' | 'draw'  // 上回合结果
  records: IGoldRecord[]      // 金币记录
}

// ==================== 经济系统类 ====================

export class EconomySystem {
  private data: IEconomyData
  
  /** 金币变化事件回调 */
  public onGoldChange?: (gold: number, change: number, type: string) => void
  
  constructor() {
    this.data = {
      gold: 0,
      totalIncome: 0,
      totalSpend: 0,
      winStreak: 0,
      loseStreak: 0,
      records: []
    }
  }
  
  /**
   * 初始化经济系统
   * 
   * @param startGold 初始金币
   */
  public initialize(startGold: number = 0): void {
    this.data.gold = startGold
    this.data.totalIncome = 0
    this.data.totalSpend: 0
    this.data.winStreak = 0
    this.data.loseStreak = 0
    this.data.records = []
  }
  
  /**
   * 增加金币
   * 
   * @param amount 金额
   * @param source 来源
   * @param description 描述
   */
  public addGold(amount: number, source: GoldSource, description?: string): void {
    if (amount <= 0) return
    
    this.data.gold += amount
    this.data.totalIncome += amount
    this.addRecord(amount, source, description)
    
    this.notifyGoldChange(amount, source)
  }
  
  /**
   * 消费金币
   * 
   * @param amount 金额
   * @param type 消费类型
   * @param description 描述
   * @returns 是否成功
   */
  public spendGold(amount: number, type: GoldSpendType, description?: string): boolean {
    if (amount <= 0) return true
    if (this.data.gold < amount) return false
    
    this.data.gold -= amount
    this.data.totalSpend += amount
    this.addRecord(-amount, type, description)
    
    this.notifyGoldChange(-amount, type)
    return true
  }
  
  /**
   * 计算回合收入
   * 
   * @param playerLevel 玩家等级
   * @param roundNumber 回合数
   * @returns 收入明细
   */
  public calculateRoundIncome(playerLevel: number, roundNumber: number): {
    base: number
    interest: number
    streak: number
    total: number
  } {
    // 基础收入
    const baseIncome = EconomyConfig.baseGold
    
    // 利息计算
    const interest = this.calculateInterest()
    
    // 连胜/连败奖励
    const streakBonus = this.calculateStreakBonus()
    
    const total = baseIncome + interest + streakBonus
    
    return {
      base: baseIncome,
      interest,
      streak: streakBonus,
      total
    }
  }
  
  /**
   * 结算回合结果
   * 
   * @param isWin 是否胜利
   * @param playerLevel 玩家等级
   * @param roundNumber 回合数
   */
  public endRound(isWin: boolean, playerLevel: number, roundNumber: number): void {
    // 更新连胜/连败
    if (isWin) {
      this.data.winStreak += 1
      this.data.loseStreak = 0
    } else {
      this.data.loseStreak += 1
      this.data.winStreak = 0
    }
    
    // 发放收入
    const income = this.calculateRoundIncome(playerLevel, roundNumber)
    
    if (income.base > 0) {
      this.addGold(income.base, GoldSource.BASE_INCOME, `回合 ${roundNumber} 基础收入`)
    }
    if (income.interest > 0) {
      this.addGold(income.interest, GoldSource.INTEREST, `利息 (${this.data.gold} 金币)`)
    }
    if (income.streak > 0) {
      const source = isWin ? GoldSource.WIN_STREAK : GoldSource.LOSE_STREAK
      const streakCount = isWin ? this.data.winStreak : this.data.loseStreak
      this.addGold(income.streak, source, `${isWin ? '连胜' : '连败'} ${streakCount} 场`)
    }
  }
  
  /**
   * 计算利息
   * 
   * 规则：每 10 金币 +1 利息，上限 5
   * 
   * @returns 利息金额
   */
  public calculateInterest(): number {
    const cappedGold = Math.min(this.data.gold, EconomyConfig.interestCap)
    const interest = Math.floor(cappedGold * EconomyConfig.interestRate)
    return Math.min(interest, 5) // 利息上限 5
  }
  
  /**
   * 计算连胜/连败奖励
   * 
   * @returns 奖励金额
   */
  public calculateStreakBonus(): number {
    const streak = Math.max(this.data.winStreak, this.data.loseStreak)
    
    if (streak < 3) return 0
    
    const bonusArray = this.data.winStreak >= 3 ? EconomyConfig.winStreakBonus : EconomyConfig.loseStreakBonus
    
    if (streak >= 5) {
      return bonusArray[5] || 3
    }
    return bonusArray[streak] || 0
  }
  
  /**
   * 升级人口
   * 
   * @param currentLevel 当前等级
   * @returns 是否成功
   */
  public levelUp(currentLevel: number): boolean {
    if (currentLevel >= 8) return false // 最高 8 级
    
    const cost = EconomyConfig.levelUpCost[currentLevel]
    if (!cost || cost <= 0) return false
    
    const success = this.spendGold(cost, GoldSpendType.LEVEL_UP, `升级到 ${currentLevel + 1} 级`)
    return success
  }
  
  /**
   * 刷新商店
   * 
   * @returns 是否成功
   */
  public refreshShop(): boolean {
    const cost = EconomyConfig.refreshCost
    return this.spendGold(cost, GoldSpendType.REFRESH_SHOP, '刷新商店')
  }
  
  /**
   * 售卖棋子
   * 
   * @param chessCost 棋子费用
   * @param chessStar 棋子星级
   */
  public sellChess(chessCost: number, chessStar: number): void {
    // 售卖价格 = 费用 (1 星) / 费用×1.5 (2 星) / 费用×2.5 (3 星)
    const starMultiplier = chessStar === 1 ? 1 : chessStar === 2 ? 1.5 : 2.5
    const sellPrice = Math.floor(chessCost * starMultiplier)
    
    this.addGold(sellPrice, GoldSource.CHESS_SELL, `售卖${chessStar}星棋子`)
  }
  
  /**
   * 获取经济数据统计
   * 
   * @returns 统计数据
   */
  public getStats(): Readonly<IEconomyData> {
    return { ...this.data }
  }
  
  /**
   * 获取当前金币
   */
  public getGold(): number {
    return this.data.gold
  }
  
  /**
   * 获取连胜/连败次数
   */
  public getStreak(): { win: number; lose: number } {
    return {
      win: this.data.winStreak,
      lose: this.data.loseStreak
    }
  }
  
  /**
   * 重置连胜/连败 (新赛季/新游戏)
   */
  public resetStreak(): void {
    this.data.winStreak = 0
    this.data.loseStreak = 0
  }
  
  // ==================== 私有方法 ====================
  
  /**
   * 添加金币记录
   */
  private addRecord(amount: number, type: GoldSource | GoldSpendType, description?: string): void {
    this.data.records.push({
      amount,
      type,
      timestamp: Date.now(),
      description
    })
    
    // 保留最近 100 条记录
    if (this.data.records.length > 100) {
      this.data.records = this.data.records.slice(-100)
    }
  }
  
  /**
   * 通知金币变化
   */
  private notifyGoldChange(change: number, type: string): void {
    if (this.onGoldChange) {
      this.onGoldChange(this.data.gold, change, type)
    }
  }
}

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 创建经济系统
 * const economy = new EconomySystem()
 * economy.initialize(0)
 * 
 * // 设置金币变化回调
 * economy.onGoldChange = (gold, change, type) => {
 *   console.log(`金币变化：${change > 0 ? '+' : ''}${change}, 当前：${gold}, 类型：${type}`)
 * }
 * 
 * // 回合结束结算
 * economy.endRound(true, playerLevel, roundNumber)
 * 
 * // 刷新商店
 * if (economy.refreshShop()) {
 *   shop.refresh()
 * }
 * 
 * // 升级人口
 * if (economy.levelUp(currentLevel)) {
 *   player.levelUp()
 * }
 * 
 * // 售卖棋子
 * economy.sellChess(chess.cost, chess.star)
 * 
 * // 获取统计数据
 * const stats = economy.getStats()
 * console.log(`当前金币：${stats.gold}, 连胜：${stats.winStreak}`)
 * ```
 */
