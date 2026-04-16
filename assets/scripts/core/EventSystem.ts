/**
 * 封狼居胥 - 事件系统
 * 
 * 全局事件总线：
 * - 发布/订阅模式
 * - 事件优先级
 * - 一次性事件
 * - 事件池优化
 */

// ==================== 类型定义 ====================

/** 事件回调函数类型 */
export type EventCallback<T = any> = (data: T) => void

/** 事件订阅项 */
interface IEventSubscription {
  callback: EventCallback
  priority: number          // 优先级 (数字越大越优先)
  once: boolean             // 是否一次性
}

/** 事件池项 */
interface IEventPoolItem {
  name: string
  data?: any
  timestamp: number
}

// ==================== 事件常量定义 ====================

/** 游戏事件枚举 */
export enum GameEventType {
  // 游戏流程
  GAME_START = 'game:start',
  GAME_END = 'game:end',
  ROUND_START = 'round:start',
  ROUND_END = 'round:end',
  PHASE_CHANGE = 'game:phase_change',
  
  // 经济系统
  GOLD_CHANGE = 'economy:gold_change',
  SHOP_REFRESH = 'shop:refresh',
  CHESS_BUY = 'shop:chess_buy',
  CHESS_SELL = 'shop:chess_sell',
  LEVEL_UP = 'economy:level_up',
  
  // 棋子相关
  CHESS_ADD = 'chess:add',
  CHESS_REMOVE = 'chess:remove',
  CHESS_UPGRADE = 'chess:upgrade',
  CHESS_STAR_UP = 'chess:star_up',
  CHESS_CLASS_CHANGE = 'chess:class_change',
  CHESS_DEATH = 'chess:death',
  CHESS_SKILL = 'chess:skill',
  
  // 战斗相关
  BATTLE_START = 'battle:start',
  BATTLE_END = 'battle:end',
  BATTLE_DAMAGE = 'battle:damage',
  BATTLE_HEAL = 'battle:heal',
  BATTLE_BUFF_ADD = 'battle:buff_add',
  BATTLE_BUFF_REMOVE = 'battle:buff_remove',
  
  // 羁绊系统
  BOND_ACTIVATE = 'bond:activate',
  BOND_DEACTIVATE = 'bond:deactivate',
  
  // UI 相关
  UI_SHOW = 'ui:show',
  UI_HIDE = 'ui:hide',
  UI_UPDATE = 'ui:update'
}

// ==================== 事件系统类 ====================

export class EventSystem {
  // ==================== 单例模式 ====================
  
  private static instance: EventSystem | null = null
  
  public static getInstance(): EventSystem {
    if (!this.instance) {
      this.instance = new EventSystem()
    }
    return this.instance
  }
  
  // ==================== 私有属性 ====================
  
  /** 事件映射表 */
  private events: Map<string, IEventSubscription[]> = new Map()
  
  /** 事件池 (用于调试) */
  private eventPool: IEventPoolItem[] = []
  
  /** 事件池最大容量 */
  private readonly POOL_CAPACITY = 100
  
  /** 是否在触发中 (防止递归) */
  private isEmitting: boolean = false
  
  /** 待发事件队列 */
  private pendingEvents: Array<{ name: string; data?: any }> = []
  
  // ==================== 订阅方法 ====================
  
  /**
   * 订阅事件
   * 
   * @param eventName 事件名称
   * @param callback 回调函数
   * @param priority 优先级 (默认 0)
   * @returns 取消订阅函数
   */
  public on<T = any>(
    eventName: string,
    callback: EventCallback<T>,
    priority: number = 0
  ): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, [])
    }
    
    const subscription: IEventSubscription = {
      callback,
      priority,
      once: false
    }
    
    const subscriptions = this.events.get(eventName)!
    subscriptions.push(subscription)
    
    // 按优先级排序
    subscriptions.sort((a, b) => b.priority - a.priority)
    
    // 返回取消订阅函数
    return () => this.off(eventName, callback)
  }
  
  /**
   * 订阅一次性事件
   * 
   * @param eventName 事件名称
   * @param callback 回调函数
   * @param priority 优先级
   * @returns 取消订阅函数
   */
  public once<T = any>(
    eventName: string,
    callback: EventCallback<T>,
    priority: number = 0
  ): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, [])
    }
    
    const subscription: IEventSubscription = {
      callback,
      priority,
      once: true
    }
    
    const subscriptions = this.events.get(eventName)!
    subscriptions.push(subscription)
    subscriptions.sort((a, b) => b.priority - a.priority)
    
    // 返回取消订阅函数
    return () => this.off(eventName, callback)
  }
  
  /**
   * 取消订阅
   * 
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  public off<T = any>(eventName: string, callback: EventCallback<T>): void {
    const subscriptions = this.events.get(eventName)
    if (!subscriptions) return
    
    const index = subscriptions.findIndex(s => s.callback === callback)
    if (index !== -1) {
      subscriptions.splice(index, 1)
    }
    
    // 清空空数组
    if (subscriptions.length === 0) {
      this.events.delete(eventName)
    }
  }
  
  /**
   * 取消所有订阅
   * 
   * @param eventName 事件名称 (可选，不传则清空所有)
   */
  public offAll(eventName?: string): void {
    if (eventName) {
      this.events.delete(eventName)
    } else {
      this.events.clear()
    }
  }
  
  // ==================== 触发方法 ====================
  
  /**
   * 触发事件
   * 
   * @param eventName 事件名称
   * @param data 事件数据
   */
  public emit<T = any>(eventName: string, data?: T): void {
    // 记录事件 (用于调试)
    this.recordEvent(eventName, data)
    
    // 如果正在触发中，加入队列
    if (this.isEmitting) {
      this.pendingEvents.push({ name: eventName, data })
      return
    }
    
    this.isEmitting = true
    
    try {
      const subscriptions = this.events.get(eventName)
      if (!subscriptions || subscriptions.length === 0) {
        return
      }
      
      // 复制一份，防止回调中修改订阅列表
      const subscriptionsCopy = [...subscriptions]
      
      // 按优先级触发
      for (const subscription of subscriptionsCopy) {
        // 检查是否已被移除
        if (!subscriptions.includes(subscription)) {
          continue
        }
        
        try {
          subscription.callback(data)
        } catch (error) {
          console.error(`事件回调错误：${eventName}`, error)
        }
        
        // 一次性事件，触发后移除
        if (subscription.once) {
          this.off(eventName, subscription.callback)
        }
      }
    } finally {
      this.isEmitting = false
      
      // 处理待发事件
      while (this.pendingEvents.length > 0) {
        const event = this.pendingEvents.shift()!
        this.emit(event.name, event.data)
      }
    }
  }
  
  /**
   * 触发事件 (带延迟)
   * 
   * @param eventName 事件名称
   * @param data 事件数据
   * @param delay 延迟时间 (毫秒)
   */
  public emitDelay<T = any>(eventName: string, data: T, delay: number): void {
    setTimeout(() => {
      this.emit(eventName, data)
    }, delay)
  }
  
  // ==================== 查询方法 ====================
  
  /**
   * 获取事件的订阅数量
   * 
   * @param eventName 事件名称
   */
  public getListenerCount(eventName: string): number {
    const subscriptions = this.events.get(eventName)
    return subscriptions ? subscriptions.length : 0
  }
  
  /**
   * 检查是否有订阅
   * 
   * @param eventName 事件名称
   */
  public hasListener(eventName: string): boolean {
    const subscriptions = this.events.get(eventName)
    return subscriptions ? subscriptions.length > 0 : false
  }
  
  /**
   * 获取所有事件名称
   */
  public getAllEventNames(): string[] {
    return Array.from(this.events.keys())
  }
  
  /**
   * 获取事件历史 (用于调试)
   * 
   * @param limit 数量限制
   */
  public getEventHistory(limit: number = 20): IEventPoolItem[] {
    return this.eventPool.slice(-limit)
  }
  
  // ==================== 私有方法 ====================
  
  /**
   * 记录事件 (用于调试)
   */
  private recordEvent(name: string, data?: any): void {
    this.eventPool.push({
      name,
      data,
      timestamp: Date.now()
    })
    
    // 限制池大小
    if (this.eventPool.length > this.POOL_CAPACITY) {
      this.eventPool.shift()
    }
  }
  
  /**
   * 清空事件池
   */
  public clearEventPool(): void {
    this.eventPool = []
  }
}

// ==================== 便捷函数 ====================

/**
 * 全局事件实例
 */
export const eventBus = EventSystem.getInstance()

/**
 * 订阅事件 (便捷函数)
 */
export const on = eventBus.on.bind(eventBus)
export const once = eventBus.once.bind(eventBus)
export const off = eventBus.off.bind(eventBus)
export const offAll = eventBus.offAll.bind(eventBus)
export const emit = eventBus.emit.bind(eventBus)
export const emitDelay = eventBus.emitDelay.bind(eventBus)

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * // 方式 1: 使用实例
 * const eventSystem = EventSystem.getInstance()
 * 
 * // 订阅事件
 * eventSystem.on('chess:death', (chess) => {
 *   console.log(`${chess.name} 阵亡`)
 * })
 * 
 * // 订阅一次性事件
 * eventSystem.once('battle:end', (result) => {
 *   console.log(`战斗结束：${result}`)
 * })
 * 
 * // 订阅带优先级的事件
 * eventSystem.on('ui:update', updateUI, 10) // 高优先级
 * eventSystem.on('ui:update', logUpdate, 1)  // 低优先级
 * 
 * // 触发事件
 * eventSystem.emit('chess:death', chess)
 * eventSystem.emit('battle:end', { win: true })
 * 
 * // 取消订阅
 * eventSystem.off('chess:death', callback)
 * eventSystem.offAll() // 取消所有
 * 
 * // 方式 2: 使用便捷函数
 * on('shop:refresh', (slots) => {
 *   console.log('商店刷新:', slots)
 * })
 * 
 * emit('shop:refresh', shopSlots)
 * 
 * // 查看事件历史 (调试用)
 * const history = eventSystem.getEventHistory()
 * console.log('最近事件:', history)
 * ```
 */
