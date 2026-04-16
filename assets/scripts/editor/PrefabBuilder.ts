/**
 * 辅助脚本 - 在编辑器中快速创建预制体
 * 
 * 使用方法:
 * 1. 在 Cocos Creator 中创建空场景
 * 2. 将此脚本挂载到空节点上
 * 3. 点击按钮创建预制体
 */

import { _decorator, Component, Node, Prefab, instantiate, editor, assetManager, resources } from 'cc'

const { ccclass, property, executeInEditMode } = _decorator

@ccclass('PrefabBuilder')
@executeInEditMode
export class PrefabBuilder extends Component {
  /**
   * 创建棋子预制体
   */
  public createChessPrefab(): Node {
    const node = new Node('Chess')
    
    // 创建 spriteChess 节点
    const spriteNode = new Node('spriteChess')
    const sprite = spriteNode.addComponent('cc.Sprite') as any
    sprite.color.set(0, 128, 255, 255) // 蓝色占位
    spriteNode.parent = node
    spriteNode.setPosition(0, 0, 0)
    
    // 创建 starNode 节点
    const starNode = new Node('starNode')
    starNode.parent = node
    starNode.setPosition(0, 50, 0)
    
    // 创建 3 个星
    for (let i = 0; i < 3; i++) {
      const star = new Node(`star${i + 1}`)
      const starSprite = star.addComponent('cc.Sprite') as any
      starSprite.color.set(255, 215, 0, 255) // 金色
      star.parent = starNode
      star.setPosition(i * 20 - 20, 0, 0)
      star.active = false // 初始隐藏
    }
    
    // 创建 hpBar 节点
    const hpBarNode = new Node('hpBar')
    hpBarNode.parent = node
    hpBarNode.setPosition(0, -40, 0)
    
    const hpBg = new Node('bg')
    const hpBgSprite = hpBg.addComponent('cc.Sprite') as any
    hpBgSprite.color.set(50, 50, 50, 200) // 深灰背景
    hpBg.parent = hpBarNode
    hpBg.setPosition(0, 0, 0)
    
    const hpBar = new Node('bar')
    const hpBarSprite = hpBar.addComponent('cc.Sprite') as any
    hpBarSprite.color.set(255, 50, 50, 255) // 红色血条
    hpBar.parent = hpBarNode
    hpBar.setPosition(-25, 0, 0)
    hpBar.scale = 0.5 // 初始 50% 血量
    
    // 创建 energyBar 节点
    const energyBarNode = new Node('energyBar')
    energyBarNode.parent = node
    energyBarNode.setPosition(0, -55, 0)
    
    const energyBg = new Node('bg')
    const energyBgSprite = energyBg.addComponent('cc.Sprite') as any
    energyBgSprite.color.set(50, 50, 50, 200)
    energyBg.parent = energyBarNode
    
    const energyBar = new Node('bar')
    const energyBarSprite = energyBar.addComponent('cc.Sprite') as any
    energyBarSprite.color.set(50, 150, 255, 255) // 蓝色能量
    energyBar.parent = energyBarNode
    
    // 创建 lblName 节点
    const lblNameNode = new Node('lblName')
    const label = lblNameNode.addComponent('cc.Label') as any
    label.string = '棋子名'
    label.color.set(255, 255, 255, 255)
    label.fontSize = 16
    lblNameNode.parent = node
    lblNameNode.setPosition(0, 60, 0)
    
    // 添加 Chess 组件 (如果已导入)
    // node.addComponent('Chess')
    
    // 设置节点大小
    const uiTransform = node.addComponent('cc.UITransform')
    uiTransform.setContentSize(80, 120)
    
    return node
  }
  
  /**
   * 创建商店格子预制体
   */
  public createShopSlotPrefab(): Node {
    const node = new Node('ShopSlot')
    
    // 背景
    const bgNode = new Node('bg')
    const bgSprite = bgNode.addComponent('cc.Sprite') as any
    bgSprite.color.set(200, 200, 200, 255) // 灰色背景
    bgNode.parent = node
    
    const bgTransform = bgNode.addComponent('cc.UITransform')
    bgTransform.setContentSize(100, 140)
    
    // 棋子图标
    const iconNode = new Node('chessIcon')
    iconNode.parent = node
    iconNode.setPosition(0, 20, 0)
    
    const iconSprite = iconNode.addComponent('cc.Sprite') as any
    iconSprite.color.set(0, 128, 255, 255) // 蓝色占位
    const iconTransform = iconNode.addComponent('cc.UITransform')
    iconTransform.setContentSize(70, 70)
    
    // 费用
    const costNode = new Node('costNode')
    costNode.parent = node
    costNode.setPosition(0, -40, 0)
    
    const costLabel = costNode.addComponent('cc.Label') as any
    costLabel.string = '5'
    costLabel.color.set(255, 215, 0, 255) // 金色
    costLabel.fontSize = 24
    costLabel.isSystemFontUsed = true
    
    // 数量
    const countNode = new Node('countNode')
    countNode.parent = node
    countNode.setPosition(0, -65, 0)
    
    const countLabel = countNode.addComponent('cc.Label') as any
    countLabel.string = '6/6'
    countLabel.color.set(200, 200, 200, 255)
    countLabel.fontSize = 14
    
    // 购买按钮
    const btnBuyNode = new Node('btnBuy')
    btnBuyNode.parent = node
    btnBuyNode.setPosition(0, -20, 0)
    
    const btnBg = btnBuyNode.addComponent('cc.Sprite') as any
    btnBg.color.set(0, 200, 100, 255) // 绿色按钮
    
    const btnLabel = new Node('Label')
    btnLabel.parent = btnBuyNode
    const label = btnLabel.addComponent('cc.Label') as any
    label.string = '购买'
    label.color.set(255, 255, 255, 255)
    label.fontSize = 18
    
    const btnTransform = btnBuyNode.addComponent('cc.UITransform')
    btnTransform.setContentSize(80, 30)
    
    // 设置总大小
    const uiTransform = node.addComponent('cc.UITransform')
    uiTransform.setContentSize(100, 140)
    
    return node
  }
  
  /**
   * 创建血条预制体
   */
  public createHPBarPrefab(): Node {
    const node = new Node('HPBar')
    
    // 背景
    const bgNode = new Node('bg')
    const bgSprite = bgNode.addComponent('cc.Sprite') as any
    bgSprite.color.set(50, 50, 50, 200)
    bgNode.parent = node
    
    const bgTransform = bgNode.addComponent('cc.UITransform')
    bgTransform.setContentSize(60, 8)
    
    // 血条
    const barNode = new Node('bar')
    barNode.parent = node
    
    const barSprite = barNode.addComponent('cc.Sprite') as any
    barSprite.color.set(255, 50, 50, 255) // 红色
    barNode.parent = node
    
    const barTransform = barNode.addComponent('cc.UITransform')
    barTransform.setContentSize(58, 6)
    barNode.setPosition(0, 0, 0)
    
    // 设置总大小
    const uiTransform = node.addComponent('cc.UITransform')
    uiTransform.setContentSize(60, 8)
    
    return node
  }
  
  /**
   * 创建能量条预制体
   */
  public createEnergyBarPrefab(): Node {
    const node = new Node('EnergyBar')
    
    // 背景
    const bgNode = new Node('bg')
    const bgSprite = bgNode.addComponent('cc.Sprite') as any
    bgSprite.color.set(50, 50, 80, 200)
    bgNode.parent = node
    
    const bgTransform = bgNode.addComponent('cc.UITransform')
    bgTransform.setContentSize(60, 6)
    
    // 能量条
    const barNode = new Node('bar')
    barNode.parent = node
    
    const barSprite = barNode.addComponent('cc.Sprite') as any
    barSprite.color.set(50, 150, 255, 255) // 蓝色
    barNode.parent = node
    
    const barTransform = barNode.addComponent('cc.UITransform')
    barTransform.setContentSize(58, 4)
    
    // 设置总大小
    const uiTransform = node.addComponent('cc.UITransform')
    uiTransform.setContentSize(60, 6)
    
    return node
  }
  
  // ==================== 编辑器按钮 ====================
  
  /**
   * 在场景中创建所有预制体 (编辑器模式下调用)
   */
  public createAllPrefabsInScene() {
    if (!editor.EditorExtends) {
      console.log('[PrefabBuilder] 只能在编辑器模式下运行')
      return
    }
    
    console.log('[PrefabBuilder] 创建所有预制体...')
    
    // 创建 Chess
    const chess = this.createChessPrefab()
    chess.parent = this.node
    chess.setPosition(-150, 0, 0)
    console.log('✅ 创建 Chess')
    
    // 创建 ShopSlot
    const shopSlot = this.createShopSlotPrefab()
    shopSlot.parent = this.node
    shopSlot.setPosition(0, 0, 0)
    console.log('✅ 创建 ShopSlot')
    
    // 创建 HPBar
    const hpBar = this.createHPBarPrefab()
    hpBar.parent = this.node
    hpBar.setPosition(150, 50, 0)
    console.log('✅ 创建 HPBar')
    
    // 创建 EnergyBar
    const energyBar = this.createEnergyBarPrefab()
    energyBar.parent = this.node
    energyBar.setPosition(150, -50, 0)
    console.log('✅ 创建 EnergyBar')
    
    console.log('[PrefabBuilder] 创建完成！请右键节点 → Create → Prefab 保存')
  }
}

[menu]
Editor Buttons = "PrefabBuilder:menu/Prefab Builder/Create All Prefabs"
