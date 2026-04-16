/**
 * 封狼居胥 - 游戏管理器
 * 
 * 核心状态机：
 * - 游戏流程控制 (准备/战斗/结束)
 * - 回合管理
 * - 玩家管理
 * - 游戏结束判定
 */

import { Chess } from './chess/Chess'
import { EconomySystem, GoldSource } from './economy/EconomySystem'
import { ShopSystem } from './shop/ShopSystem'
import { SynergyCalculator } from './battle/SynergyCalculator'
import type { IChessData } from './ChessData'

// ==================== 枚举和接口定义 ====================

/** 游戏状态 */
export enum GameState {
  LOBBY = 'lobby',          // 大厅
  MATCHING = 'matching',    // 匹配中
  PREPARING = 'preparing',  // 准备阶段
  COMBAT = 'combat',        // 战斗阶段
  ROUND_END = 'round_end',  // 回合结束
  GAME_END = 'game_end'     // 游戏结束
}

/** 游戏阶段 */
export enum GamePhase {
  RECRUIT = 'recruit',      // 招募阶段
  ARRANGE = 'arrange',      // 布阵阶段
  BATTLE = 'battle',        // 战斗阶段
  REWARD = 'reward'         // 奖励阶段
}

/** 玩家数据 */
export interface IPlayerData {
  id: string                      // 玩家 ID
  level: number                   // 玩家等级
  gold: number                    // 金币
  hp: number                      // 生命值
  maxHp: number                   // 最大生命值
  chessList: Chess[]              // 拥有的棋子
  benchChess: Chess[]             // 备用棋子
  winStreak: number               // 连胜
  loseStreak: number              // 连败
  isAI: boolean                   // 是否 AI
}

/** 回合数据 */
export interface IRoundData {
  roundNumber: number             // 回合数
  phase: GamePhase                // 当前阶段
  preparingTime: number           // 准备时间
  combatTime: number              // 战斗时间
  isPvE: boolean                  // 是否 PVE (野怪回合)
}

/** 游戏配置 */
export interface IGameConfig {
  playerCount: number             // 玩家数量 (默认 8)
  initialHp: number               // 初始生命值 (默认 100)
  preparingTime: number           // 准备时间 (秒)
  combatTime: number              // 战斗时间 (秒)
  totalRounds: number             // 总回合数 (默认 20)
}

// ==================== 游戏管理器类 ====================

export class GameManager {
  // ==================== 单例模式 ====================
  
  private static instance: GameManager | null = null
  
  public static getInstance(): GameManager {
    if (!this.instance) {
      this.instance = new GameManager()
    }
    return this.instance
  }
  
  // ==================== 游戏状态 ====================
  
  public state: GameState = GameState.LOBBY
  public phase: GamePhase = GamePhase.RECRUIT
  
  // 游戏配置
  private config: IGameConfig = {
    playerCount: 8,
    initialHp: 100,
    preparingTime: 30,
    combatTime: 60,
    totalRounds: 20
  }
  
  // 当前回合
  private roundData: IRoundData = {
    roundNumber: 0,
    phase: GamePhase.RECRUIT,
    preparingTime: 0,
    combatTime: 0,
    isPvE: false
  }
  
  // 玩家列表
  private players: IPlayerData[] = []
  public localPlayerId: string = ''
  
  // 系统实例
  private shopSystem: ShopSystem | null = null
  private economySystem: EconomySystem | null = null
  
  // 计时器
  private roundTimer: number = 0
  private frameTimer: number = 0
  
  // 事件回调
  public onGameStart?: () => void
  public onRoundStart?: (round: number) => void
  public onPhaseChange?: (phase: GamePhase) => void
  public onRoundEnd?: (round: number, result: 'win' | 'lose') => void
  public onGameEnd?: (ranking: number) => void
  
  // ==================== 生命周期 ====================
  
  /**
   * 初始化游戏
   * 
   * @param config 游戏配置
   */
  public initialize(config: Partial<IGameConfig> = {}): void {
    this.config = { ...this.config, ...config }
    this.state = GameState.LOBBY
    this.roundData.roundNumber = 0
    this.players = []
  }
  
  /**
   * 开始游戏
   * 
   * @param playerCount 玩家数量
   */
  public startGame(playerCount: number = 8): void {
    this.config.playerCount = playerCount
    this.state = GameState.MATCHING
    
    // 模拟匹配 (实际项目中需要联网)
    setTimeout(() => {
      this.createPlayers()
      this.startRound(1)
      this.onGameStart?.()
    }, 1000)
  }
  
  /**
   * 创建玩家
   */
  private createPlayers(): void {
    this.players = []
    
    // 创建本地玩家
    const localPlayer: IPlayerData = {
      id: 'player_local',
      level: 1,
      gold: 0,
      hp: this.config.initialHp,
      maxHp: this.config.initialHp,
      chessList: [],
      benchChess: [],
      winStreak: 0,
      loseStreak: 0,
      isAI: false
    }
    this.players.push(localPlayer)
    this.localPlayerId = localPlayer.id
    
    // 初始化经济系统
    this.economySystem = new EconomySystem()
    this.economySystem.initialize(0)
    
    // 初始化商店系统 (需要传入棋子数据库)
    // this.shopSystem = new ShopSystem(allChessData)
    
    // 创建 AI 玩家
    for (let i = 1; i < this.config.playerCount; i++) {
      this.players.push({
        id: `player_ai_${i}`,
        level: 1,
        gold: 0,
        hp: this.config.initialHp,
        maxHp: this.config.initialHp,
        chessList: [],
        benchChess: [],
        winStreak: 0,
        loseStreak: 0,
        isAI: true
      })
    }
  }
  
  /**
   * 开始回合
   * 
   * @param roundNumber 回合数
   */
  public startRound(roundNumber: number): void {
    this.roundData.roundNumber = roundNumber
    this.roundData.isPvE = (roundNumber % 5 === 0) // 每 5 回合是野怪回合
    
    // 检查游戏结束
    if (this.checkGameEnd()) {
      return
    }
    
    // 发放回合收入
    this.distributeRoundIncome()
    
    // 进入准备阶段
    this.enterPreparingPhase()
    this.onRoundStart?.(roundNumber)
  }
  
  /**
   * 进入准备阶段
   */
  private enterPreparingPhase(): void {
    this.state = GameState.PREPARING
    this.phase = GamePhase.RECRUIT
    this.roundData.preparingTime = this.config.preparingTime
    this.roundData.phase = GamePhase.RECRUIT
    
    this.onPhaseChange?.(GamePhase.RECRUIT)
    
    // 生成商店
    const player = this.getLocalPlayer()
    if (player && this.shopSystem) {
      this.shopSystem.generateShop(player.level)
    }
  }
  
  /**
   * 进入布阵阶段
   */
  public enterArrangePhase(): void {
    this.phase = GamePhase.ARRANGE
    this.roundData.phase = GamePhase.ARRANGE
    
    this.onPhaseChange?.(GamePhase.ARRANGE)
  }
  
  /**
   * 进入战斗阶段
   */
  public enterCombatPhase(): void {
    this.state = GameState.COMBAT
    this.phase = GamePhase.BATTLE
    this.roundData.combatTime = this.config.combatTime
    this.roundData.phase = GamePhase.BATTLE
    
    this.onPhaseChange?.(GamePhase.BATTLE)
    
    // 开始战斗
    this.startCombat()
  }
  
  /**
   * 开始战斗
   */
  private startCombat(): void {
    const player = this.getLocalPlayer()
    if (!player) return
    
    // 选择对手
    const opponent = this.selectOpponent()
    
    // 触发战斗 (实际项目中由 BattleSystem 处理)
    console.log(`战斗开始：玩家 vs ${opponent.isAI ? 'AI' : '玩家'}`)
    
    // 模拟战斗结果 (实际项目中需要真实战斗)
    setTimeout(() => {
      const isWin = Math.random() > 0.5 // 临时随机
      this.endCombat(isWin, opponent)
    }, this.config.combatTime * 1000)
  }
  
  /**
   * 结束战斗
   * 
   * @param isWin 是否胜利
   * @param opponent 对手
   */
  private endCombat(isWin: boolean, opponent: IPlayerData): void {
    const player = this.getLocalPlayer()
    if (!player) return
    
    // 更新玩家状态
    if (isWin) {
      player.winStreak += 1
      player.loseStreak = 0
    } else {
      player.loseStreak += 1
      player.winStreak = 0
      
      // 战败扣血
      const damage = this.calculateDamage(player)
      player.hp = Math.max(0, player.hp - damage)
    }
    
    // 更新 AI 对手状态
    if (isWin) {
      opponent.loseStreak += 1
      opponent.winStreak = 0
    } else {
      opponent.winStreak += 1
      opponent.loseStreak = 0
    }
    
    // 结算经济
    if (this.economySystem) {
      this.economySystem.endRound(isWin, player.level, this.roundData.roundNumber)
    }
    
    this.onRoundEnd?.(this.roundData.roundNumber, isWin ? 'win' : 'lose')
    
    // 进入下一回合
    setTimeout(() => {
      this.startRound(this.roundData.roundNumber + 1)
    }, 3000)
  }
  
  /**
   * 结束回合
   */
  private endRound(): void {
    this.state = GameState.ROUND_END
    this.roundData.phase = GamePhase.REWARD
    
    // 重置商店
    if (this.shopSystem) {
      this.shopSystem.resetRound()
    }
  }
  
  /**
   * 结束游戏
   */
  public endGame(): void {
    this.state = GameState.GAME_END
    
    // 计算排名
    const ranking = this.calculateRanking()
    
    this.onGameEnd?.(ranking)
  }
  
  // ==================== 玩家相关 ====================
  
  /**
   * 获取本地玩家
   */
  public getLocalPlayer(): IPlayerData | null {
    return this.players.find(p => p.id === this.localPlayerId) || null
  }
  
  /**
   * 获取玩家
   * 
   * @param playerId 玩家 ID
   */
  public getPlayer(playerId: string): IPlayerData | null {
    return this.players.find(p => p.id === playerId) || null
  }
  
  /**
   * 购买棋子
   * 
   * @param slotIndex 商店格子索引
   * @returns 是否成功
   */
  public buyChess(slotIndex: number): boolean {
    const player = this.getLocalPlayer()
    if (!player || !this.shopSystem || !this.economySystem) return false
    
    const slot = this.shopSystem.getShopData().slots[slotIndex]
    if (!slot) return false
    
    const cost = slot.cost
    
    // 检查金币
    if (this.economySystem.getGold() < cost) {
      return false
    }
    
    // 消费金币
    if (!this.economySystem.spendGold(cost, 'buy_chess' as any, `购买 ${slot.chessData.name}`)) {
      return false
    }
    
    // 购买棋子
    const chessData = this.shopSystem.buyChess(slotIndex)
    if (!chessData) return false
    
    // 添加到棋子列表
    const chess = new Chess(chessData)
    player.benchChess.push(chess)
    
    return true
  }
  
  /**
   * 升级人口
   * 
   * @returns 是否成功
   */
  public levelUp(): boolean {
    const player = this.getLocalPlayer()
    if (!player || !this.economySystem) return false
    
    if (player.level >= 8) return false
    
    const levelUpCost = [0, 0, 0, 4, 8, 16, 24, 32, 40]
    const cost = levelUpCost[player.level]
    
    if (!cost || cost <= 0) return false
    
    if (!this.economySystem.spendGold(cost, 'level_up' as any, '升级人口')) {
      return false
    }
    
    player.level += 1
    return true
  }
  
  /**
   * 刷新商店
   * 
   * @returns 是否成功
   */
  public refreshShop(): boolean {
    const player = this.getLocalPlayer()
    if (!player || !this.shopSystem || !this.economySystem) return false
    
    if (!this.economySystem.spendGold(2, 'refresh_shop' as any, '刷新商店')) {
      return false
    }
    
    this.shopSystem.refresh()
    return true
  }
  
  /**
   * 卖出棋子
   * 
   * @param chess 棋子
   * @returns 是否成功
   */
  public sellChess(chess: Chess): boolean {
    const player = this.getLocalPlayer()
    if (!player || !this.economySystem) return false
    
    const index = player.benchChess.indexOf(chess)
    if (index === -1) return false
    
    // 移除棋子
    player.benchChess.splice(index, 1)
    
    // 返还金币
    const sellPrice = chess.chessData.rarity
    this.economySystem.addGold(sellPrice, GoldSource.CHESS_SELL, `售卖 ${chess.chessData.name}`)
    
    return true
  }
  
  // ==================== 更新循环 ====================
  
  /**
   * 游戏更新 (每帧调用)
   * 
   * @param dt deltaTime (秒)
   */
  public update(dt: number): void {
    if (this.state === GameState.LOBBY || this.state === GameState.GAME_END) {
      return
    }
    
    this.roundTimer += dt
    
    // 准备阶段倒计时
    if (this.state === GameState.PREPARING) {
      this.roundData.preparingTime -= dt
      
      // 自动进入战斗
      if (this.roundData.preparingTime <= 0) {
        this.enterCombatPhase()
      }
    }
    
    // 战斗阶段倒计时
    if (this.state === GameState.COMBAT) {
      this.roundData.combatTime -= dt
      
      // 战斗超时
      if (this.roundData.combatTime <= 0) {
        // 根据血量判定胜负
        const isWin = this.getLocalPlayer()?.hp > 50 || false
        this.endCombat(isWin, this.selectOpponent())
      }
    }
  }
  
  // ==================== 私有辅助方法 ====================
  
  /**
   * 选择对手
   */
  private selectOpponent(): IPlayerData {
    const player = this.getLocalPlayer()
    if (!player) return this.players[1]
    
    // 匹配相同战绩的玩家
    const similarPlayers = this.players.filter(p => 
      p.id !== player.id && !p.isAI
    )
    
    if (similarPlayers.length > 0) {
      return similarPlayers[Math.floor(Math.random() * similarPlayers.length)]
    }
    
    // 没有合适对手时匹配 AI
    const aiPlayers = this.players.filter(p => p.isAI && p.hp > 0)
    return aiPlayers[Math.floor(Math.random() * aiPlayers.length)]
  }
  
  /**
   * 计算战败伤害
   */
  private calculateDamage(player: IPlayerData): number {
    const round = this.roundData.roundNumber
    
    // 基础伤害 + 未上场棋子数
    const baseDamage = round
    const benchDamage = Math.floor(player.benchChess.length * 0.5)
    
    return Math.min(20, baseDamage + benchDamage)
  }
  
  /**
   * 发放回合收入
   */
  private distributeRoundIncome(): void {
    const player = this.getLocalPlayer()
    if (!player || !this.economySystem) return
    
    // 基础收入
    this.economySystem.addGold(5, GoldSource.BASE_INCOME, '回合收入')
    
    // 利息
    const interest = this.economySystem.calculateInterest()
    if (interest > 0) {
      this.economySystem.addGold(interest, GoldSource.INTEREST, '利息')
    }
    
    // 连胜/连败
    const streakBonus = this.economySystem.calculateStreakBonus()
    if (streakBonus > 0) {
      const source = player.winStreak > 0 ? GoldSource.WIN_STREAK : GoldSource.LOSE_STREAK
      this.economySystem.addGold(streakBonus, source)
    }
  }
  
  /**
   * 检查游戏结束
   */
  private checkGameEnd(): boolean {
    const player = this.getLocalPlayer()
    if (!player) return false
    
    // 玩家死亡
    if (player.hp <= 0) {
      this.endGame()
      return true
    }
    
    // 达到最大回合数
    if (this.roundData.roundNumber >= this.config.totalRounds) {
      this.endGame()
      return true
    }
    
    // 只剩一个玩家
    const alivePlayers = this.players.filter(p => p.hp > 0)
    if (alivePlayers.length === 1) {
      this.endGame()
      return true
    }
    
    return false
  }
  
  /**
   * 计算最终排名
   */
  private calculateRanking(): number {
    const sortedPlayers = [...this.players].sort((a, b) => {
      if (b.hp !== a.hp) return b.hp - a.hp
      if (b.winStreak !== a.winStreak) return b.winStreak - a.winStreak
      return b.level - a.level
    })
    
    const index = sortedPlayers.findIndex(p => p.id === this.localPlayerId)
    return index + 1
  }
  
  /**
   * 重置游戏
   */
  public reset(): void {
    this.state = GameState.LOBBY
    this.phase = GamePhase.RECRUIT
    this.roundData.roundNumber = 0
    this.players = []
    this.economySystem = null
    this.shopSystem = null
    this.roundTimer = 0
  }
}

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 获取游戏管理器实例
 * const gameManager = GameManager.getInstance()
 * 
 * // 初始化
 * gameManager.initialize({
 *   initialHp: 100,
 *   preparingTime: 30,
 *   combatTime: 60
 * })
 * 
 * // 设置回调
 * gameManager.onGameStart = () => {
 *   console.log('游戏开始!')
 * }
 * 
 * gameManager.onRoundStart = (round) => {
 *   console.log(`第 ${round} 回合开始`)
 * }
 * 
 * gameManager.onPhaseChange = (phase) => {
 *   console.log(`阶段变化：${phase}`)
 *   if (phase === GamePhase.RECRUIT) {
 *     // 显示商店 UI
 *   }
 * }
 * 
 * gameManager.onRoundEnd = (round, result) => {
 *   console.log(`第 ${round} 回合结束：${result}`)
 * }
 * 
 * // 开始游戏
 * gameManager.startGame(8)
 * 
 * // 游戏循环
 * function gameLoop(dt: number) {
 *   gameManager.update(dt)
 * }
 * 
 * // 玩家操作
 * gameManager.buyChess(0)     // 购买第 1 个棋子
 * gameManager.refreshShop()   // 刷新商店
 * gameManager.levelUp()       // 升级人口
 * ```
 */
