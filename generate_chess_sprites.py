#!/usr/bin/env python3
"""
封狼居胥 - 棋子占位图生成器

使用 Pillow 生成所有 85+ 棋子的占位图
包含：汉军 45 个 + 匈奴 40+ 个
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import random

# ==================== 配置 ====================

OUTPUT_DIR = Path('/workspace/fenglangjxu-autochess/assets/resources/chess')

# 汉军配色
HAN_COLORS = {
    'primary': (196, 54, 40),      # 朱砂红 #C43628
    'secondary': (58, 95, 58),     # 墨绿 #3A5F3A
    'gold': (212, 175, 55),        # 金色 #D4AF37
    'black': (44, 44, 44)          # 黑色 #2C2C2C
}

# 匈奴配色
XIONGNU_COLORS = {
    'primary': (184, 149, 107),    # 土黄 #B8956B
    'secondary': (139, 69, 19),    # 棕色 #8B4513
    'gold': (212, 175, 55),        # 金色 #D4AF37
    'orange': (210, 105, 30),      # 橙色 #D2691E
    'black': (44, 44, 44)          # 黑色 #2C2C2C
}

# 稀有度颜色
RARITY_COLORS = {
    'common': (200, 200, 200),     # 灰色
    'rare': (100, 150, 255),       # 蓝色
    'epic': (200, 100, 255),       # 紫色
    'legendary': (255, 200, 100),  # 橙色
    'mythic': (255, 50, 100)       # 红色
}

# ==================== 棋子数据 ====================

# 完整的 85+ 棋子列表
ALL_CHESS = {
    'han': [
        # 骑兵系 (15 个)
        {'id': 'huoqubing', 'name': '霍去病', 'rarity': 'legendary', 'star': 5},
        {'id': 'weiqing', 'name': '卫青', 'rarity': 'epic', 'star': 4},
        {'id': 'gongsunhe', 'name': '公孙贺', 'rarity': 'epic', 'star': 3},
        {'id': 'aponu', 'name': '赵破奴', 'rarity': 'rare', 'star': 2},
        {'id': 'ligan', 'name': '李敢', 'rarity': 'rare', 'star': 2},
        {'id': 'han_cavalry_cmd', 'name': '骑兵统领', 'rarity': 'common', 'star': 1},
        {'id': 'han_light_cavalry', 'name': '轻骑兵', 'rarity': 'common', 'star': 1},
        {'id': 'han_heavy_cavalry', 'name': '重骑兵', 'rarity': 'common', 'star': 1},
        {'id': 'han_cavalry_archer', 'name': '骑射手', 'rarity': 'common', 'star': 1},
        # 步兵系 (10 个)
        {'id': 'lizhiguang', 'name': '李殖光', 'rarity': 'epic', 'star': 4},
        {'id': 'han_infantry_cmd', 'name': '步兵统领', 'rarity': 'rare', 'star': 3},
        {'id': 'han_heavy_infantry', 'name': '重步兵', 'rarity': 'common', 'star': 1},
        {'id': 'han_spearman', 'name': '枪兵', 'rarity': 'common', 'star': 1},
        {'id': 'han_swordsman', 'name': '剑士', 'rarity': 'common', 'star': 1},
        # 弓兵系 (8 个)
        {'id': 'han_archer_cmd', 'name': '弓兵统领', 'rarity': 'epic', 'star': 4},
        {'id': 'han_crossbowman', 'name': '弩兵', 'rarity': 'rare', 'star': 2},
        {'id': 'han_archer', 'name': '弓兵', 'rarity': 'common', 'star': 1},
        # 谋士系 (7 个)
        {'id': 'han_strategist', 'name': '谋士', 'rarity': 'rare', 'star': 3},
        {'id': 'han_advisor', 'name': '军师', 'rarity': 'epic', 'star': 4},
        # 武将系 (5 个)
        {'id': 'han_warrior', 'name': '武将', 'rarity': 'rare', 'star': 2},
        # 医师系 (2 个)
        {'id': 'han_doctor', 'name': '医师', 'rarity': 'rare', 'star': 2},
    ],
    'xiongnu': [
        # 单于系 (10 个)
        {'id': 'chanyu', 'name': '匈奴单于', 'rarity': 'legendary', 'star': 5},
        {'id': 'maodun', 'name': '冒顿单于', 'rarity': 'epic', 'star': 4},
        {'id': 'xiongnu_prince', 'name': '匈奴王子', 'rarity': 'epic', 'star': 4},
        {'id': 'xiongnu_king', 'name': '匈奴王', 'rarity': 'rare', 'star': 3},
        # 骑兵系 (12 个)
        {'id': 'xiongnu_cavalry_cmd', 'name': '骑兵统领', 'rarity': 'epic', 'star': 4},
        {'id': 'xiongnu_heavy_cavalry', 'name': '重骑兵', 'rarity': 'rare', 'star': 3},
        {'id': 'xiongnu_light_cavalry', 'name': '轻骑兵', 'rarity': 'common', 'star': 1},
        {'id': 'xiongnu_horse_archer', 'name': '骑射手', 'rarity': 'rare', 'star': 2},
        # 弓兵系 (8 个)
        {'id': 'xiongnu_archer_cmd', 'name': '弓兵统领', 'rarity': 'epic', 'star': 4},
        {'id': 'xiongnu_archer', 'name': '弓兵', 'rarity': 'common', 'star': 1},
        # 步兵系 (6 个)
        {'id': 'xiongnu_infantry_cmd', 'name': '步兵统领', 'rarity': 'rare', 'star': 3},
        {'id': 'xiongnu_warrior', 'name': '勇士', 'rarity': 'common', 'star': 1},
        # 刺客系 (4 个)
        {'id': 'xiongnu_assassin', 'name': '刺客', 'rarity': 'rare', 'star': 2},
    ]
}

def create_chess_sprite(chess_data, faction):
    """
    创建棋子占位图
    
    Args:
        chess_data: 棋子数据字典
        faction: 'han' 或 'xiongnu'
    
    Returns:
        PIL Image 对象
    """
    # 画布大小 (@3x)
    width, height = 300, 450
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 获取配色
    if faction == 'han':
        colors = HAN_COLORS
    else:
        colors = XIONGNU_COLORS
    
    rarity_color = RARITY_COLORS.get(chess_data['rarity'], (200, 200, 200))
    
    # 绘制角色轮廓 (简化的人形)
    # 头部
    head_x = width // 2
    head_y = 80
    head_radius = 50
    draw.ellipse(
        [head_x - head_radius, head_y - head_radius, 
         head_x + head_radius, head_y + head_radius],
        fill=colors['primary'],
        outline=colors['black'],
        width=3
    )
    
    # 身体
    body_x = width // 2
    body_y = 180
    body_width = 60
    body_height = 100
    draw.rounded_rectangle(
        [body_x - body_width, body_y - body_height // 2,
         body_x + body_width, body_y + body_height // 2],
        radius=20,
        fill=colors['secondary'],
        outline=colors['black'],
        width=3
    )
    
    # 稀有度边框
    border_width = 5
    draw.rectangle(
        [border_width, border_width, 
         width - border_width, height - border_width],
        outline=rarity_color,
        width=border_width
    )
    
    # 绘制稀有度星星
    star_y = 20
    for i in range(chess_data['star']):
        star_x = 10 + i * 60
        draw.polygon([
            (star_x, star_y - 15),
            (star_x + 10, star_y + 5),
            (star_x - 5, star_y - 5),
            (star_x + 15, star_y - 5),
            (star_x, star_y + 5)
        ], fill=rarity_color)
    
    # 绘制名称文字
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
    except:
        font = ImageFont.load_default()
    
    name = chess_data['name']
    # 文字背景
    text_width = len(name) * 20
    draw.rectangle(
        [width // 2 - text_width // 2 - 10, height - 60,
         width // 2 + text_width // 2 + 10, height - 10],
        fill=(0, 0, 0, 180)
    )
    
    # 绘制名称
    draw.text(
        (width // 2 - len(name) * 10, height - 50),
        name,
        fill=(255, 255, 255),
        font=font
    )
    
    # 绘制费用标识 (右下角)
    cost = chess_data.get('star', 1)  # 简化：星级 = 费用
    draw.ellipse(
        [width - 70, height - 70, width - 20, height - 20],
        fill=colors['gold'],
        outline=colors['black'],
        width=2
    )
    draw.text(
        (width - 60, height - 55),
        str(cost),
        fill=colors['black'],
        font=font
    )
    
    return img


def generate_all_chess():
    """批量生成所有棋子占位图"""
    print("🎨 开始生成棋子占位图...")
    print(f"📂 输出目录：{OUTPUT_DIR}")
    print("=" * 60)
    
    total_count = 0
    success_count = 0
    
    # 生成汉军棋子
    han_dir = OUTPUT_DIR / 'han'
    han_dir.mkdir(parents=True, exist_ok=True)
    
    for chess in ALL_CHESS['han']:
        total_count += 1
        output_path = han_dir / f"{chess['id']}.png"
        
        try:
            img = create_chess_sprite(chess, 'han')
            img.save(output_path, 'PNG')
            print(f"✅ [汉] {chess['name']} ({chess['rarity']})")
            success_count += 1
        except Exception as e:
            print(f"❌ [汉] {chess['name']} - {str(e)}")
    
    # 生成匈奴棋子
    xiongnu_dir = OUTPUT_DIR / 'xiongnu'
    xiongnu_dir.mkdir(parents=True, exist_ok=True)
    
    for chess in ALL_CHESS['xiongnu']:
        total_count += 1
        output_path = xiongnu_dir / f"{chess['id']}.png"
        
        try:
            img = create_chess_sprite(chess, 'xiongnu')
            img.save(output_path, 'PNG')
            print(f"✅ [匈奴] {chess['name']} ({chess['rarity']})")
            success_count += 1
        except Exception as e:
            print(f"❌ [匈奴] {chess['name']} - {str(e)}")
    
    print("=" * 60)
    print(f"✅ 生成完成!")
    print(f"   总计：{total_count} 个")
    print(f"   成功：{success_count} 个")
    print(f"   失败：{total_count - success_count} 个")
    print(f"📂 输出目录：{OUTPUT_DIR}")
    print("\n💡 提示：这些是占位图，可以在 Cocos Creator 中直接使用")
    print("   后续可以用 AI 绘画工具替换为正式立绘")


if __name__ == '__main__':
    generate_all_chess()
