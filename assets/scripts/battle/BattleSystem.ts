/**
 * 封狼居胥 - 战斗系统
 * 
 * 战斗逻辑：
 * - 战斗流程控制
 * - 目标选择
 * - 伤害计算
 * - 技能释放
 * - Buff 管理
 */

import { Chess, ChessState, BuffType } from './chess/Chess'
import { SynergyCalculator } from './battle/SynergyCalculator'
import { eventBus, GameEventType } from './core/EventSystem'
import type { IChessBaseStats } from './ChessData'

// ==================== 接口定义 ====================

/** 战斗配置 */
export interface IBattleConfig {
  boardWidth: number          // 棋盘宽度
  boardHeight: number         // 棋盘高度
  attackInterval: number      // 攻击间隔 (秒)
  moveSpeed: number           // 移动速度倍率
}

/** 战斗结果 */
export interface IBattleResult {
  winner: 'friendly' | 'enemy'
  winReason: 'eliminate' | 'timeout' | 'surrender'
  duration: number            // 战斗持续时间 (秒)
  casualties: {               // 伤亡统计
    friendly: number
    enemy: number
  }
}

/** 战棋位置数据 */
export interface IBattleChessPosition {
  chess: Chess
  position: { x: number; y: number }
}

// ==================== 战斗系统类 ====================

export class BattleSystem {
  // ==================== 静态属性 ====================
  
  /** 默认配置 */
  private static DEFAULT_CONFIG: IBattleConfig = {
    boardWidth: 1200,
    boardHeight: 800,
    attackInterval: 1.0,
    moveSpeed: 1.0
  }
  
  // ==================== 实例属性 ====================
  
  private config: IBattleConfig
  private friendlyChess: Chess[] = []
  private enemyChess: Chess[] = []
  private allChess: Chess[] = []
  
  /** 战斗是否进行中 */
  private isBattling: boolean = false
  
  /** 战斗开始时间 */
  private battleStartTime: number = 0
  
  /** 战斗超时时间 (秒) */
  private readonly BATTLE_TIMEOUT = 180
  
  /** 攻击定时器 */
  private attackTimers: Map<string, number> = new Map()
  
  // 事件回调
  public onBattleStart?: (battle: BattleSystem) => void
  public onBattleEnd?: (result: IBattleResult) => void
  public onChessAttack?: (attacker: Chess, target: Chess, damage: number) => void
  public onChessSkill?: (chess: Chess, targets: Chess[]) => void
  
  /**
   * 构造函数
   * 
   * @param config 战斗配置
   */
  constructor(config: Partial<IBattleConfig> = {}) {
    this.config = { ...BattleSystem.DEFAULT_CONFIG, ...config }
  }
  
  // ==================== 战斗生命周期 ====================
  
  /**
   * 开始战斗
   * 
   * @param friendlyChess 友方棋子列表
   * @param enemyChess 敌方棋子列表
   */
  public startBattle(friendlyChess: Chess[], enemyChess: Chess[]): void {
    this.friendlyChess = [...friendlyChess]
    this.enemyChess = [...enemyChess]
    this.allChess = [...this.friendlyChess, ...this.enemyChess]
    
    this.isBattling = true
    this.battleStartTime = Date.now()
    
    // 初始化攻击定时器
    this.initializeAttackTimers()
    
    // 触发事件
    eventBus.emit(GameEventType.BATTLE_START, {
      friendlyCount: this.friendlyChess.length,
      enemyCount: this.enemyChess.length
    })
    
    this.onBattleStart?.(this)
    
    console.log(`战斗开始：友军 ${this.friendlyChess.length} vs 敌军 ${this.enemyChess.length}`)
  }
  
  /**
   * 结束战斗
   * 
   * @param result 战斗结果
   */
  public endBattle(result: IBattleResult): void {
    this.isBattling = false
    
    // 清理定时器
    this.attackTimers.clear()
    
    // 触发事件
    eventBus.emit(GameEventType.BATTLE_END, result)
    this.onBattleEnd?.(result)
    
    console.log(`战斗结束：${result.winner} 获胜，原因：${result.winReason}`)
  }
  
  /**
   * 更新战斗 (每帧调用)
   * 
   * @param dt deltaTime (秒)
   */
  public update(dt: number): void {
    if (!this.isBattling) return
    
    // 检查超时
    const elapsed = (Date.now() - this.battleStartTime) / 1000
    if (elapsed >= this.BATTLE_TIMEOUT) {
      this.handleTimeout()
      return
    }
    
    // 更新所有棋子
    for (const chess of this.allChess) {
      if (chess.state === ChessState.DEAD) continue
      
      // 更新 Buff
      chess.updateBuffs(dt)
      
      // 更新攻击定时器
      this.updateAttackTimer(chess, dt)
      
      // 自动行为
      if (chess.state === ChessState.IDLE || chess.state === ChessState.MOVING) {
        this.autoBehavior(chess, dt)
      }
    }
    
    // 检查战斗结束
    this.checkBattleEnd()
  }
  
  // ==================== 战斗行为 ====================
  
  /**
   * 棋子自动行为
   * 
   * @param chess 棋子
   * @param dt deltaTime
   */
  public autoBehavior(chess: Chess, dt: number): void {
    // 寻找目标
    const target = this.findNearestTarget(chess)
    
    if (!target) {
      // 没有敌人，向前移动
      this.moveForward(chess, dt)
      return
    }
    
    chess.target = target
    
    // 计算距离
    const distance = this.calculateDistance(chess.position, target.position)
    const attackRange = this.getAttackRange(chess)
    
    if (distance <= attackRange) {
      // 在攻击范围内，攻击
      this.chessAttack(chess, target)
    } else {
      // 移动向目标
      this.moveTo(chess, target.position, dt)
    }
  }
  
  /**
   * 棋子攻击
   * 
   * @param attacker 攻击者
   * @param target 目标
   */
  public chessAttack(attacker: Chess, target: Chess): void {
    if (!this.isBattling) return
    if (attacker.state === ChessState.DEAD || target.state === ChessState.DEAD) return
    
    // 计算伤害
    const damage = this.calculateDamage(attacker, target)
    
    // 触发攻击
    const actualDamage = attacker.attack(target)
    
    // 触发事件
    eventBus.emit(GameEventType.BATTLE_DAMAGE, {
      attacker,
      target,
      damage: actualDamage
    })
    
    this.onChessAttack?.(attacker, target, actualDamage)
    
    console.log(`${attacker.chessData.name} 攻击 ${target.chessData.name}, 造成 ${actualDamage} 点伤害`)
  }
  
  /**
   * 棋子释放技能
   * 
   * @param chess 棋子
   * @param targets 技能目标
   */
  public chessSkill(chess: Chess, targets: Chess[]): void {
    if (!this.isBattling) return
    if (chess.state === ChessState.DEAD) return
    
    const skill = chess.chessData.skill
    
    // 消耗能量
    chess.currentEnergy -= skill.energyCost
    
    // 根据技能类型处理
    switch (skill.target) {
      case 'area':
        // 范围伤害
        this.handleAreaSkill(chess, targets, skill)
        break
      case 'ally':
        // 增益友军
        this.handleBuffSkill(chess, targets, skill)
        break
      case 'enemy':
        // 单体伤害
        this.handleSingleSkill(chess, targets, skill)
        break
    }
    
    // 触发事件
    eventBus.emit(GameEventType.CHESS_SKILL, {
      chess,
      skill,
      targets
    })
    
    this.onChessSkill?.(chess, targets)
    
    console.log(`${chess.chessData.name} 释放技能：${skill.name}`)
  }
  
  // ==================== 目标选择 ====================
  
  /**
   * 寻找最近目标
   * 
   * @param chess 棋子
   * @returns 最近目标
   */
  public findNearestTarget(chess: Chess): Chess | null {
    const enemies = chess.team === 'friendly' ? this.enemyChess : this.friendlyChess
    const aliveEnemies = enemies.filter(e => e.state !== ChessState.DEAD)
    
    if (aliveEnemies.length === 0) {
      return null
    }
    
    // 找到最近的敌人
    let nearest: Chess | null = null
    let nearestDistance = Infinity
    
    for (const enemy of aliveEnemies) {
      const distance = this.calculateDistance(chess.position, enemy.position)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = enemy
      }
    }
    
    return nearest
  }
  
  /**
   * 寻找血量最低目标
   * 
   * @param chess 棋子
   * @returns 血量最低目标
   */
  public findLowestHpTarget(chess: Chess): Chess | null {
    const enemies = chess.team === 'friendly' ? this.enemyChess : this.friendlyChess
    const aliveEnemies = enemies.filter(e => e.state !== ChessState.DEAD)
    
    if (aliveEnemies.length === 0) {
      return null
    }
    
    return aliveEnemies.reduce((lowest, current) => 
      current.currentHp < lowest.currentHp ? current : lowest
    )
  }
  
  // ==================== 伤害计算 ====================
  
  /**
   * 计算伤害
   * 
   * @param attacker 攻击者
   * @param target 目标
   * @returns 最终伤害
   */
  public calculateDamage(attacker: Chess, target: Chess): number {
    const attack = attacker.getCurrentAttack()
    const defense = target.getCurrentDefense()
    
    // 基础伤害公式
    let damage = attack * (100 / (100 + defense))
    
    // 羁绊加成
    const attackerTeam = attacker.team === 'friendly' ? this.friendlyChess : this.enemyChess
    const bonus = SynergyCalculator.calculateChessBonus(attacker.chessData, 
      attackerTeam.map(c => c.chessData)
    )
    
    if (bonus.attackPercent) {
      damage *= (1 + bonus.attackPercent)
    }
    
    return Math.floor(Math.max(1, damage))
  }
  
  // ==================== 位置管理 ====================
  
  /**
   * 移动到目标位置
   * 
   * @param chess 棋子
   * @param targetPosition 目标位置
   * @param dt deltaTime
   */
  public moveTo(chess: Chess, targetPosition: { x: number; y: number }, dt: number): void {
    chess.move(targetPosition, dt * this.config.moveSpeed)
  }
  
  /**
   * 向前移动
   * 
   * @param chess 棋子
   * @param dt deltaTime
   */
  public moveForward(chess: Chess, dt: number): void {
    const direction = chess.team === 'friendly' ? 1 : -1
    const targetY = chess.position.y + direction * 100 * dt
    
    chess.move({
      x: chess.position.x,
      y: Math.max(0, Math.min(this.config.boardHeight, targetY))
    }, dt)
  }
  
  // ==================== 战斗结束检查 ====================
  
  /**
   * 检查战斗是否结束
   */
  private checkBattleEnd(): void {
    const friendlyAlive = this.friendlyChess.filter(c => c.state !== ChessState.DEAD).length
    const enemyAlive = this.enemyChess.filter(c => c.state !== ChessState.DEAD).length
    
    if (friendlyAlive === 0 && enemyAlive === 0) {
      // 平局
      this.endBattle({
        winner: 'friendly', // 临时处理
        winReason: 'eliminate',
        duration: (Date.now() - this.battleStartTime) / 1000,
        casualties: {
          friendly: this.friendlyChess.length,
          enemy: this.enemyChess.length
        }
      })
    } else if (friendlyAlive === 0) {
      // 敌方胜利
      this.endBattle({
        winner: 'enemy',
        winReason: 'eliminate',
        duration: (Date.now() - this.battleStartTime) / 1000,
        casualties: {
          friendly: this.friendlyChess.length,
          enemy: this.enemyChess.length - enemyAlive
        }
      })
    } else if (enemyAlive === 0) {
      // 友方胜利
      this.endBattle({
        winner: 'friendly',
        winReason: 'eliminate',
        duration: (Date.now() - this.battleStartTime) / 1000,
        casualties: {
          friendly: this.friendlyChess.length - friendlyAlive,
          enemy: this.enemyChess.length
        }
      })
    }
  }
  
  /**
   * 处理超时
   */
  private handleTimeout(): void {
    const friendlyHp = this.getTotalHp(this.friendlyChess)
    const enemyHp = this.getTotalHp(this.enemyChess)
    
    const winner: 'friendly' | 'enemy' = friendlyHp >= enemyHp ? 'friendly' : 'enemy'
    
    this.endBattle({
      winner,
      winReason: 'timeout',
      duration: this.BATTLE_TIMEOUT,
      casualties: {
        friendly: this.friendlyChess.filter(c => c.state === ChessState.DEAD).length,
        enemy: this.enemyChess.filter(c => c.state === ChessState.DEAD).length
      }
    })
  }
  
  /**
   * 获取总血量
   */
  private getTotalHp(chessList: Chess[]): number {
    return chessList
      .filter(c => c.state !== ChessState.DEAD)
      .reduce((sum, chess) => sum + chess.currentHp, 0)
  }
  
  // ==================== 私有辅助方法 ====================
  
  /**
   * 初始化攻击定时器
   */
  private initializeAttackTimers(): void {
    for (const chess of this.allChess) {
      // 随机化首次攻击时间，避免同时攻击
      const randomDelay = Math.random() * this.config.attackInterval
      this.attackTimers.set(chess.uid, randomDelay)
    }
  }
  
  /**
   * 更新攻击定时器
   */
  private updateAttackTimer(chess: Chess, dt: number): void {
    const timer = this.attackTimers.get(chess.uid)
    if (timer === undefined) return
    
    const newTimer = timer - dt
    if (newTimer <= 0) {
      // 可以攻击
      this.attackTimers.set(chess.uid, this.config.attackInterval)
    } else {
      this.attackTimers.set(chess.uid, newTimer)
    }
  }
  
  /**
   * 计算距离
   */
  private calculateDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    return Math.sqrt(dx * dx + dy * dy)
  }
  
  /**
   * 获取攻击范围
   */
  private getAttackRange(chess: Chess): number {
    const range = chess.getFinalStats().range
    // 射程转换为像素距离 (简化处理)
    return range * 100
  }
  
  /**
   * 处理范围技能
   */
  private handleAreaSkill(chess: Chess, targets: Chess[], skill: any): void {
    // 范围伤害
    for (const target of targets) {
      // TODO: 实现范围伤害逻辑
    }
  }
  
  /**
   * 处理增益技能
   */
  private handleBuffSkill(chess: Chess, targets: Chess[], skill: any): void {
    // 增益友军
    for (const target of targets) {
      // TODO: 实现增益逻辑
    }
  }
  
  /**
   * 处理单体技能
   */
  private handleSingleSkill(chess: Chess, targets: Chess[], skill: any): void {
    // 单体伤害
    for (const target of targets) {
      // TODO: 实现单体技能逻辑
    }
  }
}

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 创建战斗系统
 * const battle = new BattleSystem({
 *   boardWidth: 1200,
 *   boardHeight: 800
 * })
 * 
 * // 设置回调
 * battle.onBattleStart = (battle) => {
 *   console.log('战斗开始!')
 * }
 * 
 * battle.onBattleEnd = (result) => {
 *   console.log(`战斗结束：${result.winner} 获胜`)
 * }
 * 
 * battle.onChessAttack = (attacker, target, damage) => {
 *   console.log(`${attacker.name} 攻击 ${target.name}, 造成 ${damage} 伤害`)
 * }
 * 
 * // 开始战斗
 * battle.startBattle(friendlyChess, enemyChess)
 * 
 * // 游戏循环
 * function gameLoop(dt: number) {
 *   battle.update(dt)
 * }
 * ```
 */
