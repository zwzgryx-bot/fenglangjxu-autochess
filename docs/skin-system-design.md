# 封狼居胥 - 可换皮架构设计

## 换皮架构核心理念

```
┌─────────────────────────────────────────┐
│          可换皮架构三层设计              │
├─────────────────────────────────────────┤
│  Layer 3: 游戏逻辑层 (不变)              │
│  - 核心玩法                              │
│  - 数值计算                              │
│  - 状态管理                              │
├─────────────────────────────────────────┤
│  Layer 2: 配置层 (可配置)                │
│  - 主题配置 (ThemeConfig)                │
│  - 视觉配置 (VisualStyle)                │
│  - 音效配置 (AudioStyle)                 │
├─────────────────────────────────────────┤
│  Layer 1: 资源层 (可替换)                │
│  - 美术资源 (图集/纹理/动画)             │
│  - 音效资源 (BGM/音效)                   │
│  - 字体资源                              │
└─────────────────────────────────────────┘
```

## 换皮维度

### 1. 主题换皮 (Theme)
```
- 色彩方案 (Color Scheme)
- 字体风格 (Font Style)
- UI 样式 (UI Style)
```

### 2. 美术换皮 (Art Style)
```
- 手绘涂鸦风 (当前)
- Q 版二次元风
- 写实国风
- 像素风
- 低多边形风
```

### 3. 音效换皮 (Audio)
```
- 背景音乐包
- 音效包
- 语音包
```

---

## 配置文件结构

### 主题配置文件

```json
// resources/config/theme.json
{
  "currentTheme": "default",
  "themes": {
    "default": {
      "name": "封狼居胥 - 手绘涂鸦",
      "colors": {
        "primary": "#C43628",
        "secondary": "#3A5F3A",
        "accent": "#D4AF37",
        "background": "#F5E6C8",
        "text": "#2C2C2C"
      },
      "fonts": {
        "title": "汉仪手写体",
        "body": "思源黑体 CN",
        "numbers": "手绘数字"
      },
      "uiStyle": {
        "borderWidth": 4,
        "cornerRadius": 10,
        "shadowType": "hand-drawn"
      }
    },
    
    "anime": {
      "name": "二次元 Q 版",
      "colors": {
        "primary": "#FF6B9D",
        "secondary": "#4ECDC4",
        "accent": "#FFE66D",
        "background": "#F7FFF7",
        "text": "#292F36"
      },
      "fonts": {
        "title": "圆体",
        "body": "黑体",
        "numbers": "标准数字"
      },
      "uiStyle": {
        "borderWidth": 2,
        "cornerRadius": 15,
        "shadowType": "soft"
      }
    },
    
    "realistic": {
      "name": "写实国风",
      "colors": {
        "primary": "#8B0000",
        "secondary": "#2F4F4F",
        "accent": "#DAA520",
        "background": "#FAEBD7",
        "text": "#000000"
      },
      "fonts": {
        "title": "隶书",
        "body": "宋体",
        "numbers": "书法数字"
      },
      "uiStyle": {
        "borderWidth": 3,
        "cornerRadius": 5,
        "shadowType": "ink"
      }
    }
  }
}
```

### 资源映射配置

```json
// resources/config/art_mapping.json
{
  "default": {
    "atlases": {
      "ui_common": "atlases/ui_common",
      "ui_main": "atlases/ui_main_default",
      "chess_cards": "atlases/chess_default",
      "effects": "atlases/effects_default"
    },
    "textures": {
      "background_main": "textures/bg_main_default",
      "background_battle": "textures/bg_battle_default",
      "button_normal": "textures/btn_normal_default",
      "button_pressed": "textures/btn_pressed_default"
    },
    "audio": {
      "bgm_lobby": "audio/bgm/lobby_default",
      "bgm_battle": "audio/bgm/battle_default"
    }
  },
  
  "anime": {
    "atlases": {
      "ui_common": "atlases/ui_common",
      "ui_main": "atlases/ui_main_anime",
      "chess_cards": "atlases/chess_anime",
      "effects": "atlases/effects_anime"
    },
    "textures": {
      "background_main": "textures/bg_main_anime",
      "background_battle": "textures/bg_battle_anime",
      "button_normal": "textures/btn_normal_anime",
      "button_pressed": "textures/btn_pressed_anime"
    },
    "audio": {
      "bgm_lobby": "audio/bgm/lobby_anime",
      "bgm_battle": "audio/bgm/battle_anime"
    }
  }
}
```

---

## 核心代码架构

### 1. ThemeManager (主题管理器)

```typescript
// assets/scripts/core/ThemeManager.ts

import { EventSystem } from './EventSystem';

const { ccclass, property } = cc._decorator;

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface ThemeFonts {
  title: string | cc.Font;
  body: string | cc.Font;
  numbers: string | cc.Font;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  uiStyle: {
    borderWidth: number;
    cornerRadius: number;
    shadowType: string;
  };
}

@ccclass('ThemeManager')
export class ThemeManager extends Component {
  private static instance: ThemeManager;
  public static get Instance(): ThemeManager {
    return ThemeManager.instance;
  }
  
  @property
  currentThemeId: string = 'default';
  
  private themes: Map<string, ThemeConfig> = new Map();
  private artMapping: Map<string, any> = new Map();
  private currentTheme: ThemeConfig | null = null;
  
  // 换皮时的回调监听器
  private onThemeChangedCallbacks: ((themeId: string) => void)[] = [];
  
  async onLoad() {
    ThemeManager.instance = this;
    await this.loadThemeConfig();
    await this.loadArtMapping();
    await this.applyTheme(this.currentThemeId);
  }
  
  /**
   * 加载主题配置
   */
  private async loadThemeConfig() {
    try {
      const config = await this.loadJSON('config/theme');
      this.currentThemeId = config.currentTheme;
      
      for (const [themeId, themeData] of Object.entries(config.themes)) {
        this.themes.set(themeId, themeData as ThemeConfig);
      }
    } catch (error) {
      console.error('Load theme config failed:', error);
    }
  }
  
  /**
   * 加载美术资源映射
   */
  private async loadArtMapping() {
    try {
      const mapping = await this.loadJSON('config/art_mapping');
      for (const [themeId, mappingData] of Object.entries(mapping)) {
        this.artMapping.set(themeId, mappingData);
      }
    } catch (error) {
      console.error('Load art mapping failed:', error);
    }
  }
  
  /**
   * 应用主题
   */
  public async applyTheme(themeId: string): Promise<boolean> {
    if (!this.themes.has(themeId)) {
      console.error(`Theme ${themeId} not found`);
      return false;
    }
    
    const theme = this.themes.get(themeId);
    this.currentTheme = theme;
    this.currentThemeId = themeId;
    
    // 1. 应用色彩
    this.applyColors(theme.colors);
    
    // 2. 应用字体
    await this.applyFonts(theme.fonts);
    
    // 3. 加载新主题资源
    await this.loadThemeResources(themeId);
    
    // 4. 通知监听器
    this.notifyThemeChanged(themeId);
    
    // 5. 保存偏好
    this.saveThemePreference(themeId);
    
    console.log(`Theme applied: ${theme.name}`);
    return true;
  }
  
  /**
   * 应用色彩方案
   */
  private applyColors(colors: ThemeColors) {
    // 设置 CSS 变量 (Web 平台)
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      const rootStyle = document.documentElement.style;
      rootStyle.setProperty('--primary-color', colors.primary);
      rootStyle.setProperty('--secondary-color', colors.secondary);
      rootStyle.setProperty('--accent-color', colors.accent);
      rootStyle.setProperty('--bg-color', colors.background);
      rootStyle.setProperty('--text-color', colors.text);
    }
    
    // 更新全局颜色配置
    cc.Material.setDefault('primary', cc.Color.fromHEX(colors.primary));
    cc.Material.setDefault('secondary', cc.Color.fromHEX(colors.secondary));
    // ...
  }
  
  /**
   * 应用字体
   */
  private async applyFonts(fonts: ThemeFonts) {
    // 动态加载字体
    if (typeof fonts.title === 'string') {
      // 加载字体文件
      await this.loadFont('title', fonts.title);
    }
    // ... 其他字体
  }
  
  /**
   * 加载主题资源
   */
  private async loadThemeResources(themeId: string) {
    const mapping = this.artMapping.get(themeId);
    if (!mapping) return;
    
    // 预加载新主题图集
    for (const [key, path] of Object.entries(mapping.atlases)) {
      await this.preloadAtlas(path);
    }
    
    // 预加载纹理
    for (const [key, path] of Object.entries(mapping.textures)) {
      await this.preloadTexture(path);
    }
  }
  
  /**
   * 获取资源路径 (根据当前主题)
   */
  public getResourcePath(key: string, category: 'atlas' | 'texture' | 'audio'): string {
    const mapping = this.artMapping.get(this.currentThemeId);
    if (!mapping) return '';
    
    return mapping[category + 's'][key] || mapping[category === 'atlas' ? 'atlases' : category === 'audio' ? 'audio' : 'textures'][key];
  }
  
  /**
   * 获取颜色
   */
  public getColor(colorName: keyof ThemeColors): string {
    return this.currentTheme?.colors[colorName] || '#000000';
  }
  
  /**
   * 获取字体
   */
  public getFont(fontName: keyof ThemeFonts): string | cc.Font {
    return this.currentTheme?.fonts[fontName] || '';
  }
  
  /**
   * 注册主题变化监听
   */
  public onThemeChanged(callback: (themeId: string) => void) {
    this.onThemeChangedCallbacks.push(callback);
  }
  
  /**
   * 通知主题变化
   */
  private notifyThemeChanged(themeId: string) {
    this.onThemeChangedCallbacks.forEach(cb => cb(themeId));
    EventSystem.emit('theme_changed', { themeId });
  }
  
  /**
   * 切换主题 (供 UI 调用)
   */
  public async switchTheme(themeId: string) {
    const success = await this.applyTheme(themeId);
    if (success) {
      EventSystem.emit('theme_switch_success', { themeId });
    }
  }
  
  /**
   * 获取所有可用主题
   */
  public getAvailableThemes(): string[] {
    return Array.from(this.themes.keys());
  }
  
  /**
   * 获取当前主题信息
   */
  public getCurrentTheme(): ThemeConfig | null {
    return this.currentTheme;
  }
  
  // ==================== 工具方法 ====================
  
  private async loadJSON(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
      cc.resources.load(path, cc.JsonAsset, (err, asset) => {
        if (err) reject(err);
        else resolve(asset.json);
      });
    });
  }
  
  private async preloadAtlas(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cc.resources.load(path, cc.SpriteAtlas, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  
  private async preloadTexture(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cc.resources.load(path, cc.Texture2D, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  
  private async loadFont(name: string, fontPath: string): Promise<void> {
    // 字体加载逻辑
    return Promise.resolve();
  }
  
  private saveThemePreference(themeId: string) {
    cc.sys.localStorage.setItem('current_theme', themeId);
  }
}
```

---

### 2. UIManager (支持换皮)

```typescript
// assets/scripts/ui/UIManager.ts

import { ThemeManager } from '../core/ThemeManager';

const { ccclass, property } = cc._decorator;

@ccclass('UIManager')
export class UIManager extends Component {
  private static instance: UIManager;
  public static get Instance(): UIManager {
    return UIManager.instance;
  }
  
  @property(cc.Prefab)
  commonButtonPrefab: cc.Prefab = null;
  
  @property(cc.Prefab)
  dialogPrefab: cc.Prefab = null;
  
  onLoad() {
    UIManager.instance = this;
    
    // 监听主题变化
    ThemeManager.Instance.onThemeChanged((themeId) => {
      this.onThemeChanged(themeId);
    });
  }
  
  /**
   * 创建主题自适应按钮
   */
  public createThemedButton(config: {
    text: string;
    onClick: () => void;
    themeStyle?: 'primary' | 'secondary' | 'accent';
  }): cc.Node {
    const node = cc.instantiate(this.commonButtonPrefab);
    const button = node.getComponent(cc.Button);
    const label = node.getComponentInChildren(cc.Label);
    
    // 应用当前主题色彩
    const theme = ThemeManager.Instance.getCurrentTheme();
    const color = theme?.colors[config.themeStyle || 'primary'];
    
    // 设置按钮颜色
    const sprite = node.getComponent(cc.Sprite);
    if (sprite) {
      sprite.color = cc.Color.fromHEX(color);
    }
    
    // 设置圆角 (根据主题配置)
    const uiStyle = theme?.uiStyle;
    if (uiStyle) {
      // 圆角处理 (可能需要自定义组件)
      node.setComponent('RoundedRect', { radius: uiStyle.cornerRadius });
    }
    
    label.string = config.text;
    
    button.clickEvents[0].callback = config.onClick;
    
    return node;
  }
  
  /**
   * 应用主题到 UI 节点
   */
  public applyThemeToNode(node: cc.Node, style: {
    backgroundColor?: string;
    textColor?: string;
    borderWidth?: number;
    cornerRadius?: number;
  }) {
    const theme = ThemeManager.Instance.getCurrentTheme();
    
    // 背景色
    if (style.backgroundColor) {
      const sprite = node.getComponent(cc.Sprite);
      if (sprite) {
        sprite.color = cc.Color.fromHEX(style.backgroundColor);
      }
    }
    
    // 文字颜色
    const label = node.getComponentInChildren(cc.Label);
    if (label && style.textColor) {
      label.fontColor = cc.Color.fromHEX(style.textColor);
    }
    
    // 边框宽度
    if (style.borderWidth !== undefined) {
      // 应用边框 (可能需要自定义组件)
    }
    
    // 圆角
    if (style.cornerRadius !== undefined) {
      // 应用圆角
    }
  }
  
  /**
   * 主题变化时更新 UI
   */
  private onThemeChanged(themeId: string) {
    // 遍历所有 UI 节点，应用新主题
    this.updateDynamicUI();
  }
  
  private updateDynamicUI() {
    // 查找所有动态创建的 UI 元素并更新
    // ...
  }
}
```

---

### 3. ChessView (棋子视图 - 资源动态加载)

```typescript
// assets/scripts/chess/ChessView.ts

import { ThemeManager } from '../core/ThemeManager';
import { ChessData } from './ChessData';

const { ccclass, property } = cc._decorator;

@ccclass('ChessView')
export class ChessView extends Component {
  @property(cc.Sprite)
  chessSprite: cc.Sprite = null;
  
  @property(cc.Label)
  nameLabel: cc.Label = null;
  
  @property(cc.Node)
  starGroup: cc.Node = null;
  
  @property(cc.Sprite)
  campIcon: cc.Sprite = null;
  
  @property(cc.Sprite)
  professionIcon: cc.Sprite = null;
  
  @property(cc.Node)
  evolutionEffect: cc.Node = null;
  
  private chessData: ChessData = null;
  private currentSkin: string = 'default';
  
  onLoad() {
    // 监听主题变化
    ThemeManager.Instance.onThemeChanged((themeId) => {
      this.updateSkin(themeId);
    });
  }
  
  /**
   * 初始化棋子视图
   */
  public init(data: ChessData) {
    this.chessData = data;
    this.currentSkin = ThemeManager.Instance.currentThemeId;
    
    this.nameLabel.string = data.name;
    this.updateStars(data.star);
    this.loadChessSprite();
    this.loadIcons();
  }
  
  /**
   * 加载棋子立绘 (根据当前主题)
   */
  private async loadChessSprite() {
    const skinId = this.currentSkin;
    const chessId = this.chessData.id;
    
    // 根据主题加载不同的立绘
    const atlasPath = ThemeManager.Instance.getResourcePath(
      'chess_cards',
      'atlas'
    );
    
    cc.resources.load(atlasPath, cc.SpriteAtlas, (err, atlas) => {
      if (err) {
        console.error('Load chess atlas failed:', err);
        return;
      }
      
      // 尝试获取对应主题的精灵
      const spriteName = `${chessId}_${skinId}`;
      const spriteFrame = atlas.getSpriteFrame(spriteName);
      
      if (spriteFrame) {
        this.chessSprite.spriteFrame = spriteFrame;
      } else {
        // 如果主题立绘不存在，使用默认立绘
        const defaultSprite = atlas.getSpriteFrame(chessId);
        if (defaultSprite) {
          this.chessSprite.spriteFrame = defaultSprite;
        }
      }
    });
  }
  
  /**
   * 加载图标 (阵营/职业)
   */
  private async loadIcons() {
    // 类似 loadChessSprite 的逻辑
    // 根据主题加载不同的图标
  }
  
  /**
   * 更新皮肤
   */
  public updateSkin(themeId: string) {
    this.currentSkin = themeId;
    this.loadChessSprite();
    this.loadIcons();
    this.updateEvolutionEffect();
  }
  
  /**
   * 更新转职特效
   */
  private updateEvolutionEffect() {
    if (this.evolutionEffect && this.chessData.isEvolved) {
      // 根据主题应用不同的转职特效
      const effectPath = ThemeManager.Instance.getResourcePath(
        `evolution_${this.currentSkin}`,
        'atlas'
      );
      // 加载并播放特效
    }
  }
  
  private updateStars(star: number) {
    // 更新星级显示
  }
}
```

---

### 4. ResourceLoader (资源加载器 - 支持换皮)

```typescript
// assets/scripts/utils/ResourceLoader.ts

import { ThemeManager } from '../core/ThemeManager';

export class ResourceLoader {
  private static instance: ResourceLoader;
  public static get Instance(): ResourceLoader {
    return ResourceLoader.instance;
  }
  
  private loadedResources: Map<string, any> = new Map();
  private loadingQueue: Map<string, Promise<any>[]> = new Map();
  
  /**
   * 加载资源 (自动适配当前主题)
   */
  public async load<T>(
    path: string,
    type: typeof cc.Asset,
    themed: boolean = true
  ): Promise<T> {
    const cacheKey = `${path}_${type.name}_${themed ? ThemeManager.Instance.currentThemeId : 'global'}`;
    
    // 检查缓存
    if (this.loadedResources.has(cacheKey)) {
      return this.loadedResources.get(cacheKey);
    }
    
    // 如果正在加载，加入队列
    if (this.loadingQueue.has(cacheKey)) {
      return new Promise((resolve, reject) => {
        this.loadingQueue.get(cacheKey).push({ resolve, reject });
      });
    }
    
    this.loadingQueue.set(cacheKey, []);
    
    // 应用主题路径
    const actualPath = themed ? this.applyThemeToPath(path) : path;
    
    return new Promise((resolve, reject) => {
      cc.resources.load(actualPath, type, (err, asset) => {
        if (err) {
          reject(err);
          this.notifyLoaders(cacheKey, err, null);
          return;
        }
        
        this.loadedResources.set(cacheKey, asset);
        resolve(asset);
        this.notifyLoaders(cacheKey, null, asset);
      });
    });
  }
  
  /**
   * 应用主题到路径
   */
  private applyThemeToPath(path: string): string {
    const themeId = ThemeManager.Instance.currentThemeId;
    const mapping = this.getArtMapping(themeId);
    
    // 检查是否有主题映射
    for (const [key, themedPath] of Object.entries(mapping.atlases)) {
      if (path.includes(key)) {
        return themedPath;
      }
    }
    
    return path;
  }
  
  private getArtMapping(themeId: string): any {
    // 获取美术映射配置
    return {};
  }
  
  private notifyLoaders(cacheKey: string, err: any, asset: any) {
    const queue = this.loadingQueue.get(cacheKey);
    if (queue) {
      queue.forEach(({ resolve, reject }) => {
        if (err) reject(err);
        else resolve(asset);
      });
      this.loadingQueue.delete(cacheKey);
    }
  }
  
  /**
   * 预加载主题资源
   */
  public async preloadThemeResources(themeId: string): Promise<void> {
    const mapping = this.getArtMapping(themeId);
    const promises: Promise<any>[] = [];
    
    // 预加载所有图集
    for (const path of Object.values(mapping.atlases)) {
      promises.push(this.load(path, cc.SpriteAtlas, false));
    }
    
    // 预加载所有纹理
    for (const path of Object.values(mapping.textures)) {
      promises.push(this.load(path, cc.Texture2D, false));
    }
    
    await Promise.all(promises);
    console.log(`Theme ${themeId} resources preloaded`);
  }
  
  /**
   * 清除缓存的主题资源
   */
  public clearThemeCache(themeId: string) {
    for (const key of this.loadedResources.keys()) {
      if (key.includes(themeId)) {
        this.loadedResources.delete(key);
      }
    }
  }
}
```

---

### 5. 换皮 UI 界面

```typescript
// assets/scripts/ui/UISkinSelector.ts

import { ThemeManager } from '../core/ThemeManager';

const { ccclass, property } = cc._decorator;

@ccclass('UISkinSelector')
export class UISkinSelector extends Component {
  @property(cc.Node)
  themeListContent: cc.Node = null;
  
  @property(cc.Prefab)
  themeItemPrefab: cc.Prefab = null;
  
  private availableThemes: string[] = [];
  
  onEnable() {
    this.refreshThemeList();
  }
  
  /**
   * 刷新主题列表
   */
  private refreshThemeList() {
    // 清空现有列表
    this.themeListContent.removeAllChildren();
    
    // 获取可用主题
    this.availableThemes = ThemeManager.Instance.getAvailableThemes();
    
    // 创建主题选项
    this.availableThemes.forEach(themeId => {
      const item = cc.instantiate(this.themeItemPrefab);
      const themeConfig = ThemeManager.Instance.themes.get(themeId);
      
      // 设置主题名称
      const label = item.getComponentInChildren(cc.Label);
      label.string = themeConfig.name;
      
      // 设置主题预览色
      const previewSprite = item.getChildByName('Preview').getComponent(cc.Sprite);
      previewSprite.color = cc.Color.fromHEX(themeConfig.colors.primary);
      
      // 标记当前主题
      const isSelected = themeId === ThemeManager.Instance.currentThemeId;
      item.getChildByName('Checkmark').active = isSelected;
      
      // 绑定点击事件
      const button = item.getComponent(cc.Button);
      button.clickEvents[0].callback = () => {
        this.onThemeSelected(themeId);
      };
      
      this.themeListContent.addChild(item);
    });
  }
  
  /**
   * 主题选择回调
   */
  private async onThemeSelected(themeId: string) {
    // 显示加载提示
    UIManager.Instance.showLoading('切换主题中...');
    
    try {
      // 切换主题
      await ThemeManager.Instance.switchTheme(themeId);
      
      // 刷新列表
      this.refreshThemeList();
      
      // 隐藏加载提示
      UIManager.Instance.hideLoading();
      
      // 显示成功提示
      UIManager.Instance.showToast('主题切换成功!');
    } catch (error) {
      console.error('Theme switch failed:', error);
      UIManager.Instance.hideLoading();
      UIManager.Instance.showToast('主题切换失败');
    }
  }
}
```

---

## 换皮使用流程

### 开发新皮肤

```
1. 准备美术资源
   - UI 图集 (ui_main_newskin.atlas)
   - 棋子立绘 (chess_newskin.atlas)
   - 特效资源 (effects_newskin.atlas)
   - 背景纹理 (textures/bg_*.png)

2. 添加资源配置
   - 编辑 config/theme.json (添加主题色彩)
   - 编辑 config/art_mapping.json (添加资源映射)

3. 测试新皮肤
   - 游戏中打开设置 → 主题选择
   - 选择新主题测试效果

4. 打包发布
   - 新皮肤资源打包
   - 可作为 DLC 或活动皮肤
```

### 换皮示例代码

```typescript
// 在游戏中切换皮肤
await ThemeManager.Instance.switchTheme('anime');
await ThemeManager.Instance.switchTheme('realistic');
await ThemeManager.Instance.switchTheme('pixel');

// 监听主题变化
ThemeManager.Instance.onThemeChanged((themeId) => {
  console.log('主题切换为:', themeId);
  // 更新 UI
});
```

---

## 资源目录规范

```
assets/resources/
├── config/
│   ├── theme.json           # 主题配置
│   └── art_mapping.json     # 美术映射
│
├── atlases/
│   ├── ui_common.atlas      # 通用 UI (不换)
│   ├── ui_main_default.atlas
│   ├── ui_main_anime.atlas
│   ├── ui_main_realistic.atlas
│   ├── chess_default.atlas
│   ├── chess_anime.atlas
│   ├── chess_realistic.atlas
│   └── ...
│
├── textures/
│   ├── bg_main_default/
│   ├── bg_main_anime/
│   └── ...
│
├── audio/
│   ├── bgm/
│   │   ├── lobby_default.mp3
│   │   ├── lobby_anime.mp3
│   │   └── ...
│   └── sfx/
│       ├── default/
│       └── anime/
│
└── skins/                   # 完整皮肤包 (可选 DLC)
    ├── anime/
    ├── realistic/
    └── pixel/
```

---

## 换皮架构优势

### ✅ 对开发
- 代码与美术完全分离
- 新皮肤只需替换资源 + 配置
- 支持热更新皮肤包
- 可做多皮肤 DLC

### ✅ 对美术
- 不改动代码即可换风格
- 支持并行开发多个皮肤
- 资源规范清晰

### ✅ 对运营
- 可搞皮肤活动
- 可卖皮肤 DLC
- 可 AB 测试不同风格

---

这个架构让换皮超级简单！我去继续写其他模块代码，你按照 `ui-design.md` 开始搞图吧！🎨

需要我帮你规范一下输出的图片命名和目录结构吗?
