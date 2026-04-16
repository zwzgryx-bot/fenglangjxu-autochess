/**
 * 封狼居胥 - 商店 UI 控制器
 * 
 * 管理商店界面的显示和交互:
 * - 刷新商店
 * - 购买棋子
 * - 锁定棋子
 * - 显示费用
 */

import { _decorator, Component, Node, Label, Button, Sprite, Color } from 'cc'
import { EventSystem } from '../core/EventSystem'
import { ShopSystem, IShopSlot } from '../shop/ShopSystem'
import { EconomySystem } from '../economy/EconomySystem'
import { ChessData } from '../chess/ChessData'

const { ccclass, property } = _decorator

/**
 * 商店格子 UI 组件
 */
@ccclass('ShopSlotUI')
export class ShopSlotUI extends Component {
  @property({ type: Label, tooltip: '费用标签' })
  lblCost: Label | null = null
  
  @property({ type: Label, tooltip: '棋子池数量标签' })
  lblCount: Label | null = null
  
  @property({ type: Sprite, tooltip: '棋子图标' })
  spriteIcon: Sprite | null = null
  
  @property({ type: Button, tooltip: '购买按钮' })
  btnBuy: Button | null = null
  
  @property({ type: Node, tooltip: '锁定图标节点' })
  lockIcon: Node | null = null
  
  @property({ type: Sprite, tooltip: '背景框' })
  bgSprite: Sprite | null = null
  
  private chessData: ChessData | null = null
  private cost: number = 0
  private countInPool: number = 0
  private isLocked: boolean = false
  private slotIndex: number = -1

  start() {
    if (this.btnBuy) {
      this.btnBuy.node.on(Button.EventType.CLICK, this.onClickBuy, this)
    }
  }

  /**
   * 初始化商店格子
   */
  public initialize(slotIndex: number, chessData: ChessData, cost: number, countInPool: number): void {
    this.slotIndex = slotIndex
    this.chessData = chessData
    this.cost = cost
    this.countInPool = countInPool
    
    this.updateUI()
  }

  /**
   * 更新 UI 显示
   */
  private updateUI(): void {
    if (!this.chessData) return
    
    // 更新费用
    if (this.lblCost) {
      this.lblCost.string = `${this.cost}`
    }
    
    // 更新棋子池数量
    if (this.lblCount) {
      this.lblCount.string = `${this.countInPool}`
    }
    
    // 更新图标 (临时用颜色代替)
    if (this.bgSprite && this.chessData) {
      // 根据稀有度设置颜色
      const rarityColors = {
        common: new Color(200, 200, 200),      // 灰色
        uncommon: new Color(100, 200, 100),    // 绿色
        rare: new Color(100, 150, 255),        // 蓝色
        epic: new Color(200, 100, 255),        // 紫色
        legendary: new Color(255, 200, 100),   // 橙色
        mythic: new Color(255, 50, 100)        // 红色
      }
      this.bgSprite.color = rarityColors[this.chessData.rarity] || Color.WHITE
    }
    
    // 更新锁定状态
    if (this.lockIcon) {
      this.lockIcon.active = this.isLocked
    }
  }

  /**
   * 点击购买按钮
   */
  private onClickBuy(): void {
    if (!this.chessData) return
    
    console.log(`[ShopSlot] 购买棋子：${this.chessData.name}`)
    EventSystem.emit('shop:buy_chess', {
      slotIndex: this.slotIndex,
      chessId: this.chessData.id,
      cost: this.cost
    })
  }

  /**
   * 设置锁定状态
   */
  public setLocked(locked: boolean): void {
    this.isLocked = locked
    if (this.lockIcon) {
      this.lockIcon.active = locked
    }
  }

  /**
   * 更新棋子池数量
   */
  public updateCount(count: number): void {
    this.countInPool = count
    if (this.lblCount) {
      this.lblCount.string = `${count}`
    }
  }
}

/**
 * 商店面板控制器
 */
@ccclass('ShopController')
export class ShopController extends Component {
  @property({ type: Node, tooltip: '商店格子容器' })
  shopContainer: Node | null = null
  
  @property({ type: Button, tooltip: '刷新按钮' })
  btnRefresh: Button | null = null
  
  @property({ type: Button, tooltip: '升级按钮' })
  btnLevelUp: Button | null = null
  
  @property({ type: Button, tooltip: '锁定商店按钮' })
  btnLock: Button | null = null
  
  @property({ type: Label, tooltip: '金币标签' })
  lblGold: Label | null = null
  
  @property({ type: Label, tooltip: '刷新费用标签' })
  lblRefreshCost: Label | null = null
  
  @property({ type: Label, tooltip: '升级费用标签' })
  lblLevelUpCost: Label | null = null
  
  @property({ type: Prefab, tooltip: '商店格子预制体' })
  shopSlotPrefab: any = null
  
  private shopSlots: ShopSlotUI[] = []
  private shopSystem: ShopSystem | null = null
  private economySystem: EconomySystem | null = null
  private isShopLocked: boolean = false
  private refreshCost: number = 2

  start() {
    this.shopSystem = ShopSystem.getInstance()
    this.economySystem = EconomySystem.getInstance()
    
    this.bindEvents()
    this.createShopSlots()
    this.updateUI()
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    if (this.btnRefresh) {
      this.btnRefresh.node.on(Button.EventType.CLICK, this.onClickRefresh, this)
    }
    
    if (this.btnLevelUp) {
      this.btnLevelUp.node.on(Button.EventType.CLICK, this.onClickLevelUp, this)
    }
    
    if (this.btnLock) {
      this.btnLock.node.on(Button.EventType.CLICK, this.onClickLock, this)
    }
    
    // 监听购买事件
    EventSystem.on('shop:buy_chess', this.onBuyChess, this)
    
    // 监听金币变化
    EventSystem.on('gold_change', this.updateGold, this)
  }

  /**
   * 创建商店格子
   */
  private createShopSlots(): void {
    if (!this.shopContainer || !this.shopSlotPrefab) {
      console.warn('[ShopController] 商店容器或预制体未设置')
      return
    }
    
    // 创建 5 个商店格子
    for (let i = 0; i < 5; i++) {
      const slotNode = new Node(`Slot${i}`)
      slotNode.parent = this.shopContainer
      
      // 添加 ShopSlotUI 组件
      const slotUI = slotNode.addComponent(ShopSlotUI)
      this.shopSlots.push(slotUI)
      
      // TODO: 创建子节点 (bg, icon, lblCost, lblCount, btnBuy, lockIcon)
      // 这里简化处理，实际需要在 Cocos Creator 中手动创建
    }
    
    console.log('[ShopController] 创建商店格子完成')
  }

  /**
   * 刷新商店
   */
  private onClickRefresh(): void {
    if (!this.economySystem) return
    
    if (this.economySystem.spendGold(this.refreshCost)) {
      this.refreshShop()
      EventSystem.emit('gold_change', { gold: this.economySystem.getCurrentGold() })
      EventSystem.emit('audio:play_sfx', { sfx: 'shop_refresh' })
    } else {
      EventSystem.emit('ui:show_toast', { message: '金币不足' })
    }
  }

  /**
   * 升级人口
   */
  private onClickLevelUp(): void {
    console.log('[ShopController] 点击升级')
    EventSystem.emit('shop:level_up')
  }

  /**
   * 锁定商店
   */
  private onClickLock(): void {
    this.isShopLocked = !this.isShopLocked
    
    if (this.isShopLocked) {
      this.shopSystem?.lockShop()
      EventSystem.emit('ui:show_toast', { message: '商店已锁定' })
    } else {
      this.shopSystem?.unlockShop()
      EventSystem.emit('ui:show_toast', { message: '商店已解锁' })
    }
    
    // 更新按钮状态
    if (this.btnLock) {
      this.btnLock.node.setScale(this.isShopLocked ? 1.1 : 1.0)
    }
  }

  /**
   * 刷新商店 UI
   */
  public refreshShop(): void {
    if (!this.shopSystem) return
    
    const shopData = this.shopSystem.refreshShop()
    this.updateShopSlots(shopData.slots)
    
    console.log('[ShopController] 商店刷新完成')
  }

  /**
   * 更新商店格子显示
   */
  private updateShopSlots(slots: IShopSlot[]): void {
    for (let i = 0; i < Math.min(slots.length, this.shopSlots.length); i++) {
      const slot = slots[i]
      const slotUI = this.shopSlots[i]
      
      // 获取棋子数据
      const chessData = ChessData.getChessById(slot.chessId)
      
      if (chessData && slotUI) {
        slotUI.initialize(i, chessData, slot.cost, slot.chessData.countInPool)
        slotUI.setLocked(slot.locked || false)
      }
    }
  }

  /**
   * 购买棋子回调
   */
  private onBuyChess(data: { slotIndex: number; chessId: string; cost: number }): void {
    console.log('[ShopController] 购买棋子:', data.chessId)
    
    // TODO: 执行购买逻辑
    EventSystem.emit('ui:show_toast', { message: `购买 ${data.chessId}` })
  }

  /**
   * 更新金币显示
   */
  private updateGold(data: { gold: number }): void {
    if (this.lblGold) {
      this.lblGold.string = `${data.gold}`
    }
  }

  /**
   * 更新 UI
   */
  private updateUI(): void {
    if (this.lblRefreshCost) {
      this.lblRefreshCost.string = `${this.refreshCost}`
    }
    
    if (this.lblLevelUpCost) {
      this.lblLevelUpCost.string = '4' // 假设升级费用为 4
    }
    
    if (this.lblGold && this.economySystem) {
      this.lblGold.string = `${this.economySystem.getCurrentGold()}`
    }
  }

  onDestroy() {
    EventSystem.off('shop:buy_chess', this.onBuyChess, this)
    EventSystem.off('gold_change', this.updateGold, this)
  }
}

/**
 * 使用示例:
 * 
 * 1. 创建 ShopPanel.prefab:
 *    - ShopPanel (Node)
 *      - shopContainer (Node)
 *        - Slot0, Slot1, Slot2, Slot3, Slot4 (Node)
 *      - btnRefresh (Button)
 *      - btnLevelUp (Button)
 *      - btnLock (Button)
 *      - lblGold (Label)
 *      - lblRefreshCost (Label)
 *      - lblLevelUpCost (Label)
 * 
 * 2. 添加 ShopController 组件
 * 3. 创建 ShopSlotUI 预制体
 * 4. 绑定所有属性
 */
