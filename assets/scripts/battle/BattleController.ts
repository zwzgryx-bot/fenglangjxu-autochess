/**
 * 封狼居胥 - 战斗场景控制器
 * 
 * 管理战斗场景的所有 UI 和逻辑:
 * - 棋盘和棋子显示
 * - 商店 UI
 * - 羁绊面板
 * - 战斗流程控制
 */

import { _decorator, Component, Node, Prefab, instantiate } from 'cc'
import { GameManager } from '../core/GameManager'
import { UIManager, openPage, setText, updatePageData } from '../core/UIManager'
import { BattleSystem } from './BattleSystem'
import { ShopSystem } from '../shop/ShopSystem'
import { SynergyCalculator } from './SynergyCalculator'

const { ccclass, property } = _decorator

@ccclass('BattleController')
export class BattleController extends Component {
  // UI 引用
  @property({ type: Node, tooltip: '顶部信息面板' })
  pnlTop: Node | null = null
  
  @property({ type: Node, tooltip: '左侧棋子列表' })
  pnlLeft: Node | null = null
  
  @property({ type: Node, tooltip: '右侧面板' })
  pnlRight: Node | null = null
  
  @property({ type: Node, tooltip: '底部商店面板' })
  pnlShop: Node | null = null
  
  @property({ type: Node, tooltip: '棋盘节点' })
  chessboard: Node | null = null
  
  @property({ type: Prefab, tooltip: '棋子预制体' })
  chessPrefab: Prefab | null = null
  
  @property({ type: Prefab, tooltip: '商店格子预制体' })
  shopSlotPrefab: Prefab | null = null
  
  // 系统引用
  private battleSystem: BattleSystem | null = null
  private shopSystem: ShopSystem | null = null
  private gameManager: GameManager | null = null
  
  onLoad() {
    console.log('[Battle] 战斗场景加载完成')
    
    // 初始化系统
    this.initializeSystems()
    
    // 初始化 UI
    this.initializeUI()
    
    // 开始战斗
    this.startBattle()
  }
  
  /**
   * 初始化系统
   */
  private initializeSystems(): void {
    // 获取游戏管理器
    this.gameManager = GameManager.getInstance()
    
    // 创建战斗系统
    this.battleSystem = new BattleSystem({
      boardWidth: 1200,
      boardHeight: 800,
      attackInterval: 1.0,
      moveSpeed: 1.0
    })
    
    // 设置战斗回调
    this.battleSystem.onBattleStart = () => {
      console.log('[Battle] 战斗开始')
    }
    
    this.battleSystem.onBattleEnd = (result) => {
      console.log(`[Battle] 战斗结束：${result.winner} 获胜`)
      this.onBattleEnd(result.winner === 'friendly')
    }
    
    // 创建商店系统
    // this.shopSystem = new ShopSystem(allChessData)
  }
  
  /**
   * 初始化 UI
   */
  private initializeUI(): void {
    // 初始化 UI 管理器
    UIManager.getInstance().initialize(this.node)
    
    // 创建棋子预制体
    this.createChessOnBoard('huoqubing', { x: 300, y: 400 })
    this.createChessOnBoard('weiqing', { x: 400, y: 400 })
    this.createChessOnBoard('liguang', { x: 500, y: 400 })
    
    // 创建商店格子
    this.createShopSlots()
    
    // 更新 UI 显示
    this.updateUI()
  }
  
  /**
   * 开始战斗
   */
  private startBattle(): void {
    console.log('[Battle] 开始战斗')
    
    // TODO: 设置友军和敌军棋子
    const friendlyChess = []
    const enemyChess = []
    
    if (this.battleSystem) {
      this.battleSystem.startBattle(friendlyChess, enemyChess)
    }
  }
  
  /**
   * 在棋盘上创建棋子
   */
  private createChessOnBoard(chessId: string, position: { x: number; y: number }): Node | null {
    if (!this.chessPrefab) {
      console.warn('[Battle] Chess 预制体未设置')
      return null
    }
    
    if (!this.chessboard) {
      console.warn('[Battle] 棋盘未设置')
      return null
    }
    
    // 实例化棋子
    const chessNode = instantiate(this.chessPrefab)
    chessNode.parent = this.chessboard
    chessNode.setPosition(position.x, position.y, 0)
    
    // TODO: 设置棋子数据
    // chessNode.getComponent(Chess)?.setData(chessId)
    
    console.log(`[Battle] 创建棋子：${chessId}`)
    return chessNode
  }
  
  /**
   * 创建商店格子
   */
  private createShopSlots(): void {
    if (!this.pnlShop || !this.shopSlotPrefab) {
      console.warn('[Battle] 商店面板或预制体未设置')
      return
    }
    
    // 创建 5 个商店格子
    for (let i = 0; i < 5; i++) {
      const slotNode = instantiate(this.shopSlotPrefab)
      slotNode.parent = this.pnlShop
      slotNode.setPosition(i * 110 - 220, 0, 0)
      
      // TODO: 设置商店格子数据
    }
    
    console.log('[Battle] 创建商店格子完成')
  }
  
  /**
   * 更新 UI 显示
   */
  private updateUI(): void {
    // 更新回合数
    setText('pnlTop/lblRound', '第 1 回合')
    
    // 更新时间
    setText('pnlTop/lblTimer', '30')
    
    // 更新金币
    setText('pnlShop/lblGold', '50')
  }
  
  /**
   * 刷新商店
   */
  public refreshShop(): void {
    console.log('[Battle] 刷新商店')
    
    // TODO: 实际刷新逻辑
    if (this.shopSystem) {
      // this.shopSystem.refresh()
    }
  }
  
  /**
   * 升级人口
   */
  public levelUp(): void {
    console.log('[Battle] 升级人口')
    
    if (this.gameManager) {
      // this.gameManager.levelUp()
    }
  }
  
  /**
   * 购买棋子
   * 
   * @param slotIndex 格子索引
   */
  public buyChess(slotIndex: number): void {
    console.log('[Battle] 购买棋子:', slotIndex)
    
    if (this.gameManager) {
      // this.gameManager.buyChess(slotIndex)
    }
  }
  
  /**
   * 战斗结束处理
   */
  private onBattleEnd(isWin: boolean): void {
    console.log('[Battle] 战斗结束:', isWin ? '胜利' : '失败')
    
    // 显示结果
    if (isWin) {
      setText('pnlTop/lblResult', '胜利!')
    } else {
      setText('pnlTop/lblResult', '失败')
    }
    
    // 3 秒后返回大厅
    setTimeout(() => {
      this.returnToLobby()
    }, 3000)
  }
  
  /**
   * 返回大厅
   */
  private returnToLobby(): void {
    console.log('[Battle] 返回大厅')
    // TODO: 加载 lobby.scene
  }
  
  // ==================== 更新循环 ====================
  
  update(dt: number) {
    // 更新战斗系统
    if (this.battleSystem) {
      this.battleSystem.update(dt)
    }
    
    // 更新倒计时
    this.updateTimer(dt)
  }
  
  /**
   * 更新倒计时
   */
  private updateTimer(dt: number): void {
    // TODO: 更新倒计时显示
  }
  
  onDestroy() {
    console.log('[Battle] 战斗场景销毁')
    
    // 清理战斗系统
    if (this.battleSystem) {
      // this.battleSystem.cleanup()
    }
    
    // 清理 UI 管理器
    UIManager.getInstance().cleanup()
  }
}

/**
 * 使用示例:
 * 
 * 1. 创建 battle.scene 场景
 * 2. 创建空节点"Battle"
 * 3. 添加 BattleController 组件
 * 4. 绑定所有 UI 引用
 * 5. 设置 chessPrefab 和 shopSlotPrefab
 * 6. 运行场景
 */
