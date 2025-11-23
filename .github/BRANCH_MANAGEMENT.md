# 分支管理规范

## 分支类型和用途

### 1. 主要分支
- **main** - 生产就绪代码，只接受来自release分支的合并
- **develop** - 开发集成分支，所有功能分支合并到此

### 2. 功能分支 (feature/*)
- 从 `develop` 分支创建
- 命名规范: `feature/组件名-功能描述`
- 示例: `feature/user-profile-avatar`
- 完成后合并回 `develop` 分支

### 3. 发布分支 (release/*)
- 从 `develop` 分支创建
- 命名规范: `release/v版本号`
- 示例: `release/v1.2.0`
- 用于版本发布前的最终测试和bug修复

### 4. 热修复分支 (hotfix/*)
- 从 `main` 分支创建
- 命名规范: `hotfix/问题描述`
- 示例: `hotfix/login-crash`
- 紧急修复生产环境问题

### 5. Bug修复分支 (bugfix/*)
- 从 `develop` 分支创建
- 命名规范: `bugfix/问题描述`
- 示例: `bugfix/memory-leak`

## 分支生命周期

### 功能分支流程
```
develop → feature/xxx → develop → release/v1.x → main
```

### 热修复流程
```
main → hotfix/xxx → main + develop
```

## 分支命名约定

| 分支类型 | 前缀 | 示例 |
|---------|------|------|
| 功能分支 | feature/ | feature/user-authentication |
| 发布分支 | release/ | release/v1.3.0 |
| 热修复分支 | hotfix/ | hotfix/security-vulnerability |
| Bug修复分支 | bugfix/ | bugfix/ui-overlap |

## 合并策略

### 功能分支合并
1. 确保代码是最新的: `git pull origin develop`
2. 解决冲突
3. 运行测试: `npm test`
4. 提交Pull Request
5. 代码审查通过后合并

### 发布分支合并
1. 从develop创建release分支
2. 更新版本号
3. 更新CHANGELOG.md
4. 最终测试
5. 合并到main并打标签
6. 合并回develop

## 分支保护规则

### main分支保护
- 禁止直接推送
- 必须通过Pull Request合并
- 需要代码审查
- 必须通过CI测试

### develop分支保护
- 禁止直接推送
- 必须通过Pull Request合并
- 需要代码审查

## 最佳实践

1. **保持分支简洁**: 一个分支只做一个功能或修复
2. **及时删除分支**: 合并后及时删除功能分支
3. **定期同步**: 定期从develop分支拉取最新代码
4. **清晰描述**: 分支名要清晰描述功能或问题
5. **小步提交**: 频繁提交小改动，便于审查和回滚