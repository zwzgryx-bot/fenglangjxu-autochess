/**
 * 封狼居胥 - 棋子基类
 * 
 * 棋子核心类：
 * - 属性管理 (基础/升星/转职/羁绊加成)
 * - 战斗行为 (移动/攻击/技能)
 * - 状态管理 (能量/血量/ Buff)
 */

import { 
  Camp, 
  Profession, 
  Rarity, 
  type IChessData, 
  type IChessBaseStats,
  type ISkill,
  type IBond,
  STAR_MULTIPLIERS,
  calculateDamage as calcDamage
} from './ChessData'
import { SynergyCalculator, type IBonusData } from './battle/SynergyCalculator'
import { ClassChangeSystem, type IChessClassChangeState, type ClassChangeTier } from './ClassChangeSystem'

// ==================== 枚举和接口定义 ====================

/** 棋子状态 */
export enum ChessState {
  IDLE = 'idle',           // 待机
  MOVING = 'moving',       // 移动中
  ATTACKING = 'attacking', // 攻击中
  SKILLING = 'skilling',   // 释放技能
  HURT = 'hurt',           // 受击
  DEAD = 'dead',           // 死亡
  FROZEN = 'frozen',       // 冻结
  STUNNED = 'stunned'      // 眩晕
}

/** Buff 类型 */
export enum BuffType {
  ATTACK_UP = 'attack_up',       // 攻击提升
  DEFENSE_UP = 'defense_up',     // 防御提升
  SPEED_UP = 'speed_up',         // 速度提升
  ENERGY_UP = 'energy_up',       // 能量获取提升
  DAMAGE_REDUCTION = 'damage_reduction', // 伤害减免
  HEAL = 'heal',                 // 持续治疗
  POISON = 'poison'              // 中毒
}

/** Buff 数据 */
export interface IBuff {
  type: BuffType
  value: number
  duration: number        // 持续时间 (秒)
  remainingTime: number   // 剩余时间
  stackCount?: number     // 叠加层数
}

/** 棋子实例属性 */
export interface IChessInstance {
  // 基础信息
  uid: string                         // 实例唯一 ID
  chessData: IChessData               // 棋子数据
  star: number                        // 星级 (1-3)
  classChangeState?: IChessClassChangeState // 转职状态
  
  // 战斗属性
  currentHp: number                   // 当前生命值
  maxHp: number                       // 最大生命值
  currentEnergy: number               // 当前能量
  maxEnergy: number                   // 最大能量 (通常 100)
  
  // 状态
  state: ChessState                   // 当前状态
  buffs: IBuff[]                      // Buff 列表
  position: { x: number; y: number }  // 当前位置
  target?: IChessInstance             // 当前目标
  
  // 引用
  team: 'friendly' | 'enemy'          // 所属队伍
}

// ==================== 棋子基类 ====================

export class Chess implements IChessInstance {
  // ==================== 静态属性 ====================
  
  /** 全局 UID 计数器 */
  private static uidCounter = 0
  
  /** 生成唯一 UID */
  private static generateUID(): string {
    return `chess_${++this.uidCounter}_${Date.now()}`
  }
  
  // ==================== 实例属性 ====================
  
  // 基础信息
  public readonly uid: string
  public readonly chessData: IChessData
  public star: number
  public classChangeState?: IChessClassChangeState
  
  // 战斗属性
  public currentHp: number
  public maxHp: number
  public currentEnergy: number
  public maxEnergy: number = 100
  
  // 状态
  public state: ChessState
  public buffs: IBuff[]
  public position: { x: number; y: number }
  public target?: IChessInstance
  
  // 引用
  public team: 'friendly' | 'enemy'
  
  // 事件回调
  public onDeath?: (chess: Chess) => void
  public onSkillCast?: (chess: Chess, skill: ISkill) => void
  public onBuffChange?: (chess: Chess, buffs: IBuff[]) => void
  
  // ==================== 构造函数 ====================
  
  /**
   * 创建棋子实例
   * 
   * @param chessData 棋子数据
   * @param star 星级 (默认 1 星)
   */
  constructor(chessData: IChessData, star: number = 1) {
    this.uid = Chess.generateUID()
    this.chessData = chessData
    this.star = Math.max(1, Math.min(3, star))
    this.state = ChessState.IDLE
    this.buffs = []
    this.position = { x: 0, y: 0 }
    this.team = 'friendly'
    
    // 初始化属性
    const stats = this.getFinalStats()
    this.maxHp = stats.hp
    this.currentHp = stats.hp
    this.currentEnergy = 0
  }
  
  // ==================== 属性计算 ====================
  
  /**
   * 获取最终属性 (包含升星/转职/羁绊加成)
   */
  public getFinalStats(): IChessBaseStats {
    // 1. 基础属性
    let stats = { ...this.chessData.baseStats }
    
    // 2. 升星加成
    const starMultiplier = STAR_MULTIPLIERS[this.star as keyof typeof STAR_MULTIPLIERS]
    stats = {
      hp: Math.floor(stats.hp * starMultiplier),
      attack: Math.floor(stats.attack * starMultiplier),
      defense: Math.floor(stats.defense * starMultiplier),
      speed: stats.speed,
      range: stats.range,
      energyRegen: stats.energyRegen || 10
    }
    
    // 3. 转职加成
    if (this.classChangeState && this.classChangeState.bonusStats) {
      const bonus = this.classChangeState.bonusStats
      stats = {
        hp: Math.floor(stats.hp * (bonus.hpMultiplier || 1)),
        attack: Math.floor(stats.attack * (bonus.attackMultiplier || 1)),
        defense: Math.floor(stats.defense * (bonus.defenseMultiplier || 1)),
        speed: stats.speed * (bonus.speedMultiplier || 1),
        range: stats.range + (bonus.rangeBonus || 0),
        energyRegen: stats.energyRegen
      }
    }
    
    // 4. 羁绊加成 (需要外部传入)
    // 羁绊加成由外部系统计算后通过 applyBonus 应用
    
    return stats
  }
  
  /**
   * 获取当前攻击力 (包含 Buff)
   */
  public getCurrentAttack(): number {
    const base = this.getFinalStats().attack
    return this.applyBuffValue(base, BuffType.ATTACK_UP)
  }
  
  /**
   * 获取当前防御力 (包含 Buff)
   */
  public getCurrentDefense(): number {
    const base = this.getFinalStats().defense
    return this.applyBuffValue(base, BuffType.DEFENSE_UP)
  }
  
  /**
   * 获取当前速度 (包含 Buff)
   */
  public getCurrentSpeed(): number {
    const base = this.getFinalStats().speed
    return this.applyBuffValue(base, BuffType.SPEED_UP)
  }
  
  /**
   * 应用羁绊加成
   * 
   * @param bonus 羁绊加成数据
   */
  public applyBonus(bonus: IBonusData): void {
    const stats = this.getFinalStats()
    
    if (bonus.attackPercent) {
      stats.attack = Math.floor(stats.attack * (1 + bonus.attackPercent))
    }
    if (bonus.hpPercent) {
      stats.hp = Math.floor(stats.hp * (1 + bonus.hpPercent))
      this.maxHp = stats.hp
      this.currentHp = Math.min(this.currentHp, stats.hp)
    }
    if (bonus.defensePercent) {
      stats.defense = Math.floor(stats.defense * (1 + bonus.defensePercent))
    }
    if (bonus.speedPercent) {
      stats.speed = stats.speed * (1 + bonus.speedPercent)
    }
    if (bonus.rangeBonus) {
      stats.range += bonus.rangeBonus
    }
  }
  
  // ==================== 战斗行为 ====================
  
  /**
   * 移动
   * 
   * @param targetPosition 目标位置
   * @param dt  deltaTime (秒)
   */
  public move(targetPosition: { x: number; y: number }, dt: number): void {
    if (this.state === ChessState.DEAD || this.state === ChessState.STUNNED) {
      return
    }
    
    const speed = this.getCurrentSpeed() * 50 // 像素/秒
    const dx = targetPosition.x - this.position.x
    const dy = targetPosition.y - this.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < 5) {
      this.position = { ...targetPosition }
      this.state = ChessState.IDLE
      return
    }
    
    const moveX = (dx / distance) * speed * dt
    const moveY = (dy / distance) * speed * dt
    
    this.position.x += moveX
    this.position.y += moveY
    this.state = ChessState.MOVING
  }
  
  /**
   * 攻击目标
   * 
   * @param target 目标棋子
   * @returns 伤害量
   */
  public attack(target: Chess): number {
    if (this.state === ChessState.DEAD || this.state === ChessState.STUNNED) {
      return 0
    }
    
    this.target = target
    this.state = ChessState.ATTACKING
    
    const attack = this.getCurrentAttack()
    const defense = target.getCurrentDefense()
    const damage = calcDamage(attack, defense)
    
    target.takeDamage(damage, this)
    
    // 攻击获取能量
    this.gainEnergy(10)
    
    // 被击获取能量
    target.gainEnergy(5)
    
    return damage
  }
  
  /**
   * 承受伤害
   * 
   * @param damage 伤害量
   * @param attacker 攻击者
   */
  public takeDamage(damage: number, attacker: Chess): void {
    if (this.state === ChessState.DEAD) {
      return
    }
    
    // 应用伤害减免 Buff
    damage = this.applyBuffReduction(damage)
    
    this.currentHp = Math.max(0, this.currentHp - damage)
    this.state = ChessState.HURT
    
    // 检查死亡
    if (this.currentHp <= 0) {
      this.die()
    }
  }
  
  /**
   * 治疗
   * 
   * @param amount 治疗量
   */
  public heal(amount: number): void {
    if (this.state === ChessState.DEAD) {
      return
    }
    
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount)
  }
  
  /**
   * 获取能量
   * 
   * @param amount 能量值
   */
  public gainEnergy(amount: number): void {
    // 应用能量获取 Buff
    const energyUpBuff = this.buffs.find(b => b.type === BuffType.ENERGY_UP)
    if (energyUpBuff) {
      amount = Math.floor(amount * (1 + energyUpBuff.value))
    }
    
    this.currentEnergy = Math.min(this.maxEnergy, this.currentEnergy + amount)
    
    // 检查是否可以释放技能
    if (this.currentEnergy >= this.chessData.skill.energyCost) {
      this.tryCastSkill()
    }
  }
  
  /**
   * 尝试释放技能
   */
  public tryCastSkill(): boolean {
    if (this.state === ChessState.DEAD || this.state === ChessState.STUNNED) {
      return false
    }
    
    const skill = this.chessData.skill
    if (this.currentEnergy < skill.energyCost) {
      return false
    }
    
    this.currentEnergy -= skill.energyCost
    this.state = ChessState.SKILLING
    
    // 触发回调
    this.onSkillCast?.(this, skill)
    
    return true
  }
  
  /**
   * 死亡
   */
  public die(): void {
    this.state = ChessState.DEAD
    this.currentHp = 0
    this.target = undefined
    
    // 触发回调
    this.onDeath?.(this)
  }
  
  // ==================== Buff 系统 ====================
  
  /**
   * 添加 Buff
   * 
   * @param type Buff 类型
   * @param value Buff 值
   * @param duration 持续时间 (秒)
   * @param stackCount 叠加层数
   */
  public addBuff(type: BuffType, value: number, duration: number, stackCount: number = 1): void {
    const existingBuff = this.buffs.find(b => b.type === type)
    
    if (existingBuff) {
      // 刷新持续时间或叠加
      existingBuff.remainingTime = Math.max(existingBuff.remainingTime, duration)
      if (stackCount > 1) {
        existingBuff.stackCount = (existingBuff.stackCount || 1) + stackCount
      }
    } else {
      this.buffs.push({
        type,
        value,
        duration,
        remainingTime: duration,
        stackCount
      })
    }
    
    this.onBuffChange?.(this, this.buffs)
  }
  
  /**
   * 移除 Buff
   * 
   * @param type Buff 类型
   */
  public removeBuff(type: BuffType): void {
    this.buffs = this.buffs.filter(b => b.type !== type)
    this.onBuffChange?.(this, this.buffs)
  }
  
  /**
   * 清除所有 Buff
   */
  public clearBuffs(): void {
    this.buffs = []
    this.onBuffChange?.(this, this.buffs)
  }
  
  /**
   * 更新 Buff (每帧调用)
   * 
   * @param dt deltaTime (秒)
   */
  public updateBuffs(dt: number): void {
    let changed = false
    
    for (let i = this.buffs.length - 1; i >= 0; i--) {
      const buff = this.buffs[i]
      buff.remainingTime -= dt
      
      if (buff.remainingTime <= 0) {
        this.buffs.splice(i, 1)
        changed = true
      }
    }
    
    if (changed) {
      this.onBuffChange?.(this, this.buffs)
    }
  }
  
  /**
   * 获取转职状态
   */
  public getClassChangeTier(): ClassChangeTier {
    return this.classChangeState?.tier || 0
  }
  
  /**
   * 设置转职状态
   * 
   * @param state 转职状态
   */
  public setClassChangeState(state: IChessClassChangeState): void {
    this.classChangeState = state
  }
  
  /**
   * 检查是否可以升星
   */
  public canMergeChess(sameChessList: Chess[]): boolean {
    const count = sameChessList.length
    
    if (this.star === 1 && count >= 2) {
      return true // 3 个 1 星 = 1 个 2 星
    }
    if (this.star === 2 && count >= 2) {
      return true // 3 个 2 星 = 1 个 3 星
    }
    
    return false
  }
  
  /**
   * 升星
   * 
   * @returns 是否成功
   */
  public upgradeStar(): boolean {
    if (this.star >= 3) {
      return false
    }
    
    this.star += 1
    
    // 重置生命值和能量
    const stats = this.getFinalStats()
    this.maxHp = stats.hp
    this.currentHp = stats.hp
    this.currentEnergy = 0
    
    return true
  }
  
  /**
   * 检查是否可以转职
   */
  public canClassChange(): boolean {
    return ClassChangeSystem.canChangeClass(
      this.chessData,
      this.star,
      this.getClassChangeTier()
    )
  }
  
  /**
   * 执行转职
   * 
   * @param routeId 转职路线 ID
   * @returns 是否成功
   */
  public classChange(routeId: string): boolean {
    if (!this.canClassChange()) {
      return false
    }
    
    const newState = ClassChangeSystem.changeClass(this.chessData, routeId)
    if (!newState) {
      return false
    }
    
    this.classChangeState = newState
    
    // 重置生命值和能量
    const stats = this.getFinalStats()
    this.maxHp = stats.hp
    this.currentHp = stats.hp
    this.currentEnergy = 0
    
    return true
  }
  
  // ==================== 私有辅助方法 ====================
  
  /**
   * 应用 Buff 值加成
   */
  private applyBuffValue(base: number, buffType: BuffType): number {
    const buff = this.buffs.find(b => b.type === buffType)
    if (!buff) return base
    
    const multiplier = 1 + (buff.value * (buff.stackCount || 1))
    return Math.floor(base * multiplier)
  }
  
  /**
   * 应用 Buff 伤害减免
   */
  private applyBuffReduction(damage: number): number {
    const buff = this.buffs.find(b => b.type === BuffType.DAMAGE_REDUCTION)
    if (!buff) return damage
    
    const reduction = buff.value * (buff.stackCount || 1)
    return Math.floor(damage * (1 - reduction))
  }
}

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 创建棋子
 * const huoqubing = new Chess(HanChessDatabase['huoqubing'])
 * 
 * // 设置回调
 * huoqubing.onDeath = (chess) => {
 *   console.log(`${chess.chessData.name} 阵亡!`)
 * }
 * 
 * huoqubing.onSkillCast = (chess, skill) => {
 *   console.log(`${chess.chessData.name} 释放技能：${skill.name}`)
 * }
 * 
 * // 移动
 * huoqubing.move({ x: 600, y: 400 }, dt)
 * 
 * // 攻击
 * const damage = huoqubing.attack(enemyChess)
 * 
 * // 承受伤害
 * huoqubing.takeDamage(100, attacker)
 * 
 * // 添加 Buff
 * huoqubing.addBuff(BuffType.ATTACK_UP, 0.3, 8) // 攻击 +30%, 8 秒
 * 
 * // 升星
 * if (huoqubing.canMergeChess(sameChessList)) {
 *   huoqubing.upgradeStar()
 * }
 * 
 * // 转职
 * if (huoqubing.canClassChange()) {
 *   huoqubing.classChange('cavalry_to_paladin')
 * }
 * 
 * // 每帧更新
 * function update(dt: number) {
 *   huoqubing.updateBuffs(dt)
 * }
 * ```
 */
