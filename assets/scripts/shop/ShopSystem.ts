/**
 * 封狼居胥 - 商店系统
 * 
 * 管理棋子商店：
 * - 随机刷新棋子
 * - 概率控制 (按玩家等级)
 * - 棋子池管理 (共享卡池)
 * - 购买棋子
 */

import { Rarity, ShopProbability, ChessPoolConfig, type IChessData } from './ChessData'

// ==================== 接口定义 ====================

/** 商店格子 */
export interface IShopSlot {
  chessId: string             // 棋子 ID
  chessData: IChessData       // 棋子数据
  cost: number                // 价格
  locked?: boolean            // 是否锁定 (防止刷新消失)
  lockedCount?: number        // 锁定计数器
}

/** 商店数据 */
export interface IShopData {
  slots: IShopSlot[]          // 商店格子
  playerLevel: number         // 玩家等级
  refreshCount: number        // 本回合刷新次数
}

/** 棋子池数据 */
export interface IChessPool {
  [chessId: string]: {
    total: number             // 总数量
    remaining: number         // 剩余数量
    owned: number             // 已拥有数量
  }
}

// ==================== 商店系统类 ====================

export class ShopSystem {
  private shopData: IShopData
  private chessPool: IChessPool
  private allChessData: Record<string, IChessData>
  
  /** 商店刷新事件回调 */
  public onShopRefresh?: (slots: IShopSlot[]) => void
  
  /** 棋子购买事件回调 */
  public onChessBuy?: (chessId: string, slotIndex: number) => void
  
  /** 棋子池变化事件回调 */
  public onPoolChange?: (chessId: string, remaining: number) => void
  
  /**
   * 构造函数
   * 
   * @param allChessData 所有棋子数据
   */
  constructor(allChessData: Record<string, IChessData>) {
    this.allChessData = allChessData
    this.shopData = {
      slots: [],
      playerLevel: 1,
      refreshCount: 0
    }
    this.chessPool = {}
    
    this.initializeChessPool()
  }
  
  /**
   * 初始化棋子池
   */
  private initializeChessPool(): void {
    for (const [chessId, chessData] of Object.entries(this.allChessData)) {
      const total = ChessPoolConfig[chessData.rarity] || 10
      this.chessPool[chessId] = {
        total,
        remaining: total,
        owned: 0
      }
    }
  }
  
  /**
   * 设置玩家等级
   * 
   * @param level 玩家等级
   */
  public setPlayerLevel(level: number): void {
    this.shopData.playerLevel = Math.max(1, Math.min(8, level))
  }
  
  /**
   * 生成新商店
   * 
   * @param level 玩家等级
   * @returns 商店格子
   */
  public generateShop(level: number): IShopSlot[] {
    this.setPlayerLevel(level)
    this.shopData.refreshCount = 0
    
    const slots: IShopSlot[] = []
    const slotCount = 5 // 固定 5 个商店格子
    
    for (let i = 0; i < slotCount; i++) {
      const chessId = this.randomChess(level)
      if (chessId) {
        const chessData = this.allChessData[chessId]
        slots.push({
          chessId,
          chessData,
          cost: chessData.rarity,
          locked: false
        })
      }
    }
    
    this.shopData.slots = slots
    this.onShopRefresh?.(slots)
    
    return slots
  }
  
  /**
   * 刷新商店
   * 
   * @returns 新的商店格子
   */
  public refresh(): IShopSlot[] {
    const level = this.shopData.playerLevel
    this.shopData.refreshCount += 1
    
    const slots: IShopSlot[] = []
    const slotCount = 5
    
    for (let i = 0; i < slotCount; i++) {
      // 保留锁定的棋子
      const oldSlot = this.shopData.slots[i]
      if (oldSlot && oldSlot.locked && oldSlot.lockedCount > 0) {
        slots.push({
          ...oldSlot,
          lockedCount: (oldSlot.lockedCount || 1) - 1
        })
        continue
      }
      
      // 刷新新棋子
      const chessId = this.randomChess(level)
      if (chessId) {
        const chessData = this.allChessData[chessId]
        slots.push({
          chessId,
          chessData,
          cost: chessData.rarity,
          locked: false
        })
      }
    }
    
    this.shopData.slots = slots
    this.onShopRefresh?.(slots)
    
    return slots
  }
  
  /**
   * 随机生成一个棋子
   * 
   * @param level 玩家等级
   * @returns 棋子 ID
   */
  private randomChess(level: number): string | null {
    const probability = ShopProbability[level] || ShopProbability[1]
    
    // 按权重随机稀有度
    const rarityRoll = Math.random()
    let cumulative = 0
    let targetRarity = Rarity.COMMON
    
    for (let r = 1; r <= 5; r++) {
      cumulative += probability[r] || 0
      if (rarityRoll <= cumulative) {
        targetRarity = r as Rarity
        break
      }
    }
    
    // 从该稀有度的棋子中随机选择一个 (排除池子为空的)
    const availableChess = Object.entries(this.allChessData)
      .filter(([_, data]) => data.rarity === targetRarity)
      .filter(([chessId, _]) => this.chessPool[chessId].remaining > 0)
    
    if (availableChess.length === 0) {
      // 如果该稀有度没有可用棋子，降级查找
      for (let r = targetRarity - 1; r >= 1; r--) {
        const fallback = Object.entries(this.allChessData)
          .filter(([_, data]) => data.rarity === r)
          .filter(([chessId, _]) => this.chessPool[chessId].remaining > 0)
        
        if (fallback.length > 0) {
          const randomIndex = Math.floor(Math.random() * fallback.length)
          return fallback[randomIndex][0]
        }
      }
      return null
    }
    
    const randomIndex = Math.floor(Math.random() * availableChess.length)
    return availableChess[randomIndex][0]
  }
  
  /**
   * 购买棋子
   * 
   * @param slotIndex 商店格子索引
   * @returns 是否成功
   */
  public buyChess(slotIndex: number): IChessData | null {
    if (slotIndex < 0 || slotIndex >= this.shopData.slots.length) {
      return null
    }
    
    const slot = this.shopData.slots[slotIndex]
    if (!slot) {
      return null
    }
    
    // 从棋子池移除
    this.removeFromPool(slot.chessId)
    
    // 从商店移除
    this.shopData.slots.splice(slotIndex, 1)
    
    this.onChessBuy?.(slot.chessId, slotIndex)
    
    return slot.chessData
  }
  
  /**
   * 锁定/解锁商店格子
   * 
   * @param slotIndex 格子索引
   * @param locked 是否锁定
   * @param rounds 锁定回合数 (可选)
   */
  public lockSlot(slotIndex: number, locked: boolean, rounds: number = 1): void {
    if (slotIndex < 0 || slotIndex >= this.shopData.slots.length) {
      return
    }
    
    const slot = this.shopData.slots[slotIndex]
    if (slot) {
      slot.locked = locked
      slot.lockedCount = locked ? rounds : 0
    }
  }
  
  /**
   * 获取棋子池信息
   * 
   * @param chessId 棋子 ID
   * @returns 棋子池数据
   */
  public getChessPool(chessId: string): { total: number; remaining: number; owned: number } | null {
    return this.chessPool[chessId] || null
  }
  
  /**
   * 获取所有棋子的池子信息
   */
  public getAllPoolData(): Readonly<IChessPool> {
    return { ...this.chessPool }
  }
  
  /**
   * 获取当前商店数据
   */
  public getShopData(): Readonly<IShopData> {
    return { ...this.shopData }
  }
  
  /**
   * 重置回合 (刷新计数清零)
   */
  public resetRound(): void {
    this.shopData.refreshCount = 0
  }
  
  // ==================== 棋子池管理 ====================
  
  /**
   * 从棋子池移除 (购买)
   * 
   * @param chessId 棋子 ID
   */
  private removeFromPool(chessId: string): void {
    const pool = this.chessPool[chessId]
    if (pool && pool.remaining > 0) {
      pool.remaining -= 1
      pool.owned += 1
      this.onPoolChange?.(chessId, pool.remaining)
    }
  }
  
  /**
   * 返还棋子到池子 (售卖/淘汰)
   * 
   * @param chessId 棋子 ID
   */
  public returnToPool(chessId: string): void {
    const pool = this.chessPool[chessId]
    if (pool && pool.owned > 0) {
      pool.remaining += 1
      pool.owned -= 1
      this.onPoolChange?.(chessId, pool.remaining)
    }
  }
  
  /**
   * 获取棋子的剩余数量
   * 
   * @param chessId 棋子 ID
   * @returns 剩余数量
   */
  public getRemainingCount(chessId: string): number {
    return this.chessPool[chessId]?.remaining || 0
  }
  
  /**
   * 检查棋子是否已售罄
   * 
   * @param chessId 棋子 ID
   * @returns 是否售罄
   */
  public isSoldOut(chessId: string): boolean {
    return this.getRemainingCount(chessId) === 0
  }
}

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 创建商店系统
 * const shop = new ShopSystem(allChessData)
 * 
 * // 设置回调
 * shop.onShopRefresh = (slots) => {
 *   console.log('商店刷新:', slots.map(s => s.chessData.name))
 * }
 * 
 * shop.onChessBuy = (chessId, index) => {
 *   console.log(`购买了棋子：${chessId}`)
 * }
 * 
 * // 生成初始商店
 * shop.generateShop(playerLevel)
 * 
 * // 刷新商店
 * if (economy.spendGold(2, GoldSpendType.REFRESH_SHOP)) {
 *   shop.refresh()
 * }
 * 
 * // 购买棋子
 * const chess = shop.buyChess(slotIndex)
 * if (chess) {
 *   player.addChess(chess)
 * }
 * 
 * // 锁定棋子
 * shop.lockSlot(0, true, 2) // 锁定 2 回合
 * 
 * // 查看棋子池
 * const pool = shop.getChessPool('huoqubing')
 * console.log(`霍去病剩余：${pool?.remaining}/${pool?.total}`)
 * ```
 */
