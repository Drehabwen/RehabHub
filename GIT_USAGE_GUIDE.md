# Git 版本控制使用指南

## 📦 仓库信息

- **项目名称**: 亚当斯数字化 (Adams Digitalization)
- **基础版本**: RehabHub v0.3.0-stable
- **当前分支**: 亚当斯数字化
- **仓库位置**: `d:\DEV\RehabHub.worktrees\v0.3.0-stable`

## 🌿 分支结构

### 当前分支
- **亚当斯数字化**: 新产品线开发分支，专注于亚当斯数字化功能的迭代开发

### 主要分支
- **master**: 主分支，稳定版本
- **康复宝**: 康复宝产品线主分支
- **product-line/team**: 团队版产品线
- **product-line/pro**: 专业版产品线
- **product-line/lite**: 精简版产品线

## 🚀 常用 Git 命令

### 1. 查看状态
```bash
git status
```

### 2. 添加文件
```bash
# 添加所有更改
git add -A

# 添加特定文件
git add <文件名>
```

### 3. 提交更改
```bash
git commit -m "描述你的更改"
```

### 4. 查看历史
```bash
# 查看最近的提交
git log --oneline -10

# 查看详细历史
git log
```

### 5. 分支管理
```bash
# 查看所有分支
git branch -a

# 创建新分支
git checkout -b <分支名>

# 切换分支
git checkout <分支名>

# 合并分支
git merge <分支名>
```

### 6. 推送和拉取
```bash
# 推送到远程仓库
git push origin 亚当斯数字化

# 从远程拉取
git pull origin 亚当斯数字化
```

## 📝 提交规范

### 提交消息格式
```
<类型>: <简短描述>
```

### 类型说明
- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建/工具配置

### 提交示例
```bash
git commit -m "feat: 添加亚当斯测试视频分析功能"
git commit -m "fix: 修复角度计算精度问题"
git commit -m "docs: 更新 API 接口文档"
```

## 🔄 工作流建议

### 日常开发流程
1. **开始工作前**
   ```bash
   git checkout 亚当斯数字化
   git pull origin 亚当斯数字化
   ```

2. **开发完成后**
   ```bash
   git add -A
   git status  # 确认更改
   git commit -m "描述你的更改"
   ```

3. **推送到远程**
   ```bash
   git push origin 亚当斯数字化
   ```

### 功能开发流程
1. **创建功能分支**
   ```bash
   git checkout -b feature/功能名称
   ```

2. **开发并定期提交**
   ```bash
   git add -A
   git commit -m "feat: 完成功能的一部分"
   ```

3. **合并回主分支**
   ```bash
   git checkout 亚当斯数字化
   git merge feature/功能名称
   ```

## 📊 远程仓库配置

### 添加远程仓库（如果需要）
```bash
# 查看当前远程仓库
git remote -v

# 添加远程仓库
git remote add origin <仓库地址>

# 推送到远程
git push -u origin 亚当斯数字化
```

## 🛠️ 实用技巧

### 1. 撤销更改
```bash
# 撤销工作区更改
git checkout -- <文件名>

# 撤销暂存
git reset HEAD <文件名>

# 撤销上一次提交
git reset --soft HEAD~1
```

### 2. 查看差异
```bash
# 查看未暂存的更改
git diff

# 查看已暂存的更改
git diff --cached
```

### 3. 清理工作区
```bash
# 清理未跟踪的文件
git clean -fd
```

## 📞 获取帮助

```bash
# 查看 Git 帮助
git help

# 查看特定命令帮助
git help <命令>
```

## ⚠️ 注意事项

1. **提交前检查**: 使用 `git status` 确认要提交的文件
2. **频繁提交**: 小步提交，便于回滚和审查
3. **清晰的提交信息**: 使用中文描述，说明做了什么
4. **分支保护**: 不要直接在主分支上开发重要功能
5. **定期备份**: 及时推送到远程仓库

---

**生成时间**: 2026-04-05  
**适用项目**: 亚当斯数字化康复评估系统
