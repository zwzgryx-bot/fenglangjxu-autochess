/**
 * 封狼居胥 - AI 对战系统
 * 
 * AI 决策系统：
 * - 招募决策 (购买/升级棋子)
 * - 布阵决策 (站位优化)
 * - 战斗决策 (目标选择/技能释放)
 * - 经济决策 (攒钱/花钱)
 */

import { Camp, Profession, Rarity, type IChessData, type IChessBaseStats, calculateDamage } from './ChessData'
import { SynergyCalculator, type IBondStats, type IActiveBond, type IBonusData } from './battle/SynergyCalculator'

// ==================== 接口定义 ====================

/** AI 决策类型 */
export enum AIDecisionType {
  BUY_CHESS = 'buy_chess',             // 购买棋子
  SELL_CHESS = 'sell_chess',           // 售卖棋子
  UPGRADE_CHESS = 'upgrade_chess',     // 升星棋子
  LEVEL_UP = 'level_up',               // 升级人口
  REFRESH_SHOP = 'refresh_shop',       // 刷新商店
  ARRANGE_FORMATION = 'arrange_formation', // 布阵
  TARGET_SELECTION = 'target_selection'    // 目标选择
}

/** AI 决策结果 */
export interface AIDecision {
  type: AIDecisionType                // 决策类型
  priority: number                     // 优先级 (1-10, 越高越优先)
  data?: {                             // 决策数据
    chessId?: string                   // 棋子 ID
    slotIndex?: number                 // 商店格子索引
    targetId?: string                  // 目标 ID
    position?: { x: number; y: number } // 位置
    reason?: string                    // 决策理由
  }
}

/** AI 玩家数据 */
export interface IAIPlayerData {
  gold: number                         // 当前金币
  level: number                        // 玩家等级
  chessList: IChessData[]              // 拥有的棋子
  activeBonds: IActiveBond[]           // 激活的羁绊
  shopSlots: Array<{ chessId: string; cost: number }> // 商店格子
}

/** 战场棋子数据 */
export interface IBattleChess {
  id: string
  chessData: IChessData
  position: { x: number; y: number }
  currentHp: number
  team: 'friendly' | 'enemy'
  target?: IBattleChess
}

// ==================== AI 系统类 ====================

export class BattleAI {
  private aiData: IAIPlayerData
  
  /** 决策难度 (1-5) */
  private difficulty: number
  
  constructor(difficulty: number = 3) {
    this.difficulty = Math.max(1, Math.min(5, difficulty))
    this.aiData = {
      gold: 0,
      level: 1,
      chessList: [],
      activeBonds: [],
      shopSlots: []
    }
  }
  
  /**
   * 更新 AI 数据
   */
  public updateAIData(data: Partial<IAIPlayerData>): void {
    this.aiData = { ...this.aiData, ...data }
  }
  
  /**
   * 做出招募阶段决策
   * 
   * @returns 决策列表
   */
  public makeRecruitDecisions(): AIDecision[] {
    const decisions: AIDecision[] = []
    
    // 1. 检查是否可以升星
    const upgradeDecisions = this.evaluateUpgrades()
    decisions.push(...upgradeDecisions)
    
    // 2. 检查商店棋子
    const buyDecisions = this.evaluateShopBuys()
    decisions.push(...buyDecisions)
    
    // 3. 检查是否可以升级人口
    if (this.shouldLevelUp()) {
      decisions.push({
        type: AIDecisionType.LEVEL_UP,
        priority: 6,
        data: { reason: '升级人口以解锁更高品质棋子' }
      })
    }
    
    // 4. 检查是否应该刷新商店
    if (this.shouldRefreshShop()) {
      decisions.push({
        type: AIDecisionType.REFRESH_SHOP,
        priority: 5,
        data: { reason: '寻找关键棋子' }
      })
    }
    
    // 5. 检查是否应该售卖棋子
    const sellDecisions = this.evaluateSells()
    decisions.push(...sellDecisions)
    
    // 按优先级排序
    return decisions.sort((a, b) => b.priority - a.priority)
  }
  
  /**
   * 做出布阵决策
   * 
   * @param boardWidth 棋盘宽度
   * @param boardHeight 棋盘高度
   * @returns 每个棋子的最佳位置
   */
  public makeFormationDecision(boardWidth: number, boardHeight: number): Array<{
    chessId: string
    position: { x: number; y: number }
  }> {
    const positions: Array<{ chessId: string; position: { x: number; y: number } }> = []
    
    // 按职业分类
    const tanks = this.aiData.chessList.filter(c => 
      c.profession === Profession.CHARIOT || 
      c.profession === Profession.WARRIOR
    )
    const ranged = this.aiData.chessList.filter(c => 
      c.profession === Profession.ARCHER || 
      c.profession === Profession.MAGE
    )
    const melee = this.aiData.chessList.filter(c => 
      !tanks.includes(c) && !ranged.includes(c)
    )
    
    // 坦克放前排
    const tankRow = boardHeight * 0.3
    tanks.forEach((chess, index) => {
      positions.push({
        chessId: chess.id,
        position: {
          x: (boardWidth / (tanks.length + 1)) * (index + 1),
          y: tankRow
        }
      })
    })
    
    // 远程放后排
    const rangedRow = boardHeight * 0.7
    ranged.forEach((chess, index) => {
      positions.push({
        chessId: chess.id,
        position: {
          x: (boardWidth / (ranged.length + 1)) * (index + 1),
          y: rangedRow
        }
      })
    })
    
    // 近战放中间
    const meleeRow = boardHeight * 0.5
    melee.forEach((chess, index) => {
      positions.push({
        chessId: chess.id,
        position: {
          x: (boardWidth / (melee.length + 1)) * (index + 1),
          y: meleeRow
        }
      })
    })
    
    return positions
  }
  
  /**
   * 做出战斗决策 (目标选择)
   * 
   * @param chess 己方棋子
   * @param enemies 敌方棋子列表
   * @returns 最佳目标
   */
  public selectTarget(chess: IChessData, enemies: IBattleChess[]): IBattleChess | null {
    if (enemies.length === 0) return null
    
    // 根据职业选择目标策略
    if (chess.profession === Profession.ARCHER || chess.profession === Profession.MAGE) {
      // 远程优先攻击最近目标
      return this.selectNearestTarget(chess, enemies)
    } else if (chess.rarity >= Rarity.EPIC) {
      // 高费棋子优先攻击低血量目标
      return this.selectLowestHpTarget(enemies)
    } else {
      // 其他情况随机攻击
      return enemies[Math.floor(Math.random() * enemies.length)]
    }
  }
  
  /**
   * 决定是否释放技能
   * 
   * @param chess 棋子
   * @param currentEnergy 当前能量
   * @param allies 友军
   * @param enemies 敌军
   * @returns 是否释放技能
   */
  public shouldCastSkill(
    chess: IChessData,
    currentEnergy: number,
    allies: IBattleChess[],
    enemies: IBattleChess[]
  ): boolean {
    // 能量足够
    if (currentEnergy < chess.skill.energyCost) {
      return false
    }
    
    // 根据技能类型判断
    switch (chess.skill.target) {
      case 'area':
        // 范围技能：当敌人聚集时释放
        return this.areEnemiesGrouped(enemies, chess.skill.effect.radius || 100)
      case 'ally':
        // 增益技能：当有友军血量低时释放
        return this.hasLowHpAlly(allies)
      case 'enemy':
        // 单体技能：总是可以释放
        return true
      default:
        return true
    }
  }
  
  /**
   * 评估是否应该购买商店棋子
   */
  private evaluateShopBuys(): AIDecision[] {
    const decisions: AIDecision[] = []
    
    for (let i = 0; i < this.aiData.shopSlots.length; i++) {
      const slot = this.aiData.shopSlots[i]
      if (!slot) continue
      
      const decision = this.evaluateChessBuy(slot.chessId, slot.cost, i)
      if (decision) {
        decisions.push(decision)
      }
    }
    
    return decisions
  }
  
  /**
   * 评估单个棋子的购买价值
   */
  private evaluateChessBuy(chessId: string, cost: number, slotIndex: number): AIDecision | null {
    const chess = this.getChessData(chessId)
    if (!chess) return null
    
    // 计算购买后的羁绊提升
    const currentStats = SynergyCalculator.countBonds(this.aiData.chessList)
    const newList = [...this.aiData.chessList, chess]
    const newStats = SynergyCalculator.countBonds(newList)
    const changes = SynergyCalculator.checkBondChanges(currentStats, newStats)
    
    let priority = 5 // 基础优先级
    
    // 有新羁绊激活，优先级提升
    if (changes.activated.length > 0) {
      priority += 3
    }
    
    // 已有相同棋子，可以升星
    const existingCount = this.aiData.chessList.filter(c => c.id === chessId).length
    if (existingCount >= 1) {
      priority += 2
    }
    if (existingCount >= 3) {
      priority += 3 // 可以升 2 星
    }
    
    // 核心棋子 (5 费) 优先级高
    if (chess.rarity >= Rarity.LEGENDARY) {
      priority += 2
    }
    
    // 根据经济情况调整
    if (this.aiData.gold < 20) {
      priority -= 2 // 经济差时不买
    }
    
    if (priority >= 5) {
      return {
        type: AIDecisionType.BUY_CHESS,
        priority: Math.min(priority, 10),
        data: {
          chessId,
          slotIndex,
          reason: `价值评分：${priority}`
        }
      }
    }
    
    return null
  }
  
  /**
   * 评估升星决策
   */
  private evaluateUpgrades(): AIDecision[] {
    const decisions: AIDecision[] = []
    
    // 统计每个棋子的数量
    const chessCount: Record<string, number> = {}
    for (const chess of this.aiData.chessList) {
      chessCount[chess.id] = (chessCount[chess.id] || 0) + 1
    }
    
    // 检查是否可以升星
    for (const [chessId, count] of Object.entries(chessCount)) {
      if (count >= 3) {
        decisions.push({
          type: AIDecisionType.UPGRADE_CHESS,
          priority: 8, // 高优先级
          data: {
            chessId,
            reason: `可以升星 (${count} 个)`
          }
        })
      }
    }
    
    return decisions
  }
  
  /**
   * 评估售卖决策
   */
  private evaluateSells(): AIDecision[] {
    const decisions: AIDecision[] = []
    
    // 找出不在场的棋子
    const benchChess = this.aiData.chessList.filter(c => {
      // 简化逻辑：假设所有棋子都在场
      return false
    })
    
    // 评估是否应该售卖
    for (const chess of benchChess) {
      if (chess.rarity <= Rarity.RARE && this.aiData.gold < 10) {
        decisions.push({
          type: AIDecisionType.SELL_CHESS,
          priority: 4,
          data: {
            chessId: chess.id,
            reason: '经济紧张时售卖低费棋子'
          }
        })
      }
    }
    
    return decisions
  }
  
  /**
   * 判断是否应该升级人口
   */
  private shouldLevelUp(): boolean {
    // 金币充足且当前等级较低时升级
    const levelUpCost = [0, 0, 0, 4, 8, 16, 24, 32, 40]
    const cost = levelUpCost[this.aiData.level] || 999
    
    if (cost === 0) return false // 已经满级
    
    // 金币足够且超过升级费用
    if (this.aiData.gold >= cost + 10) {
      return true
    }
    
    return false
  }
  
  /**
   * 判断是否应该刷新商店
   */
  private shouldRefreshShop(): boolean {
    // 经济充裕且想找关键棋子时刷新
    if (this.aiData.gold >= 30) {
      return true
    }
    
    // 连败时刷新找战力
    if (this.aiData.gold >= 15) {
      // 简化逻辑
      return false
    }
    
    return false
  }
  
  /**
   * 选择最近目标
   */
  private selectNearestTarget(chess: IChessData, enemies: IBattleChess[]): IBattleChess {
    // 简化实现：返回第一个敌人
    return enemies[0]
  }
  
  /**
   * 选择血量最低目标
   */
  private selectLowestHpTarget(enemies: IBattleChess[]): IBattleChess {
    return enemies.reduce((lowest, current) => 
      current.currentHp < lowest.currentHp ? current : lowest
    )
  }
  
  /**
   * 检查敌人是否聚集
   */
  private areEnemiesGrouped(enemies: IBattleChess[], radius: number): boolean {
    // 简化实现：总是返回 true
    return enemies.length >= 3
  }
  
  /**
   * 检查是否有低血量友军
   */
  private hasLowHpAlly(allies: IBattleChess[]): boolean {
    return allies.some(ally => ally.currentHp < ally.chessData.baseStats.hp * 0.5)
  }
  
  /**
   * 获取棋子数据 (占位符)
   */
  private getChessData(chessId: string): IChessData | null {
    // 实际项目中从数据库获取
    return null
  }
}

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 创建 AI 系统
 * const ai = new BattleAI(difficulty: 4)
 * 
 * // 更新 AI 数据
 * ai.updateAIData({
 *   gold: 50,
 *   level: 6,
 *   chessList: myChessList,
 *   activeBonds: activeBonds,
 *   shopSlots: shopSlots
 * })
 * 
 * // 获取招募决策
 * const decisions = ai.makeRecruitDecisions()
 * for (const decision of decisions) {
 *   if (decision.type === AIDecisionType.BUY_CHESS) {
 *     shop.buyChess(decision.data!.slotIndex!)
 *   }
 * }
 * 
 * // 获取布阵决策
 * const positions = ai.makeFormationDecision(1200, 800)
 * positions.forEach(({ chessId, position }) => {
 *   board.placeChess(chessId, position)
 * })
 * 
 * // 战斗中目标选择
 * const target = ai.selectTarget(myChess, enemies)
 * if (target) {
 *   myChess.attack(target)
 * }
 * 
 * // 判断是否释放技能
 * if (ai.shouldCastSkill(myChess, energy, allies, enemies)) {
 *   myChess.castSkill()
 * }
 * ```
 */
