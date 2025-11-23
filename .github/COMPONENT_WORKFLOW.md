# 组件开发工作流

## 组件开发流程

### 1. 创建功能分支
```bash
git checkout develop
git pull origin develop
git checkout -b feature/组件名-功能描述
```

### 2. 创建组件目录结构
```
src/components/
├── 组件名/
│   ├── index.tsx          # 组件主文件
│   ├── 组件名.tsx         # 组件实现
│   ├── 组件名.stories.tsx # Storybook故事
│   ├── 组件名.test.tsx    # 测试文件
│   ├── 组件名.module.css  # 样式文件
│   └── types.ts           # 类型定义
```

### 3. 组件开发规范

#### 文件命名
- 组件文件: PascalCase (如: `UserProfile.tsx`)
- 样式文件: kebab-case (如: `user-profile.module.css`)
- 测试文件: 与组件同名 (如: `UserProfile.test.tsx`)

#### 组件结构
```tsx
import React from 'react';
import styles from './组件名.module.css';

interface 组件名Props {
  // 组件属性定义
}

export const 组件名: React.FC<组件名Props> = (props) => {
  // 组件逻辑
  
  return (
    <div className={styles.container}>
      {/* 组件内容 */}
    </div>
  );
};

export default 组件名;
```

### 4. 编写测试
```tsx
import { render, screen } from '@testing-library/react';
import 组件名 from './组件名';

describe('组件名', () => {
  it('应该正确渲染', () => {
    render(<组件名 />);
    expect(screen.getByText('预期文本')).toBeInTheDocument();
  });
});
```

### 5. 编写Storybook故事
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import 组件名 from './组件名';

const meta: Meta<typeof 组件名> = {
  title: 'Components/组件名',
  component: 组件名,
};

export default meta;
type Story = StoryObj<typeof 组件名>;

export const Default: Story = {
  args: {
    // 默认参数
  },
};
```

### 6. 提交代码
```bash
# 添加文件
git add src/components/组件名/

# 提交信息格式
git commit -m "feat(组件名): 添加新组件功能"

# 推送分支
git push origin feature/组件名-功能描述
```

## 组件类型分类

### 1. UI组件 (基础组件)
- 位置: `src/components/ui/`
- 示例: Button, Input, Modal, Card
- 要求: 高度可复用，无业务逻辑

### 2. 业务组件
- 位置: `src/components/业务领域/`
- 示例: UserProfile, VideoPlayer, AssessmentForm
- 要求: 包含特定业务逻辑

### 3. 布局组件
- 位置: `src/components/layout/`
- 示例: Header, Sidebar, Footer
- 要求: 负责页面布局

### 4. 复合组件
- 位置: `src/components/composite/`
- 示例: SearchBar, DataTable, Wizard
- 要求: 由多个基础组件组合而成

## 组件开发检查清单

### 开发前
- [ ] 确认组件需求和设计
- [ ] 创建功能分支
- [ ] 设计组件API接口

### 开发中
- [ ] 实现组件功能
- [ ] 编写样式文件
- [ ] 添加类型定义
- [ ] 编写单元测试
- [ ] 编写Storybook故事

### 开发后
- [ ] 运行测试确保通过
- [ ] 代码审查
- [ ] 更新组件文档
- [ ] 合并到develop分支

## 组件发布流程

### 1. 内部测试
- 在Storybook中测试组件
- 在开发环境中集成测试

### 2. 代码审查
- 至少1名开发者审查
- 检查代码规范
- 验证测试覆盖率

### 3. 合并发布
- 合并到develop分支
- 在下一个版本中发布

## 最佳实践

### 组件设计原则
1. **单一职责**: 每个组件只负责一个功能
2. **可组合性**: 组件应该易于组合使用
3. **可测试性**: 组件应该易于测试
4. **可维护性**: 代码清晰，易于理解

### 性能优化
- 使用React.memo优化重渲染
- 合理使用useCallback和useMemo
- 避免不必要的props传递

### 可访问性
- 支持键盘导航
- 提供适当的ARIA属性
- 确保颜色对比度符合标准