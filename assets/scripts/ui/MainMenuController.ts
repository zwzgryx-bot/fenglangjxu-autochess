/**
 * 封狼居胥 - 主菜单场景控制器
 * 
 * 处理主菜单 UI 和交互：
 * - 开始游戏
 * - 设置
 * - 换肤选择
 * - 玩家信息显示
 */

import { _decorator, Component, Node, Button, Label, Sprite, Color } from 'cc'
import { GameManager } from './core/GameManager'
import { UIManager, openPage } from './core/UIManager'
import { SaveSystem, getPlayerData } from './utils/SaveSystem'
import { ThemeManager, switchTheme, getAllThemes } from './core/ThemeManager'

const { ccclass, property } = _decorator

@ccclass('MainMenuController')
export class MainMenuController extends Component {
  // UI 引用
  @property({ type: Button, tooltip: '开始游戏按钮' })
  btnStart: Button | null = null
  
  @property({ type: Button, tooltip: '设置按钮' })
  btnSettings: Button | null = null
  
  @property({ type: Button, tooltip: '棋子收藏按钮' })
  btnCollection: Button | null = null
  
  @property({ type: Button, tooltip: '换肤按钮' })
  btnSkin: Button | null = null
  
  @property({ type: Label, tooltip: '玩家名称' })
  lblPlayerName: Label | null = null
  
  @property({ type: Label, tooltip: '玩家等级' })
  lblPlayerLevel: Label | null = null
  
  @property({ type: Label, tooltip: '金币数量' })
  lblGold: Label | null = null
  
  @property({ type: Node, tooltip: '主题选择面板' })
  panelThemes: Node | null = null
  
  onLoad() {
    console.log('[MainMenu] 主菜单加载完成')
    
    // 初始化 UI 管理器
    UIManager.getInstance().initialize(this.node)
    
    // 绑定按钮事件
    this.bindEvents()
    
    // 更新玩家信息显示
    this.updatePlayerInfo()
    
    // 加载主题列表
    this.loadThemeList()
  }
  
  start() {
    // 播放入场动画
    this.animateIn()
  }
  
  /**
   * 绑定按钮事件
   */
  private bindEvents(): void {
    // 开始游戏
    this.btnStart?.node.on(Button.EventType.CLICK, this.onStartGame, this)
    
    // 设置
    this.btnSettings?.node.on(Button.EventType.CLICK, this.onSettings, this)
    
    // 棋子收藏
    this.btnCollection?.node.on(Button.EventType.CLICK, this.onCollection, this)
    
    // 换肤
    this.btnSkin?.node.on(Button.EventType.CLICK, this.onSkin, this)
  }
  
  /**
   * 更新玩家信息显示
   */
  private updatePlayerInfo(): void {
    const player = getPlayerData()
    if (!player) return
    
    if (this.lblPlayerName) {
      this.lblPlayerName.string = player.playerName
    }
    
    if (this.lblPlayerLevel) {
      this.lblPlayerLevel.string = `Lv.${player.playerLevel}`
    }
    
    if (this.lblGold) {
      this.lblGold.string = player.gold.toString()
    }
  }
  
  /**
   * 加载主题列表
   */
  private loadThemeList(): void {
    const themes = getAllThemes()
    console.log('[MainMenu] 可用主题:', themes)
    
    // TODO: 动态生成主题选择按钮
  }
  
  // ==================== 按钮事件处理 ====================
  
  /**
   * 开始游戏按钮
   */
  private onStartGame(): void {
    console.log('[MainMenu] 开始游戏')
    
    // 进入游戏大厅
    const gameManager = GameManager.getInstance()
    gameManager.startGame(8)
    
    // 切换场景
    // 这里应该加载 lobby.scene
  }
  
  /**
   * 设置按钮
   */
  private onSettings(): void {
    console.log('[MainMenu] 打开设置')
    openPage('settings')
  }
  
  /**
   * 棋子收藏按钮
   */
  private onCollection(): void {
    console.log('[MainMenu] 打开棋子收藏')
    // TODO: 打开收藏界面
  }
  
  /**
   * 换肤按钮
   */
  private onSkin(): void {
    console.log('[MainMenu] 打开换肤界面')
    
    // 显示主题选择面板
    if (this.panelThemes) {
      this.panelThemes.active = !this.panelThemes.active
    }
  }
  
  /**
   * 切换主题
   * 
   * @param themeId 主题 ID
   */
  public switchToTheme(themeId: string): void {
    console.log('[MainMenu] 切换主题:', themeId)
    switchTheme(themeId, {
      onComplete: () => {
        console.log('[MainMenu] 主题切换完成')
        // 更新 UI 显示
      }
    })
  }
  
  // ==================== 动画 ====================
  
  /**
   * 入场动画
   */
  private animateIn(): void {
    // 简单淡入
    this.node.scale = 0.8
    this.node.opacity = 0
    
    // 这里应该使用 cc.tween 实现动画
    // cc.tween(this.node)
    //   .to(0.3, { scale: 1, opacity: 255 })
    //   .start()
    
    this.node.scale = 1
    this.node.opacity = 255
  }
  
  /**
   * 出场动画
   */
  private animateOut(callback?: () => void): void {
    // 淡出动画
    this.node.scale = 1
    this.node.opacity = 255
    
    // cc.tween(this.node)
    //   .to(0.3, { scale: 0.8, opacity: 0 })
    //   .call(callback)
    //   .start()
    
    callback?.()
  }
  
  onDestroy() {
    console.log('[MainMenu] 主菜单销毁')
  }
}

/**
 * 使用示例:
 * 
 * 1. 在 Cocos Creator 中创建空节点"MainMenu"
 * 2. 添加 MainMenuController 组件
 * 3. 绑定所有 UI 引用 (btnStart, btnSettings 等)
 * 4. 运行场景
 */
