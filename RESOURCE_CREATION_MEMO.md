# 资源创建备忘录

**创建日期**: 2026-04-16  
**项目**: 封狼居胥 - 自走棋微信小程序  
**用途**: 记录所有需要手动创建的资源，包含详细提示词、文件名和路径

---

## 📋 使用说明

1. **复制提示词** → 到 AI 绘画工具生成
2. **保存为指定文件名** → 放到对应路径
3. **在 Cocos Creator 中刷新** → 资源自动导入

### 推荐的 AI 工具
- **图片生成**: Midjourney / Stable Diffusion / 通义万相 / DALL-E 3
- **音效生成**: AIVA / Soundraw / ElevenLabs
- **免费资源**: 
  - 图片：[OpenGameArt](https://opengameart.org/) / [itch.io Free Game Assets](https://itch.io/game-assets/free)
  - 音效：[Freesound](https://freesound.org/) / [OpenGameArt Audio](https://opengameart.org/art-search-advanced?keys=&field_art_type_tid%5B%5D=7)

---

## Part 1: UI 资源 (buttons/)

**路径**: `assets/resources/ui/buttons/`  
**总量**: 5 个按钮  
**规格**: PNG 透明背景，@3x 分辨率建议 200x80

---

### 1. 普通按钮
**文件名**: `btn_normal.png`  
**用途**: 按钮默认状态  
**提示词**:
```
mobile game button, normal state, rounded rectangle, 
modern UI design, gradient from light blue to dark blue, 
subtle shadow and highlight, clean vector art style, 
transparent background, no text, game UI element, 
suitable for fantasy mobile game, flat design with depth
--ar 5:2 --q 2
```

---

### 2. 按下按钮
**文件名**: `btn_pressed.png`  
**用途**: 按钮按下状态  
**提示词**:
```
mobile game button, pressed state, rounded rectangle, 
darker gradient, pressed shadow effect, 
modern UI design, clean vector art style, 
transparent background, no text, game UI element, 
showing button being clicked, slightly darker tones
--ar 5:2 --q 2
```

---

### 3. 禁用按钮
**文件名**: `btn_disabled.png`  
**用途**: 按钮禁用状态  
**提示词**:
```
mobile game button, disabled state, rounded rectangle, 
desaturated gray color, flat design, 
no shadow, modern UI design, 
transparent background, no text, game UI element, 
inactive button appearance, muted colors
--ar 5:2 --q 2
```

---

### 4. 刷新按钮图标
**文件名**: `btn_refresh.png`  
**用途**: 商店刷新按钮  
**提示词**:
```
refresh icon for mobile game, circular arrow symbol, 
blue gradient, clean modern design, 
transparent background, game UI element, 
simple recognizable refresh symbol, 
vector art style, suitable for fantasy game
--ar 1:1 --q 2
```

---

### 5. 升级按钮图标
**文件名**: `btn_levelup.png`  
**用途**: 升级按钮  
**提示词**:
```
level up icon for mobile game, upward arrow with stars, 
gold and blue gradient, fantasy style, 
transparent background, game UI element, 
progress and upgrade symbol, decorative design
--ar 1:1 --q 2
```

---

## Part 2: UI 资源 (icons/)

**路径**: `assets/resources/ui/icons/`  
**总量**: 10 个图标  
**规格**: PNG 透明背景，@3x 分辨率建议 64x64

---

### 1. 金币图标
**文件名**: `icon_gold.png`  
**用途**: 金币货币显示  
**提示词**:
```
gold coin icon for mobile game, circular coin with 
embossed symbol, shiny gold metal texture, 
fantasy style, transparent background, 
game currency icon, detailed but simple, 
suitable for auto chess game, 2D sprite
--ar 1:1 --q 2
```

---

### 2. 钻石图标
**文件名**: `icon_diamond.png`  
**用途**: 钻石货币显示  
**提示词**:
```
diamond gem icon for mobile game, cut gemstone, 
sparkling blue crystal, fantasy style, 
transparent background, game currency icon, 
polygonal gem design, shiny and valuable appearance
--ar 1:1 --q 2
```

---

### 3. 锁定图标
**文件名**: `icon_lock.png`  
**用途**: 锁定/解锁状态  
**提示词**:
```
lock icon for mobile game, traditional padlock, 
gold metal with keyhole, fantasy style, 
transparent background, game UI element, 
simple recognizable lock symbol, 2D sprite
--ar 1:1 --q 2
```

---

### 4. 星级图标 (1-5 星通用)
**文件名**: `icon_star.png`  
**用途**: 星级显示  
**提示词**:
```
star icon for mobile game, five-pointed star, 
bright gold color, shiny and glowing, 
fantasy style, transparent background, 
game rating element, clean design, 
suitable for mobile game UI, 2D sprite
--ar 1:1 --q 2
```

---

### 5. 剑图标
**文件名**: `icon_sword.png`  
**用途**: 攻击/战士职业  
**提示词**:
```
sword icon for mobile game, medieval knight sword, 
silver blade with gold hilt, fantasy style, 
transparent background, game element, 
recognizable weapon silhouette, 2D sprite
--ar 1:1 --q 2
```

---

### 6. 盾图标
**文件名**: `icon_shield.png`  
**用途**: 防御/坦克职业  
**提示词**:
```
shield icon for mobile game, medieval knight shield, 
blue and gold decoration, fantasy style, 
transparent background, game element, 
recognizable shield shape, 2D sprite
--ar 1:1 --q 2
```

---

### 7. 弓图标
**文件名**: `icon_bow.png`  
**用途**: 弓兵/射手职业  
**提示词**:
```
bow icon for mobile game, archer bow with arrow, 
wood and gold design, fantasy style, 
transparent background, game element, 
recognizable weapon silhouette, 2D sprite
--ar 1:1 --q 2
```

---

### 8. 书图标
**文件名**: `icon_book.png`  
**用途**: 谋士/军师职业  
**提示词**:
```
magic book icon for mobile game, spell book with 
mystical symbols, leather bound with gold trim, 
fantasy style, transparent background, 
game element, recognizable book shape, 2D sprite
--ar 1:1 --q 2
```

---

### 9. 血滴图标
**文件名**: `icon_health.png`  
**用途**: 生命值/医师职业  
**提示词**:
```
health drop icon for mobile game, red blood drop, 
bright red with highlight, fantasy style, 
transparent background, game element, 
recognizable health symbol, 2D sprite
--ar 1:1 --q 2
```

---

### 10. 闪电图标
**文件名**: `icon_energy.png`  
**用途**: 能量/技能  
**提示词**:
```
lightning bolt icon for mobile game, electric bolt, 
bright blue with glow effect, fantasy style, 
transparent background, game element, 
recognizable lightning shape, 2D sprite
--ar 1:1 --q 2
```

---

## Part 3: UI 资源 (panels/)

**路径**: `assets/resources/ui/panels/`  
**总量**: 8 个面板背景  
**规格**: PNG 透明背景，@3x 分辨率建议 400x300

---

### 1. 普通面板 1
**文件名**: `panel_common.png`  
**用途**: 普通品质面板背景  
**提示词**:
```
game UI panel background, common quality, 
dark gray rectangular frame with subtle decoration, 
fantasy mobile game style, transparent background, 
suitable for info panels and dialogs, 
clean vector design, slightly transparent center
--ar 4:3 --q 2
```

---

### 2. 稀有面板 2
**文件名**: `panel_rare.png`  
**用途**: 稀有品质面板背景  
**提示词**:
```
game UI panel background, rare quality, 
blue decorated frame with ornate corners, 
fantasy mobile game style, transparent background, 
suitable for info panels and dialogs, 
elegant design with blue accent colors
--ar 4:3 --q 2
```

---

### 3. 史诗面板 3
**_filename**: `panel_epic.png`  
**用途**: 史诗品质面板背景  
**提示词**:
```
game UI panel background, epic quality, 
purple decorated frame with gold trim, 
fantasy mobile game style, transparent background, 
suitable for info panels and dialogs, 
luxurious design with purple and gold details
--ar 4:3 --q 2
```

---

### 4. 传说面板 4
**文件名**: `panel_legendary.png`  
**用途**: 传说品质面板背景  
**提示词**:
```
game UI panel background, legendary quality, 
elaborate gold and orange fire-themed frame, 
fantasy mobile game style, transparent background, 
suitable for info panels and dialogs, 
magnificent ornate design with glowing effects
--ar 4:3 --q 2
```

---

### 5. 商店面板
**文件名**: `panel_shop.png`  
**用途**: 商店界面背景  
**提示词**:
```
shop panel background for mobile game, 
market stall style with wooden frame and fabric canopy, 
fantasy mobile game style, transparent background, 
suitable for shop interface, market theme, 
warm inviting colors, detailed decoration
--ar 16:9 --q 2
```

---

### 6. 棋子信息面板
**文件名**: `panel_chess_info.png`  
**用途**: 棋子详情面板  
**提示词**:
```
character info panel for mobile game, 
elegant rectangular frame with scroll-like borders, 
fantasy mobile game style, transparent background, 
suitable for character stats display, 
classy design with parchment texture hints
--ar 3:4 --q 2
```

---

### 7. 羁绊面板
**文件名**: `panel_bond.png`  
**用途**: 羁绊信息面板  
**提示词**:
```
synergy panel background for mobile game, 
connected nodes pattern with mystical symbols, 
fantasy mobile game style, transparent background, 
suitable for showing team bonds and synergies, 
geometric design with connection lines
--ar 16:9 --q 2
```

---

### 8. 设置面板
**文件名**: `panel_settings.png`  
**用途**: 设置界面背景  
**提示词**:
```
settings panel background for mobile game, 
clean minimalist design with gear motif borders, 
fantasy mobile game style, transparent background, 
suitable for options and settings menu, 
organized and clear design
--ar 4:3 --q 2
```

---

## Part 4: 背景资源 (bg/)

**路径**: `assets/resources/bg/`  
**总量**: 11 个背景  
**规格**: PNG 或 JPG，建议 1920x1080

---

### 一、棋盘地形背景 (8 种)

#### 1. 草坪地形
**文件名**: `bg_lawn.png`  
**用途**: 草坪棋盘背景  
**提示词**:
```
auto chess chessboard background, green grass field with 
checkered pattern, fantasy style, top-down view, 
suitable for mobile game, bright colorful grass squares, 
some flowers and decorations, pleasant nature scene, 
seamless tileable pattern, vibrant green tones
--ar 3:2 --q 2
```

---

#### 2. 沙漠地形
**文件名**: `bg_desert.png`  
**用途**: 沙漠棋盘背景  
**提示词**:
```
auto chess chessboard background, desert sand field with 
checkered pattern, fantasy style, top-down view, 
suitable for mobile game, yellow and orange sand squares, 
some rocks and cactus decorations, desert landscape, 
seamless tileable pattern, warm sandy tones
--ar 3:2 --q 2
```

---

#### 3. 深渊地形
**文件名**: `bg_abyss.png`  
**用途**: 深渊棋盘背景  
**提示词**:
```
auto chess chessboard background, dark abyss void field with 
checkered pattern, fantasy style, top-down view, 
suitable for mobile game, dark purple and black squares, 
mystical glowing runic symbols, mysterious dark atmosphere, 
seamless tileable pattern, ominous deep tones
--ar 3:2 --q 2
```

---

#### 4. 悬崖地形
**文件名**: `bg_cliff.png`  
**用途**: 悬崖棋盘背景  
**提示词**:
```
auto chess chessboard background, rocky cliff field with 
checkered pattern, fantasy style, top-down view, 
suitable for mobile game, gray and brown stone squares, 
rugged rocky texture, mountain landscape feel, 
seamless tileable pattern, earthy stone tones
--ar 3:2 --q 2
```

---

#### 5. 河流地形
**文件名**: `bg_river.png`  
**用途**: 河流棋盘背景  
**提示词**:
```
auto chess chessboard background, water river field with 
checkered pattern, fantasy style, top-down view, 
suitable for mobile game, blue water squares with waves, 
some fish and water effects, refreshing water scene, 
seamless tileable pattern, cool blue water tones
--ar 3:2 --q 2
```

---

#### 6. 森林地形
**文件名**: `bg_forest.png`  
**用途**: 森林棋盘背景  
**提示词**:
```
auto chess chessboard background, forest field with 
checkered pattern, fantasy style, top-down view, 
suitable for mobile game, green forest squares with trees, 
some mushrooms and plants, lush woodland scene, 
seamless tileable pattern, natural forest tones
--ar 3:2 --q 2
```

---

#### 7. 冰原地形
**文件名**: `bg_icefield.png`  
**用途**: 冰原棋盘背景  
**提示词**:
```
auto chess chessboard background, ice field with 
checkered pattern, fantasy style, top-down view, 
suitable for mobile game, white and light blue ice squares, 
crystal ice texture, frozen winter landscape, 
seamless tileable pattern, cold icy tones
--ar 3:2 --q 2
```

---

#### 8. 岩浆地形
**文件名**: `bg_lava.png`  
**用途**: 岩浆棋盘背景  
**提示词**:
```
auto chess chessboard background, lava field with 
checkered pattern, fantasy style, top-down view, 
suitable for mobile game, red and orange lava squares, 
glowing magma cracks, volcanic fiery atmosphere, 
seamless tileable pattern, hot fire tones
--ar 3:2 --q 2
```

---

### 二、界面背景 (3 个)

#### 9. 主菜单背景
**文件名**: `bg_main_menu.png`  
**用途**: 主菜单界面背景  
**提示词**:
```
mobile game main menu background, 
Chinese Han dynasty theme with Great Wall silhouette, 
sunset sky with clouds, majestic landscape, 
fantasy historical style, suitable for auto chess game, 
warm golden and orange sunset colors, 
epic atmosphere, 1920x1080 resolution
--ar 16:9 --q 2
```

---

#### 10. 大厅背景
**文件名**: `bg_lobby.png`  
**用途**: 大厅界面背景  
**提示词**:
```
mobile game lobby background, 
Chinese Han dynasty palace courtyard, 
military camp with tents and banners, 
fantasy historical style, suitable for auto chess game, 
organized and clean design, daytime scene, 
welcoming atmosphere, 1920x1080 resolution
--ar 16:9 --q 2
```

---

#### 11. 加载背景
**文件名**: `bg_loading.png`  
**用途**: 加载界面背景  
**提示词**:
```
mobile game loading screen background, 
simple gradient with game logo placement area, 
Chinese Han dynasty pattern decorations, 
fantasy historical style, suitable for auto chess game, 
dark background with subtle patterns, 
clean design for text overlay, 1920x1080 resolution
--ar 16:9 --q 2
```

---

## Part 5: 音频资源

**路径**: `assets/resources/audio/`  
**总量**: 13 个音频文件  
**规格**: MP3 格式，BGM 建议 2-3 分钟，SFX 建议 1-3 秒

---

### BGM (背景音乐)

**路径**: `assets/resources/audio/bgm/`  
**工具推荐**: [AIVA](https://www.aiva.ai/) / [Soundraw](https://soundraw.io/) / [Hans Zimmer String Theory](https://www.hszstringtheory.com/)

---

#### 1. 主菜单 BGM
**文件名**: `main_menu.mp3`  
**用途**: 主菜单背景音乐  
**时长**: 2-3 分钟  
**风格**: 史诗中国风  
**提示词** (用于 AI 音乐生成):
```
epic Chinese Han dynasty orchestral music, 
traditional Chinese instruments (erhu, guzheng, pipa), 
majestic and welcoming atmosphere, 
suitable for mobile game main menu, 
moderate tempo, heroic and grand, 
2-3 minutes length, loopable, high quality MP3, 
fantasy historical game soundtrack
```

---

#### 2. 大厅 BGM
**文件名**: `lobby.mp3`  
**用途**: 大厅背景音乐  
**时长**: 2-3 分钟  
**风格**: 轻松中国风  
**提示词**:
```
relaxing Chinese traditional music, 
light orchestral with Chinese instruments, 
calm and peaceful atmosphere, 
suitable for mobile game lobby area, 
slow to moderate tempo, background ambience, 
2-3 minutes length, loopable, high quality MP3, 
fantasy game background music
```

---

#### 3. 战斗 BGM
**文件名**: `battle.mp3`  
**用途**: 战斗场景背景音乐  
**时长**: 2-3 分钟  
**风格**: 激烈战斗音乐  
**提示词**:
```
intense battle music for mobile game, 
epic orchestral with Chinese war drums, 
fast tempo and dramatic, 
suitable for auto chess combat, 
action-packed and exciting, 
military fanfare and heroic themes, 
2-3 minutes length, loopable, high quality MP3, 
fantasy battle soundtrack
```

---

#### 4. 胜利 BGM
**文件名**: `victory.mp3`  
**用途**: 胜利结算音乐  
**时长**: 30-60 秒  
**风格**: 胜利庆典  
**提示词**:
```
victory fanfare music for mobile game, 
triumphant and celebratory, 
Chinese traditional instruments with brass, 
short 30-60 seconds length, 
suitable for win screen, 
energetic and joyful, high quality MP3, 
fantasy game victory theme
```

---

#### 5. 失败 BGM
**文件名**: `defeat.mp3`  
**用途**: 失败结算音乐  
**时长**: 30-60 秒  
**风格**: 悲伤但不绝望  
**提示词**:
```
defeat music for mobile game, 
melancholic but not too dark, 
Chinese traditional erhu and soft strings, 
short 30-60 seconds length, 
suitable for loss screen, 
sorrowful but hopeful for next battle, 
high quality MP3, fantasy game defeat theme
```

---

### SFX (音效)

**路径**: `assets/resources/audio/sfx/`  
**工具推荐**: [Freesound](https://freesound.org/) / [BFXR](https://www.bfxr.net/) / [ChipTone](https://sfbgames.itch.io/chiptone)

---

#### 6. 按钮点击音效
**文件名**: `button_click.mp3`  
**用途**: 所有按钮点击反馈  
**时长**: 0.5-1 秒  
**提示词**:
```
UI button click sound effect, 
clean modern UI sound, short and crisp, 
suitable for mobile game interface, 
positive feedback tone, 
0.5-1 second length, high quality MP3, 
game UI interaction sound
```

---

#### 7. 棋子选中音效
**文件名**: `chess_select.mp3`  
**用途**: 选中棋子时播放  
**时长**: 0.5-1 秒  
**提示词**:
```
chess piece selection sound effect, 
magical fantasy highlight tone, 
short and clear, suitable for mobile game, 
character selection feedback, 
0.5-1 second length, high quality MP3, 
game interaction sound
```

---

#### 8. 棋子放置音效
**文件名**: `chess_place.mp3`  
**用途**: 放置棋子到棋盘  
**时长**: 0.5-1 秒  
**提示词**:
```
chess piece placement sound effect, 
solid thud with magical accent, 
satisfying placement feedback, 
suitable for mobile game, 
0.5-1 second length, high quality MP3, 
game interaction sound
```

---

#### 9. 棋子出售音效
**文件名**: `chess_sell.mp3`  
**用途**: 出售棋子  
**时长**: 0.5-1 秒  
**提示词**:
```
sell transaction sound effect, 
coin jingle with magical sparkle, 
positive feedback for selling, 
suitable for mobile game, 
0.5-1 second length, high quality MP3, 
economy transaction sound
```

---

#### 10. 攻击命中音效
**文件名**: `attack_hit.mp3`  
**用途**: 普通攻击命中  
**时长**: 0.5-1 秒  
**提示词**:
```
sword hit impact sound effect, 
metal clash with body hit, 
suitable for fantasy mobile game, 
combat feedback sound, 
0.5-1 second length, high quality MP3, 
battle action sound
```

---

#### 11. 技能触发音效
**文件名**: `skill_activate.mp3`  
**用途**: 棋子技能释放  
**时长**: 1-2 秒  
**提示词**:
```
magic skill activation sound effect, 
magical buildup and release, 
fantasy spell sound, 
suitable for mobile game abilities, 
1-2 seconds length, high quality MP3, 
combat magic sound
```

---

#### 12. 获得金币音效
**文件名**: `gold_gain.mp3`  
**用途**: 获得金币  
**时长**: 0.5-1 秒  
**提示词**:
```
coin gain sound effect, 
satisfying coin jingle and chime, 
positive reward feedback, 
suitable for mobile game economy, 
0.5-1 second length, high quality MP3, 
treasure collection sound
```

---

#### 13. 商店刷新音效
**文件名**: `shop_refresh.mp3`  
**用途**: 刷新商店  
**时长**: 0.5-1 秒  
**提示词**:
```
shop refresh sound effect, 
magical sparkle and card shuffle, 
refresh and renewal feedback, 
suitable for mobile game shop, 
0.5-1 second length, high quality MP3, 
economy interaction sound
```

---

## Part 6: 剩余棋子资源

**路径**: `assets/resources/chess/`  
**总量**: 51 个棋子待生成  
**规格**: PNG 透明背景，@3x 分辨率 300x450

---

### 汉军棋子 (30 个待生成)

**现有**: 21 个 ✅  
**缺失**: 30 个 ⏳

#### 骑兵系补充
| 文件名 | 提示词 |
|--------|--------|
| `han_cavalry_veteran.png` | Q 版手绘卡通风格的汉军资深骑兵，骑马持枪，朱砂红色盔甲，经验老道表情，透明背景，游戏角色立绘 |
| `han_cavalry_elite.png` | Q 版手绘卡通风格的汉军精英骑兵，豪华战马，朱砂红色精甲，自信表情，透明背景，游戏角色立绘 |
| `han_cavalry_commander.png` | Q 版手绘卡通风格的汉军骑兵将领，骑披甲战马，朱砂红色将领盔甲，指挥姿态，透明背景，游戏角色立绘 |
| `han_cataphract.png` | Q 版手绘卡通风格的汉军具装骑兵，人马俱甲，朱砂红色重装甲，强大气场，透明背景，游戏角色立绘 |
| `han_mounted_general.png` | Q 版手绘卡通风格的汉军马上将军，朱砂红色将军盔甲，骑白马，威武霸气，透明背景，游戏角色立绘 |
| `han_desert_rider.png` | Q 版手绘卡通风格的汉军沙漠骑兵，适应沙漠作战，朱砂红色轻甲，坚毅表情，透明背景，游戏角色立绘 |
| `han_frontier_rider.png` | Q 版手绘卡通风格的汉军边防骑兵，边境巡逻装束，朱砂红色边防盔甲，警惕眼神，透明背景，游戏角色立绘 |

#### 步兵系补充
| 文件名 | 提示词 |
|--------|--------|
| `han_infantry_veteran.png` | Q 版手绘卡通风格的汉军资深步兵，朱砂红色老兵盔甲，手持长兵器，战斗经验丰富的表情，透明背景，游戏角色立绘 |
| `han_infantry_elite.png` | Q 版手绘卡通风格的汉军精英步兵，朱砂红色精甲，精锐部队徽章，自信表情，透明背景，游戏角色立绘 |
| `han_infantry_commander.png` | Q 版手绘卡通风格的汉军步兵将领，朱砂红色将领盔甲，指挥刀，指挥官气场，透明背景，游戏角色立绘 |
| `han_legionary.png` | Q 版手绘卡通风格的汉军团兵，军团制式盔甲，朱砂红色标准装备，整齐划一，透明背景，游戏角色立绘 |
| `han_skirmisher.png` | Q 版手绘卡通风格的汉军散兵，轻装机动，朱砂红色轻甲，灵活敏捷，透明背景，游戏角色立绘 |
| `han_standard_bearer.png` | Q 版手绘卡通风格的汉军旗手，手持军旗，朱砂红色仪仗盔甲，庄重表情，透明背景，游戏角色立绘 |

#### 弓兵系补充
| 文件名 | 提示词 |
|--------|--------|
| `han_archer_veteran.png` | Q 版手绘卡通风格的汉军资深弓手，朱砂红色老兵装备，手持强弓，精准眼神，透明背景，游戏角色立绘 |
| `han_archer_elite.png` | Q 版手绘卡通风格的汉军精英弓手，朱砂红色精甲，神射手徽章，专注表情，透明背景，游戏角色立绘 |
| `han_archer_commander.png` | Q 版手绘卡通风格的汉军弓兵将领，朱砂红色将领盔甲，指挥弓，领导者气场，透明背景，游戏角色立绘 |
| `han_sniper.png` | Q 版手绘卡通风格的汉军狙击手，特制长弓，朱砂红色狙击装备，极度专注，透明背景，游戏角色立绘 |
| `han_volley_archer.png` | Q 版手绘卡通风格的汉军齐射弓兵，朱砂红色齐射部队制服，整齐划一动作，透明背景，游戏角色立绘 |

#### 谋士系补充
| 文件名 | 提示词 |
|--------|--------|
| `han_tactician.png` | Q 版手绘卡通风格的汉军战术家，手持战术图，墨绿色智者袍，深谋远虑表情，透明背景，游戏角色立绘 |
| `han_oracle.png` | Q 版手绘卡通风格的汉军占卜师，手持八卦，墨绿色占卜师长袍，神秘表情，透明背景，游戏角色立绘 |
| `han_logistics.png` | Q 版手绘卡通风格的汉军军需官，手持账本，墨绿色官员袍，精明表情，透明背景，游戏角色立绘 |
| `han_diplomat.png` | Q 版手绘卡通风格的汉军外交官，手持诏书，墨绿色文官袍，机智表情，透明背景，游戏角色立绘 |
| `han_historian.png` | Q 版手绘卡通风格的汉军史官，手持竹简，墨绿色学者袍，学者气质，透明背景，游戏角色立绘 |

#### 武将系补充
| 文件名 | 提示词 |
|--------|--------|
| `han_champion.png` | Q 版手绘卡通风格的汉军勇士，双持重型武器，朱砂红色勇士盔甲，威猛无比，透明背景，游戏角色立绘 |
| `han_duelist.png` | Q 版手绘卡通风格的汉军决斗者，手持名剑，朱砂红色决斗盔甲，好战表情，透明背景，游戏角色立绘 |
| `han_guardian.png` | Q 版手绘卡通风格的汉军护卫，重甲持盾，朱砂红色护卫盔甲，忠诚坚定表情，透明背景，游戏角色立绘 |

#### 医师系补充
| 文件名 | 提示词 |
|--------|--------|
| `han_field_surgeon.png` | Q 版手绘卡通风格的汉军战场医师，急救装备，墨绿色军医袍，专业表情，透明背景，游戏角色立绘 |
| `han_acupuncturist.png` | Q 版手绘卡通风格的汉军针灸师，银针医具，墨绿色针医师袍，专注表情，透明背景，游戏角色立绘 |
| `han_herbalist.png` | Q 版手绘卡通风格的汉军草药师，采药篓，墨绿色药师袍，慈祥表情，透明背景，游戏角色立绘 |

---

### 匈奴棋子 (21 个待生成)

**现有**: 13 个 ✅  
**缺失**: 21 个 ⏳

#### 骑兵系补充
| 文件名 | 提示词 |
|--------|--------|
| `xiongnu_cavalry_veteran.png` | Q 版手绘卡通风格的匈奴资深骑兵，骑经验丰富战马，土黄色和棕色老兵盔甲，老练表情，透明背景，游戏角色立绘 |
| `xiongnu_cavalry_elite.png` | Q 版手绘卡通风格的匈奴精英骑兵，豪华战马装备，土黄色精甲，骄傲表情，透明背景，游戏角色立绘 |
| `xiongnu_horde_rider.png` | Q 版手绘卡通风格的匈奴铁骑，大规模骑兵部队，土黄色和棕色铁骑盔甲，凶猛冲锋姿态，透明背景，游戏角色立绘 |
| `xiongnu_cataphract.png` | Q 版手绘卡通风格的匈奴具装骑兵，人马俱甲，土黄色重装甲，压倒性气场，透明背景，游戏角色立绘 |
| `xiongnu_tribal_rider.png` | Q 版手绘卡通风格的匈奴部落骑兵，部落装饰，土黄色和棕色部落盔甲，野性表情，透明背景，游戏角色立绘 |
| `xiongnu_steppe_rider.png` | Q 版手绘卡通风格的匈奴草原骑兵，草原民族特色，土黄色草原盔甲，自由奔放表情，透明背景，游戏角色立绘 |
| `xiongnu_raider.png` | Q 版手绘卡通风格的匈奴袭击骑兵，快速突袭装备，土黄色轻甲，狡黠表情，透明背景，游戏角色立绘 |
| `xiongnu_scout.png` | Q 版手绘卡通风格的匈奴侦察骑兵，侦察装备，土黄色侦察兵盔甲，机警表情，透明背景，游戏角色立绘 |

#### 弓兵系补充
| 文件名 | 提示词 |
|--------|--------|
| `xiongnu_archer_veteran.png` | Q 版手绘卡通风格的匈奴资深弓手，复合弓，棕色老兵装备，精准眼神，透明背景，游戏角色立绘 |
| `xiongnu_archer_elite.png` | Q 版手绘卡通风格的匈奴精英弓手，顶级复合弓，土黄色精甲，神射手气场，透明背景，游戏角色立绘 |
| `xiongnu_hunter.png` | Q 版手绘卡通风格的匈奴猎人，狩猎弓，棕色猎人装备，敏锐眼神，透明背景，游戏角色立绘 |
| `xiongnu_sniper.png` | Q 版手绘卡通风格的匈奴狙击手，特制长弓，土黄色狙击装备，极度专注，透明背景，游戏角色立绘 |
| `xiongnu_volley_archer.png` | Q 版手绘卡通风格的匈奴齐射弓兵，齐射部队制服，土黄色齐射装备，整齐动作，透明背景，游戏角色立绘 |

#### 步兵系补充
| 文件名 | 提示词 |
|--------|--------|
| `xiongnu_infantry_veteran.png` | Q 版手绘卡通风格的匈奴资深步兵，战斗经验丰富，土黄色和棕色老兵盔甲，老练表情，透明背景，游戏角色立绘 |
| `xiongnu_infantry_elite.png` | Q 版手绘卡通风格的匈奴精英步兵，精锐部队，土黄色精甲，自信表情，透明背景，游戏角色立绘 |
| `xiongnu_berzerker.png` | Q 版手绘卡通风格的匈奴狂战士，双手武器，土黄色狂战装备，狂暴表情，透明背景，游戏角色立绘 |
| `xiongnu_skirmisher.png` | Q 版手绘卡通风格的匈奴散兵，轻装灵活，土黄色轻甲，敏捷表情，透明背景，游戏角色立绘 |
| `xiongnu_guardian.png` | Q 版手绘卡通风格的匈奴护卫，重甲守卫，土黄色护卫盔甲，忠诚表情，透明背景，游戏角色立绘 |

#### 刺客系补充
| 文件名 | 提示词 |
|--------|--------|
| `xiongnu_shadow_assassin.png` | Q 版手绘卡通风格的匈奴暗影刺客，黑影斗篷，深色暗影装备，致命眼神，透明背景，游戏角色立绘 |
| `xiongnu_poison_assassin.png` | Q 版手绘卡通风格的匈奴毒师刺客，淬毒匕首，土黄色和紫色毒师装备，阴险表情，透明背景，游戏角色立绘 |
| `xiongnu_spy.png` | Q 版手绘卡通风格的匈奴间谍，伪装装备，土黄色间谍服装，机警表情，透明背景，游戏角色立绘 |
| `xion-gnu_tracker.png` | Q 版手绘卡通风格的匈奴追踪者，追踪装备，土黄色追踪者服装，专注眼神，透明背景，游戏角色立绘 |

---

## ✅ 创建清单

### UI 资源
- [ ] buttons/ 5 个按钮
- [ ] icons/ 10 个图标
- [ ] panels/ 8 个面板

### 背景资源
- [ ] bg/ 8 个棋盘地形
- [ ] bg/ 3 个界面背景

### 音频资源
- [ ] audio/bgm/ 5 首背景音乐
- [ ] audio/sfx/ 8 个音效

### 棋子资源
- [ ] chess/han/ 30 个汉军棋子
- [ ] chess/xiongnu/ 21 个匈奴棋子

---

## 📝 创建完成后

1. **保存文件到对应路径**
2. **在 Cocos Creator 中刷新资源**
3. **检查资源是否导入成功**
4. **在场景中绑定资源**

祝创建顺利！🎨
