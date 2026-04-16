/**
 * 封狼居胥 - 游戏入口
 * 
 * 初始化所有系统，启动游戏主循环
 */

import { _decorator, Component, director } from 'cc'
import { GameManager } from './core/GameManager'
import { EventSystem } from './core/EventSystem'
import { ResourceManager } from './utils/ResourceManager'
import { ThemeManager } from './core/ThemeManager'

const { ccclass, property } = _decorator

/**
 * 游戏入口组件
 * 
 * 挂载到空节点上，作为游戏的起点
 */
@ccclass('Main')
export class Main extends Component {
  @property({
    type: String,
    tooltip: '初始场景名称'
  })
  startScene: string = 'loading'

  @property({
    tooltip: '是否显示调试信息'
  })
  debugMode: boolean = true

  // 系统实例
  private eventSystem: EventSystem | null = null
  private resourceManager: ResourceManager | null = null
  private themeManager: ThemeManager | null = null

  start() {
    console.log('=================================')
    console.log('  封狼居胥 - 游戏启动')
    console.log('=================================')

    // 初始化所有系统 (按顺序)
    this.initializeSystems()

    // 进入初始场景
    this.loadStartScene()

    if (this.debugMode) {
      this.logSystemStatus()
    }
  }

  /**
   * 初始化所有系统
   */
  private initializeSystems(): void {
    console.log('[Main] 初始化系统...')

    // 1. 事件系统 (第一个初始化，其他系统依赖它)
    this.eventSystem = EventSystem.getInstance()
    this.eventSystem.initialize()
    console.log('[Main] ✅ 事件系统初始化完成')

    // 2. 资源管理器
    this.resourceManager = ResourceManager.getInstance()
    this.resourceManager.initialize()
    console.log('[Main] ✅ 资源管理器初始化完成')

    // 3. 主题管理器
    this.themeManager = ThemeManager.getInstance()
    this.themeManager.initialize()
    console.log('[Main] ✅ 主题管理器初始化完成')

    // 4. 游戏管理器
    const gameManager = GameManager.getInstance()
    gameManager.initialize({
      initialHp: 100,
      preparingTime: 30,
      combatTime: 60,
      totalRounds: 20
    })
    console.log('[Main] ✅ 游戏管理器初始化完成')

    // 绑定事件回调
    this.bindEvents()

    console.log('[Main] 所有系统初始化完成\n')
  }

  /**
   * 绑定全局事件
   */
  private bindEvents(): void {
    // 游戏启动完成
    this.eventSystem!.on('game:start', () => {
      console.log('[Main] 游戏启动完成')
    })

    // 主题切换
    this.eventSystem!.on('ui:update', (data) => {
      if (data.type === 'theme_change') {
        console.log(`[Main] 主题已切换：${data.oldThemeId} -> ${data.themeId}`)
      }
    })

    // 棋子死亡
    this.eventSystem!.on('chess:death', (chess) => {
      if (this.debugMode) {
        console.log(`[Main] ${chess.chessData.name} 阵亡`)
      }
    })

    // 战斗伤害
    this.eventSystem!.on('battle:damage', (data) => {
      if (this.debugMode) {
        console.log(`[Main] ${data.attacker.chessData.name} 对 ${data.target.chessData.name} 造成 ${data.damage} 点伤害`)
      }
    })
  }

  /**
   * 加载初始场景
   */
  private loadStartScene(): void {
    console.log(`[Main] 加载初始场景：${this.startScene}`)
    
    director.loadScene(this.startScene, (err, scene) => {
      if (err) {
        console.error(`[Main] 场景加载失败：${this.startScene}`, err)
        return
      }

      console.log(`[Main] 场景加载成功：${this.startScene}`)
      director.runScene(scene)
    })
  }

  /**
   * 打印系统状态
   */
  private logSystemStatus(): void {
    console.log('\n[Main] 系统状态:')
    console.log('├─ 事件系统:', this.eventSystem ? '正常' : '异常')
    console.log('├─ 资源管理器:', this.resourceManager ? '正常' : '异常')
    console.log('├─ 主题管理器:', this.themeManager ? '正常' : '异常')
    console.log('├─ 游戏管理器:', GameManager.getInstance() ? '正常' : '异常')
    console.log('└─ 初始场景:', this.startScene)
    console.log('')
  }

  /**
   * 获取事件系统实例
   */
  public getEventSystem(): EventSystem | null {
    return this.eventSystem
  }

  /**
   * 获取资源管理器实例
   */
  public getResourceManager(): ResourceManager | null {
    return this.resourceManager
  }

  /**
   * 获取主题管理器实例
   */
  public getThemeManager(): ThemeManager | null {
    return this.themeManager
  }
}

/**
 * 使用示例:
 * 
 * 1. 在场景中创建空节点"GameRoot"
 * 2. 添加 Main 组件
 * 3. 设置 startScene = "loading"
 * 4. 运行场景
 * 
 * 系统会自动初始化并进入加载场景
 * 
 * 访问系统实例:
 * const main = node.getComponent(Main)
 * const eventSystem = main?.getEventSystem()
 * eventSystem?.emit('game:start')
 */
