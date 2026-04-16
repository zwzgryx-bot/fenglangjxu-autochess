/**
 * 封狼居胥 - 羁绊计算系统
 * 
 * 三维度羁绊系统：
 * 1. 阵营羁绊 (汉军/匈奴)
 * 2. 职业羁绊 (骑兵/弩兵/车兵/谋士/武将/狼骑兵/弓骑兵/萨满/勇士)
 * 3. 名将羁绊 (特殊组合)
 */

import { Camp, Profession, IBond, BondConfig, getBondEffect } from './ChessData'
import type { IChessData } from './ChessData'

// ==================== 羁绊接口定义 ====================

/** 激活的羁绊效果 */
export interface IActiveBond {
  id: string              // 羁绊 ID
  type: 'camp' | 'profession' | 'name'  // 羁绊类型
  count: number           // 当前数量
  requirement: number     // 需要的数量
  effect: string          // 效果描述
  bonus?: IBonusData      // 数值化加成 (用于计算)
}

/** 加成数据结构 */
export interface IBonusData {
  attackPercent?: number      // 攻击力百分比加成
  hpPercent?: number          // 生命值百分比加成
  defensePercent?: number     // 防御力百分比加成
  speedPercent?: number       // 速度百分比加成
  rangeBonus?: number         // 射程加成
  critRate?: number           // 暴击率
  damageReduction?: number    // 伤害减免
  energyRegenPercent?: number // 能量获取加成
  skillDamagePercent?: number // 技能伤害加成
  lifesteal?: number          // 吸血率
  special?: string            // 特殊效果描述
}

/** 羁绊统计结果 */
export interface IBondStats {
  campStats: Record<string, number>      // 阵营统计 (阵营 → 数量)
  professionStats: Record<string, number> // 职业统计 (职业 → 数量)
  nameBondStats: Record<string, {
    count: number
    requirement: number
    chessIds: string[]
  }>                                       // 名将羁绊统计
}

// ==================== 羁绊计算器类 ====================

export class SynergyCalculator {
  /**
   * 统计棋盘上所有棋子的羁绊
   * 
   * @param chessList 棋子列表
   * @returns 羁绊统计结果
   */
  public static countBonds(chessList: IChessData[]): IBondStats {
    const stats: IBondStats = {
      campStats: {},
      professionStats: {},
      nameBondStats: {}
    }
    
    // 统计阵营和职业
    for (const chess of chessList) {
      // 阵营统计
      const campKey = chess.camp
      stats.campStats[campKey] = (stats.campStats[campKey] || 0) + 1
      
      // 职业统计
      const profKey = chess.profession
      stats.professionStats[profKey] = (stats.professionStats[profKey] || 0) + 1
      
      // 名将羁绊统计
      for (const bond of chess.bonds) {
        if (bond.type === 'name') {
          if (!stats.nameBondStats[bond.id]) {
            stats.nameBondStats[bond.id] = {
              count: 0,
              requirement: bond.requirement,
              chessIds: []
            }
          }
          stats.nameBondStats[bond.id].count += 1
          stats.nameBondStats[bond.id].chessIds.push(chess.id)
        }
      }
    }
    
    return stats
  }
  
  /**
   * 计算所有激活的羁绊效果
   * 
   * @param stats 羁绊统计结果
   * @returns 激活的羁绊列表
   */
  public static calculateActiveBonds(stats: IBondStats): IActiveBond[] {
    const activeBonds: IActiveBond[] = []
    
    // 计算阵营羁绊
    for (const [camp, count] of Object.entries(stats.campStats)) {
      const bondId = `${camp}_camp`
      const effect = getBondEffect(bondId, count)
      if (effect) {
        activeBonds.push({
          id: bondId,
          type: 'camp',
          count,
          requirement: this.getMinimumRequirement(bondId, count),
          effect,
          bonus: this.parseBondBonus(bondId, count)
        })
      }
    }
    
    // 计算职业羁绊
    for (const [profession, count] of Object.entries(stats.professionStats)) {
      const effect = getBondEffect(profession, count)
      if (effect) {
        activeBonds.push({
          id: profession,
          type: 'profession',
          count,
          requirement: this.getMinimumRequirement(profession, count),
          effect,
          bonus: this.parseBondBonus(profession, count)
        })
      }
    }
    
    // 计算名将羁绊
    for (const [bondId, data] of Object.entries(stats.nameBondStats)) {
      if (data.count >= data.requirement) {
        const effect = getBondEffect(bondId, data.count)
        if (effect) {
          activeBonds.push({
            id: bondId,
            type: 'name',
            count: data.count,
            requirement: data.requirement,
            effect,
            bonus: this.parseBondBonus(bondId, data.count)
          })
        }
      }
    }
    
    return activeBonds
  }
  
  /**
   * 获取羁绊加成数值
   * 
   * @param activeBonds 激活的羁绊列表
   * @returns 总加成数据
   */
  public static getTotalBonus(activeBonds: IActiveBond[]): IBonusData {
    const total: IBonusData = {}
    
    for (const bond of activeBonds) {
      if (bond.bonus) {
        total = this.mergeBonus(total, bond.bonus)
      }
    }
    
    return total
  }
  
  /**
   * 计算单个棋子的羁绊加成
   * 
   * @param chess 棋子数据
   * @param chessList 所有棋子列表
   * @returns 该棋子的总加成
   */
  public static calculateChessBonus(chess: IChessData, chessList: IChessData[]): IBonusData {
    const stats = this.countBonds(chessList)
    const activeBonds = this.calculateActiveBonds(stats)
    
    // 筛选出对该棋子生效的羁绊
    const relevantBonds = activeBonds.filter(bond => {
      // 阵营羁绊：同阵营生效
      if (bond.type === 'camp') {
        return bond.id === `${chess.camp}_camp`
      }
      // 职业羁绊：同职业生效
      if (bond.type === 'profession') {
        return bond.id === chess.profession
      }
      // 名将羁绊：棋子在羁绊列表中生效
      if (bond.type === 'name') {
        return chess.bonds.some(b => b.id === bond.id)
      }
      return false
    })
    
    return this.getTotalBonus(relevantBonds)
  }
  
  /**
   * 应用羁绊加成到棋子属性
   * 
   * @param baseStats 基础属性
   * @param bonus 加成数据
   * @returns 加成后的属性
   */
  public static applyBonus(baseStats: { hp: number; attack: number; defense: number; speed: number; range: number }, bonus: IBonusData) {
    return {
      hp: Math.floor(baseStats.hp * (1 + (bonus.hpPercent || 0))),
      attack: Math.floor(baseStats.attack * (1 + (bonus.attackPercent || 0))),
      defense: Math.floor(baseStats.defense * (1 + (bonus.defensePercent || 0))),
      speed: baseStats.speed * (1 + (bonus.speedPercent || 0)),
      range: baseStats.range + (bonus.rangeBonus || 0)
    }
  }
  
  /**
   * 检查羁绊变化
   * 
   * @param oldStats 之前的统计
   * @param newStats 新的统计
   * @returns 新增和消失的羁绊
   */
  public static checkBondChanges(oldStats: IBondStats, newStats: IBondStats): {
    activated: IActiveBond[]
    deactivated: IActiveBond[]
  } {
    const oldBonds = this.calculateActiveBonds(oldStats)
    const newBonds = this.calculateActiveBonds(newStats)
    
    const activated = newBonds.filter(newBond => 
      !oldBonds.some(oldBond => oldBond.id === newBond.id && oldBond.requirement === newBond.requirement)
    )
    
    const deactivated = oldBonds.filter(oldBond => 
      !newBonds.some(newBond => newBond.id === oldBond.id && newBond.requirement === oldBond.requirement)
    )
    
    return { activated, deactivated }
  }
  
  // ==================== 私有辅助方法 ====================
  
  /**
   * 获取当前数量达到的最低门槛
   */
  private static getMinimumRequirement(bondId: string, count: number): number {
    const config = BondConfig[bondId]
    if (!config) return count
    
    const thresholds = Object.keys(config).map(Number).sort((a, b) => a - b)
    for (const threshold of thresholds) {
      if (count >= threshold) {
        return threshold
      }
    }
    return count
  }
  
  /**
   * 解析羁绊效果为数值加成
   * 
   * @param bondId 羁绊 ID
   * @param count 当前数量
   * @returns 数值化加成
   */
  private static parseBondBonus(bondId: string, count: number): IBonusData | undefined {
    const config = BondConfig[bondId]
    if (!config) return undefined
    
    // 找到当前档位的描述
    const thresholds = Object.keys(config).map(Number).sort((a, b) => b - a)
    let currentThreshold = 0
    for (const threshold of thresholds) {
      if (count >= threshold) {
        currentThreshold = threshold
        break
      }
    }
    
    if (currentThreshold === 0) return undefined
    
    const effectText = config[currentThreshold]
    const bonus: IBonusData = {}
    
    // 解析效果文本 (简化解析，实际项目中可能需要更复杂的逻辑)
    if (effectText.includes('攻击 +')) {
      const match = effectText.match(/攻击 \+(\d+)%/)
      if (match) bonus.attackPercent = parseInt(match[1]) / 100
    }
    if (effectText.includes('生命 +')) {
      const match = effectText.match(/生命 \+(\d+)%/)
      if (match) bonus.hpPercent = parseInt(match[1]) / 100
    }
    if (effectText.includes('防御 +')) {
      const match = effectText.match(/防御 \+(\d+)%/)
      if (match) bonus.defensePercent = parseInt(match[1]) / 100
    }
    if (effectText.includes('速度 +')) {
      const match = effectText.match(/速度 \+(\d+)%/)
      if (match) bonus.speedPercent = parseInt(match[1]) / 100
    }
    if (effectText.includes('范围 +')) {
      const match = effectText.match(/范围 \+(\d+)/)
      if (match) bonus.rangeBonus = parseInt(match[1])
    }
    if (effectText.includes('暴击')) {
      const match = effectText.match(/(\d+)% 暴击/)
      if (match) bonus.critRate = parseInt(match[1]) / 100
    }
    if (effectText.includes('吸血')) {
      const match = effectText.match(/吸血 (\d+)%/)
      if (match) bonus.lifesteal = parseInt(match[1]) / 100
    }
    if (effectText.includes('技能伤害 +')) {
      const match = effectText.match(/技能伤害 \+(\d+)%/)
      if (match) bonus.skillDamagePercent = parseInt(match[1]) / 100
    }
    
    // 特殊效果
    if (effectText.includes('移动射击')) {
      bonus.special = '移动射击'
    }
    if (effectText.includes('击杀刷新')) {
      bonus.special = '击杀刷新技能'
    }
    
    return Object.keys(bonus).length > 0 ? bonus : undefined
  }
  
  /**
   * 合并两个加成数据
   */
  private static mergeBonus(a: IBonusData, b: IBonusData): IBonusData {
    const result: IBonusData = { ...a }
    
    for (const [key, value] of Object.entries(b)) {
      if (key === 'special') {
        if (value && (!result.special || !result.special.includes(value))) {
          result.special = result.special ? `${result.special}, ${value}` : value
        }
      } else {
        const numValue = value as number
        const existingValue = result[key as keyof IBonusData] as number || 0
        result[key as keyof IBonusData] = existingValue + numValue
      }
    }
    
    return result
  }
}

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 统计羁绊
 * const stats = SynergyCalculator.countBonds(myChessList)
 * 
 * // 计算激活的羁绊
 * const activeBonds = SynergyCalculator.calculateActiveBonds(stats)
 * 
 * // 获取总加成
 * const totalBonus = SynergyCalculator.getTotalBonus(activeBonds)
 * 
 * // 计算单个棋子的加成
 * const chessBonus = SynergyCalculator.calculateChessBonus(huoqubing, myChessList)
 * 
 * // 应用加成到属性
 * const finalStats = SynergyCalculator.applyBonus(baseStats, chessBonus)
 * ```
 */
