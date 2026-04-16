# AI 绘画提示词指南 - 封狼居胥自走棋 (优化版 v2)

本指南用于使用 Midjourney / Stable Diffusion 等 AI 工具生成游戏 UI 资源。

**版本**: v2.0 (已优化手机游戏特性、去水印、年龄化、地形系统)

---

## 通用风格设定 (核心 Prompt)

### 基础 Style Prompt (手绘涂鸦卡通)
```
hand-drawn cartoon style, doodle art, sketchy charcoal lines, warm color palette, 
parchment texture background, cute chibi proportions, playful and whimsical, 
mobile game UI design, flat illustration, clean edges for cutout, 
no watermark, no text, no signature, no copyright mark --ar 16:9 --stylize 250
```

### 负面提示词 (Negative Prompt) - 增强版
```
photorealistic, 3d render, cg art, anime, manga, clean lines, vector art, 
gradient, shiny, glossy, dark, horror, realistic, watermark, text, signature, 
copyright, logo, brand name, blurred, low quality, deformed, ugly, extra limbs, 
missing fingers, bad anatomy, disfigured, poorly drawn, mutated hands, 
poorly drawn face, floating limbs, disconnected limbs, malformed hands, 
out of focus, long neck, long body, bad proportions, unrealistic, 
photographic, photographic realism, photograph, photography
```

### 年龄化设计指南

**目标用户**: 12+ 岁青少年及成人 (轻度策略游戏玩家)

**Q 版比例规范**:
```
- 头身比：2.5-3 头身 (更可爱)
- 眼睛：大而有神，占脸部 1/3
- 四肢：简化但结构合理
- 色彩：明亮饱和度高，避免暗黑
- 表情：友好积极，避免恐怖/血腥
```

**风格关键词**:
```
cute chibi, kid-friendly but not childish, all-ages appeal, 
whimsical and fun, approachable design, friendly characters
```

---

## 手机游戏特性规范

### 分辨率和输出规格

**竖屏模式 (Portrait)**:
- 主界面：750x1334 (@2x), 1125x2001 (@3x)
- 安全区域：上下各留 150px (刘海屏适配)
- Prompt 参数：`--ar 9:16` 或 `--ar 3:4`

**横屏模式 (Landscape)**:
- 战斗界面：1334x750 (@2x), 2001x1125 (@3x)
- 安全区域：左右各留 100px
- Prompt 参数：`--ar 16:9` 或 `--ar 3:2`

**UI 元素**:
- 按钮/图标：输出多尺寸 (@1x, @2x, @3x)
- Prompt 参数：`--tile` (可平铺), `--no crop`

### Midjourney 手机优化参数
```
--ar 9:16          # 竖屏全屏
--ar 16:9          # 横屏全屏
--ar 3:4           # 角色立绘
--ar 1:1           # 图标
--v 5.2            # 最新版本
--stylize 200-300  # 中等风格化
--quality 1        # 标准质量 (生成更快)
--no watermark text signature logo brand  # 移除水印文字
```

### Safe Area 提示词模板
```
mobile game UI, safe area for notch display, leave top 15% empty for status bar, 
leave bottom 15% empty for gesture bar,UI elements in center safe zone, 
no important content near edges, touch-friendly button sizes --ar 9:16
```

---

## 主界面生成 (已优化)

### Prompt 1: 主界面背景 (竖屏)
```
mobile game main lobby background, hand-drawn cartoon style, ancient chinese 
military camp theme, parchment paper texture, warm beige color, sketchy tent 
silhouettes in background, charcoal border frame, empty center for logo, 
UI safe area for mobile, no UI elements in top 15% and bottom 15%, 
flat illustration for game interface, no watermark, no text, no signature, 
cute cartoon style, all-ages friendly --ar 9:16 --stylize 250 --v 5.2
```

### Prompt 2: Logo 区域
```
chinese calligraphy logo "封狼居胥", hand-painted brush strokes, red ink seal 
stamp, ancient scroll banner, cartoon style, game title design, isolated on 
transparent background, professional game logo, no watermark, clean edges --ar 3:1
```

### Prompt 3: 开始按钮 (大，触摸友好)
```
large game start button for mobile touch, minimum 120x80 pixels, hand-drawn 
cartoon style, vermilion red color, golden border frame, ancient chinese 
ornament pattern, rectangular with rounded corners, doodle art style, 
game UI button, clear visual feedback states, easy to tap, 
no watermark, no text --ar 4:1 --tile
```

Prompt 变体：
```
-- 正常状态: add "normal state, bright colors"
-- 按下状态：add "pressed state, slightly darker, shadow effect"
-- 禁用状态：add "disabled state, greyed out, low saturation"
```

---

## 棋子立绘生成 (已优化)

### 年龄化规范
```
cute chibi style, 2.5-3 heads tall proportion, large expressive eyes, 
simplified anatomy, friendly expression, suitable for 12+ age rating, 
no violence, no gore, no scary elements, colorful and appealing to 
teenagers and adults, approachable character design
```

### 霍去病 (汉军核心武将，5 费传说)
```
cute chibi general huo qubing, ancient chinese han dynasty military commander, 
riding wolf mount, dynamic charging pose, heroic smile, hand-drawn cartoon 
style, doodle art, bold charcoal outlines, warm vibrant colors, 
traditional chinese armor with ornate details, spear weapon, 
character sprite for auto chess mobile game, full body portrait, 
isolated on pure white background, clean edges for cutout, 
no watermark, no text, no signature, copyright free, all-ages friendly --ar 3:4 --stylize 250 --v 5.2
```

### 卫青 (汉军骑兵，4 费史诗)
```
cute chibi general wei qing, ancient chinese han dynasty cavalry commander, 
standing beside horse mount, confident friendly smile, hand-drawn cartoon 
style, sketchy charcoal lines, green and brown color palette, 
traditional armor simplified design, sword weapon, relaxed pose, 
character design for mobile game, full body, clean white background, 
no watermark, no text, suitable for teenagers 12+, cute but cool --ar 3:4 --stylize 200 --v 5.2
```

### 单于 (匈奴领袖，5 费传说)
```
cute chibi xiongnu chanyu king, ancient nomadic tribal leader, 
wolf fur cloak and tribal ornaments, bow weapon, fierce but not 
scary expression, hand-drawn cartoon doodle style, warm earth tone 
colors, brown and yellow palette, barbarian general design but 
friendly cartoon style, ancient china northern tribes, 
character sprite for mobile game, full body on white background, 
no watermark, no text, age appropriate 12+, approachable villain --ar 3:4 --v 5.2
```

### 左贤王 (匈奴骑兵，4 费史诗)
```
cute chibi xiongnu left virtuous king, nomadic cavalry warrior, 
wolf head helmet, horse companion, dynamic action pose, 
hand-drawn cartoon style, sketchy charcoal lines, warm earth colors, 
tribal armor with fur details, curved sword, friendly expression, 
game character design, clean white background, no watermark, 
no text, no signature, suitable for all ages --ar 3:4 --stylize 200
```

### 通用 1 费棋子模板 (普通士兵)
```
cute chibi ancient chinese soldier, simple armor, basic weapon, 
neutral friendly pose, hand-drawn cartoon style, doodle art, 
friendly approachable expression, common rarity design, 
grey and brown muted colors, character sprite for auto chess game, 
full body on white background, clean edges for cutout, 
no watermark, no text, beginner friendly design --ar 3:4 --stylize 150 --v 5.2
```

### 棋子输出清单
```
每个棋子输出：
1. [chess_name]_full@2x.png  - 完整立绘 (120x160 @2x)
2. [chess_name]_full@3x.png  - 完整立绘 (180x240 @3x)
3. [chess_name]_icon@2x.png  - 头像图标 (64x64 @2x)
4. [chess_name]_icon@3x.png  - 头像图标 (96x96 @3x)
```

---

## UI 组件生成 (触摸优化)

### 按钮组 (触摸友好尺寸)
```
mobile game UI button set, touch-friendly sizes minimum 120x80 pixels, 
hand-drawn cartoon style, vermilion red and golden colors, 
ancient chinese ornament patterns, rounded rectangles with 
12px radius for comfortable tap, charcoal outlines, 
normal pressed disabled states visible, sketchy doodle art, 
mobile game interface elements, no watermark, no text --ar 16:9 --tile --v 5.2
```

### 资源图标 (清晰可识别)
```
game currency icons set for mobile, large and clear symbols, 
hand-drawn cartoon style, gold coins with ¥ symbol, 
silver taels, jade ingots, ancient chinese money, 
doodle art, warm vibrant colors, charcoal outlines, 
isolated on white background, game UI resources, 
easy to recognize at small sizes, no watermark --ar 4:3 --tile --v 5.2
```

### 血条进度条 (移动端优化)
```
health bar and progress bar for mobile game, thick enough for 
mobile visibility minimum 20px height, hand-drawn wooden frame style, 
ancient chinese design, red to green gradient fill, 
charcoal sketchy outlines, doodle art, multiple length variations, 
clear contrast for outdoor visibility, no watermark --ar 8:1 --tile --v 5.2
```

### 弹窗背景 (适配不同屏幕)
```
dialog box background for mobile game, scalable design, 
parchment paper texture, hand-drawn charcoal border frame 
minimum 5px thick, ancient chinese scroll style, 
rounded corners 12px radius, warm beige color, 
sketchy doodle art, game UI modal background, 
center area clear for text content, no watermark, 
safe area for notch displays --ar 3:4 --v 5.2
```

---

## 羁绊图标生成 (小屏优化)

### 汉军阵营图标
```
han dynasty faction icon for mobile game, simple recognizable design 
at 64x64 pixels, chinese dragon symbol simplified, circular badge design, 
military green color, hand-drawn cartoon style, thick outlines 
minimum 3px for visibility, doodle art, ancient chinese ornament 
pattern, game UI faction emblem, no small details, no watermark --ar 1:1 --v 5.2
```

### 匈奴阵营图标
```
xiongnu tribe faction icon for mobile game, clear at small sizes, 
white wolf symbol simplified design, circular badge, earth yellow 
color, hand-drawn cartoon style, bold charcoal outlines, 
nomadic tribal pattern, game UI faction emblem, minimal details 
for mobile clarity, no watermark, no text --ar 1:1 --v 5.2
```

### 骑兵职业图标
```
cavalry profession icon for mobile, recognizable at 64x64 pixels, 
horse head and spear symbol, circular badge, warm brown color, 
hand-drawn cartoon style, thick sketchy outlines, game UI 
class emblem, simple and clear, no watermark --ar 1:1 --tile --v 5.2
```

### 弩兵职业图标
```
archer profession icon for mobile game, bow and arrow symbol, 
circular badge, forest green color, hand-drawn cartoon style, 
bold charcoal outlines, game UI class emblem, clear silhouette, 
no intricate details, no watermark, no text --ar 1:1 --tile --v 5.2
```

---

## 棋盘地形系统 (新增核心特性)

### 随机地形设计规范

**设计理念**: 每局游戏随机生成不同地形，地形影响棋子移动和战斗。

**地形类型**:
1. **平原/草坪** - 基础地形，无特殊效果
2. **沙漠** - 降低移动速度 20%
3. **深渊** - 不可通行，棋子需绕行
4. **悬崖** - 远程棋子可跨越，近战不可
5. **河流** - 降低防御 15%
6. **森林** - 提升闪避 10%
7. **冰原** - 有几率滑倒失控
8. **岩浆** - 持续伤害区域

### Prompt 1: 草坪地形 (基础)
```
auto chess game board terrain, green grassland plain, top-down view 
90 degrees, hand-drawn cartoon style, warm green colors, 
parchment texture overlay, charcoal sketchy lines, grid-less free 
movement area, mobile game play area, no UI elements, 
isolated on white background, seamless tileable edges, 
no watermark, no text, clear boundaries for collision --ar 3:2 --tile --v 5.2
```

### Prompt 2: 沙漠地形 (减速)
```
auto chess game board terrain, yellow desert sand dunes, top-down 
view 90 degrees, hand-drawn cartoon style, warm yellow and 
orange colors, sand texture details, sketchy charcoal outlines, 
mobile game battleground, no UI, isolated on white, 
seamless tileable for game map, no watermark, no text --ar 3:2 --tile --stylize 200 --v 5.2
```

### Prompt 3: 深渊地形 (障碍)
```
auto chess game board terrain, dark abyss chasm, deep purple and 
black colors, glowing purple cracks, top-down view 90 degrees, 
hand-drawn cartoon style but not scary, charcoal sketchy lines, 
impassable obstacle area for game, mobile game map element, 
isolated on white, clear edges for collision detection, 
cute cartoon style not horror, no watermark, no text --ar 3:2 --tile --v 5.2
```

### Prompt 4: 悬崖地形 (高低差)
```
auto chess game board terrain, cliff edge elevation difference, 
brown rocky cliffs, top-down view 90 degrees, hand-drawn 
cartoon style, warm earth colors, charcoal sketchy outlines, 
ranged units can cross, melee blocked, mobile game terrain, 
isolated on white, clear boundary line, no watermark, no text --ar 3:2 --tile --v 5.2
```

### Prompt 5: 河流地形 (减益)
```
auto chess game board terrain, flowing river stream, light blue 
water with cartoon waves, top-down view 90 degrees, hand-drawn 
cartoon style, bright blue and cyan colors, charcoal sketchy 
outlines, water splash details, mobile game map, isolated on 
white, seamless tileable, no watermark, no text --ar 3:2 --tile --v 5.2
```

### Prompt 6: 森林地形 (增益)
```
auto chess game board terrain, dense forest woodland, green trees 
canopy view from above, top-down 90 degrees, hand-drawn 
cartoon style, various green shades, charcoal sketchy lines, 
tree positioning for cover mechanics, mobile game battleground, 
isolated on white, no watermark, no text --ar 3:2 --tile --stylize 250 --v 5.2
```

### Prompt 7: 冰原地形 (随机失控)
```
auto chess game board terrain, ice frozen tundra, light blue 
and white ice cracks, top-down view 90 degrees, hand-drawn 
cartoon style, cold color palette, charcoal sketchy outlines, 
slippery surface visual, mobile game map, isolated on white, 
seamless edges, no watermark, no text --ar 3:2 --tile --v 5.2
```

### Prompt 8: 岩浆地形 (持续伤害)
```
auto chess game board terrain, volcanic lava field, orange 
and red molten rock, top-down view 90 degrees, hand-drawn 
cartoon style not scary, warm fiery colors, charcoal sketchy 
outlines, glowing lava cracks, cartoon fire effects, 
mobile game danger zone, isolated on white, no watermark, 
no text, cute not horrifying --ar 3:2 --tile --v 5.2
```

### 地形输出规格
```
每个地形输出：
1. [terrain_name]_full@2x.png  - 完整地形 (1200x800 @2x)
2. [terrain_name]_full@3x.png  - 完整地形 (1800x1200 @3x)
3. [terrain_name]_tile@2x.png  - 可平铺单元 (400x400 @2x)
4. [terrain_name]_overlay.png  - 效果覆盖层 (透明 PNG)

提示词必加：--tile (可平铺), --ar 3:2 (棋盘比例)
```

---

## 技能特效生成 (移动端优化)

### 骑兵冲锋特效
```
cavalry charge effect for mobile game, motion lines and dust cloud, 
hand-drawn cartoon style, warm earth colors, dynamic speed lines, 
game VFX sprite sheet, isolated on transparent background, 
optimized for mobile performance, simple particle effects, 
no watermark, no text, multiple frames for animation --ar 16:9 --v 5.2
```

### 剑击特效 (序列帧)
```
sword attack effect for mobile, hand-drawn cartoon slash, white 
and yellow color, dynamic arc, sketchy lines, doodle art, 
game VFX sprite sheet, 6 frames animation sequence, isolated 
on black background, optimized file size for mobile, 
no watermark, no text --ar 1:1 --v 5.2
```

### 防御护盾特效
```
shield buff effect for mobile game, circular protective barrier, 
light blue color, hand-drawn cartoon style, doodle art, 
glowing outline, ancient chinese pattern, game VFX, 
isolated on transparent background, simple geometry for 
mobile performance, no watermark --ar 1:1 --tile --v 5.2
```

### 击败特效 (可爱不血腥)
```
defeat explosion effect for mobile game, hand-drawn cartoon 
style, orange and red colors, comic book explosion, 
doodle art, sketchy lines, game VFX, cute not violent, 
no blood no gore, suitable for 12+, multiple frames, 
isolated on transparent background, no watermark --ar 1:1 --v 5.2
```

---

## 场景背景生成 (横屏战斗)

### 主战场 (汉军视角，横屏)
```
battlefield background for mobile game landscape mode, ancient 
chinese han dynasty military camp, mountains in distance, 
tents and flags, hand-drawn cartoon style, warm afternoon 
lighting, parchment texture overlay, doodle art, 
safe area for mobile UI overlay, leave center 60% clear 
for chess board, flat illustration, no watermark, no text --ar 16:9 --stylize 300 --v 5.2
```

### 主战场 (匈奴视角，横屏)
```
battlefield background for mobile game landscape, nomadic 
xiongnu tribe camp, grassland and yurts, wolf totems, 
evening sunset, hand-drawn cartoon style, earth tone colors, 
sketchy doodle art, mobile game landscape background, 
UI safe area for top and bottom bars, no important 
details near edges, no watermark, no text --ar 16:9 --v 5.2
```

### 通用棋盘区域 (透明底)
```
game chess board area, ancient chinese battle map, parchment 
paper map texture, top-down view 90 degrees, warm beige colors, 
charcoal sketchy lines, doodle art, mobile game play area, 
isolated on pure white background for transparency, 
no watermark, no text, grid-less free movement --ar 3:2 --v 5.2
```

---

## Stable Diffusion 专用配置 (优化版)

### 模型推荐
```
主模型：
- Anything V5 (动漫卡通平衡)
- Counterfeit V3.0 (更适合游戏美术)
- ToonYou (Q 版专用)

备选：
- openjourney (MJ 风格平替)
- ghostmix (2.5D 卡通)
```

### 推荐参数
```
Model: Counterfeit V3.0
Sampler: DPM++ 2M Karras
Steps: 28-35
CFG Scale: 7-9
Size: 
  - 竖图：512x768 (适配 9:16)
  - 横图：768x512 (适配 16:9)
  - 棋子：512x683 (适配 3:4)
  - 图标：512x512 (适配 1:1)
Hires. fix: 启用，2x 放大，Denoising 0.3-0.4
```

### ControlNet 配置 (保持角色一致性)
```
启用 ControlNet 多单元：
1. Canny - 保持边缘结构 (权重 0.7)
2. Open Pose - 控制姿势 (权重 0.6)
3. Depth - 控制深度 (权重 0.5)

批量生成技巧:
- 固定 Seed 值
- 使用同一张参考图垫图
- LoRA 模型锁定风格
```

---

## 后期处理流程 (完善版)

### Photoshop 批量处理动作

**Action 1: 抠图去背景**
1. 打开图片
2. 选择 → 色彩范围 → 选择白色背景
3. Delete 删除背景
4. 导出为 PNG (透明)

**Action 2: 统一尺寸**
1. 图像 → 图像大小
2. @2x: 宽度 120px (棋子), 64px (图标)
3. @3x: 150% 放大
4. 导出对应倍率

**Action 3: 强化线条**
1. 复制图层 (Ctrl+J)
2. 滤镜 → 风格化 → 查找边缘
3. 混合模式：正片叠底，不透明度 30%
4. 合并图层

**Action 4: 统一色调**
1. 添加色彩平衡调整层
2. 中间调：R+5, G+3, B-2 (暖色调)
3. 高光：R+3, G+2, B-1
4. 羊皮纸纹理叠加 (柔光 20%)

### 批量输出脚本
```javascript
// Photoshop Batch Export Script
var folder = Folder.selectDialog("选择输出文件夹");
var doc = app.activeDocument;

// 导出@2x
doc.resizeImage(UnitValue(120, "px"), UnitValue(160, "px"));
doc.saveAs(new File(folder + "/" + doc.name + "@2x.png"), new PNGSaveOptions(), true, Extension.LOWERCASE);

// 导出@3x
doc.resizeImage(UnitValue(180, "px"), UnitValue(240, "px"));
doc.saveAs(new File(folder + "/" + doc.name + "@3x.png"), new PNGSaveOptions(), true, Extension.LOWERCASE);
```

---

## 批量生成工作流 (优化)

### 第一阶段：风格确认 (2-3 天)
```
Day 1: 生成 3 个棋子样稿 (霍去病/卫青/单于)
Day 2: 生成主界面 + 按钮组
Day 3: 筛选修改，确认最终风格方向
```

### 第二阶段：核心 UI (3-4 天)
```
Day 4-5: 生成所有 UI 组件 (按钮/图标/血条/弹窗)
Day 6-7: 后期处理，批量输出@2x/@3x
```

### 第三阶段：棋子批量生产 (7-10 天)
```
每天生成 8-10 个棋子立绘
批量抠图 + 统一色调
10 天完成 80+ 棋子
```

### 第四阶段：地形和特效 (5-7 天)
```
8 种地形 × 1 天 = 8 天
技能特效 × 2 天 = 2 天
场景背景 × 2 天 = 2 天
合计 5-7 天
```

### 时间总计
```
- AI 生成：30-45 分钟/资源
- 后期处理：10-15 分钟/资源
- 80 棋子 + UI+ 地形+ 特效：约 120-150 工时
- 建议：2-3 人团队，4-6 周完成
```

---

## 质量检查清单 (增强版)

### 手机端检查
- [ ] 尺寸是否符合@2x/@3x 规范
- [ ] 在小屏幕上是否清晰可识别
- [ ] 按钮触摸区域是否≥44x44pt
- [ ] 色彩对比度是否符合无障碍标准
- [ ] 重要信息是否在安全区域内

### 年龄适宜性检查
- [ ] 无可怖/血腥元素
- [ ] 表情友好积极
- [ ] 比例可爱但不幼稚
- [ ] 适合 12+ 岁年龄评级

### 技术规范检查
- [ ] 无水印/文字/签名
- [ ] 透明背景正确
- [ ] 边缘干净适合抠图
- [ ] 可平铺资源边缘无缝
- [ ] 文件格式 PNG-24 透明

### 风格统一性检查
- [ ] 线条粗细一致 (3-5px)
- [ ] 色彩饱和度统一
- [ ] 光影方向一致
- [ ] 所有资源符合手绘涂鸦风格

---

## 常见问题解决方案

### Q1: 生成的棋子风格不统一
**解决方案**:
```
- 固定 Seed 值 (--seed 1234)
- 使用同一张参考图垫图 (--image URL)
- 添加固定风格词 "hand-drawn cartoon style, doodle art"
- 使用 LoRA 模型锁定风格
```

### Q2: 有水印或文字
**解决方案**:
```
- 加负面提示词：no watermark, no text, no signature, no logo
- 加--no watermark 参数
- 使用 Inpaint 功能手动去除
```

### Q3: 不适合手机端 (太复杂)
**解决方案**:
```
- 加 "simple design, minimal details, clear at small sizes"
- 限制细节：no intricate patterns, no small text
- 强调移动端："mobile game UI, touch-friendly"
```

### Q4: 年龄不合适 (太成熟/太幼稚)
**解决方案**:
```
- 调整 Q 版程度：加 "2.5-3 heads tall, cute chibi"
- 指定年龄段："suitable for 12+, all-ages friendly"
- 避免成人元素：加 "no mature content, no violence"
```

### Q5: 地形无法平铺
**解决方案**:
```
- 加--tile 参数 (Midjourney)
- 使用 Photoshop 偏移滤镜检查接缝
- 手动修复边缘过渡
```

---

## 资源命名规范 (完善版)

```
格式：{模块}_{分类}_{名称}_{状态}@{倍数}.{格式}

示例:
- ui_main_btn_start_normal@2x.png
- ui_main_btn_start_pressed@2x.png
- ui_chess_huoqubing_full@3x.png
- ui_chess_huoqubing_icon@2x.png
- ui_terrain_grassland_full@2x.png
- ui_terrain_desert_tile@2x.png
- ui_effect_swordslash_frame01@2x.png
- sb_bond_han_icon@2x.png
```

---

## 附录：完整 Prompt 模板

### 通用模板 (可复制修改)
```
cute chibi [角色名/元素], [背景设定], [动作/姿势], 
hand-drawn cartoon style, doodle art, sketchy charcoal lines, 
[主色] and [辅色] color palette, [具体细节描述], 
character/game asset for mobile auto chess game, 
full body / icon / background, isolated on white/transparent background, 
clean edges for cutout, no watermark, no text, no signature, 
suitable for 12+, all-ages friendly, optimized for mobile 
--ar [比例] --stylize [200-300] --v 5.2 --no watermark text signature
```

---

**最后建议**: 优先测试 3-5 个关键资源，确认风格和参数后再批量生产！
