# 手动上传 GitHub 指南

由于 Token 权限问题，请使用以下方法手动上传代码到 GitHub。

---

## 方法一：在 GitHub 网页上创建 ZIP 上传

### 1. 打包项目

```bash
cd /workspace/fenglangjxu-autochess

# 创建 ZIP 压缩包
zip -r ../fenglangjxu-autochess-full.zip . -x ".git/*" -x "*.git*"
```

### 2. 上传到 GitHub

1. 访问 https://github.com/zwzgryx-bot/fenglangjxu-autochess
2. 点击 **Add file** → **Upload files**
3. 拖拽 `fenglangjxu-autochess-full.zip` 上传
4. 或者解压后逐个上传文件

---

## 方法二：使用 GitHub Desktop

1. 下载并安装 https://desktop.github.com/
2. Clone 仓库：
   ```
   https://github.com/zwzgryx-bot/fenglangjxu-autochess.git
   ```
3. 将项目文件复制到clone的目录
4. Commit 并 Push

---

## 方法三：使用 SSH（推荐）

### 1. 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 一路回车
```

### 2. 添加公钥到 GitHub

```bash
cat ~/.ssh/id_ed25519.pub
# 复制输出内容
```

访问 https://github.com/settings/keys → New SSH key → 粘贴公钥

### 3. 切换为 SSH 并推送

```bash
cd /workspace/fenglangjxu-autochess
git remote set-url origin git@github.com:zwzgryx-bot/fenglangjxu-autochess.git
git checkout -b main
git push -u origin main
```

---

## 方法四：使用 GitHub CLI

### 1. 安装

```bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### 2. 认证并推送

```bash
cd /workspace/fenglangjxu-autochess
gh auth login
# 选择 GitHub.com → SSH → 按提示完成

gh repo push --force
```

---

## 当前代码摘要

**提交数**: 13 次  
**代码量**: 
- TypeScript: 24 个文件，10,499 行
- 图片资源：34 个棋子 PNG
- 文档：15+ 个完整文档

**核心文件**:
```
assets/scripts/              # 所有 TypeScript 代码
  ├── core/                  # 核心系统
  ├── chess/                 # 棋子系统
  ├── battle/                # 战斗系统
  ├── economy/               # 经济系统
  ├── shop/                  # 商店系统
  ├── ui/                    # UI 控制器
  ├── utils/                 # 工具系统
  ├── ai/                    # AI 系统
  ├── editor/                # 编辑器工具
  ├── config/                # 配置和事件定义 ⭐
  └── Main.ts                # 游戏入口

assets/resources/chess/      # 棋子资源
  ├── han/                   # 21 个汉军棋子占位图
  └── xiongnu/               # 13 个匈奴棋子占位图

.monkeycode/specs/           # 完整设计文档
  └── fenglangjxu-autochess/
      ├── requirements.md    # 需求文档
      ├── design.md          # 技术设计
      ├── ui-design.md       # UI 设计
      ├── chess-system.md    # 兵种系统
      ├── upgrade-system.md  # 升级系统
      ├── upgrade-advanced-system.md  # 转职系统
      ├── ai-prompt-complete-fixed.md  # AI 绘画提示词
      ├── tasklist-full.md   # 16 周任务
      └── skin-system-design.md  # 换皮系统

项目根目录文档:
  ├── README.md                       # 项目说明
  ├── QUICK_START.md                  # 快速启动指南 ⭐
  ├── SCENE_GUIDE.md                  # 场景创建指南
  ├── PREFAB_GUIDE.md                 # 预制体创建指南
  ├── TYPESCRIPT_COMPLETION_SUMMARY.md # 代码完成总结
  ├── OPTIMIZATION_SUMMARY.md         # 优化总结
  ├── PROJECT_COMPLETION_REPORT.md    # 完成度报告
  ├── RESOURCE_CREATION_MEMO.md       # 资源创建备忘录 ⭐
  ├── TODO.md                         # 待办清单
  └── GITHUB_PUSH_GUIDE_UPDATED.md    # GitHub 推送指南
```

---

## 推荐操作步骤

### 最简单的方案

1. **使用浏览器上传**:
   - 访问 https://github.com/zwzgryx-bot/fenglangjxu-autochess
   - 点击 **Add file** → **Upload files**
   - 使用文件管理器将整个项目文件夹拖进去
   - 或者使用 `git add .` 然后在本地执行 git 命令

2. **在本地执行 Git 命令**:
   ```bash
   cd /workspace/fenglangjxu-autochess
   
   # 查看所有文件
   git status
   
   # 如果使用 SSH
   git remote set-url origin git@github.com:zwzgryx-bot/fenglangjxu-autochess.git
   
   # 推送
   git push -u origin main --force
   ```

---

## 验证 Token 权限

你的 Token (`github_pat_11B3...`) 有以下权限：
- ✅ 读取仓库信息
- ✅ 读取用户信息
- ❌ 写入权限被拒绝 (403)

**可能原因**:
1. Token 没有 `repo` 完整权限
2. 组织策略限制
3. 需要双重认证

**解决方案**:
1. 重新生成 Token，确保勾选 **Full control of private repositories (repo)**
2. 或者使用 SSH 方式推送

---

## 快速解决

如果急需上传，最简单的方法：

1. 访问：https://github.com/zwzgryx-bot/fenglangjxu-autochess/settings
2. 检查是否启用了 **Third-party access restrictions**
3. 如果启用了，临时禁用或批准此应用
4. 或者使用 SSH：
   ```bash
   # 生成密钥
   ssh-keygen -t ed25519
   
   # 查看公钥并添加到 GitHub
   cat ~/.ssh/id_ed25519.pub
   
   # 切换到 SSH
   git remote set-url origin git@github.com:zwzgryx-bot/fenglangjxu-autochess.git
   
   # 推送
   git push -u origin main
   ```

---

## 上传后验证

上传成功后检查：
1. 访问 https://github.com/zwzgryx-bot/fenglangjxu-autochess
2. 确认文件数量正确
3. 检查 TypeScript 文件完整性
4. 确认图片资源已上传（34 个 PNG）
5. 确认所有文档完整

---

祝上传顺利！如果还有问题，推荐使用 SSH 方式。🚀
