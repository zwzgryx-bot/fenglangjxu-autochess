#!/usr/bin/env python3
"""
封狼居胥 - 棋子立绘生成器

使用 AI 绘画 API 批量生成所有棋子立绘
支持：Stable Diffusion WebUI API / Midjourney / DALL-E 3

当前配置：使用 Stable Diffusion WebUI API
"""

import os
import json
import requests
from pathlib import Path
from datetime import datetime

# ==================== 配置 ====================

# Stable Diffusion WebUI API 地址
SD_WEBUI_URL = os.getenv('SD_WEBUI_URL', 'http://localhost:7860')

# 输出目录
OUTPUT_DIR = Path('/workspace/fenglangjxu-autochess/assets/resources/chess')

# 通用负面提示词
NEGATIVE_PROMPT = """
worst quality, low quality, normal quality, jpeg artifacts, watermark, 
white background, text, signature, blurry, cropped, duplicate, extra limbs, 
missing limbs, deformed, hands fused, fingers fused, extra fingers, 
bad anatomy, wrong anatomy, amputation, extra arms, missing arms, 
extra legs, missing legs, extra fingers, missing fingers, bad hands, 
missing hands, floating limbs, disconnected limbs, malformed hands, 
blurry details, out of focus, long neck, long body, bad proportions, 
gross proportions, bad face, deformed face, ugly face, 
ugly, disfigured, mutation, mutated hands, disfigured hands
"""

# 通用风格提示词
STYLE_PROMPT = """
hand-drawn cartoon style, doodle art, sketchy charcoal lines, 
cute chibi proportions (2.5-3 heads tall), 
warm color palette, playful and whimsial, 
mobile game character sprite, clean edges for cutout, 
transparent background with checkerboard pattern, 
no white background, alpha channel, PNG format, 
no watermark, no text, no signature, 
suitable for 12+, all-ages friendly
"""

# ==================== 棋子数据 ====================

# 汉军棋子 (45 个)
HAN_CHESS = [
    # 骑兵系 (15 个)
    {'id': 'huoqubing', 'name': '霍去病', 'rarity': 'legendary', 'prompt': 'cute chibi general huo qubing, han dynasty supreme cavalry commander, riding black war wolf, dynamic charging pose with long spear, heroic confident expression, vermilion red and dark green ornate armor with golden decorations, traditional han military uniform'},
    {'id': 'weiqing', 'name': '卫青', 'rarity': 'epic', 'prompt': 'cute chibi general wei qing, han dynasty cavalry general, standing beside brown warhorse, holding sword, calm confident smile, vermilion red armor with dark green flowing cape, noble commander aura'},
    {'id': 'gongsunhe', 'name': '公孙贺', 'rarity': 'epic', 'prompt': 'cute chibi general gongsun he, han dynasty cavalry officer, mounted on horse, lance ready for charge, determined expression, vermilion red and dark green cavalry armor'},
    {'id': 'aponu', 'name': '赵破奴', 'rarity': 'rare', 'prompt': 'cute chibi general po nu, han dynasty light cavalry, riding horse, attacking pose with curved blade, fierce expression, vermilion red light armor with dark green accents'},
    {'id': 'ligan', 'name': '李敢', 'rarity': 'rare', 'prompt': 'cute chibi general li gan, han dynasty cavalry warrior, on horseback, sword raised, brave expression, vermilion red and dark green armor'},
    # ... 更多汉军棋子
]

# 匈奴棋子 (40+ 个)
XIONGNU_CHESS = [
    # 单于系 (10 个)
    {'id': 'chanyu', 'name': '匈奴单于', 'rarity': 'legendary', 'prompt': 'cute chibi xiongnu chanyu, supreme nomadic khan, riding brown steppe horse, wielding curved scimitar, fierce intimidating expression, earth yellow and brown ornate armor with golden decorations'},
    {'id': 'maodun', 'name': '冒顿单于', 'rarity': 'epic', 'prompt': 'cute chibi maodun chanyu, xiongnu emperor, standing beside warhorse, holding bow, stern expression, earth yellow and brown imperial armor with golden trim'},
    # ... 更多匈奴棋子
]

# ==================== API 调用 ====================

def generate_image(prompt: str, output_path: Path) -> bool:
    """
    调用 Stable Diffusion WebUI API 生成图片
    
    Args:
        prompt: 正面提示词
        output_path: 输出路径
    
    Returns:
        是否成功
    """
    full_prompt = f"{STYLE_PROMPT}, {prompt}"
    
    payload = {
        "prompt": full_prompt,
        "negative_prompt": NEGATIVE_PROMPT,
        "steps": 30,
        "cfg_scale": 7,
        "width": 512,
        "height": 768,
        "batch_size": 1,
        "sampler_name": "DPM++ 2M Karras",
        "scheduler": "automatic",
        "seed": -1,
        "override_settings": {
            "CLIP_stop_at_last_layers": 2
        }
    }
    
    try:
        response = requests.post(
            f"{SD_WEBUI_URL}/sdapi/v1/txt2img",
            json=payload,
            timeout=120
        )
        
        if response.status_code == 200:
            result = response.json()
            if 'images' in result and len(result['images']) > 0:
                import base64
                img_data = base64.b64decode(result['images'][0])
                output_path.parent.mkdir(parents=True, exist_ok=True)
                with open(output_path, 'wb') as f:
                    f.write(img_data)
                print(f"✅ 已生成：{output_path.name}")
                return True
        
        print(f"❌ 生成失败：{output_path.name} - HTTP {response.status_code}")
        return False
        
    except Exception as e:
        print(f"❌ 生成错误：{output_path.name} - {str(e)}")
        return False


def generate_all_chess():
    """批量生成所有棋子"""
    print(f"🎨 开始批量生成棋子立绘...")
    print(f"📂 输出目录：{OUTPUT_DIR}")
    print(f"🌐 API 地址：{SD_WEBUI_URL}")
    print("-" * 60)
    
    total_count = 0
    success_count = 0
    
    # 生成汉军棋子
    if OUTPUT_DIR.exists():
        for chess in HAN_CHESS:
            total_count += 1
            output_path = OUTPUT_DIR / 'han' / f"{chess['id']}.png"
            
            if generate_image(chess['prompt'], output_path):
                success_count += 1
    
    # 生成匈奴棋子
    for chess in XIONGNU_CHESS:
        total_count += 1
        output_path = OUTPUT_DIR / 'xiongnu' / f"{chess['id']}.png"
        
        if generate_image(chess['prompt'], output_path):
            success_count += 1
    
    print("=" * 60)
    print(f"✅ 批量生成完成!")
    print(f"   总计：{total_count} 个")
    print(f"   成功：{success_count} 个")
    print(f"   失败：{total_count - success_count} 个")
    print(f"   成功率：{success_count / total_count * 100:.1f}%")


if __name__ == '__main__':
    generate_all_chess()
