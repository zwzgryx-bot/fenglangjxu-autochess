/**
 * 封狼居胥 - 转职系统
 * 
 * 核心特色系统：
 * - 3 星棋子可转职
 * - 一转 (1.3x 属性)
 * - 终极转职 (1.5x 属性)
 * - 21 条转职路线
 */

import { Camp, Profession, type IChessData, type IChessBaseStats, CLASS_CHANGE_MULTIPLIERS } from './ChessData'

// ==================== 枚举和接口定义 ====================

/** 转职阶位 */
export enum ClassChangeTier {
  NONE = 0,        // 未转职
  TIER1 = 1,       // 一转
  ULTIMATE = 2     // 终极转职
}

/** 转职路线定义 */
export interface IClassChangeRoute {
  id: string                          // 转职 ID
  name: string                        // 转职名称
  description: string                 // 转职描述
  fromProfession: Profession          // 原职业
  toProfession: Profession            // 转职后职业
  tier: ClassChangeTier               // 转职阶位
  requirement?: {                     // 转职要求 (可选)
    minLevel?: number                 // 最低玩家等级
    specialCondition?: string         // 特殊条件描述
  }
  bonus?: {                           // 转职加成 (可选)
    attackPercent?: number            // 额外攻击力加成
    hpPercent?: number                // 额外生命值加成
    skillBonus?: string               // 技能强化描述
  }
  icon?: string                       // 转职图标资源名
}

/** 棋子转职状态 */
export interface IChessClassChangeState {
  tier: ClassChangeTier               // 当前转职阶位
  routeId?: string                    // 转职路线 ID
  newProfession?: Profession          // 转职后职业
  bonusStats?: IChessBaseStats        // 转职加成属性
}

// ==================== 转职路线配置 ====================

/**
 * 21 条转职路线配置
 * 
 * 一转路线 (12 条) + 终极转职路线 (9 条)
 */
export const ClassChangeRoutes: Record<string, IClassChangeRoute> = {
  // ==================== 汉军转职路线 ====================
  
  // --- 骑兵转职 ---
  'cavalry_to_lancer': {
    id: 'cavalry_to_lancer',
    name: '重装骑兵',
    description: '骑兵 → 重装骑兵，防御力大幅提升，冲锋伤害增加',
    fromProfession: Profession.CAVALRY,
    toProfession: Profession.CAVALRY, // 保持骑兵职业，但获得强化
    tier: ClassChangeTier.TIER1,
    bonus: { defensePercent: 0.5, attackPercent: 0.2 },
    icon: 'icon_lancer'
  },
  
  'cavalry_to_paladin': {
    id: 'cavalry_to_paladin',
    name: '圣骑士',
    description: '骑兵 → 圣骑士，获得治疗和护盾能力',
    fromProfession: Profession.CAVALRY,
    toProfession: Profession.CAVALRY,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { hpPercent: 0.4, attackPercent: 0.3 },
    skillBonus: '技能附带治疗效果',
    icon: 'icon_paladin'
  },
  
  'cavalry_to_dragon': {
    id: 'cavalry_to_dragon',
    name: '龙骑兵',
    description: '骑兵 → 龙骑兵，移动速度和攻击范围提升',
    fromProfession: Profession.CAVALRY,
    toProfession: Profession.CAVALRY,
    tier: ClassChangeTier.TIER1,
    bonus: { speed: 2, attackPercent: 0.25 },
    icon: 'icon_dragon'
  },
  
  // --- 弩兵转职 ---
  'archer_to_ranger': {
    id: 'archer_to_ranger',
    name: '游侠',
    description: '弩兵 → 游侠，射程和暴击率提升',
    fromProfession: Profession.ARCHER,
    toProfession: Profession.ARCHER,
    tier: ClassChangeTier.TIER1,
    bonus: { attackPercent: 0.3 },
    icon: 'icon_ranger'
  },
  
  'archer_to_sniper': {
    id: 'archer_to_sniper',
    name: '狙神',
    description: '弩兵 → 狙神，超远射程和单体爆发',
    fromProfession: Profession.ARCHER,
    toProfession: Profession.ARCHER,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { attackPercent: 0.5, range: 2 },
    skillBonus: '技能可秒杀低血量目标',
    icon: 'icon_sniper'
  },
  
  'archer_to_magearcher': {
    id: 'archer_to_magearcher',
    name: '魔箭手',
    description: '弩兵 → 魔箭手，攻击附带法术伤害',
    fromProfession: Profession.ARCHER,
    toProfession: Profession.ARCHER,
    tier: ClassChangeTier.TIER1,
    bonus: { attackPercent: 0.2 },
    icon: 'icon_magearcher'
  },
  
  // --- 车兵转职 ---
  'chariot_to_tank': {
    id: 'chariot_to_tank',
    name: '铁甲战车',
    description: '车兵 → 铁甲战车，极高防御和生命值',
    fromProfession: Profession.CHARIOT,
    toProfession: Profession.CHARIOT,
    tier: ClassChangeTier.TIER1,
    bonus: { defensePercent: 0.6, hpPercent: 0.3 },
    icon: 'icon_tank'
  },
  
  'chariot_to_fortress': {
    id: 'chariot_to_fortress',
    name: '移动堡垒',
    description: '车兵 → 移动堡垒，可为周围友军提供护盾',
    fromProfession: Profession.CHARIOT,
    toProfession: Profession.CHARIOT,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { defensePercent: 0.8, hpPercent: 0.5 },
    skillBonus: '技能为周围友军提供护盾',
    icon: 'icon_fortress'
  },
  
  // --- 谋士转职 ---
  'mage_to_sage': {
    id: 'mage_to_sage',
    name: '贤者',
    description: '谋士 → 贤者，技能伤害和能量获取提升',
    fromProfession: Profession.MAGE,
    toProfession: Profession.MAGE,
    tier: ClassChangeTier.TIER1,
    bonus: { attackPercent: 0.3 },
    icon: 'icon_sage'
  },
  
  'mage_to_archmage': {
    id: 'mage_to_archmage',
    name: '大法师',
    description: '谋士 → 大法师，群体伤害和控制能力',
    fromProfession: Profession.MAGE,
    toProfession: Profession.MAGE,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { attackPercent: 0.5 },
    skillBonus: '技能范围扩大 50%',
    icon: 'icon_archmage'
  },
  
  // --- 武将转职 ---
  'warrior_to_berserker': {
    id: 'warrior_to_berserker',
    name: '狂战士',
    description: '武将 → 狂战士，低血量时攻击力大幅提升',
    fromProfession: Profession.WARRIOR,
    toProfession: Profession.WARRIOR,
    tier: ClassChangeTier.TIER1,
    bonus: { attackPercent: 0.35 },
    icon: 'icon_berserker'
  },
  
  'warrior_to_swordsaint': {
    id: 'warrior_to_swordsaint',
    name: '剑圣',
    description: '武将 → 剑圣，极高暴击和闪避',
    fromProfession: Profession.WARRIOR,
    toProfession: Profession.WARRIOR,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { attackPercent: 0.5 },
    skillBonus: '技能必定暴击',
    icon: 'icon_swordsaint'
  },
  
  // ==================== 匈奴转职路线 ====================
  
  // --- 狼骑兵转职 ---
  'wolfcavalry_to_raider': {
    id: 'wolfcavalry_to_raider',
    name: '掠夺者',
    description: '狼骑兵 → 掠夺者，攻击速度和吸血提升',
    fromProfession: Profession.WOLF_CAVALRY,
    toProfession: Profession.WOLF_CAVALRY,
    tier: ClassChangeTier.TIER1,
    bonus: { attackPercent: 0.25 },
    icon: 'icon_raider'
  },
  
  'wolfcavalry_to_wolflord': {
    id: 'wolfcavalry_to_wolflord',
    name: '狼王',
    description: '狼骑兵 → 狼王，可召唤战狼协助作战',
    fromProfession: Profession.WOLF_CAVALRY,
    toProfession: Profession.WOLF_CAVALRY,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { attackPercent: 0.4, hpPercent: 0.3 },
    skillBonus: '技能召唤 2 只战狼',
    icon: 'icon_wolflord'
  },
  
  'wolfcavalry_to_hunter': {
    id: 'wolfcavalry_to_hunter',
    name: '猎人',
    description: '狼骑兵 → 猎人，对低血量目标额外伤害',
    fromProfession: Profession.WOLF_CAVALRY,
    toProfession: Profession.WOLF_CAVALRY,
    tier: ClassChangeTier.TIER1,
    bonus: { attackPercent: 0.2, speed: 1 },
    icon: 'icon_hunter'
  },
  
  // --- 弓骑兵转职 ---
  'mountedarcher_to_knight': {
    id: 'mountedarcher_to_knight',
    name: '骑士',
    description: '弓骑兵 → 骑士，攻防一体',
    fromProfession: Profession.MOUNTED_ARCHER,
    toProfession: Profession.MOUNTED_ARCHER,
    tier: ClassChangeTier.TIER1,
    bonus: { attackPercent: 0.25, defense: 10 },
    icon: 'icon_knight'
  },
  
  'mountedarcher_to_wind': {
    id: 'mountedarcher_to_wind',
    name: '风行者',
    description: '弓骑兵 → 风行者，极高移动速度和连射',
    fromProfession: Profession.MOUNTED_ARCHER,
    toProfession: Profession.MOUNTED_ARCHER,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { attackPercent: 0.4, speed: 3 },
    skillBonus: '技能可连续射击 5 次',
    icon: 'icon_wind'
  },
  
  // --- 萨满转职 ---
  'shaman_to_priest': {
    id: 'shaman_to_priest',
    name: '祭司',
    description: '萨满 → 祭司，更强治疗和增益',
    fromProfession: Profession.SHAMAN,
    toProfession: Profession.SHAMAN,
    tier: ClassChangeTier.TIER1,
    bonus: { hpPercent: 0.3 },
    icon: 'icon_priest'
  },
  
  'shaman_to_spiritmaster': {
    id: 'shaman_to_spiritmaster',
    name: '灵魂使者',
    description: '萨满 → 灵魂使者，可复活阵亡友军',
    fromProfession: Profession.SHAMAN,
    toProfession: Profession.SHAMAN,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { hpPercent: 0.5 },
    skillBonus: '技能有 20% 概率复活友军',
    icon: 'icon_spiritmaster'
  },
  
  // --- 勇士转职 ---
  'berserker_to_gladiator': {
    id: 'berserker_to_gladiator',
    name: '角斗士',
    description: '勇士 → 角斗士，竞技场霸主',
    fromProfession: Profession.BERSERKER,
    toProfession: Profession.BERSERKER,
    tier: ClassChangeTier.TIER1,
    bonus: { attackPercent: 0.3, hpPercent: 0.2 },
    icon: 'icon_gladiator'
  },
  
  'berserker_to_demon': {
    id: 'berserker_to_demon',
    name: '魔化战士',
    description: '勇士 → 魔化战士，血量越低越强',
    fromProfession: Profession.BERSERKER,
    toProfession: Profession.BERSERKER,
    tier: ClassChangeTier.ULTIMATE,
    bonus: { attackPercent: 0.5, hpPercent: 0.3 },
    skillBonus: '血量低于 30% 时攻击翻倍',
    icon: 'icon_demon'
  }
}

// ==================== 转职系统类 ====================

export class ClassChangeSystem {
  /**
   * 检查棋子是否可以转职
   * 
   * @param chessData 棋子数据
   * @param chessStar 棋子星级
   * @param currentTier 当前转职阶位
   * @returns 是否可转职
   */
  public static canChangeClass(
    chessData: IChessData,
    chessStar: number,
    currentTier: ClassChangeTier
  ): boolean {
    // 必须是 3 星
    if (chessStar !== 3) {
      return false
    }
    
    // 不能已经终极转职
    if (currentTier === ClassChangeTier.ULTIMATE) {
      return false
    }
    
    return true
  }
  
  /**
   * 获取棋子可进行的转职路线
   * 
   * @param chessData 棋子数据
   * @param currentTier 当前转职阶位
   * @returns 可用转职路线列表
   */
  public static getAvailableRoutes(
    chessData: IChessData,
    currentTier: ClassChangeTier
  ): IClassChangeRoute[] {
    const targetTier = currentTier === ClassChangeTier.NONE
      ? ClassChangeTier.TIER1
      : ClassChangeTier.ULTIMATE
    
    return Object.values(ClassChangeRoutes).filter(route => {
      return route.fromProfession === chessData.profession &&
        route.tier === targetTier
    })
  }
  
  /**
   * 执行转职
   * 
   * @param chessData 棋子数据
   * @param routeId 转职路线 ID
   * @returns 转职后的状态
   */
  public static changeClass(
    chessData: IChessData,
    routeId: string
  ): IChessClassChangeState | null {
    const route = ClassChangeRoutes[routeId]
    if (!route) {
      return null
    }
    
    // 验证是否符合转职条件
    if (chessData.profession !== route.fromProfession) {
      return null
    }
    
    // 计算转职加成
    const multiplier = route.tier === ClassChangeTier.TIER1
      ? CLASS_CHANGE_MULTIPLIERS.TIER1
      : CLASS_CHANGE_MULTIPLIERS.ULTIMATE
    
    const bonusStats = this.calculateBonusStats(chessData.baseStats, multiplier, route.bonus)
    
    return {
      tier: route.tier,
      routeId: route.id,
      newProfession: route.toProfession,
      bonusStats
    }
  }
  
  /**
   * 计算转职后的属性
   * 
   * @param baseStats 基础属性
   * @param star 星级
   * @param classChangeState 转职状态
   * @returns 最终属性
   */
  public static getFinalStats(
    baseStats: IChessBaseStats,
    star: number,
    classChangeState?: IChessClassChangeState
  ): IChessBaseStats {
    // 先计算升星
    const starMultiplier = star === 1 ? 1 : star === 2 ? 1.5 : 2.5
    let stats = {
      hp: Math.floor(baseStats.hp * starMultiplier),
      attack: Math.floor(baseStats.attack * starMultiplier),
      defense: Math.floor(baseStats.defense * starMultiplier),
      speed: baseStats.speed,
      range: baseStats.range,
      energyRegen: baseStats.energyRegen
    }
    
    // 再计算转职加成
    if (classChangeState && classChangeState.bonusStats) {
      stats = {
        hp: Math.floor(stats.hp * (classChangeState.bonusStats.hpMultiplier || 1)),
        attack: Math.floor(stats.attack * (classChangeState.bonusStats.attackMultiplier || 1)),
        defense: Math.floor(stats.defense * (classChangeState.bonusStats.defenseMultiplier || 1)),
        speed: stats.speed * (classChangeState.bonusStats.speedMultiplier || 1),
        range: stats.range + (classChangeState.bonusStats.rangeBonus || 0),
        energyRegen: stats.energyRegen
      }
    }
    
    return stats
  }
  
  /**
   * 获取转职描述
   * 
   * @param routeId 转职路线 ID
   * @returns 转职描述
   */
  public static getClassChangeDescription(routeId: string): string {
    const route = ClassChangeRoutes[routeId]
    return route ? route.description : '未知转职'
  }
  
  /**
   * 获取所有转职路线
   */
  public static getAllRoutes(): IClassChangeRoute[] {
    return Object.values(ClassChangeRoutes)
  }
  
  /**
   * 获取一转路线
   */
  public static getTier1Routes(): IClassChangeRoute[] {
    return Object.values(ClassChangeRoutes).filter(
      r => r.tier === ClassChangeTier.TIER1
    )
  }
  
  /**
   * 获取终极转职路线
   */
  public static getUltimateRoutes(): IClassChangeRoute[] {
    return Object.values(ClassChangeRoutes).filter(
      r => r.tier === ClassChangeTier.ULTIMATE
    )
  }
  
  // ==================== 私有方法 ====================
  
  /**
   * 计算转职加成属性
   */
  private static calculateBonusStats(
    baseStats: IChessBaseStats,
    multiplier: number,
    bonus?: IClassChangeRoute['bonus']
  ): IChessBaseStats {
    const stats: IChessBaseStats = {
      hp: Math.floor(baseStats.hp * multiplier),
      attack: Math.floor(baseStats.attack * multiplier),
      defense: Math.floor(baseStats.defense * multiplier),
      speed: baseStats.speed,
      range: baseStats.range,
      energyRegen: baseStats.energyRegen
    }
    
    if (bonus) {
      if (bonus.hpPercent) {
        stats.hp = Math.floor(stats.hp * (1 + bonus.hpPercent))
      }
      if (bonus.attackPercent) {
        stats.attack = Math.floor(stats.attack * (1 + bonus.attackPercent))
      }
      if (bonus.defensePercent) {
        stats.defense = Math.floor(stats.defense * (1 + bonus.defensePercent))
      }
      // ... 其他加成
    }
    
    return stats
  }
}

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 检查是否可以转职
 * if (ClassChangeSystem.canChangeClass(huoqubing, 3, ClassChangeTier.NONE)) {
 *   console.log('可以转职!')
 * }
 * 
 * // 获取可用转职路线
 * const routes = ClassChangeSystem.getAvailableRoutes(huoqubing, ClassChangeTier.NONE)
 * console.log('可转职为:', routes.map(r => r.name))
 * 
 * // 执行转职
 * const newState = ClassChangeSystem.changeClass(huoqubing, 'cavalry_to_paladin')
 * if (newState) {
 *   chess.classChangeState = newState
 *   console.log('转职成功!')
 * }
 * 
 * // 获取最终属性
 * const finalStats = ClassChangeSystem.getFinalStats(
 *   huoqubing.baseStats,
 *   3,
 *   newState
 * )
 * console.log('转职后属性:', finalStats)
 * ```
 */
