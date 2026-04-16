/**
 * 封狼居胥 - 加载场景控制器
 * 
 * 管理游戏加载场景:
 * - 显示游戏 LOGO
 * - 进度条动画
 * - 资源预加载
 * - 场景过渡
 */

import { _decorator, Component, Node, Label, ProgressBar, Color, game, director } from 'cc'
import { GameManager, GameScene } from '../core/GameManager'
import { EventSystem } from '../core/EventSystem'
import { AudioManager, BGMType, SFXType } from './AudioManager'

const { ccclass, property } = _decorator

@ccclass('LoadingController')
export class LoadingController extends Component {
  @property({ type: Node, tooltip: '背景节点' })
  bgImage: Node | null = null
  
  @property({ type: Node, tooltip: '游戏 LOGO 节点' })
  gameLogo: Node | null = null
  
  @property({ type: ProgressBar, tooltip: '进度条组件' })
  progressBar: ProgressBar | null = null
  
  @property({ type: Label, tooltip: '进度文字' })
  lblProgress: Label | null = null
  
  @property({ type: Label, tooltip: '加载提示文字' })
  lblLoading: Label | null = null
  
  @property({ type: Label, tooltip: '版本信息' })
  lblVersion: Label | null = null
  
  private loadProgress: number = 0
  private targetProgress: number = 0
  private isInitialized: boolean = false
  private nextScene: GameScene = GameScene.MainMenu
  
  start() {
    console.log('[Loading] 加载场景启动')
    
    // 设置版本信息
    if (this.lblVersion) {
      this.lblVersion.string = 'v1.0.0'
    }
    
    // 初始化进度条
    if (this.progressBar) {
      this.progressBar.progress = 0
    }
    
    if (this.lblProgress) {
      this.lblProgress.string = '0%'
    }
    
    // 绑定事件
    EventSystem.on('show_loading', this.showLoading, this)
    EventSystem.on('hide_loading', this.hideLoading, this)
    
    // 开始加载
    this.startLoading()
  }
  
  update(dt: number) {
    if (!this.isInitialized) return
    
    // 平滑进度条动画
    if (this.loadProgress < this.targetProgress) {
      this.loadProgress += dt * 0.5
      if (this.loadProgress > this.targetProgress) {
        this.loadProgress = this.targetProgress
      }
      this.updateProgress(this.loadProgress)
    }
  }
  
  /**
   * 开始加载流程
   */
  private async startLoading(): Promise<void> {
    console.log('[Loading] 开始资源加载')
    
    // 第一阶段：加载必要资源 (0-30%)
    this.targetProgress = 0.3
    await this.loadEssentialResources()
    this.isInitialized = true
    
    // 第二阶段：预加载音频 (30-60%)
    this.targetProgress = 0.6
    await this.preloadAudio()
    
    // 第三阶段：预加载场景 (60-90%)
    this.targetProgress = 0.9
    await this.preloadScenes()
    
    // 第四阶段：完成加载 (90-100%)
    this.targetProgress = 1.0
    
    // 等待一小段时间，让用户看到 100%
    await this.delay(500)
    
    // 进入下一个场景
    this.enterNextScene()
  }
  
  /**
   * 加载必要资源
   */
  private async loadEssentialResources(): Promise<void> {
    console.log('[Loading] 加载必要资源')
    
    // TODO: 加载主题配置
    // TODO: 加载基础 UI 资源
    // TODO: 加载棋子数据
    
    await this.delay(200) // 模拟加载时间
  }
  
  /**
   * 预加载音频
   */
  private async preloadAudio(): Promise<void> {
    console.log('[Loading] 预加载音频')
    
    try {
      const audioManager = AudioManager.getInstance()
      
      // 预加载所有 BGM 和常用 SFX
      await audioManager.preloadAudio(
        [BGMType.MAIN_MENU, BGMType.LOBBY, BGMType.BATTLE],
        [
          SFXType.BUTTON_CLICK,
          SFXType.CHESS_SELECT,
          SFXType.CHESS_PLACE,
          SFXType.ATTACK_HIT,
          SFXType.GOLD_GAIN
        ]
      )
      
      console.log('[Loading] 音频预加载完成')
    } catch (error) {
      console.error('[Loading] 音频加载失败:', error)
    }
    
    await this.delay(300)
  }
  
  /**
   * 预加载场景
   */
  private async preloadScenes(): Promise<void> {
    console.log('[Loading] 预加载场景')
    
    // TODO: 预加载 main_menu.scene
    // TODO: 预加载 lobby.scene
    // TODO: 预加载 battle.scene
    
    await this.delay(200)
  }
  
  /**
   * 更新进度显示
   */
  private updateProgress(progress: number): void {
    if (this.progressBar) {
      this.progressBar.progress = progress
    }
    
    if (this.lblProgress) {
      this.lblProgress.string = `${Math.floor(progress * 100)}%`
    }
  }
  
  /**
   * 进入下一个场景
   */
  private enterNextScene(): void {
    console.log('[Loading] 进入场景:', this.nextScene)
    
    // 播放进入场景音效
    AudioManager.getInstance().playSFX(SFXType.PAGE_OPEN)
    
    // 场景切换
    switch (this.nextScene) {
      case GameScene.MainMenu:
        GameManager.getInstance().showMainMenu()
        break
      case GameScene.Lobby:
        GameManager.getInstance().enterLobby()
        break
      case GameScene.Battle:
        GameManager.getInstance().enterBattle()
        break
    }
  }
  
  /**
   * 显示加载界面 (通用)
   * 
   * @param options 加载选项
   */
  private showLoading(options?: { message?: string; nextScene?: GameScene }): void {
    if (options?.message) {
      if (this.lblLoading) {
        this.lblLoading.string = options.message
      }
    }
    
    if (options?.nextScene) {
      this.nextScene = options.nextScene
    }
    
    // 重置进度
    this.loadProgress = 0
    this.targetProgress = 0.1
    
    // 显示界面
    if (this.node) {
      this.node.active = true
    }
  }
  
  /**
   * 隐藏加载界面
   */
  private hideLoading(): void {
    if (this.node) {
      this.node.active = false
    }
  }
  
  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  onDestroy() {
    console.log('[Loading] 加载场景销毁')
    
    EventSystem.off('show_loading', this.showLoading, this)
    EventSystem.off('hide_loading', this.hideLoading, this)
  }
}

/**
 * 使用示例:
 * 
 * 1. 创建 loading.scene 场景:
 *    - Canvas
 *      - bgImage (Sprite, 深色背景)
 *      - gameLogo (Sprite, 游戏 LOGO)
 *      - progressBar (ProgressBar)
 *        - bar (Sprite, 进度条)
 *        - lblProgress (Label, 百分比)
 *      - lblLoading (Label, "加载中...")
 *      - lblVersion (Label, 版本号)
 * 
 * 2. 添加 LoadingController 组件到 Canvas 或空节点
 * 
 * 3. 绑定所有属性引用
 * 
 * 4. 设置为启动场景:
 *    - 项目设置 → 场景 → 添加 loading.scene
 *    - 移到列表顶部
 * 
 * 5. 在其他地方调用:
 *    EventSystem.emit('show_loading', {
 *      message: '正在匹配...',
 *      nextScene: GameScene.Battle
 *    })
 */
