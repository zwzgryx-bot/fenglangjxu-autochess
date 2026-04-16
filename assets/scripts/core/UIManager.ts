/**
 * 封狼居胥 - UI 系统管理器
 * 
 * 管理所有 UI 界面：
 * - 页面打开/关闭
 * - 页面层级管理
 * - UI 数据绑定
 * - UI 动画过渡
 */

import { _decorator, Node, UITransform, find, instantiate, Prefab, Label, Sprite, Color } from 'cc'
import { eventBus, GameEventType } from './core/EventSystem'
import { ResourceManager } from './utils/ResourceManager'

const { ccclass, property } = _decorator

// ==================== 枚举定义 ====================

/** UI 页面类型 */
export enum UIPageType {
  LOADING = 'loading',           // 加载页面
  MAIN_MENU = 'main_menu',       // 主菜单
  LOBBY = 'lobby',               // 大厅
  BATTLE = 'battle',             // 战斗界面
  SHOP = 'shop',                 // 商店
  SETTINGS = 'settings',         // 设置
  CHESS_INFO = 'chess_info',     // 棋子信息
  BOND_INFO = 'bond_info',       // 羁绊信息
  GAME_END = 'game_end'          // 游戏结束
}

/** UI 层级定义 */
export enum UILayer {
  BACKGROUND = 0,         // 背景层
  NORMAL = 100,          // 普通层
  POPUP = 200,           // 弹窗层
  DIALOG = 300,          // 对话框层
  TOOLTIP = 400,         // 提示层
  LOADING = 500,         // 加载层
  GUIDE = 600            // 引导层
}

// ==================== 接口定义 ====================

/** UI 页面配置 */
export interface IUIPageConfig {
  name: string                    // 页面名称
  prefabPath: string              // 预制体路径
  layer: UILayer                  // UI 层级
  closeOthers?: boolean           // 打开时是否关闭其他页面
  closeable?: boolean             // 是否可关闭
}

/** UI 页面数据 */
export interface IUIPageData {
  node: Node                      // 页面节点
  config: IUIPageConfig           // 页面配置
  data?: any                      // 页面数据
}

// ==================== UI 管理器类 ====================

@ccclass('UIManager')
export class UIManager {
  // ==================== 单例模式 ====================
  
  private static instance: UIManager | null = null
  
  public static getInstance(): UIManager {
    if (!this.instance) {
      this.instance = new UIManager()
    }
    return this.instance
  }
  
  // ==================== 属性定义 ====================
  
  @property({ type: Prefab, tooltip: '根节点' })
  public rootNode: Node | null = null
  
  @property({ type: Prefab, tooltip: '页面预设' })
  public pagePrefabs: Array<Prefab> = []
  
  /** 已打开的页面 */
  private openedPages: Map<string, IUIPageData> = new Map()
  
  /** 页面配置注册表 */
  private pageRegistry: Map<string, IUIPageConfig> = new Map()
  
  /** 层级节点缓存 */
  private layerNodes: Map<UILayer, Node> = new Map()
  
  /** 资源管理器引用 */
  private resourceManager: ResourceManager | null = null
  
  // ==================== 初始化 ====================
  
  /**
   * 初始化 UI 管理器
   */
  public initialize(rootNode: Node): void {
    this.rootNode = rootNode
    
    // 获取资源管理器
    this.resourceManager = ResourceManager.getInstance()
    
    // 创建层级节点
    this.createLayerNodes()
    
    // 注册默认页面
    this.registerDefaultPages()
    
    // 绑定全局事件
    this.bindEvents()
    
    console.log('[UIManager] 初始化完成')
  }
  
  /**
   * 创建层级节点
   */
  private createLayerNodes(): void {
    const layers = Object.values(UILayer).filter(v => typeof v === 'number') as number[]
    
    for (const layer of layers) {
      const layerNode = new Node(`Layer_${layer}`)
      layerNode.parent = this.rootNode
      this.layerNodes.set(layer as UILayer, layerNode)
    }
  }
  
  /**
   * 注册默认页面
   */
  private registerDefaultPages(): void {
    // 加载页面
    this.registerPage({
      name: UIPageType.LOADING,
      prefabPath: 'prefabs/ui/loading',
      layer: UILayer.LOADING,
      closeOthers: true,
      closeable: false
    })
    
    // 主菜单
    this.registerPage({
      name: UIPageType.MAIN_MENU,
      prefabPath: 'prefabs/ui/main_menu',
      layer: UILayer.NORMAL,
      closeOthers: true,
      closeable: false
    })
    
    // 大厅
    this.registerPage({
      name: UIPageType.LOBBY,
      prefabPath: 'prefabs/ui/lobby',
      layer: UILayer.NORMAL,
      closeOthers: true,
      closeable: false
    })
    
    // 战斗界面
    this.registerPage({
      name: UIPageType.BATTLE,
      prefabPath: 'prefabs/ui/battle',
      layer: UILayer.NORMAL,
      closeOthers: true,
      closeable: false
    })
    
    // 商店
    this.registerPage({
      name: UIPageType.SHOP,
      prefabPath: 'prefabs/ui/shop',
      layer: UILayer.NORMAL,
      closeOthers: false,
      closeable: false
    })
    
    // 设置
    this.registerPage({
      name: UIPageType.SETTINGS,
      prefabPath: 'prefabs/ui/settings',
      layer: UILayer.POPUP,
      closeOthers: false,
      closeable: true
    })
    
    // 棋子信息
    this.registerPage({
      name: UIPageType.CHESS_INFO,
      prefabPath: 'prefabs/ui/chess_info',
      layer: UILayer.POPUP,
      closeOthers: false,
      closeable: true
    })
    
    // 羁绊信息
    this.registerPage({
      name: UIPageType.BOND_INFO,
      prefabPath: 'prefabs/ui/bond_info',
      layer: UILayer.POPUP,
      closeOthers: false,
      closeable: true
    })
    
    // 游戏结束
    this.registerPage({
      name: UIPageType.GAME_END,
      prefabPath: 'prefabs/ui/game_end',
      layer: UILayer.DIALOG,
      closeOthers: true,
      closeable: false
    })
  }
  
  // ==================== 页面管理 ====================
  
  /**
   * 注册页面配置
   * 
   * @param config 页面配置
   */
  public registerPage(config: IUIPageConfig): void {
    this.pageRegistry.set(config.name, config)
    console.log(`[UIManager] 注册页面：${config.name}`)
  }
  
  /**
   * 打开页面
   * 
   * @param pageName 页面名称
   * @param data 页面数据
   * @returns 页面节点
   */
  public openPage(pageName: string, data?: any): Node | null {
    const config = this.pageRegistry.get(pageName)
    if (!config) {
      console.error(`[UIManager] 页面未注册：${pageName}`)
      return null
    }
    
    // 如果已打开，直接返回
    if (this.openedPages.has(pageName)) {
      const pageData = this.openedPages.get(pageName)!
      pageData.node.active = true
      this.bringToFront(pageData.node)
      return pageData.node
    }
    
    // 关闭其他页面
    if (config.closeOthers) {
      this.closeAllPages()
    }
    
    // 加载预制体
    this.loadPagePrefab(config, (node) => {
      if (node) {
        this.addPageToLayer(node, config, data)
      }
    })
    
    return null
  }
  
  /**
   * 关闭页面
   * 
   * @param pageName 页面名称
   */
  public closePage(pageName: string): void {
    const pageData = this.openedPages.get(pageName)
    if (!pageData) {
      return
    }
    
    // 播放关闭动画
    this.animateOut(pageData.node, () => {
      pageData.node.active = false
      this.openedPages.delete(pageName)
      console.log(`[UIManager] 关闭页面：${pageName}`)
    })
  }
  
  /**
   * 关闭所有页面
   */
  public closeAllPages(): void {
    for (const pageName of Array.from(this.openedPages.keys())) {
      this.closePage(pageName)
    }
  }
  
  /**
   * 检查页面是否打开
   * 
   * @param pageName 页面名称
   */
  public isPageOpen(pageName: string): boolean {
    return this.openedPages.has(pageName)
  }
  
  /**
   * 获取页面节点
   * 
   * @param pageName 页面名称
   */
  public getPageNode(pageName: string): Node | null {
    const pageData = this.openedPages.get(pageName)
    return pageData ? pageData.node : null
  }
  
  // ==================== 数据绑定 ====================
  
  /**
   * 更新页面数据
   * 
   * @param pageName 页面名称
   * @param data 新数据
   */
  public updatePageData(pageName: string, data: any): void {
    const pageData = this.openedPages.get(pageName)
    if (!pageData) return
    
    pageData.data = data
    
    // 触发更新事件
    eventBus.emit(GameEventType.UI_UPDATE, {
      page: pageName,
      data
    })
  }
  
  /**
   * 设置文本内容
   * 
   * @param nodePath 节点路径
   * @param text 文本内容
   */
  public setText(nodePath: string, text: string): void {
    const node = find(nodePath, this.rootNode)
    if (!node) {
      console.warn(`[UIManager] 节点不存在：${nodePath}`)
      return
    }
    
    const label = node.getComponent(Label)
    if (label) {
      label.string = text
    }
  }
  
  /**
   * 设置按钮文本
   * 
   * @param nodePath 节点路径
   * @param text 文本内容
   */
  public setButtonText(nodePath: string, text: string): void {
    this.setText(`${nodePath}/Label`, text)
  }
  
  /**
   * 设置图片精灵
   * 
   * @param nodePath 节点路径
   * @param spriteFrame 精灵帧
   */
  public setImage(nodePath: string, spriteFrame: any): void {
    const node = find(nodePath, this.rootNode)
    if (!node) return
    
    const sprite = node.getComponent(Sprite)
    if (sprite) {
      sprite.spriteFrame = spriteFrame
    }
  }
  
  // ==================== 辅助方法 ====================
  
  /**
   * 将节点置顶
   * 
   * @param node 节点
   */
  public bringToFront(node: Node): void {
    const parent = node.parent
    if (parent) {
      node.parent = null
      node.parent = parent
    }
  }
  
  /**
   * 播放打开动画
   * 
   * @param node 节点
   * @param callback 完成回调
   */
  private animateIn(node: Node, callback?: () => void): void {
    // 简单淡入动画 (实际项目应使用 tween)
    node.scale = 0.8
    node.opacity = 0
    
    // 这里应该使用 cc.tween 实现动画
    node.scale = 1
    node.opacity = 255
    
    callback?.()
  }
  
  /**
   * 播放关闭动画
   * 
   * @param node 节点
   * @param callback 完成回调
   */
  private animateOut(node: Node, callback?: () => void): void {
    // 简单淡出动画
    node.scale = 1
    node.opacity = 255
    
    // 这里应该使用 cc.tween 实现动画
    node.scale = 0.8
    node.opacity = 0
    
    callback?.()
  }
  
  // ==================== 私有方法 ====================
  
  /**
   * 加载页面预制体
   */
  private loadPagePrefab(config: IUIPageConfig, callback: (node: Node | null) => void): void {
    if (!this.resourceManager) {
      callback(null)
      return
    }
    
    this.resourceManager.getPrefab(config.prefabPath, (error, prefab) => {
      if (error || !prefab) {
        console.error(`[UIManager] 加载预制体失败：${config.prefabPath}`, error)
        callback(null)
        return
      }
      
      // 实例化预制体
      const node = instantiate(prefab)
      callback(node)
    })
  }
  
  /**
   * 添加页面到层级
   */
  private addPageToLayer(node: Node, config: IUIPageConfig, data?: any): void {
    const layerNode = this.layerNodes.get(config.layer)
    if (!layerNode) {
      console.error(`[UIManager] 层级不存在：${config.layer}`)
      return
    }
    
    node.parent = layerNode
    node.name = config.name
    
    // 保存页面数据
    const pageData: IUIPageData = {
      node,
      config,
      data
    }
    this.openedPages.set(config.name, pageData)
    
    // 播放打开动画
    this.animateIn(node, () => {
      console.log(`[UIManager] 打开页面：${config.name}`)
    })
  }
  
  /**
   * 绑定全局事件
   */
  private bindEvents(): void {
    // 主题切换时更新 UI
    eventBus.on('ui:update', (data) => {
      if (data.type === 'theme_change') {
        this.updateTheme(data.themeId)
      }
    }, this)
  }
  
  /**
   * 更新主题
   * 
   * @param themeId 主题 ID
   */
  private updateTheme(themeId: string): void {
    console.log(`[UIManager] 更新主题：${themeId}`)
    
    // TODO: 根据主题更新 UI 资源
    // 可以重新加载所有打开页面的预制体
  }
  
  // ==================== 清理 ====================
  
  /**
   * 清理所有资源
   */
  public cleanup(): void {
    this.closeAllPages()
    this.layerNodes.forEach(node => node.destroy())
    this.layerNodes.clear()
    this.pageRegistry.clear()
    this.openedPages.clear()
    
    console.log('[UIManager] 清理完成')
  }
}

// ==================== 便捷函数 ====================

/**
 * 全局 UI 管理器实例
 */
export const ui = UIManager.getInstance()

/**
 * 打开页面 (便捷函数)
 */
export const openPage = ui.openPage.bind(ui)
export const closePage = ui.closePage.bind(ui)
export const updatePageData = ui.updatePageData.bind(ui)
export const setText = ui.setText.bind(ui)

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * import { ui, openPage, closePage, setText } from './UIManager'
 * 
 * // 初始化
 * ui.initialize(rootNode)
 * 
 * // 打开页面
 * openPage('main_menu')
 * openPage('settings')
 * 
 * // 关闭页面
 * closePage('settings')
 * 
 * // 更新数据
 * updatePageData('battle', { round: 5, gold: 50 })
 * 
 * // 设置文本
 * setText('battle/top/round', '第 5 回合')
 * setText('battle/top/gold', '50')
 * 
 * // 检查页面状态
 * if (ui.isPageOpen('shop')) {
 *   console.log('商店已打开')
 * }
 * 
 * // 获取页面节点
 * const shopNode = ui.getPageNode('shop')
 * if (shopNode) {
 *   // 操作节点
 * }
 * ```
 */
