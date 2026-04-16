#!/usr/bin/env python3
"""
批量生成 UI 占位图资源
使用 PIL 绘制简单的 UI 元素占位图
"""

from PIL import Image, ImageDraw, ImageFont
import os

# 创建目录结构
dirs = [
    'assets/resources/ui/buttons',
    'assets/resources/ui/icons',
    'assets/resources/ui/panels',
    'assets/resources/bg',
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

print("📁 创建目录完成")

# ==================== 按钮资源 ====================
def create_button(filename, base_color, state='normal'):
    """创建按钮占位图"""
    width, height = 200, 80
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 圆角矩形
    radius = 15
    
    if state == 'normal':
        color = base_color
    elif state == 'pressed':
        # 调暗 20%
        color = tuple(int(c * 0.8) for c in base_color[:3]) + (255,)
    elif state == 'disabled':
        # 灰色
        color = (150, 150, 150, 255)
    
    # 绘制圆角矩形背景
    draw.rounded_rectangle([0, 0, width, height], radius, fill=color)
    
    # 添加高光效果
    highlight = tuple(min(c + 30, 255) for c in color[:3]) + (100,)
    draw.arc([0, 0, radius*2, radius*2], 180, 270, fill=highlight, width=2)
    draw.arc([width-radius*2, 0, width, radius*2], 270, 360, fill=highlight, width=2)
    
    img.save(filename, 'PNG')
    print(f"  ✅ {filename}")

# 创建按钮
create_button('assets/resources/ui/buttons/btn_normal.png', (60, 150, 220, 255), 'normal')
create_button('assets/resources/ui/buttons/btn_pressed.png', (60, 150, 220, 255), 'pressed')
create_button('assets/resources/ui/buttons/btn_disabled.png', (150, 150, 150, 255), 'disabled')

# 创建图标按钮 (带符号)
def create_icon_button(filename, symbol, base_color):
    """创建带符号的按钮"""
    width, height = 80, 80
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 圆形背景
    draw.ellipse([5, 5, width-5, height-5], fill=base_color)
    
    # 绘制符号 (简单图形)
    center = width // 2
    
    if symbol == 'refresh':
        # 循环箭头
        draw.arc([20, 20, 60, 60], 0, 270, fill=(255, 255, 255, 255), width=8)
        draw.polygon([(55, 25), (65, 35), (55, 45)], fill=(255, 255, 255, 255))
    elif symbol == 'levelup':
        # 向上箭头
        draw.polygon([(center, 20), (35, 50), (45, 50), (45, 60), (55, 60), (55, 50), (65, 50)], fill=(255, 215, 0, 255))
    
    img.save(filename, 'PNG')
    print(f"  ✅ {filename}")

create_icon_button('assets/resources/ui/buttons/btn_refresh.png', 'refresh', (50, 180, 220, 255))
create_icon_button('assets/resources/ui/buttons/btn_levelup.png', 'levelup', (180, 100, 50, 255))

print("\n📦 按钮资源完成 (5 个)")

# ==================== 图标资源 ====================
def create_icon(filename, icon_type):
    """创建图标占位图"""
    size = 64
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = size // 2
    
    colors = {
        'gold': (255, 215, 0, 255),
        'diamond': (50, 180, 255, 255),
        'lock': (150, 150, 150, 255),
        'star': (255, 215, 0, 255),
        'sword': (200, 200, 220, 255),
        'shield': (60, 100, 180, 255),
        'bow': (139, 90, 43, 255),
        'book': (139, 69, 19, 255),
        'health': (220, 50, 50, 255),
        'energy': (50, 150, 255, 255),
    }
    
    color = colors.get(icon_type, (200, 200, 200, 255))
    
    # 绘制不同图标
    if icon_type == 'gold':
        # 圆形金币
        draw.ellipse([12, 12, size-12, size-12], fill=color, outline=(180, 150, 0, 255), width=3)
        draw.text((center-10, center-12), "¥", fill=(200, 180, 50, 255))
    elif icon_type == 'diamond':
        # 菱形钻石
        draw.polygon([(center, 10), (size-15, center), (center, size-10), (15, center)], fill=color)
    elif icon_type == 'lock':
        # 锁
        draw.rounded_rectangle([20, 25, 44, 55], 5, fill=color)
        draw.arc([22, 15, 42, 35], 180, 0, fill=color, width=4)
    elif icon_type == 'star':
        # 五角星
        points = [(center, 10), (center+8, 28), (center+26, 28), (center+12, 40), (center+18, 58),
                  (center, 45), (center-18, 58), (center-12, 40), (center-26, 28), (center-8, 28)]
        draw.polygon(points, fill=color)
    elif icon_type == 'sword':
        # 剑
        draw.rectangle([30, 15, 34, 45], fill=color)
        draw.polygon([(25, 40), (32, 35), (32, 45), (39, 45), (39, 35), (46, 40), (32, 52)], fill=color)
    elif icon_type == 'shield':
        # 盾
        draw.arc([15, 15, 49, 49], 180, 360, fill=color, width=8)
        draw.line([(15, 32), (49, 32)], fill=color, width=8)
    elif icon_type == 'bow':
        # 弓
        draw.arc([15, 15, 49, 49], 90, 270, fill=color, width=4)
        draw.line([(20, 32), (45, 32)], fill=color, width=2)
    elif icon_type == 'book':
        # 书
        draw.rectangle([18, 20, 46, 48], fill=color)
        draw.line([(28, 20), (28, 48)], fill=(100, 50, 20, 255), width=2)
    elif icon_type == 'health':
        # 血滴
        draw.arc([22, 15, 42, 35], 180, 0, fill=color)
        draw.polygon([(32, 30), (22, 48), (42, 48)], fill=color)
    elif icon_type == 'energy':
        # 闪电
        draw.polygon([(35, 10), (25, 30), (32, 30), (28, 55), (45, 25), (38, 25)], fill=color)
    
    img.save(filename, 'PNG')
    print(f"  ✅ {filename}")

icon_types = ['gold', 'diamond', 'lock', 'star', 'sword', 'shield', 'bow', 'book', 'health', 'energy']
for icon_type in icon_types:
    create_icon(f'assets/resources/ui/icons/icon_{icon_type}.png', icon_type)

print("\n📦 图标资源完成 (10 个)")

# ==================== 面板资源 ====================
def create_panel(filename, border_color, quality='common'):
    """创建面板背景"""
    width, height = 400, 300
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 边框
    border_width = 8
    draw.rectangle([0, 0, width-1, height-1], fill=(20, 20, 30, 200))
    draw.rectangle([border_width, border_width, width-border_width-1, height-border_width-1], 
                   fill=(30, 30, 45, 180), outline=border_color, width=border_width)
    
    # 装饰角
    corner_size = 20
    for x, y in [(0, 0), (width-corner_size, 0), (0, height-corner_size), (width-corner_size, height-corner_size)]:
        draw.rectangle([x, y, x+corner_size, y+corner_size], outline=border_color, width=3)
    
    img.save(filename, 'PNG')
    print(f"  ✅ {filename}")

create_panel('assets/resources/ui/panels/panel_common.png', (120, 120, 120, 255))
create_panel('assets/resources/ui/panels/panel_rare.png', (60, 120, 200, 255))
create_panel('assets/resources/ui/panels/panel_epic.png', (150, 80, 200, 255))
create_panel('assets/resources/ui/panels/panel_legendary.png', (255, 200, 50, 255))
create_panel('assets/resources/ui/panels/panel_shop.png', (180, 140, 80, 255))
create_panel('assets/resources/ui/panels/panel_chess_info.png', (100, 150, 100, 255))
create_panel('assets/resources/ui/panels/panel_bond.png', (180, 100, 180, 255))
create_panel('assets/resources/ui/panels/panel_settings.png', (100, 150, 180, 255))

print("\n📦 面板资源完成 (8 个)")

# ==================== 背景资源 ====================
def create_bg(filename, bg_type):
    """创建背景占位图"""
    if bg_type.startswith('bg_'):
        width, height = 1920, 1080
    else:
        width, height = 1280, 720
    
    img = Image.new('RGBA', (width, height), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)
    
    colors = {
        'bg_lawn': [(40, 120, 40), (60, 140, 60)],
        'bg_desert': [(200, 180, 100), (220, 200, 120)],
        'bg_abyss': [(40, 20, 60), (60, 30, 80)],
        'bg_cliff': [(100, 90, 80), (120, 110, 100)],
        'bg_river': [(60, 120, 180), (80, 140, 200)],
        'bg_forest': [(30, 100, 30), (50, 120, 50)],
        'bg_icefield': [(200, 220, 255), (220, 240, 255)],
        'bg_lava': [(180, 50, 30), (200, 80, 40)],
        'bg_main_menu': [(180, 100, 60), (200, 120, 80)],
        'bg_lobby': [(150, 120, 80), (170, 140, 100)],
        'bg_loading': [(30, 30, 50), (50, 50, 70)],
    }
    
    color1, color2 = colors.get(bg_type, [(100, 100, 100), (120, 120, 120)])
    
    # 创建渐变背景
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1-ratio) + color2[0] * ratio)
        g = int(color1[1] * (1-ratio) + color2[1] * ratio)
        b = int(color1[2] * (1-ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    # 棋盘格图案 (如果是棋盘背景)
    if bg_type.startswith('bg_') and bg_type not in ['bg_main_menu', 'bg_lobby', 'bg_loading']:
        grid_size = 80
        for x in range(0, width, grid_size):
            for y in range(0, height, grid_size):
                if ((x // grid_size) + (y // grid_size)) % 2 == 1:
                    overlay = Image.new('RGBA', (grid_size, grid_size), (0, 0, 0, 30))
                    img.paste(overlay, (x, y), overlay)
    
    img.save(filename, 'PNG')
    print(f"  ✅ {filename}")

# 棋盘地形
bg_types = ['bg_lawn', 'bg_desert', 'bg_abyss', 'bg_cliff', 'bg_river', 'bg_forest', 'bg_icefield', 'bg_lava']
for bg_type in bg_types:
    create_bg(f'assets/resources/bg/{bg_type}.png', bg_type)

# 界面背景
for bg_type in ['bg_main_menu', 'bg_lobby', 'bg_loading']:
    create_bg(f'assets/resources/bg/{bg_type}.png', bg_type)

print("\n📦 背景资源完成 (11 个)")

print("\n" + "="*50)
print("✅ UI 资源批量生成完成！")
print("="*50)
print(f"\n总计:")
print(f"  - 按钮：5 个")
print(f"  - 图标：10 个")
print(f"  - 面板：8 个")
print(f"  - 背景：11 个")
print(f"  合计：34 个资源文件")
print(f"\n📁 路径: assets/resources/ui/ 和 assets/resources/bg/")
