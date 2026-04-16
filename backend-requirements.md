# 后端服务需求分析

**分析日期**: 2026-04-16  
**项目**: 封狼居胥 - 自走棋微信小程序

---

## 🎯 总结

当前代码架构**主要支持单机离线玩法**，但包含一些**需要后端配合**的功能点。

**后端依赖度**: 40%  
**可离线运行**: 60%

---

## ✅ 可完全离线运行的功能 (60%)

### 1. 核心战斗系统 ✅
- 战斗逻辑在本地计算
- 伤害公式本地执行
- AI 对战在本地
- 羁绊计算本地

### 2. 经济商店系统 ✅
- 金币计算本地
- 商店刷新本地
- 概率计算本地

### 3. 棋子系统 ✅
- 棋子数据静态配置
- 升星转职本地处理
- 属性计算本地

### 4. 本地存档 ✅
- 使用 `wx.getStorageSync/setStorageSync`
- 玩家进度本地保存
- 无需后端同步

---

## ⚠️ 需要后端支持的功能 (40%)

### P0 - 核心功能 🔴

#### 1. 玩家匹配系统

**代码位置**: `GameManager.ts`  
**当前状态**: 只有本地状态机，无实际匹配逻辑

```typescript
// assets/scripts/core/GameManager.ts:196
async startMatchmaking(): Promise<void> {
  this.setGameState(GameState.MATCHING)
  
  // ❌ TODO: 需要后端 API
  // - 创建匹配房间
  // - 寻找对手
  // - 返回房间信息
  
  const roomId = await api.createMatch()
  await api.joinRoom(roomId)
}
```

**需要的后端 API**:
```
POST /api/match/create
  Response: { roomId: string }

POST /api/match/join
  Body: { roomId: string, playerId: string }

POST /api/match/find
  Body: { playerLevel: number }
  Response: { roomId: string, players: Player[] }
```

---

#### 2. 多人对战房间管理

**代码位置**: `BattleController.ts`  
**当前状态**: 单机战斗，无网络同步

**需要的后端 API**:
```
WebSocket: wss://api.example.com/battle

// 玩家动作
{
  type: 'buy_chess',
  chessId: 'huoqubing',
  slotIndex: 2
}

// 玩家动作
{
  type: 'place_chess',
  chessId: 'huoqubing',
  position: { x: 300, y: 400 }
}

// 服务器广播
{
  type: 'player_action',
  playerId: 'player2',
  action: 'refresh_shop',
  timestamp: 1234567890
}
```

---

#### 3. 玩家数据云端同步

**代码位置**: `SaveSystem.ts`  
**当前状态**: 仅使用本地存储

```typescript
// assets/scripts/utils/SaveSystem.ts:55
save(): void {
  // ❌ 仅本地保存
  wx.setStorageSync(SaveSystem.SAVE_KEY, saveStr)
  
  // ✅ 应该同时保存到云端
  await api.savePlayerData(this.data)
}
```

**需要的后端 API**:
```
GET /api/player/:id/data
  Response: {
    level: number,
    gold: number,
    ownedChess: string[],
    battleRecord: { win: 0, lose: 0 }
  }

POST /api/player/:id/data
  Body: { level, gold, ownedChess, battleRecord }
```

---

### P1 - 重要功能 🟠

#### 4. 棋子卡池共享

**代码位置**: `ShopSystem.ts`  
**当前状态**: 每局独立卡池，无共享

```typescript
// assets/scripts/shop/ShopSystem.ts:126
refreshShop(): IShopData {
  // ❌ 本地随机生成
  // ✅ 应该从共享卡池抽取
  
  const chess = this.drawFromPool() // 本地
  // const chess = await api.drawFromPool(roomId) // 后端
}
```

**需要的后端 API**:
```
POST /api/pool/draw
  Body: { roomId: string, rarity: string }
  Response: { chessId: string, remaining: number }

GET /api/pool/stats
  Response: {
    huoqubing: 5,  // 剩余数量
    weiqing: 6,
    ...
  }
```

---

#### 5. 战绩排行榜

**代码位置**: 未实现  
**需求**: 显示排名、胜率等

**需要的后端 API**:
```
GET /api/ranking/global?limit=100
  Response: [
    { rank: 1, playerId: 'xxx', score: 2500 },
    { rank: 2, playerId: 'yyy', score: 2400 }
  ]

GET /api/ranking/friends
  Response: [...]
```

---

#### 6. 玩家信息与战绩

**代码位置**: `LobbyController.ts`  
**当前状态**: 本地假数据

```typescript
// assets/scripts/ui/LobbyController.ts:43
private initializeData() {
  const playerData = SaveSystem.getInstance().getPlayerData()
  // ❌ 只有本地数据
  // ✅ 应该从后端获取战绩
  this.winCount = await api.getPlayerStats().wins
}
```

**需要的后端 API**:
```
GET /api/player/:id/stats
  Response: {
    totalGames: 100,
    wins: 55,
    top4: 75,
    averageRank: 2.3,
    favoriteChess: 'huoqubing',
    maxStreak: 9
  }
```

---

### P2 - 增强功能 🟡

#### 7. 微信登录与用户认证

**代码位置**: 未实现  
**需求**: 获取 openid，创建玩家账户

**需要的后端 API**:
```
POST /api/auth/wechat
  Body: { code: string }  // 微信登录 code
  Response: {
    token: string,
    playerId: string,
    isNewPlayer: boolean
  }
```

---

#### 8. 每日任务与成就系统

**代码位置**: 未实现  
**需求**: 任务进度追踪、奖励发放

**需要的后端 API**:
```
GET /api/daily/tasks
  Response: [
    { id: 'task1', description: '赢得 3 场比赛', progress: 1, target: 3, reward: { gold: 50 } }
  ]

POST /api/daily/claim/:taskId
  Response: { reward: { gold: 50 } }
```

---

#### 9. 好友系统

**需求**: 添加好友、查看好友战绩、观战

**需要的后端 API**:
```
POST /api/friends/add
GET /api/friends/list
GET /api/friends/:id/stats
POST /api/friends/:id/challenge
```

---

#### 10. 聊天系统

**需求**: 房间内实时聊天

**需要的后端 API**:
```
WebSocket: wss://api.example.com/chat

{
  type: 'chat_message',
  roomId: 'xxx',
  playerId: 'yyy',
  content: '你好'
}
```

---

#### 11. 反作弊验证

**需求**: 验证战斗结果、金币获取等

**需要的后端 API**:
```
POST /api/validate/battle
  Body: { battleLog: BattleLog }
  Response: { isValid: boolean }

POST /api/validate/economy
  Body: { goldChange: number, reason: string }
  Response: { isValid: boolean }
```

---

#### 12. 资源下载与更新

**需求**: 动态加载资源、热更新

**需要的后端 API**:
```
GET /api/version
  Response: {
    version: '1.0.1',
    needUpdate: true,
    downloadUrl: 'https://...'
  }

GET /api/resources/:version
  Response: {
    chess: [...],
    audio: [...]
  }
```

---

## 🏗️ 后端架构建议

### 技术方案选型

#### 方案 A: Node.js + WebSocket (推荐)

```javascript
// 服务端框架
Express.js (REST API)
Socket.io (实时通信)

// 数据库
MongoDB (玩家数据)
Redis (房间状态、缓存)

// 部署
Docker + K8s
```

**优势**:
- 前后端都是 TypeScript
- WebSocket 支持好
- 开发效率高

---

#### 方案 B: Go + gRPC

```go
// 服务端
Go + Gin (REST API)
gRPC (内部通信)

// 数据库
PostgreSQL (玩家数据)
Redis (实时状态)
```

**优势**:
- 性能极佳
- 并发能力强
- 适合大型多人在线

---

#### 方案 C: 云开发方案 (最快上线)

```
微信云开发 (CloudBase)
- 云数据库
- 云函数
- 云存储
```

**优势**:
- 无需运维
- 与微信生态集成
- 免费额度够用

---

## 📋 后端开发优先级

### Stage 1: MVP (最小可行产品) - 必做

**时间**: 2-3 周

1. **玩家认证** (2 天)
   - 微信登录
   - Token 管理

2. **玩家数据** (3 天)
   - 存档云端同步
   - 基础信息存储

3. **匹配系统** (5 天)
   - 创建房间
   - 寻找对手

4. **房间管理** (5 天)
   - WebSocket 实时通信
   - 玩家动作同步

5. **部署上线** (3 天)
   - 服务器部署
   - 域名备案
   - HTTPS 配置

**总计**: 18 工作日 ≈ 3 周

---

### Stage 2: 完整功能 - 选做

**时间**: 4-6 周

6. **卡池共享** (3 天)
7. **战绩系统** (5 天)
8. **排行榜** (3 天)
9. **每日任务** (5 天)
10. **好友系统** (7 天)
11. **聊天系统** (5 天)
12. **反作弊** (5 天)

**总计**: 33 工作日 ≈ 6-7 周

---

### Stage 3: 运营功能 - 后期

13. **活动系统**
14. **充值系统**
15. **邮件系统**
16. **GM 工具**

---

## 💡 临时解决方案

### 如果暂时没有后端资源

#### 方案 A: 纯单机版 (推荐 MVP)

```typescript
// 所有战斗在本地计算
// 数据只保存在本地
// 排行榜改为"本地最佳战绩"

// 优点:
// - 无需后端
// - 快速上线
// - 成本低

// 缺点:
// - 无法 PvP
// - 数据易丢失
// - 易作弊
```

#### 方案 B: 微信云开发 (推荐)

```typescript
// 使用微信云函数代替后端
// 云数据库存储玩家数据
// 云函数处理匹配逻辑

// 优点:
// - 无需运维
// - 免费额度够用
// - 与微信深度集成

// 缺点:
// - 厂商锁定
// - 复杂逻辑受限
```

#### 方案 C: BaaS 服务

```
使用现成的后端即服务:
- LeanCloud
- Firebase (需要代理)
- Supabase

// 优点:
// - 快速开发
// - 无需搭建服务器

// 缺点:
// - 长期成本高
// - 定制性差
```

---

## 🔧 需要修改的前端代码

### 1. API 客户端封装

```typescript
// assets/scripts/api/GameAPI.ts (需要创建)
export class GameAPI {
  private static instance: GameAPI
  private baseUrl: string
  private token: string
  
  // 匹配
  async createMatch(): Promise<string>
  async joinMatch(roomId: string): Promise<void>
  
  // 玩家数据
  async getPlayerData(): Promise<PlayerData>
  async savePlayerData(data: PlayerData): Promise<void>
  
  // 战斗
  async startBattle(roomId: string): Promise<BattleConfig>
  async syncAction(action: BattleAction): Promise<void>
  
  // 战绩
  async getRanking(type: string): Promise<Ranking[]>
  async getPlayerStats(playerId: string): Promise<PlayerStats>
}
```

### 2. GameManager 修改

```typescript
// assets/scripts/core/GameManager.ts
import { GameAPI } from '../api/GameAPI'

async startMatchmaking(): Promise<void> {
  this.setGameState(GameState.MATCHING)
  
  // ✅ 调用后端 API
  try {
    const roomId = await GameAPI.getInstance().createMatch()
    await GameAPI.getInstance().joinMatch(roomId)
    this.enterLobby()
  } catch (error) {
    console.error('匹配失败:', error)
    EventSystem.emit('ui:show_toast', { message: '匹配失败，请重试' })
  }
}
```

### 3. SaveSystem 修改

```typescript
// assets/scripts/utils/SaveSystem.ts
async save(): Promise<void> {
  // 本地保存
  wx.setStorageSync(SaveSystem.SAVE_KEY, saveStr)
  
  // ✅ 云端同步
  if (this.hasNetwork()) {
    try {
      await GameAPI.getInstance().savePlayerData(this.data)
    } catch (error) {
      console.warn('云端保存失败，已降级到本地保存')
    }
  }
}
```

---

## 📊 后端开发成本估算

### 人力成本

| 角色 | 人数 | 时间 | 人月 |
|------|------|------|------|
| 后端开发 | 1 人 | 6 周 | 1.5 人月 |
| 前端配合 | 0.5 人 | 6 周 | 0.75 人月 |
| 测试 | 0.5 人 | 2 周 | 0.25 人月 |
| **总计** | | | **2.5 人月** |

### 服务器成本

| 项目 | 配置 | 月费用 |
|------|------|--------|
| 云服务器 | 2 核 4G | ¥200/月 |
| 数据库 | MongoDB | ¥150/月 |
| Redis | 缓存 | ¥100/月 |
| 带宽 | 5Mbps | ¥200/月 |
| **总计** | | **¥650/月** |

**微信云开发**: 免费额度 ≈ ¥0/月 (初期)

---

## 🎯 推荐实施路径

### 路径 A: 快速验证 (推荐)

1. **Week 1-2**: 纯单机版上线
2. **Week 3-4**: 用微信云开发添加匹配
3. **Week 5-8**: 完善后端功能
4. **Week 9+**: 根据用户反馈迭代

### 路径 B: 完整开发

1. **Week 1-4**: 后端基础架构
2. **Week 5-7**: 核心功能开发
3. **Week 8**: 测试与调优
4. **Week 9**: 上线运营

---

## ✅ 结论

**当前代码可离线运行**，但如果需要完整的在线对战功能，**需要后端配合**。

**推荐方案**:
1. 先上线单机版验证玩法
2. 使用微信云开发添加基础匹配
3. 根据用户量决定是否自建后端

**后端必要性**: 
- 单机版：❌ 不需要
- 联网对战：✅ 必须
- 数据同步：✅ 推荐
- 反作弊：⚠️ 根据需求

---

**下一步**: 如果确定需要后端，我将继续创建:
1. 后端 API 接口文档
2. 数据库设计文档
3. WebSocket 协议定义
4. 后端代码框架
