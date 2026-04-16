/**
 * 封狼居胥 - 资源管理器
 * 
 * 统一管理游戏资源：
 * - 预制体加载
 * - 精灵帧加载
 * - 音频加载
 * - 资源缓存
 * - 资源预加载
 */

import { game, assetManager, AssetManager, SpriteFrame, AudioClip, Node, Prefab, Texture2D } from 'cc'

// ==================== 类型定义 ====================

/** 资源类型枚举 */
export enum ResourceType {
  SPRITE_FRAME = 'sprite_frame',
  TEXTURE = 'texture',
  PREFAB = 'prefab',
  AUDIO_CLIP = 'audio_clip',
  FONT = 'font',
  SPINE = 'spine',
  PARTICLE = 'particle'
}

/** 资源加载配置 */
export interface IResourceConfig {
  path: string                    // 资源路径
  type: ResourceType              // 资源类型
  preload?: boolean               // 是否预加载
  priority?: number               // 加载优先级
}

/** 主题资源配置 */
export interface IThemeResource {
  themeId: string                 // 主题 ID
  resources: Record<string, string> // 资源映射 (key -> path)
}

/** 加载进度回调 */
export type LoadProgressCallback = (finished: number, total: number) => void

/** 加载完成回调 */
export type LoadCompleteCallback<T = any> = (error: Error | null, result: T) => void

// ==================== 资源管理器类 ====================

export class ResourceManager {
  // ==================== 单例模式 ====================
  
  private static instance: ResourceManager | null = null
  
  public static getInstance(): ResourceManager {
    if (!this.instance) {
      this.instance = new ResourceManager()
    }
    return this.instance
  }
  
  // ==================== 私有属性 ====================
  
  /** 资源缓存 */
  private cache: Map<string, any> = new Map()
  
  /** 加载中的资源 */
  private loadingResources: Set<string> = new Set()
  
  /** 加载队列 */
  private loadQueue: Array<{
    path: string
    type: ResourceType
    callback?: LoadCompleteCallback
  }> = []
  
  /** 是否正在加载队列 */
  private isProcessingQueue: boolean = false
  
  /** 当前主题 ID */
  private currentThemeId: string = 'default'
  
  /** 主题资源映射 */
  private themeResources: Map<string, IThemeResource> = new Map()
  
  // ==================== 初始化 ====================
  
  /**
   * 初始化资源管理器
   */
  public initialize(): void {
    this.cache.clear()
    this.loadingResources.clear()
    this.loadQueue = []
    this.isProcessingQueue = false
    this.currentThemeId = 'default'
    
    console.log('[ResourceManager] 初始化完成')
  }
  
  /**
   * 注册主题资源
   * 
   * @param themeId 主题 ID
   * @param resources 资源映射
   */
  public registerTheme(themeId: string, resources: Record<string, string>): void {
    this.themeResources.set(themeId, {
      themeId,
      resources
    })
    
    console.log(`[ResourceManager] 注册主题：${themeId}, 资源数量：${Object.keys(resources).length}`)
  }
  
  // ==================== 加载方法 ====================
  
  /**
   * 加载单个资源
   * 
   * @param path 资源路径
   * @param type 资源类型
   * @param callback 完成回调
   */
  public load<T = any>(
    path: string,
    type: ResourceType,
    callback?: LoadCompleteCallback<T>
  ): void {
    const cacheKey = this.getCacheKey(path, type)
    
    // 检查缓存
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      callback?.(null, cached)
      return
    }
    
    // 检查是否正在加载
    if (this.loadingResources.has(cacheKey)) {
      // 加入等待队列 (简化处理，实际应该用更复杂的机制)
      setTimeout(() => this.load(path, type, callback), 100)
      return
    }
    
    // 标记为加载中
    this.loadingResources.add(cacheKey)
    
    // 转换为 Cocos 资源类型
    const assetType = this.getResourceConstructor(type)
    
    // 加载资源
    assetManager.loadResource(path, assetType, (error: Error | null, asset: any) => {
      this.loadingResources.delete(cacheKey)
      
      if (error) {
        console.error(`[ResourceManager] 加载失败：${path}`, error)
        callback?.(error, null)
        return
      }
      
      // 缓存资源
      this.cache.set(cacheKey, asset)
      console.log(`[ResourceManager] 加载成功：${path}`)
      
      callback?.(null, asset)
    })
  }
  
  /**
   * 加载多个资源
   * 
   * @param configs 资源配置列表
   * @param onProgress 进度回调
   * @param onComplete 完成回调
   */
  public loadBatch(
    configs: IResourceConfig[],
    onProgress?: LoadProgressCallback,
    onComplete?: (error: Error | null, results: any[]) => void
  ): void {
    const total = configs.length
    let finished = 0
    const results: any[] = []
    let hasError = false
    
    configs.forEach((config, index) => {
      this.load(config.path, config.type, (error, result) => {
        if (error) {
          hasError = true
          console.error(`[ResourceManager] 批量加载失败：${config.path}`, error)
        }
        
        results[index] = result
        finished++
        
        onProgress?.(finished, total)
        
        if (finished === total) {
          if (hasError) {
            onComplete?.(new Error('部分资源加载失败'), results)
          } else {
            onComplete?.(null, results)
          }
        }
      })
    })
  }
  
  /**
   * 预加载资源目录
   * 
   * @param dirPath 目录路径
   * @param callback 完成回调
   */
  public preloadDir<T = any>(dirPath: string, callback?: LoadCompleteCallback<T[]>): void {
    assetManager.loadDir(dirPath, (error: Error | null, assets: T[]) => {
      if (error) {
        console.error(`[ResourceManager] 预加载目录失败：${dirPath}`, error)
        callback?.(error, [])
        return
      }
      
      // 缓存所有资源
      assets.forEach(asset => {
        const cacheKey = this.getCacheKey(asset.name, ResourceType.SPRITE_FRAME)
        this.cache.set(cacheKey, asset)
      })
      
      console.log(`[ResourceManager] 预加载目录成功：${dirPath}, 资源数量：${assets.length}`)
      callback?.(null, assets)
    })
  }
  
  /**
   * 预加载场景资源
   * 
   * @param sceneName 场景名称
   * @param callback 完成回调
   */
  public preloadScene(sceneName: string, callback?: LoadCompleteCallback): void {
    assetManager.loadScene(sceneName, (error: Error | null) => {
      if (error) {
        console.error(`[ResourceManager] 预加载场景失败：${sceneName}`, error)
        callback?.(error, null)
        return
      }
      
      console.log(`[ResourceManager] 预加载场景成功：${sceneName}`)
      callback?.(null, null)
    })
  }
  
  // ==================== 资源获取方法 ====================
  
  /**
   * 获取精灵帧
   * 
   * @param path 资源路径
   * @param callback 回调
   */
  public getSpriteFrame(path: string, callback?: LoadCompleteCallback<SpriteFrame>): void {
    this.load(path, ResourceType.SPRITE_FRAME, callback)
  }
  
  /**
   * 获取预制体
   * 
   * @param path 资源路径
   * @param callback 回调
   */
  public getPrefab(path: string, callback?: LoadCompleteCallback<Prefab>): void {
    this.load(path, ResourceType.PREFAB, callback)
  }
  
  /**
   * 获取音频
   * 
   * @param path 资源路径
   * @param callback 回调
   */
  public getAudioClip(path: string, callback?: LoadCompleteCallback<AudioClip>): void {
    this.load(path, ResourceType.AUDIO_CLIP, callback)
  }
  
  /**
   * 获取纹理
   * 
   * @param path 资源路径
   * @param callback 回调
   */
  public getTexture(path: string, callback?: LoadCompleteCallback<Texture2D>): void {
    this.load(path, ResourceType.TEXTURE, callback)
  }
  
  // ==================== 主题相关方法 ====================
  
  /**
   * 设置当前主题
   * 
   * @param themeId 主题 ID
   */
  public setCurrentTheme(themeId: string): void {
    if (this.currentThemeId === themeId) {
      return
    }
    
    this.currentThemeId = themeId
    console.log(`[ResourceManager] 切换主题：${themeId}`)
    
    // 触发主题切换事件
    this.onThemeChange?.(themeId)
  }
  
  /**
   * 获取当前主题 ID
   */
  public getCurrentThemeId(): string {
    return this.currentThemeId
  }
  
  /**
   * 获取主题资源路径
   * 
   * @param resourceKey 资源键
   * @returns 资源路径
   */
  public getThemeResourcePath(resourceKey: string): string | null {
    const theme = this.themeResources.get(this.currentThemeId)
    if (!theme) {
      return null
    }
    
    return theme.resources[resourceKey] || null
  }
  
  /**
   * 获取主题资源 (SpriteFrame)
   * 
   * @param resourceKey 资源键
   * @param callback 回调
   */
  public getThemeSpriteFrame(resourceKey: string, callback?: LoadCompleteCallback<SpriteFrame>): void {
    const path = this.getThemeResourcePath(resourceKey)
    if (!path) {
      console.error(`[ResourceManager] 主题资源未找到：${resourceKey}`)
      callback?.(new Error(`主题资源未找到：${resourceKey}`), null)
      return
    }
    
    this.getSpriteFrame(path, callback)
  }
  
  // ==================== 缓存管理 ====================
  
  /**
   * 释放单个资源
   * 
   * @param path 资源路径
   * @param type 资源类型
   */
  public release(path: string, type: ResourceType): void {
    const cacheKey = this.getCacheKey(path, type)
    const asset = this.cache.get(cacheKey)
    
    if (asset) {
      assetManager.releaseAsset(asset)
      this.cache.delete(cacheKey)
      console.log(`[ResourceManager] 释放资源：${path}`)
    }
  }
  
  /**
   * 释放资源目录
   * 
   * @param dirPath 目录路径
   */
  public releaseDir(dirPath: string): void {
    const keysToDelete: string[] = []
    
    this.cache.forEach((_, key) => {
      if (key.includes(dirPath)) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => {
      const asset = this.cache.get(key)
      if (asset) {
        assetManager.releaseAsset(asset)
      }
      this.cache.delete(key)
    })
    
    console.log(`[ResourceManager] 释放目录资源：${dirPath}, 数量：${keysToDelete.length}`)
  }
  
  /**
   * 释放所有资源
   */
  public releaseAll(): void {
    this.cache.forEach(asset => {
      assetManager.releaseAsset(asset)
    })
    
    this.cache.clear()
    console.log('[ResourceManager] 释放所有资源')
  }
  
  /**
   * 清除缓存 (不释放资源)
   */
  public clearCache(): void {
    this.cache.clear()
    console.log('[ResourceManager] 清除缓存')
  }
  
  /**
   * 获取缓存数量
   */
  public getCacheCount(): number {
    return this.cache.size
  }
  
  /**
   * 检查资源是否已加载
   * 
   * @param path 资源路径
   * @param type 资源类型
   */
  public isLoaded(path: string, type: ResourceType): boolean {
    const cacheKey = this.getCacheKey(path, type)
    return this.cache.has(cacheKey)
  }
  
  // ==================== 事件回调 ====================
  
  /** 主题切换回调 */
  public onThemeChange?: (themeId: string) => void
  
  // ==================== 私有辅助方法 ====================
  
  /**
   * 获取缓存键
   */
  private getCacheKey(path: string, type: ResourceType): string {
    return `${type}:${path}`
  }
  
  /**
   * 获取资源构造函数
   */
  private getResourceConstructor(type: ResourceType): any {
    switch (type) {
      case ResourceType.SPRITE_FRAME:
        return SpriteFrame
      case ResourceType.TEXTURE:
        return Texture2D
      case ResourceType.PREFAB:
        return Prefab
      case ResourceType.AUDIO_CLIP:
        return AudioClip
      default:
        return null
    }
  }
}

// ==================== 便捷函数 ====================

/**
 * 全局资源管理器实例
 */
export const resources = ResourceManager.getInstance()

/**
 * 加载精灵帧 (便捷函数)
 */
export const loadSpriteFrame = resources.getSpriteFrame.bind(resources)
export const loadPrefab = resources.getPrefab.bind(resources)
export const loadAudioClip = resources.getAudioClip.bind(resources)
export const loadTexture = resources.getTexture.bind(resources)

// ==================== 使用示例 ====================

/**
 * 使用示例:
 * 
 * ```typescript
 * import { resources, ResourceType, loadSpriteFrame } from './ResourceManager'
 * 
 * // 初始化
 * resources.initialize()
 * 
 * // 注册主题
 * resources.registerTheme('han_theme', {
 *   'chess_huoqubing': 'resources/themes/han/chess/huoqubing',
 *   'chess_weiqing': 'resources/themes/han/chess/weiqing',
 *   'bg_chessboard': 'resources/themes/han/bg/chessboard',
 * })
 * 
 * resources.registerTheme('xiongnu_theme', {
 *   'chess_huoqubing': 'resources/themes/xiongnu/chess/huoqubing',
 *   'chess_weiqing': 'resources/themes/xiongnu/chess/weiqing',
 *   'bg_chessboard': 'resources/themes/xiongnu/chessboard',
 * })
 * 
 * // 切换主题
 * resources.setCurrentTheme('han_theme')
 * 
 * // 加载单个资源
 * loadSpriteFrame('resources/chess/huoqubing', (error, spriteFrame) => {
 *   if (!error) {
 *     // 使用精灵帧
 *   }
 * })
 * 
 * // 加载主题资源
 * resources.getThemeSpriteFrame('chess_huoqubing', (error, spriteFrame) => {
 *   if (!error) {
 *     // 使用当前主题的霍去病立绘
 *   }
 * })
 * 
 * // 批量加载
 * resources.loadBatch([
 *   { path: 'resources/chess/huoqubing', type: ResourceType.SPRITE_FRAME },
 *   { path: 'resources/chess/weiqing', type: ResourceType.SPRITE_FRAME },
 *   { path: 'audio/bgm', type: ResourceType.AUDIO_CLIP },
 * ], (finished, total) => {
 *   console.log(`加载进度：${finished}/${total}`)
 * }, (error, results) => {
 *   console.log('批量加载完成')
 * })
 * 
 * // 预加载目录
 * resources.preloadDir('resources/chess', (error, assets) => {
 *   console.log(`预加载完成：${assets.length} 个资源`)
 * })
 * 
 * // 释放资源
 * resources.release('resources/chess/huoqubing', ResourceType.SPRITE_FRAME)
 * resources.releaseDir('resources/chess')
 * 
 * // 检查是否已加载
 * if (resources.isLoaded('resources/chess/huoqubing', ResourceType.SPRITE_FRAME)) {
 *   // 直接从缓存获取
 * }
 * ```
 */
