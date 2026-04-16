/**
 * 封狼居胥 - 音效管理器
 * 
 * 管理游戏的所有音频播放:
 * - BGM (背景音乐) 播放/暂停/切换
 * - SFX (音效) 触发
 * - 音量控制
 * - 音频预加载
 */

import { _decorator, AudioClip, AudioSource, Node, resources, sys } from 'cc'
import { EventSystem } from '../core/EventSystem'
import { SaveSystem } from './SaveSystem'

const { ccclass, property } = _decorator

/**
 * 音频类型枚举
 */
enum AudioType {
  BGM = 'bgm',
  SFX = 'sfx'
}

/**
 * 音效类型枚举
 */
export enum SFXType {
  // UI 音效
  BUTTON_CLICK = 'button_click',
  BUTTON_HOVER = 'button_hover',
  PAGE_OPEN = 'page_open',
  PAGE_CLOSE = 'page_close',
  
  // 棋子音效
  CHESS_SELECT = 'chess_select',
  CHESS_MOVE = 'chess_move',
  CHESS_PLACE = 'chess_place',
  CHESS_SELL = 'chess_sell',
  CHESS_MERGE = 'chess_merge',
  CHESS_LEVEL_UP = 'chess_levelup',
  
  // 战斗音效
  ATTACK_HIT = 'attack_hit',
  SKILL_ACTIVATE = 'skill_activate',
  CHESS_DIED = 'chess_died',
  BATTLE_START = 'battle_start',
  BATTLE_END = 'battle_end',
  
  // 经济音效
  GOLD_GAIN = 'gold_gain',
  GOLD_SPEND = 'gold_spend',
  SHOP_REFRESH = 'shop_refresh',
  
  // 系统音效
  NOTIFICATION = 'notification',
  ERROR = 'error',
  SUCCESS = 'success'
}

/**
 * BGM 类型枚举
 */
export enum BGMType {
  MAIN_MENU = 'main_menu',
  LOBBY = 'lobby',
  BATTLE = 'battle',
  VICTORY = 'victory',
  DEFEAT = 'defeat'
}

@ccclass('AudioManager')
export class AudioManager {
  private static instance: AudioManager | null = null
  
  private bgmSource: AudioSource | null = null
  private sfxSource: AudioSource | null = null
  
  private bgmVolume: number = 0.7
  private sfxVolume: number = 0.8
  
  private currentBGM: BGMType | null = null
  private isBGMPlaying: boolean = false
  private isMuted: boolean = false
  
  private bgmClipCache: Map<BGMType, AudioClip> = new Map()
  private sfxClipCache: Map<SFXType, AudioClip> = new Map()
  
  private isInitialized: boolean = false

  /**
   * 获取单例实例
   */
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  /**
   * 初始化音频管理器
   * 
   * @param bgmNode 背景音乐节点
   * @param sfxNode 音效节点
   */
  public initialize(bgmNode: Node, sfxNode: Node): void {
    if (this.isInitialized) {
      console.warn('[Audio] 已初始化，跳过')
      return
    }

    this.bgmSource = bgmNode.getComponent(AudioSource)
    if (!this.bgmSource) {
      this.bgmSource = bgmNode.addComponent(AudioSource)
    }
    this.bgmSource.loop = true
    
    this.sfxSource = sfxNode.getComponent(AudioSource)
    if (!this.sfxSource) {
      this.sfxSource = sfxNode.addComponent(AudioSource)
    }
    this.sfxSource.loop = false
    
    this.loadVolumeSettings()
    this.bindEvents()
    
    this.isInitialized = true
    console.log('[Audio] 音频管理器初始化完成')
  }

  /**
   * 加载音量设置
   */
  private loadVolumeSettings(): void {
    const saveData = SaveSystem.getInstance().getGameData()
    
    if (saveData.audioSettings) {
      this.bgmVolume = saveData.audioSettings.bgmVolume ?? 0.7
      this.sfxVolume = saveData.audioSettings.sfxVolume ?? 0.8
      this.isMuted = saveData.audioSettings.isMuted ?? false
    }
    
    this.updateVolume()
  }

  /**
   * 保存音量设置
   */
  private saveVolumeSettings(): void {
    const saveData = SaveSystem.getInstance().getGameData()
    
    if (!saveData.audioSettings) {
      saveData.audioSettings = {
        bgmVolume: this.bgmVolume,
        sfxVolume: this.sfxVolume,
        isMuted: this.isMuted
      }
    } else {
      saveData.audioSettings.bgmVolume = this.bgmVolume
      saveData.audioSettings.sfxVolume = this.sfxVolume
      saveData.audioSettings.isMuted = this.isMuted
    }
    
    SaveSystem.getInstance().saveGame(saveData)
  }

  /**
   * 绑定事件
   */
  private bindEvents(): void {
    EventSystem.on('audio_set_muted', this.setMuted, this)
    EventSystem.on('audio_set_bgm_volume', this.setBGMVolume, this)
    EventSystem.on('audio_set_sfx_volume', this.setSFXVolume, this)
  }

  /**
   * 更新音量
   */
  private updateVolume(): void {
    if (this.bgmSource) {
      this.bgmSource.volume = this.isMuted ? 0 : this.bgmVolume
    }
    if (this.sfxSource) {
      this.sfxSource.volume = this.isMuted ? 0 : this.sfxVolume
    }
  }

  /**
   * 预加载音频资源
   * 
   * @param bgmList 需要预加载的 BGM 列表
   * @param sfxList 需要预加载的 SFX 列表
   */
  public async preloadAudio(
    bgmList: BGMType[] = [],
    sfxList: SFXType[] = []
  ): Promise<void> {
    console.log('[Audio] 开始预加载音频资源')
    
    const loadPromises: Promise<void>[] = []
    
    // 加载 BGM
    for (const bgm of bgmList) {
      if (!this.bgmClipCache.has(bgm)) {
        loadPromises.push(this.loadAudioClip(bgm, AudioType.BGM))
      }
    }
    
    // 加载 SFX
    for (const sfx of sfxList) {
      if (!this.sfxClipCache.has(sfx)) {
        loadPromises.push(this.loadAudioClip(sfx, AudioType.SFX))
      }
    }
    
    await Promise.all(loadPromises)
    console.log(`[Audio] 预加载完成：${bgmList.length}首 BGM, ${sfxList.length}个 SFX`)
  }

  /**
   * 加载单个音频文件
   */
  private async loadAudioClip(name: string, type: AudioType): Promise<void> {
    return new Promise((resolve, reject) => {
      const path = `audio/${type}/${name}`
      
      resources.load(path, AudioClip, (err, clip) => {
        if (err) {
          console.error(`[Audio] 加载音频失败：${path}`, err)
          reject(err)
          return
        }
        
        if (type === AudioType.BGM) {
          this.bgmClipCache.set(name as BGMType, clip)
        } else {
          this.sfxClipCache.set(name as SFXType, clip)
        }
        
        console.log(`[Audio] 加载成功：${path}`)
        resolve()
      })
    })
  }

  /**
   * 播放背景音乐
   * 
   * @param bgm BGM 类型
   * @param force 是否强制切换（即使当前已经在播放该 BGM）
   */
  public async playBGM(bgm: BGMType, force: boolean = false): Promise<void> {
    if (this.isMuted) return
    
    if (this.currentBGM === bgm && this.isBGMPlaying && !force) {
      return
    }
    
    // 获取音频
    let clip = this.bgmClipCache.get(bgm)
    
    if (!clip) {
      try {
        await this.loadAudioClip(bgm, AudioType.BGM)
        clip = this.bgmClipCache.get(bgm)
      } catch (error) {
        console.error('[Audio] 无法加载 BGM:', bgm)
        return
      }
    }
    
    // 播放
    if (this.bgmSource && clip) {
      this.bgmSource.clip = clip
      this.bgmSource.play()
      this.currentBGM = bgm
      this.isBGMPlaying = true
      
      console.log('[Audio] 播放 BGM:', bgm)
    }
  }

  /**
   * 暂停背景音乐
   */
  public pauseBGM(): void {
    if (this.bgmSource) {
      this.bgmSource.pause()
      this.isBGMPlaying = false
      console.log('[Audio] 暂停 BGM')
    }
  }

  /**
   * 恢复背景音乐
   */
  public resumeBGM(): void {
    if (this.bgmSource && this.currentBGM && !this.isMuted) {
      this.bgmSource.play()
      this.isBGMPlaying = true
      console.log('[Audio] 恢复 BGM')
    }
  }

  /**
   * 停止背景音乐
   */
  public stopBGM(): void {
    if (this.bgmSource) {
      this.bgmSource.stop()
      this.isBGMPlaying = false
      this.currentBGM = null
      console.log('[Audio] 停止 BGM')
    }
  }

  /**
   * 播放音效
   * 
   * @param sfx SFX 类型
   */
  public async playSFX(sfx: SFXType): Promise<void> {
    if (this.isMuted) return
    
    let clip = this.sfxClipCache.get(sfx)
    
    if (!clip) {
      try {
        await this.loadAudioClip(sfx, AudioType.SFX)
        clip = this.sfxClipCache.get(sfx)
      } catch (error) {
        console.error('[Audio] 无法加载 SFX:', sfx)
        return
      }
    }
    
    if (this.sfxSource && clip) {
      this.sfxSource.clip = clip
      this.sfxSource.play()
      
      console.log('[Audio] 播放 SFX:', sfx)
    }
  }

  /**
   * 播放按钮点击音效
   */
  public playButtonClick(): void {
    this.playSFX(SFXType.BUTTON_CLICK)
  }

  /**
   * 设置静音
   * 
   * @param muted 是否静音
   */
  public setMuted(muted: boolean): void {
    this.isMuted = muted
    this.updateVolume()
    this.saveVolumeSettings()
    
    console.log('[Audio] 静音:', muted)
  }

  /**
   * 设置 BGM 音量
   * 
   * @param volume 音量 (0-1)
   */
  public setBGMVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume))
    this.updateVolume()
    this.saveVolumeSettings()
    
    console.log('[Audio] BGM 音量:', this.bgmVolume)
  }

  /**
   * 设置 SFX 音量
   * 
   * @param volume 音量 (0-1)
   */
  public setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
    this.updateVolume()
    this.saveVolumeSettings()
    
    console.log('[Audio] SFX 音量:', this.sfxVolume)
  }

  /**
   * 获取当前 BGM 音量
   */
  public getBGMVolume(): number {
    return this.bgmVolume
  }

  /**
   * 获取当前 SFX 音量
   */
  public getSFXVolume(): number {
    return this.sfxVolume
  }

  /**
   * 是否静音
   */
  public isAudioMuted(): boolean {
    return this.isMuted
  }

  /**
   * 清理资源
   */
  public cleanup(): void {
    this.stopBGM()
    
    if (this.bgmSource) {
      this.bgmSource.destroy()
      this.bgmSource = null
    }
    
    if (this.sfxSource) {
      this.sfxSource.destroy()
      this.sfxSource = null
    }
    
    this.bgmClipCache.clear()
    this.sfxClipCache.clear()
    
    this.isInitialized = false
    console.log('[Audio] 音频管理器清理完成')
  }
}

/**
 * 使用示例:
 * 
 * 1. 在场景中创建两个空节点:
 *    - AudioBGM (添加 AudioSource 组件)
 *    - AudioSFX (添加 AudioSource 组件)
 * 
 * 2. 在脚本中初始化:
 *    const audioManager = AudioManager.getInstance()
 *    audioManager.initialize(bgmNode, sfxNode)
 * 
 * 3. 预加载音频:
 *    await audioManager.preloadAudio(
 *      [BGMType.MAIN_MENU, BGMType.BATTLE],
 *      [SFXType.BUTTON_CLICK, SFXType.ATTACK_HIT]
 *    )
 * 
 * 4. 播放 BGM:
 *    audioManager.playBGM(BGMType.MAIN_MENU)
 * 
 * 5. 播放音效:
 *    audioManager.playSFX(SFXType.BUTTON_CLICK)
 *    或
 *    audioManager.playButtonClick()
 * 
 * 6. 控制音量:
 *    audioManager.setBGMVolume(0.5)
 *    audioManager.setMuted(true)
 */
