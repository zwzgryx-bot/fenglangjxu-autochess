# GitHub 推送指南

**目标仓库**: https://github.com/zwzgryx-bot/fenglangjxu-autochess.git

---

## 方法一：使用 GitHub Token（推荐）

### 1. 创建 Personal Access Token

1. 登录 GitHub
2. 进入 **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. 点击 **Generate new token (classic)**
4. 选择权限：
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. 生成并复制 Token（格式如：`ghp_xxxxxxxxxxxx`）

### 2. 使用 Token 推送

```bash
cd /workspace/fenglangjxu-autochess

# 方法 A: 在推送时输入 Token
git push -u origin master
# 当提示 Username 时：输入你的 GitHub 用户名
# 当提示 Password 时：粘贴刚才生成的 Token（不会显示）

# 方法 B: 直接在 URL 中包含 Token（不推荐，不安全）
git remote set-url origin https://YOUR_USERNAME:YOUR_TOKEN@github.com/zwzgryx-bot/fenglangjxu-autochess.git
git push -u origin master
```

---

## 方法二：使用 SSH 密钥

### 1. 生成 SSH 密钥

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# 一路回车使用默认设置
```

### 2. 添加 SSH 密钥到 GitHub

1. 复制公钥内容：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. 登录 GitHub → **Settings** → **SSH and GPG keys** → **New SSH key**
3. 粘贴公钥内容并保存

### 3. 切换为 SSH 协议

```bash
cd /workspace/fenglangjxu-autochess
git remote set-url origin git@github.com:zwzgryx-bot/fenglangjxu-autochess.git
git push -u origin master
```

---

## 方法三：使用 GitHub CLI

### 1. 安装 gh

```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 验证安装
gh --version
```

### 2. 认证并推送

```bash
cd /workspace/fenglangjxu-autochess
gh auth login
# 按提示完成认证

# 推送代码
gh repo push --force
```

---

## 方法四：使用 Git Credential Manager

如果你使用的是 Windows 或 macOS，Git Credential Manager 会自动处理认证：

```bash
cd /workspace/fenglangjxu-autochess
git push -u origin master
# 会弹出浏览器完成认证
```

---

## 当前提交状态

**最新提交**: `ed98553` - 添加项目完成度报告和棋子生成脚本

**提交历史** (最近 12 次):
```
ed98553 docs: 添加项目完成度报告和棋子生成脚本
cfce744 docs: 创建资源创建备忘录，包含所有缺失资源的详细提示词和文件路径
dff46a2 feat: 生成 34 个棋子占位图资源
fc9b7db feat: 添加配置和事件常量模块，提升代码可维护性
2a75773 feat: 添加 ShopController 并修复 BattleController 导入路径
5472ea5 docs: 添加快速启动指南
59d7c2f feat: 完成所有 TypeScript 核心代码实现
947b17f feat: 创建 UI 系统、存档系统和项目文档
ef095ab docs: 添加同步总结文档
94a70a5 feat: 添加一键推送 GitHub 脚本
df17346 docs: 添加 GitHub 推送指南
cf1cee4 feat: 封狼居胥 Cocos Creator 项目初始化
```

**总计**: 12 次提交，包含所有代码、文档和资源

---

## 快速推送命令

```bash
# 进入项目目录
cd /workspace/fenglangjxu-autochess

# 推送所有更改到 GitHub
git push -u origin master --force
```

---

## 推送成功后

1. 访问仓库确认代码已上传：
   https://github.com/zwzgryx-bot/fenglangjxu-autochess

2. 检查文件是否完整：
   - TypeScript 代码：24 个文件
   - 棋子资源：34 个 PNG
   - 文档：完整的项目文档

3. 邀请协作者（如需要）：
   - Settings → Collaborators → Add people

---

## 常见问题

### Q: 推送失败提示 "Permission denied"
**A**: 确保你有该仓库的写入权限，或联系仓库所有者添加你为协作者

### Q: 推送失败提示 "Authentication failed"
**A**: Token 已过期或权限不足，重新生成 Personal Access Token

### Q: 推送失败提示 "remote: Repository not found"
**A**: 确认仓库 URL 正确，或仓库不存在/已删除

### Q: 推送速度很慢
**A**: 棋子图片文件较大，可以使用 Git LFS 管理大文件：
```bash
git lfs install
git lfs track "*.png"
git add .gitattributes
git commit -m "Configure Git LFS for PNG files"
git push -u origin master
```

---

## 下一步

推送成功后，你可以：
1. 在 GitHub 上查看代码
2. 设置 GitHub Pages 预览
3. 配置 GitHub Actions 自动构建
4. 邀请团队成员协做

祝推送顺利！🚀
