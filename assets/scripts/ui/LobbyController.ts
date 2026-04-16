import { _decorator, Component, Node, Label, Button, systemEvent, SystemEventType } from 'cc'
import { GameManager } from '../core/GameManager'
import { EventSystem } from '../core/EventSystem'
import { SaveSystem } from '../utils/SaveSystem'

const { ccclass, property } = _decorator

/**
 * 大厅场景控制器
 * 功能：匹配对手、查看棋子、选择模式
 */
@ccclass('LobbyController')
export class LobbyController extends Component {
  @property
  btnMatch: Button | null = null

  @property
  btnPractice: Button | null = null

  @property
  btnChessCollection: Button | null = null

  @property
  btnBattleRecord: Button | null = null

  @property
  btnShop: Button | null = null

  @property
  btnSettings: Button | null = null

  @property
  lblPlayerLevel: Label | null = null

  @property
  lblGold: Label | null = null

  @property
  lblChessDisplay: Label | null = null

  @property
  panelThemes: Node | null = null

  private playerLevel: number = 1
  private playerGold: number = 0

  start() {
    this.initializeData()
    this.bindEvents()
    this.updateUI()
  }

  /**
   * 初始化数据
   */
  private initializeData() {
    const playerData = SaveSystem.getInstance().getPlayerData()
    this.playerLevel = playerData.level
    this.playerGold = playerData.gold
  }

  /**
   * 绑定事件
   */
  private bindEvents() {
    if (this.btnMatch) {
      this.btnMatch.node.on(Button.EventType.CLICK, this.onClickMatch, this)
    }

    if (this.btnPractice) {
      this.btnPractice.node.on(Button.EventType.CLICK, this.onClickPractice, this)
    }

    if (this.btnChessCollection) {
      this.btnChessCollection.node.on(Button.EventType.CLICK, this.onClickChessCollection, this)
    }

    if (this.btnBattleRecord) {
      this.btnBattleRecord.node.on(Button.EventType.CLICK, this.onClickBattleRecord, this)
    }

    if (this.btnShop) {
      this.btnShop.node.on(Button.EventType.CLICK, this.onClickShop, this)
    }

    if (this.btnSettings) {
      this.btnSettings.node.on(Button.EventType.CLICK, this.onClickSettings, this)
    }
  }

  /**
   * 更新 UI 显示
   */
  private updateUI() {
    if (this.lblPlayerLevel) {
      this.lblPlayerLevel.string = `LV.${this.playerLevel}`
    }

    if (this.lblGold) {
      this.lblGold.string = `${this.playerGold}`
    }

    if (this.lblChessDisplay) {
      const randomChess = this.getRandomChess()
      this.lblChessDisplay.string = `今日推荐：${randomChess.name}`
    }
  }

  /**
   * 获取随机棋子用于展示
   */
  private getRandomChess(): { name: string } {
    const chessList = [
      { name: '霍去病' },
      { name: '卫青' },
      { name: '李广' },
      { name: '匈奴单于' },
      { name: '冒顿单于' }
    ]
    return chessList[Math.floor(Math.random() * chessList.length)]
  }

  // ==================== 按钮点击事件 ====================

  /**
   * 点击匹配按钮
   */
  private async onClickMatch() {
    console.log('[Lobby] 开始匹配...')
    
    EventSystem.emit('show_loading', { message: '匹配对手中...' })
    
    try {
      await GameManager.getInstance().startMatchmaking()
      
      setTimeout(() => {
        EventSystem.emit('hide_loading')
        GameManager.getInstance().enterBattle()
      }, 1000)
    } catch (error) {
      console.error('[Lobby] 匹配失败:', error)
      EventSystem.emit('hide_loading')
      EventSystem.emit('show_toast', { message: '匹配失败，请重试' })
    }
  }

  /**
   * 点击练习模式按钮
   */
  private onClickPractice() {
    console.log('[Lobby] 进入练习模式')
    GameManager.getInstance().enterBattle(true)
  }

  /**
   * 点击棋子收藏按钮
   */
  private onClickChessCollection() {
    console.log('[Lobby] 打开棋子收藏')
    EventSystem.emit('open_panel', { panel: 'chess_collection' })
  }

  /**
   * 点击战记按钮
   */
  private onClickBattleRecord() {
    console.log('[Lobby] 查看战记')
    EventSystem.emit('open_panel', { panel: 'battle_record' })
  }

  /**
   * 点击商店按钮
   */
  private onClickShop() {
    console.log('[Lobby] 打开商店')
    EventSystem.emit('open_panel', { panel: 'shop' })
  }

  /**
   * 点击设置按钮
   */
  private onClickSettings() {
    console.log('[Lobby] 打开设置')
    EventSystem.emit('open_panel', { panel: 'settings' })
  }

  /**
   * 返回主菜单
   */
  public goBack() {
    console.log('[Lobby] 返回主菜单')
    GameManager.getInstance().showMainMenu()
  }

  /**
   * 更新玩家金币显示
   */
  public updateGold(gold: number) {
    this.playerGold = gold
    if (this.lblGold) {
      this.lblGold.string = `${gold}`
    }
  }

  /**
   * 更新玩家等级显示
   */
  public updateLevel(level: number) {
    this.playerLevel = level
    if (this.lblPlayerLevel) {
      this.lblPlayerLevel.string = `LV.${level}`
    }
  }
}
