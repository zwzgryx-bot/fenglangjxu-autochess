/**
 * 封狼居胥 - 换皮系统 (主题管理器)
 * 
 * 核心功能：
 * - 主题配置管理
 * - 动态主题切换
 * - 资源热切换
 * - 主题预设
 * 
 * 支持换皮架构：
 * - 代码与美术分离
 * - 配置化主题
 * - 运行时切换
 */

import { ResourceManager } from './ResourceManager'
import { eventBus, GameEventType } from '../core/EventSystem'

// ==================== 类型定义 ====================

/** 主题配置 */
export interface IThemeConfig {
  id: string                      // 主题 ID
  name: string                    // 主题名称
  description?: string            // 主题描述
  version: string                 // 主题版本
  author?: string                 // 作者
  preview?: string                // 预览图路径
  
  // 资源配置
  resources: {
    chess?: Record<string, string>      // 棋子资源 (chessId -> path)
    ui?: Record<string, string>         // UI 资源 (uiKey -> path)
    bg?: Record<string, string>         // 背景资源 (bgKey -> path)
    audio?: Record<string, string>      // 音频资源 (audioKey -> path)
    effect?: Record<string, string>     // 特效资源 (effectKey -> path)
  }
  
  // 配色方案
  colors?: {
    primary?: string              // 主色调
    secondary?: string            // 次色调
    accent?: string               // 强调色
    background?: string           // 背景色
    text?: string                 // 文字色
  }
  
  // 字体配置
  fonts?: {
    main?: string                 // 主要字体
    number?: string               // 数字字体
  }
}

/** 主题切换选项 */
export interface IThemeSwitchOptions {
  immediate?: boolean             // 是否立即切换 (不播放动画)
  fadeDuration?: number           // 淡入淡出持续时间 (秒)
  onProgress?: (progress: number) => void  // 进度回调
  onComplete?: () => void         // 完成回调
}

/** 主题数据 */
export interface IThemeData {
  config: IThemeConfig
  loaded: boolean                 // 是否已加载
  loading: boolean                // 是否正在加载
  progress: number                // 加载进度
}

// ==================== 默认主题配置 ====================

/** 默认主题 - 汉军 */
export const DEFAULT_HAN_THEME: IThemeConfig = {
  id: 'han_default',
  name: '汉军主题',
  description: '朱砂红 + 墨绿配色，经典汉军风格',
  version: '1.0.0',
  
  resources: {
    chess: {
      'huoqubing': 'resources/themes/han/chess/huoqubing',
      'weiqing': 'resources/themes/han/chess/weiqing',
      'liguang': 'resources/themes/han/chess/liguang',
      // ... 其他汉军棋子
    },
    ui: {
      'btn_main': 'resources/themes/han/ui/btn_main',
      'panel_shop': 'resources/themes/han/ui/panel_shop',
      'icon_gold': 'resources/themes/han/ui/icon_gold',
    },
    bg: {
      'chessboard': 'resources/themes/han/bg/chessboard_grass',
      'main_menu': 'resources/themes/han/bg/main_menu',
    },
    audio: {
      'bgm_main': 'resources/themes/han/audio/bgm_main',
      'bgm_battle': 'resources/themes/han/audio/bgm_battle',
    }
  },
  
  colors: {
    primary: '#C43628',      // 朱砂红
    secondary: '#3A5F3A',    // 墨绿
    accent: '#D4AF37',       // 金色
    background: '#F5E6D3',   // 米色
    text: '#2C2C2C'          // 深灰
  },
  
  fonts: {
    main: 'fonts/han_style',
    number: 'fonts/number_han'
  }
}

/** 默认主题 - 匈奴 */
export const DEFAULT_XIONGNU_THEME: IThemeConfig = {
  id: 'xiongnu_default',
  name: '匈奴主题',
  description: '土黄 + 棕色配色，草原游牧风格',
  version: '1.0.0',
  
  resources: {
    chess: {
      'chanyu': 'resources/themes/xiongnu/chess/chanyu',
      'left_king': 'resources/themes/xiongnu/chess/left_king',
      'right_king': 'resources/themes/xiongnu/chess/right_king',
      // ... 其他匈奴棋子
    },
    ui: {
      'btn_main': 'resources/themes/xiongnu/ui/btn_main',
      'panel_shop': 'resources/themes/xiongnu/ui/panel_shop',
      'icon_gold': 'resources/themes/xiongnu/ui/icon_gold',
    },
    bg: {
      'chessboard': 'resources/themes/xiongnu/bg/chessboard_desert',
      'main_menu': 'resources/themes/xiongnu//bg/main_menu',
    },
    audio: {
      'bgm_main': 'resources/themes/xiongnu/audio/bgm_main',
      'bgm_battle': 'resources/themes/xiongnu/audio/bgm_battle',
    }
  },
  
  colors: {
    primary: '#B8956B',      // 土黄
    secondary: '#8B4513',    // 棕色
    accent: '#4169E1',       // 蓝色
    background: '#F5DEB3',   // 小麦色
    text: '#2C2C2C'          // 深灰
  },
  
  fonts: {
    main: 'fonts/xiongnu_style',
    number: 'fonts/number_xiongnu'
  }
}

// ==================== 主题管理器类 ====================

export class ThemeManager {
  // ==================== 单例模式 ====================
  
  private static instance: ThemeManager | null = null
  
  public static getInstance(): ThemeManager {
    if (!this.instance) {
      this.instance = new ThemeManager()
    }
    return this.instance
  }
  
  // ==================== 私有属性 ====================
  
  private resourceManager: ResourceManager
  private themes: Map<string, IThemeData> = new Map()
  private currentThemeId: string | null = null
  private isSwitching: boolean = false
  
  // ==================== 初始化 ====================
  
  /**
   * 构造函数
   */
  constructor() {
    this.resourceManager = ResourceManager.getInstance()
    
    // 注册默认主题
    this.registerTheme(DEFAULT_HAN_THEME)
    this.registerTheme(DEFAULT_XIONGNU_THEME)
  }
  
  /**
   * 初始化主题管理器
   */
  public initialize(): void {
    this.themes.clear()
    this.currentThemeId = null
    
    // 重新注册默认主题
    this.registerTheme(DEFAULT_HAN_THEME)
    this.registerTheme(DEFAULT_XIONGNU_THEME)
    
    console.log('[ThemeManager] 初始化完成')
  }
  
  // ==================== 主题注册 ====================
  
  /**
   * 注册主题
   * 
   * @param config 主题配置
   */
  public registerTheme(config: IThemeConfig): void {
    if (this.themes.has(config.id)) {
      console.warn(`[ThemeManager] 主题已存在：${config.id}`)
    }
    
    this.themes.set(config.id, {
      config,
      loaded: false,
      loading: false,
      progress: 0
    })
    
    console.log(`[ThemeManager] 注册主题：${config.id} (${config.name})`)
  }
  
  /**
   * 注销主题
   * 
   * @param themeId 主题 ID
   */
  public unregisterTheme(themeId: string): void {
    if (themeId === this.currentThemeId) {
      console.warn(`[ThemeManager] 不能注销当前主题`)
      return
    }
    
    this.themes.delete(themeId)
    console.log(`[ThemeManager] 注销主题：${themeId}`)
  }
  
  /**
   * 获取所有已注册主题
   */
  public getAllThemes(): IThemeConfig[] {
    return Array.from(this.themes.values()).map(data => data.config)
  }
  
  /**
   * 获取主题配置
   * 
   * @param themeId 主题 ID
   */
  public getThemeConfig(themeId: string): IThemeConfig | null {
    const themeData = this.themes.get(themeId)
    return themeData ? themeData.config : null
  }
  
  // ==================== 主题切换 ====================
  
  /**
   * 切换主题
   * 
   * @param themeId 主题 ID
   * @param options 切换选项
   */
  public switchTheme(themeId: string, options: IThemeSwitchOptions = {}): void {
    if (this.isSwitching) {
      console.warn('[ThemeManager] 正在切换主题，请稍后')
      return
    }
    
    if (themeId === this.currentThemeId) {
      console.log('[ThemeManager] 已是当前主题')
      return
    }
    
    const themeData = this.themes.get(themeId)
    if (!themeData) {
      console.error(`[ThemeManager] 主题不存在：${themeId}`)
      options.onComplete?.()
      return
    }
    
    this.isSwitching = true
    
    console.log(`[ThemeManager] 开始切换主题：${themeId}`)
    
    // 如果没有加载过，先加载
    if (!themeData.loaded) {
      this.loadThemeResources(themeId, () => {
        this.doSwitchTheme(themeId, options)
      })
    } else {
      this.doSwitchTheme(themeId, options)
    }
  }
  
  /**
   * 执行主题切换
   */
  private doSwitchTheme(themeId: string, options: IThemeSwitchOptions): void {
    const oldThemeId = this.currentThemeId
    this.currentThemeId = themeId
    
    // 更新资源管理器的主题
    this.resourceManager.setCurrentTheme(themeId)
    
    // 触发事件
    eventBus.emit(GameEventType.UI_UPDATE, {
      type: 'theme_change',
      themeId,
      oldThemeId
    })
    
    console.log(`[ThemeManager] 主题切换完成：${oldThemeId} -> ${themeId}`)
    
    this.isSwitching = false
    options.onComplete?.()
    
    // 更新主题加载状态
    const themeData = this.themes.get(themeId)
    if (themeData) {
      themeData.loaded = true
    }
  }
  
  /**
   * 加载主题资源
   */
  private loadThemeResources(themeId: string, onComplete: () => void): void {
    const themeData = this.themes.get(themeId)
    if (!themeData) {
      onComplete()
      return
    }
    
    themeData.loading = true
    themeData.progress = 0
    
    const resources = themeData.config.resources
    const allPaths: Array<{ path: string; type: any }> = []
    
    // 收集所有资源路径
    if (resources.chess) {
      Object.values(resources.chess).forEach(path => {
        allPaths.push({ path, type: 'sprite_frame' })
      })
    }
    if (resources.ui) {
      Object.values(resources.ui).forEach(path => {
        allPaths.push({ path, type: 'sprite_frame' })
      })
    }
    if (resources.bg) {
      Object.values(resources.bg).forEach(path => {
        allPaths.push({ path, type: 'texture' })
      })
    }
    if (resources.audio) {
      Object.values(resources.audio).forEach(path => {
        allPaths.push({ path, type: 'audio_clip' })
      })
    }
    
    const total = allPaths.length
    let loaded = 0
    
    // 批量加载
    allPaths.forEach(({ path, type }) => {
      this.resourceManager.load(path, type, () => {
        loaded++
        themeData.progress = loaded / total
        
        if (loaded === total) {
          themeData.loading = false
          themeData.loaded = true
          onComplete()
        }
      })
    })
    
    if (total === 0) {
      themeData.loading = false
      themeData.loaded = true
      onComplete()
    }
  }
  
  // ==================== 资源获取 ====================
  
  /**
   * 获取当前主题的棋子资源路径
   * 
   * @param chessId 棋子 ID
   */
  public getChessResourcePath(chessId: string): string | null {
    if (!this.currentThemeId) return null
    
    const themeData = this.themes.get(this.currentThemeId)
    if (!themeData) return null
    
    return themeData.config.resources.chess?.[chessId] || null
  }
  
  /**
   * 获取当前主题的 UI 资源路径
   * 
   * @param uiKey UI 键
   */
  public getUIResourcePath(uiKey: string): string | null {
    if (!this.currentThemeId) return null
    
    const themeData = this.themes.get(this.currentThemeId)
    if (!themeData) return null
    
    return themeData.config.resources.ui?.[uiKey] || null
  }
  
  /**
   * 获取当前主题的背景资源路径
   * 
   * @param bgKey 背景键
   */
  public getBGResourcePath(bgKey: string): string | null {
    if (!this.currentThemeId) return null
    
    const themeData = this.themes.get(this.currentThemeId)
    if (!themeData) return null
    
    return themeData.config.resources.bg?.[bgKey] || null
  }
  
  /**
   * 获取当前主题的音频资源路径
   * 
   * @param audioKey 音频键
   */
  public getAudioResourcePath(audioKey: string): string | null {
    if (!this.currentThemeId) return null
    
    const themeData = this.themes.get(this.currentThemeId)
    if (!themeData) return null
    
    return themeData.config.resources.audio?.[audioKey] || null
  }
  
  // ==================== 配色获取 ====================
  
  /**
   * 获取当前主题的配色
   * 
   * @param colorKey 颜色键
   * @returns 颜色值
   */
  public getColor(colorKey: keyof NonNullable<IThemeConfig['colors']>): string | null {
    if (!this.currentThemeId) return null
    
    const themeData = this.themes.get(this.currentThemeId)
    if (!themeData || !themeData.config.colors) return null
    
    return themeData.config.colors[colorKey] || null
  }
  
  /**
   * 获取当前主题的所有配色
   */
  public getAllColors(): Record<string, string> | null {
    if (!this.currentThemeId) return null
    
    const themeData = this.themes.get(this.currentThemeId)
    if (!themeData || !themeData.config.colors) return null
    
    return themeData.config.colors
  }
  
  // ==================== 状态查询 ====================
  
  /**
   * 获取当前主题 ID
   */
  public getCurrentThemeId(): string | null {
    return this.currentThemeId
  }
  
  /**
   * 获取主题加载状态
   * 
   * @param themeId 主题 ID
   */
  public getThemeLoadState(themeId: string): {
    loaded: boolean
    loading: boolean
    progress: number
  } | null {
    const themeData = this.themes.get(themeId)
    if (!themeData) return null
    
    return {
      loaded: themeData.loaded,
      loading: themeData.loading,
      progress: themeData.progress
    }
  }
  
  /**
   * 检查是否是特定主题
   * 
   * @param themeId 主题 ID
   */
  public isCurrentTheme(themeId: string): boolean {
    return this.currentThemeId === themeId
  }
  
  // ==================== 主题预设 ====================
  
  /**
   * 获取预设主题 ID 列表
   */
  public getAvailableThemes(): string[] {
    return Array.from(this.themes.keys())
  }
  
  /**
   * 重置为默认主题
   */
  public resetToDefault(): void {
    this.switchTheme('han_default')
  }
}

// ==================== 便捷函数 ====================

/**
 * 全局主题管理器实例
 */
export const theme = ThemeManager.getInstance()

/**
 * 切换主题 (便捷函数)
 */
export const switchTheme = theme.switchTheme.bind(theme)
export const getCurrentTheme = theme.getCurrentThemeId.bind(theme)
export const getThemeConfig = theme.getThemeConfig.bind(theme)
export const getAllThemes = theme.getAllThemes.bind(theme)

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * import { theme, switchTheme, getCurrentTheme } from './ThemeManager'
 * 
 * // 初始化
 * theme.initialize()
 * 
 * // 注册自定义主题
 * theme.registerTheme({
 *   id: 'custom_theme',
 *   name: '自定义主题',
 *   version: '1.0.0',
 *   resources: {
 *     chess: {
 *       'huoqubing': 'resources/custom/chess/huoqubing',
 *     },
 *     ui: {
 *       'btn_main': 'resources/custom/ui/btn_main',
 *     }
 *   },
 *   colors: {
 *     primary: '#FF0000',
 *     secondary: '#00FF00',
 *   }
 * })
 * 
 * // 获取所有主题
 * const themes = getAllThemes()
 * console.log('可用主题:', themes.map(t => t.name))
 * 
 * // 切换主题
 * switchTheme('xiongnu_default', {
 *   immediate: false,
 *   fadeDuration: 1.0,
 *   onProgress: (progress) => {
 *     console.log(`切换进度：${progress * 100}%`)
 *   },
 *   onComplete: () => {
 *     console.log('主题切换完成')
 *   }
 * })
 * 
 * // 获取当前主题
 * const currentId = getCurrentTheme()
 * console.log('当前主题:', currentId)
 * 
 * // 获取主题配色
 * const primaryColor = theme.getColor('primary')
 * console.log('主色调:', primaryColor)
 * 
 * // 获取棋子资源路径
 * const chessPath = theme.getChessResourcePath('huoqubing')
 * console.log('霍去病资源路径:', chessPath)
 * ```
 */
