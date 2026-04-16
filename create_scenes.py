#!/usr/bin/env python3
"""
创建 Cocos Creator 场景文件
生成 4 个核心场景：loading, main_menu, lobby, battle
"""

import json
import os

scenes = {
    'loading': {
        'name': 'Loading',
        'description': '加载场景',
        'canvas_size': [1280, 720],
        'nodes': [
            {
                'name': 'Canvas',
                'type': 'cc.Canvas',
                'components': [{'type': 'cc.Canvas'}],
                'children': [
                    {
                        'name': 'LoadingPanel',
                        'type': 'cc.Node',
                        'position': [0, 0, 0],
                        'components': [
                            {'type': 'cc.UITransform', 'width': 800, 'height': 600},
                            {'type': 'cc.Sprite', 'color': [20, 20, 30, 200]},
                        ],
                        'children': [
                            {
                                'name': 'GameLogo',
                                'type': 'cc.Node',
                                'position': [0, 150, 0],
                                'components': [
                                    {'type': 'cc.Label', 'string': '封狼居胥', 'font_size': 64, 'color': [255, 215, 0, 255]},
                                ]
                            },
                            {
                                'name': 'LoadingBar',
                                'type': 'cc.Node',
                                'position': [0, 0, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 600, 'height': 40},
                                    {'type': 'cc.Sprite', 'color': [50, 50, 70, 255]},
                                ],
                                'children': [
                                    {
                                        'name': 'ProgressBar',
                                        'type': 'cc.Node',
                                        'position': [-270, 0, 0],
                                        'components': [
                                            {'type': 'cc.UITransform', 'width': 0, 'height': 36},
                                            {'type': 'cc.Sprite', 'color': [255, 215, 0, 255]},
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'LoadingText',
                                'type': 'cc.Node',
                                'position': [0, -80, 0],
                                'components': [
                                    {'type': 'cc.Label', 'string': '加载中...', 'font_size': 24, 'color': [200, 200, 200, 255]},
                                ]
                            },
                            {
                                'name': 'LoadingController',
                                'type': 'cc.Node',
                                'position': [0, 0, 0],
                                'components': [
                                    {'type': 'LoadingController'},
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                'name': 'Camera',
                'type': 'cc.Camera',
                'components': [{'type': 'cc.Camera'}],
                'position': [0, 0, 1000],
            }
        ]
    },
    'main_menu': {
        'name': 'MainMenu',
        'description': '主菜单场景',
        'canvas_size': [1280, 720],
        'nodes': [
            {
                'name': 'Canvas',
                'type': 'cc.Canvas',
                'components': [{'type': 'cc.Canvas'}],
                'children': [
                    {
                        'name': 'MainMenuPanel',
                        'type': 'cc.Node',
                        'position': [0, 0, 0],
                        'components': [
                            {'type': 'cc.UITransform', 'width': 1280, 'height': 720},
                        ],
                        'children': [
                            {
                                'name': 'GameTitle',
                                'type': 'cc.Node',
                                'position': [0, 200, 0],
                                'components': [
                                    {'type': 'cc.Label', 'string': '封狼居胥', 'font_size': 80, 'color': [255, 215, 0, 255]},
                                    {'type': 'cc.Label', 'string': '自走棋', 'font_size': 40, 'color': [200, 200, 200, 255], '_name': 'Subtitle'},
                                ]
                            },
                            {
                                'name': 'StartButton',
                                'type': 'cc.Node',
                                'position': [0, 50, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 200, 'height': 80},
                                    {'type': 'cc.Sprite'},
                                    {'type': 'cc.Button'},
                                ],
                                'children': [
                                    {
                                        'name': 'Label',
                                        'type': 'cc.Node',
                                        'components': [
                                            {'type': 'cc.Label', 'string': '开始游戏', 'font_size': 32, 'color': [255, 255, 255, 255]},
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'SettingsButton',
                                'type': 'cc.Node',
                                'position': [0, -50, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 200, 'height': 80},
                                    {'type': 'cc.Sprite'},
                                    {'type': 'cc.Button'},
                                ],
                                'children': [
                                    {
                                        'name': 'Label',
                                        'type': 'cc.Node',
                                        'components': [
                                            {'type': 'cc.Label', 'string': '设置', 'font_size': 32, 'color': [255, 255, 255, 255]},
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'MainMenuController',
                                'type': 'cc.Node',
                                'position': [0, 0, 0],
                                'components': [
                                    {'type': 'MainMenuController'},
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                'name': 'Camera',
                'type': 'cc.Camera',
                'components': [{'type': 'cc.Camera'}],
                'position': [0, 0, 1000],
            }
        ]
    },
    'lobby': {
        'name': 'Lobby',
        'description': '大厅场景',
        'canvas_size': [1280, 720],
        'nodes': [
            {
                'name': 'Canvas',
                'type': 'cc.Canvas',
                'components': [{'type': 'cc.Canvas'}],
                'children': [
                    {
                        'name': 'LobbyPanel',
                        'type': 'cc.Node',
                        'position': [0, 0, 0],
                        'components': [
                            {'type': 'cc.UITransform', 'width': 1280, 'height': 720},
                        ],
                        'children': [
                            {
                                'name': 'TopBar',
                                'type': 'cc.Node',
                                'position': [0, 300, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 1200, 'height': 60},
                                ],
                                'children': [
                                    {
                                        'name': 'PlayerInfo',
                                        'type': 'cc.Node',
                                        'position': [-500, 0, 0],
                                        'components': [
                                            {'type': 'cc.Label', 'string': '玩家：Guest', 'font_size': 24, 'color': [255, 255, 255, 255]},
                                        ]
                                    },
                                    {
                                        'name': 'GoldDisplay',
                                        'type': 'cc.Node',
                                        'position': [300, 0, 0],
                                        'components': [
                                            {'type': 'cc.Label', 'string': '💰 1000', 'font_size': 24, 'color': [255, 215, 0, 255]},
                                        ]
                                    },
                                    {
                                        'name': 'DiamondDisplay',
                                        'type': 'cc.Node',
                                        'position': [450, 0, 0],
                                        'components': [
                                            {'type': 'cc.Label', 'string': '💎 100', 'font_size': 24, 'color': [50, 180, 255, 255]},
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'BattleButton',
                                'type': 'cc.Node',
                                'position': [0, 0, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 250, 'height': 100},
                                    {'type': 'cc.Sprite'},
                                    {'type': 'cc.Button'},
                                ],
                                'children': [
                                    {
                                        'name': 'Label',
                                        'type': 'cc.Node',
                                        'components': [
                                            {'type': 'cc.Label', 'string': '开始战斗', 'font_size': 36, 'color': [255, 255, 255, 255]},
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'RecordButton',
                                'type': 'cc.Node',
                                'position': [0, -120, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 200, 'height': 80},
                                    {'type': 'cc.Sprite'},
                                    {'type': 'cc.Button'},
                                ],
                                'children': [
                                    {
                                        'name': 'Label',
                                        'type': 'cc.Node',
                                        'components': [
                                            {'type': 'cc.Label', 'string': '战绩', 'font_size': 32, 'color': [255, 255, 255, 255]},
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'BackButton',
                                'type': 'cc.Node',
                                'position': [-550, -300, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 150, 'height': 60},
                                    {'type': 'cc.Sprite'},
                                    {'type': 'cc.Button'},
                                ],
                                'children': [
                                    {
                                        'name': 'Label',
                                        'type': 'cc.Node',
                                        'components': [
                                            {'type': 'cc.Label', 'string': '返回', 'font_size': 28, 'color': [255, 255, 255, 255]},
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'LobbyController',
                                'type': 'cc.Node',
                                'position': [0, 0, 0],
                                'components': [
                                    {'type': 'LobbyController'},
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                'name': 'Camera',
                'type': 'cc.Camera',
                'components': [{'type': 'cc.Camera'}],
                'position': [0, 0, 1000],
            }
        ]
    },
    'battle': {
        'name': 'Battle',
        'description': '战斗场景',
        'canvas_size': [1280, 720],
        'nodes': [
            {
                'name': 'Canvas',
                'type': 'cc.Canvas',
                'components': [{'type': 'cc.Canvas'}],
                'children': [
                    {
                        'name': 'BattlePanel',
                        'type': 'cc.Node',
                        'position': [0, 0, 0],
                        'components': [
                            {'type': 'cc.UITransform', 'width': 1280, 'height': 720},
                        ],
                        'children': [
                            {
                                'name': 'TopInfo',
                                'type': 'cc.Node',
                                'position': [0, 300, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 1200, 'height': 80},
                                ],
                                'children': [
                                    {
                                        'name': 'PlayerHP',
                                        'type': 'cc.Node',
                                        'position': [-500, 0, 0],
                                        'components': [
                                            {'type': 'cc.Label', 'string': 'HP: 100', 'font_size': 28, 'color': [255, 100, 100, 255]},
                                        ]
                                    },
                                    {
                                        'name': 'RoundDisplay',
                                        'type': 'cc.Node',
                                        'position': [0, 0, 0],
                                        'components': [
                                            {'type': 'cc.Label', 'string': '第 1 回合', 'font_size': 28, 'color': [255, 255, 255, 255]},
                                        ]
                                    },
                                    {
                                        'name': 'EnemyHP',
                                        'type': 'cc.Node',
                                        'position': [500, 0, 0],
                                        'components': [
                                            {'type': 'cc.Label', 'string': 'HP: 100', 'font_size': 28, 'color': [255, 100, 100, 255]},
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'ChessboardArea',
                                'type': 'cc.Node',
                                'position': [0, 0, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 800, 'height': 400},
                                    {'type': 'cc.Sprite', 'color': [50, 50, 70, 100]},
                                ]
                            },
                            {
                                'name': 'ShopPanel',
                                'type': 'cc.Node',
                                'position': [0, -250, 0],
                                'components': [
                                    {'type': 'cc.UITransform', 'width': 1000, 'height': 180},
                                ],
                                'children': [
                                    {
                                        'name': 'ShopSlots',
                                        'type': 'cc.Node',
                                        'position': [0, 0, 0],
                                        'components': [
                                            {'type': 'cc.Layout', 'type': 'horizontal', 'spacing': 10},
                                        ]
                                    },
                                    {
                                        'name': 'ShopControls',
                                        'type': 'cc.Node',
                                        'position': [400, 0, 0],
                                        'components': [],
                                        'children': [
                                            {
                                                'name': 'GoldDisplay',
                                                'type': 'cc.Node',
                                                'position': [0, 50, 0],
                                                'components': [
                                                    {'type': 'cc.Label', 'string': '💰 50', 'font_size': 28, 'color': [255, 215, 0, 255]},
                                                ]
                                            },
                                            {
                                                'name': 'RefreshButton',
                                                'type': 'cc.Node',
                                                'position': [0, 0, 0],
                                                'components': [
                                                    {'type': 'cc.UITransform', 'width': 120, 'height': 50},
                                                    {'type': 'cc.Sprite'},
                                                    {'type': 'cc.Button'},
                                                ],
                                                'children': [
                                                    {
                                                        'name': 'Label',
                                                        'type': 'cc.Node',
                                                        'components': [
                                                            {'type': 'cc.Label', 'string': '刷新 (2G)', 'font_size': 24, 'color': [255, 255, 255, 255]},
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                'name': 'LevelUpButton',
                                                'type': 'cc.Node',
                                                'position': [0, -50, 0],
                                                'components': [
                                                    {'type': 'cc.UITransform', 'width': 120, 'height': 50},
                                                    {'type': 'cc.Sprite'},
                                                    {'type': 'cc.Button'},
                                                ],
                                                'children': [
                                                    {
                                                        'name': 'Label',
                                                        'type': 'cc.Node',
                                                        'components': [
                                                            {'type': 'cc.Label', 'string': '升级 (4G)', 'font_size': 24, 'color': [255, 255, 255, 255]},
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                'name': 'BattleController',
                                'type': 'cc.Node',
                                'position': [0, 0, 0],
                                'components': [
                                    {'type': 'BattleController'},
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                'name': 'Camera',
                'type': 'cc.Camera',
                'components': [{'type': 'cc.Camera'}],
                'position': [0, 0, 1000],
            }
        ]
    }
}

# 生成场景文件
os.makedirs('assets/scenes', exist_ok=True)

for scene_name, scene_data in scenes.items():
    scene_file = f'assets/scenes/{scene_name}.scene'
    
    # 创建 Cocos Creator 场景结构
    scene_content = {
        '@_typename': 'cc.SceneAsset',
        '_name': scene_data['name'],
        '_objFlags': 0,
        '_native': '',
        'scene': {
            '@_typename': 'cc.Scene',
            '_name': scene_data['name'],
            '_objFlags': 0,
            '_children': []
        }
    }
    
    # 添加节点
    def build_node(node_data):
        node = {
            '@_typename': 'cc.Node',
            '_name': node_data['name'],
            '_objFlags': 0,
            '_lpos': {'x': 0, 'y': 0, 'z': 0},
            '_lrot': {'x': 0, 'y': 0, 'z': 0, 'w': 1},
            '_lscl': {'x': 1, 'y': 1, 'z': 1},
            '_layer': 1073741824,
            '_children': []
        }
        
        if 'position' in node_data:
            node['_lpos'] = {'x': node_data['position'][0], 'y': node_data['position'][1], 'z': node_data['position'][2]}
        
        if 'components' in node_data:
            node['_components'] = []
            for comp in node_data['components']:
                comp_data = {
                    '@_typename': f'cc.{comp["type"]}',
                    '_name': comp.get('_name', comp['type']),
                    '_objFlags': 0
                }
                
                # 添加组件属性
                for key, value in comp.items():
                    if key not in ['type', '_name']:
                        comp_data[key] = value
                
                node['_components'].append(comp_data)
        
        if 'children' in node_data:
            for child in node_data['children']:
                node['_children'].append(build_node(child))
        
        return node
    
    # 构建树
    for node in scene_data['nodes']:
        scene_content['scene']['_children'].append(build_node(node))
    
    # 保存为 JSON
    with open(scene_file, 'w', encoding='utf-8') as f:
        json.dump(scene_content, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 创建场景：{scene_file}")

print("\n" + "="*50)
print("✅ 场景文件创建完成！")
print("="*50)
print(f"\n创建的场景:")
for name in scenes.keys():
    print(f"  - assets/scenes/{name}.scene")
print(f"\n💡 使用方法:")
print(f"  在 Cocos Creator 中刷新资源面板")
print(f"  双击场景文件即可打开编辑")
