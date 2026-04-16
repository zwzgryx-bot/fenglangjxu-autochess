# 封狼居胥 - GitHub 推送指南

**创建日期**: 2026-04-16  
**当前状态**: ✅ 本地 git 仓库已创建并提交

---

## ✅ 当前进度

```
✅ 项目框架搭建完成
✅ TypeScript 代码导入成功 (13 个文件)
✅ Git 仓库初始化完成
✅ 首次提交成功 (commit: cf1cee4)
⏳ 等待推送到 GitHub
```

---

## 🚀 推送到 GitHub - 方式 1: 创建新仓库

### 步骤 1: 在 GitHub 上创建新仓库

1. 访问 https://github.com/new
2. 填写仓库信息:
   - **Repository name**: `fenglangjxu-autochess`
   - **Description**: "封狼居胥 - 西汉题材自走棋 Cocos Creator 项目"
   - **Visibility**: 选择 Private (私有) 或 Public (公开)
   - ❌ 不要勾选 "Initialize this repository with a README"
3. 点击 "Create repository"

### 步骤 2: 关联远程仓库并推送

在终端执行以下命令:

```bash
cd /workspace/fenglangjxu-autochess

# 添加远程仓库 (替换 <your-username> 为你的 GitHub 用户名)
git remote add origin https://github.com/<your-username>/fenglangjxu-autochess.git

# 推送到 GitHub
git push -u origin master
```

### 步骤 3: 验证推送

刷新 GitHub 仓库页面，应该能看到所有文件已上传。

---

## 🔗 推送到 GitHub - 方式 2: 使用已有仓库

### 如果你已经有仓库

```bash
cd /workspace/fenglangjxu-autochess

# 如果已有远程仓库，先移除
git remote remove origin

# 添加新的远程仓库
git remote add origin https://github.com/<your-username>/<your-repo>.git

# 推送
git push -u origin master
```

---

## 🔐 使用 SSH 方式推送 (推荐)

### 步骤 1: 配置 SSH 密钥

```bash
# 生成 SSH 密钥 (如果没有)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 复制输出内容，添加到 GitHub:
# Settings → SSH and GPG keys → New SSH key
```

### 步骤 2: 使用 SSH 远程地址

```bash
cd /workspace/fenglangjxu-autochess

# 使用 SSH 地址添加远程仓库
git remote add origin git@github.com:<your-username>/fenglangjxu-autochess.git

# 推送
git push -u origin master
```

---

## 📊 提交记录

```
commit cf1cee4
Author: MonkeyCode Developer
Date:   2026-04-16

    feat: 封狼居胥 Cocos Creator 项目初始化 (12 个 TypeScript 核心系统)
    
    21 files changed, 7100 insertions(+)
```

---

## 📁 已提交的文件 (21 个)

### TypeScript 代码 (13 个)
- `assets/scripts/Main.ts` - 游戏入口
- `assets/scripts/core/` (3 个) - GameManager, EventSystem, ThemeManager
- `assets/scripts/chess/` (3 个) - ChessData, Chess, ClassChangeSystem
- `assets/scripts/battle/` (2 个) - SynergyCalculator, BattleSystem
- `assets/scripts/economy/` (1 个) - EconomySystem
- `assets/scripts/shop/` (1 个) - ShopSystem
- `assets/scripts/ai/` (1 个) - BattleAI
- `assets/scripts/utils/` (1 个) - ResourceManager

### 配置文件 (7 个)
- `project.json` - 项目信息
- `tsconfig.json` - TypeScript 配置
- `game.json` - 微信小游戏配置
- `game.config.json` - 游戏配置
- `settings/v2/project.json` - 项目设置
- `import-code.sh` - 导入脚本
- `README.md` + `README_IMPORT.md` - 文档

---

## ⏭️ 推送完成后的工作

### 1. 邀请协作者 (可选)
- GitHub 仓库 → Settings → Collaborators
- 添加团队成员

### 2. 创建分支 (推荐)
```bash
# 创建开发分支
git checkout -b develop

# 推送到远程
git push -u origin develop
```

### 3. 设置分支保护 (推荐)
- Settings → Branches → Add branch protection rule
- Branch name pattern: `master` 或 `main`
- 勾选 "Require pull request reviews"

### 4. 配置 CI/CD (可选)
- 添加 GitHub Actions 工作流
- 自动化构建和测试

---

## 📞 遇到问题？

### 问题 1: 认证失败
```
解决：使用 Personal Access Token 代替密码
1. GitHub → Settings → Developer settings → Personal access tokens
2. 生成新 token (勾选 repo 权限)
3. 推送时使用 token 作为密码
```

### 问题 2: 远程仓库已存在
```
解决：先拉取再推送
git pull origin master --allow-unrelated-histories
git push -u origin master
```

### 问题 3: 仓库太大
```
解决：分次推送或使用 Git LFS
git lfs install
git lfs track "*.png"
git lfs track "*.mp3"
```

---

## 📊 下一步计划

推送完成后:
- [ ] 在 GitHub 上查看文件
- [ ] 邀请团队成员 (如需要)
- [ ] 创建 develop 分支
- [ ] 使用 Cocos Creator 打开项目
- [ ] 继续开发 UI 和美术资源

---

**文档版本**: v1.0  
**最后更新**: 2026-04-16
