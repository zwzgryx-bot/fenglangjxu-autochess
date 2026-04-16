#!/usr/bin/env python3
"""
封狼居胥 - 使用通义万相生成棋子立绘

API: https://dashscope.aliyuncs.com
Model: wan2.7-image-pro (通义万相)
"""

import os
import json
import requests
import time
from pathlib import Path
from datetime import datetime

# ==================== 配置 ====================

# 通义万相 API
DASHSCOPE_API_KEY = os.getenv('DASHSCOPE_API_KEY', '')
DASHSCOPE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/image-generation/generation'

# 输出目录
OUTPUT_DIR = Path('/workspace/fenglangjxu-autochess/assets/resources/chess')

# ==================== 棋子数据 ====================

# 汉军棋子 (21 个)
HAN_CHESS = [
    {'id': 'huoqubing', 'name': '霍去病', 'rarity': 'legendary', 'prompt': 'Q 版手绘卡通风格的汉代名将霍去病，骑着黑色战狼，朱砂红色和墨绿色盔甲，金色装饰，手持长枪，英勇表情，透明背景，游戏角色立绘，适合 12 岁以上'},
    {'id': 'weiqing', 'name': '卫青', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的汉代大将军卫青，站在战马旁，朱砂红色盔甲配墨绿色披风，金色装饰，手持宝剑，威严表情，透明背景，游戏角色立绘'},
    {'id': 'gongsunhe', 'name': '公孙贺', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的汉代骑兵统领公孙贺，骑在马上，朱砂红色骑兵盔甲，准备冲锋姿势，透明背景，游戏角色立绘'},
    {'id': 'aponu', 'name': '赵破奴', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的汉代轻骑兵赵破奴，骑马持刀，朱砂红色轻甲，凶猛表情，透明背景，游戏角色立绘'},
    {'id': 'ligan', 'name': '李敢', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的汉代骑兵李敢，马上举剑，朱砂红色盔甲，英勇表情，透明背景，游戏角色立绘'},
    {'id': 'lizhiguang', 'name': '李殖光', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的汉代步兵统领，朱砂红色重甲，手持盾牌和剑，坚定表情，透明背景，游戏角色立绘'},
    {'id': 'han_cavalry_cmd', 'name': '骑兵统领', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的汉代骑兵，骑马持枪，朱砂红色简单盔甲，普通士兵，友好表情，透明背景，游戏角色立绘'},
    {'id': 'han_light_cavalry', 'name': '轻骑兵', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的汉代轻骑兵侦察兵，骑快马，朱砂红色皮甲，警觉表情，透明背景，游戏角色立绘'},
    {'id': 'han_heavy_cavalry', 'name': '重骑兵', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的汉代重骑兵，骑战马，朱砂红色重甲，强壮体型，透明背景，游戏角色立绘'},
    {'id': 'han_cavalry_archer', 'name': '骑射手', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的汉代骑射兵，马上持弓，朱砂红色轻甲，专注表情，透明背景，游戏角色立绘'},
    {'id': 'han_infantry_cmd', 'name': '步兵统领', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的汉代步兵队长，朱砂红色盔甲，手持长枪，指挥姿态，透明背景，游戏角色立绘'},
    {'id': 'han_heavy_infantry', 'name': '重步兵', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的汉代重步兵，重甲持盾，朱砂红色盔甲，防御姿态，透明背景，游戏角色立绘'},
    {'id': 'han_spearman', 'name': '枪兵', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的汉代枪兵，手持长枪，朱砂红色轻甲，标准军姿，透明背景，游戏角色立绘'},
    {'id': 'han_swordsman', 'name': '剑士', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的汉代剑士，手持长剑，朱砂红色盔甲，战斗姿态，透明背景，游戏角色立绘'},
    {'id': 'han_archer_cmd', 'name': '弓兵统领', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的汉代弓兵队长，手持强弓，朱砂红色精英盔甲，精准眼神，透明背景，游戏角色立绘'},
    {'id': 'han_crossbowman', 'name': '弩兵', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的汉代弩兵，手持弩机，朱砂红色军装，专注瞄准，透明背景，游戏角色立绘'},
    {'id': 'han_archer', 'name': '弓兵', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的汉代弓兵，手持弓箭，朱砂红色轻甲，标准射箭姿势，透明背景，游戏角色立绘'},
    {'id': 'han_strategist', 'name': '谋士', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的汉代谋士，手持羽扇，墨绿色文士袍，智能表情，透明背景，游戏角色立绘'},
    {'id': 'han_advisor', 'name': '军师', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的汉代军师，手持兵法，墨绿色长袍，睿智表情，透明背景，游戏角色立绘'},
    {'id': 'han_warrior', 'name': '武将', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的汉代武将，双持武器，朱砂红色战甲，威猛表情，透明背景，游戏角色立绘'},
    {'id': 'han_doctor', 'name': '医师', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的汉代军医，手持药箱，墨绿色医者袍，慈祥表情，透明背景，游戏角色立绘'},
]

# 匈奴棋子 (13 个)
XIONGNU_CHESS = [
    {'id': 'chanyu', 'name': '匈奴单于', 'rarity': 'legendary', 'prompt': 'Q 版手绘卡通风格的匈奴单于，草原可汗，骑棕色战马，土黄色和棕色华丽盔甲，金色装饰，手持弯刀，威严霸气，透明背景，游戏角色立绘'},
    {'id': 'maodun', 'name': '冒顿单于', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的冒顿单于，匈奴皇帝，站在战马旁，土黄色帝王盔甲，金色装饰，手持弓箭，严肃表情，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_prince', 'name': '匈奴王子', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的匈奴王子，年轻贵族，土黄色精致盔甲，金色装饰，自信表情，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_king', 'name': '匈奴王', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的匈奴小王，土黄色盔甲，棕色皮草装饰，骄傲表情，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_cavalry_cmd', 'name': '骑兵统领', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的匈奴骑兵队长，骑战马，土黄色和棕色盔甲，勇猛表情，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_heavy_cavalry', 'name': '重骑兵', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的匈奴重骑兵，骑披甲战马，土黄色重甲，强壮体型，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_light_cavalry', 'name': '轻骑兵', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的匈奴轻骑兵，骑快马，棕色轻甲，机警表情，草原战士，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_horse_archer', 'name': '骑射手', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的匈奴骑射手，马上持复合弓，棕色皮甲，精准眼神，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_archer_cmd', 'name': '弓兵统领', 'rarity': 'epic', 'prompt': 'Q 版手绘卡通风格的匈奴弓兵队长，手持强弓，土黄色精英盔甲，凶猛表情，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_archer', 'name': '弓兵', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的匈奴弓兵，手持弓箭，棕色皮甲，标准射箭姿势，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_infantry_cmd', 'name': '步兵统领', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的匈奴步兵队长，手持战斧，土黄色和棕色盔甲，凶猛表情，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_warrior', 'name': '勇士', 'rarity': 'common', 'prompt': 'Q 版手绘卡通风格的匈奴勇士，手持弯刀，棕色皮甲，好战表情，草原战士，透明背景，游戏角色立绘'},
    {'id': 'xiongnu_assassin', 'name': '刺客', 'rarity': 'rare', 'prompt': 'Q 版手绘卡通风格的匈奴刺客，双持匕首，深色夜行衣，狡黠表情，敏捷身形，透明背景，游戏角色立绘'},
]

def generate_image(chess_data, faction):
    """
    调用通义万相 API 生成图片
    
    Args:
        chess_data: 棋子数据
        faction: 'han' 或 'xiongnu'
    
    Returns:
        是否成功
    """
    full_prompt = chess_data['prompt']
    output_path = OUTPUT_DIR / faction / f"{chess_data['id']}.png"
    
    # 确保输出目录存在
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # 请求 payload
    payload = {
        "model": "wan2.7-image-pro",
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"text": full_prompt}
                    ]
                }
            ]
        },
        "parameters": {
            "size": "2K",
            "n": 1,
            "watermark": False,
            "thinking_mode": True
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
        "X-DashScope-Async": "enable"
    }
    
    print(f"🎨 正在生成：{chess_data['name']} ({chess_data['rarity']})")
    
    try:
        # 第一步：提交生成任务
        response = requests.post(DASHSCOPE_URL, json=payload, headers=headers, timeout=60)
        
        if response.status_code != 200:
            print(f"❌ 提交失败：{chess_data['name']} - HTTP {response.status_code}")
            print(f"   响应：{response.text}")
            return False
        
        result = response.json()
        
        if 'output' not in result or 'task_id' not in result['output']:
            print(f"❌ 任务 ID 获取失败：{chess_data['name']}")
            print(f"   响应：{json.dumps(result, indent=2)}")
            return False
        
        task_id = result['output']['task_id']
        print(f"   任务 ID: {task_id}")
        
        # 第二步：轮询等待结果
        query_url = f"https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}"
        
        max_attempts = 30
        for attempt in range(max_attempts):
            time.sleep(5)  # 等待 5 秒
            
            query_response = requests.get(query_url, headers=headers, timeout=60)
            
            if query_response.status_code == 200:
                query_result = query_response.json()
                
                if query_result.get('output', {}).get('task_status') == 'SUCCEEDED':
                    # 获取图片 URL
                    image_url = query_result['output']['results'][0]['url']
                    
                    # 下载图片
                    img_response = requests.get(image_url, timeout=60)
                    if img_response.status_code == 200:
                        with open(output_path, 'wb') as f:
                            f.write(img_response.content)
                        print(f"✅ 保存成功：{output_path.name}")
                        return True
                    else:
                        print(f"❌ 下载失败：{chess_data['name']}")
                        return False
                        
                elif query_result.get('output', {}).get('task_status') == 'FAILED':
                    print(f"❌ 生成失败：{chess_data['name']} - 任务失败")
                    return False
                    
            else:
                print(f"   轮询第{attempt+1}次 - HTTP {query_response.status_code}")
        
        print(f"❌ 超时：{chess_data['name']} - {max_attempts * 5}秒未完成")
        return False
        
    except Exception as e:
        print(f"❌ 错误：{chess_data['name']} - {str(e)}")
        return False


def generate_all_chess():
    """批量生成所有棋子"""
    print("🎨 开始调用通义万相生成棋子立绘...")
    print(f"📂 输出目录：{OUTPUT_DIR}")
    print(f"🌐 API: 通义万相 wan2.7-image-pro")
    print("=" * 60)
    
    total_count = 0
    success_count = 0
    
    # 生成汉军棋子
    print("\n【汉军】")
    for chess in HAN_CHESS:
        total_count += 1
        if generate_image(chess, 'han'):
            success_count += 1
    
    # 生成匈奴棋子
    print("\n【匈奴】")
    for chess in XIONGNU_CHESS:
        total_count += 1
        if generate_image(chess, 'xiongnu'):
            success_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ 批量生成完成!")
    print(f"   总计：{total_count} 个")
    print(f"   成功：{success_count} 个")
    print(f"   失败：{total_count - success_count} 个")
    print(f"   成功率：{success_count / total_count * 100:.1f}%")


if __name__ == '__main__':
    if not DASHSCOPE_API_KEY:
        print("❌ 错误：DASHSCOPE_API_KEY 环境变量未设置")
        print("   请设置：export DASHSCOPE_API_KEY=your_api_key")
        exit(1)
    
    generate_all_chess()
