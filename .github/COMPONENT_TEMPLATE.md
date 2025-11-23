# 组件模板和规范

## 组件模板结构

### 基础组件模板
```
src/components/ui/
├── Button/
│   ├── index.tsx          # 组件导出
│   ├── Button.tsx         # 组件实现
│   ├── Button.stories.tsx  # Storybook故事
│   ├── Button.test.tsx     # 测试文件
│   ├── Button.module.css   # 样式文件
│   └── types.ts           # 类型定义
```

### 业务组件模板
```
src/components/assessment/
├── VideoPlayer/
│   ├── index.tsx
│   ├── VideoPlayer.tsx
│   ├── VideoPlayer.stories.tsx
│   ├── VideoPlayer.test.tsx
│   ├── VideoPlayer.module.css
│   ├── hooks/
│   │   └── useVideoControl.ts
│   └── types.ts
```

## 组件代码模板

### TypeScript接口定义 (types.ts)
```tsx
export interface ButtonProps {
  /** 按钮文本 */
  children: React.ReactNode;
  /** 按钮类型 */
  variant?: 'primary' | 'secondary' | 'danger';
  /** 按钮尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件 */
  onClick?: () => void;
  /** 自定义类名 */
  className?: string;
}
```

### 组件实现 (Button.tsx)
```tsx
import React from 'react';
import styles from './Button.module.css';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    disabled ? styles['button--disabled'] : '',
    className,
  ].join(' ').trim();

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={handleClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;
```

### 样式文件 (Button.module.css)
```css
.button {
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

/* 尺寸变体 */
.button--small {
  padding: 8px 12px;
  font-size: 14px;
}

.button--medium {
  padding: 12px 16px;
  font-size: 16px;
}

.button--large {
  padding: 16px 24px;
  font-size: 18px;
}

/* 类型变体 */
.button--primary {
  background-color: #007bff;
  color: white;
}

.button--primary:hover:not(.button--disabled) {
  background-color: #0056b3;
}

.button--secondary {
  background-color: #6c757d;
  color: white;
}

.button--secondary:hover:not(.button--disabled) {
  background-color: #545b62;
}

.button--danger {
  background-color: #dc3545;
  color: white;
}

.button--danger:hover:not(.button--disabled) {
  background-color: #c82333;
}

/* 禁用状态 */
.button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### 测试文件 (Button.test.tsx)
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('应该正确渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('应该触发点击事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('禁用状态下不应该触发点击事件', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>禁用按钮</Button>);
    
    fireEvent.click(screen.getByText('禁用按钮'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Storybook故事 (Button.stories.tsx)
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按钮',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '次要按钮',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: '大按钮',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: '小按钮',
  },
};
```

### 导出文件 (index.tsx)
```tsx
export { default } from './Button';
export type { ButtonProps } from './types';
```

## 组件开发规范

### 1. 命名规范
- **组件名**: PascalCase (如: `UserProfile`)
- **文件名**: 与组件名一致 (如: `UserProfile.tsx`)
- **目录名**: kebab-case (如: `user-profile/`)
- **CSS类名**: BEM命名法 (如: `button__text--primary`)

### 2. 文件组织
- 每个组件一个独立目录
- 相关文件放在同一目录下
- 类型定义单独文件
- 样式使用CSS Modules

### 3. 代码质量
- 使用TypeScript严格模式
- 添加必要的JSDoc注释
- 遵循ESLint规则
- 保持代码简洁可读

### 4. 测试要求
- 单元测试覆盖率 > 80%
- 测试用户交互行为
- 测试边界条件
- 测试可访问性

### 5. 文档要求
- 完整的Props文档
- 使用示例
- Storybook集成
- README文件

## 推荐的组件库

### 基础UI组件
1. **Button** - 按钮组件
2. **Input** - 输入框组件
3. **Modal** - 模态框组件
4. **Card** - 卡片组件
5. **Table** - 表格组件

### 业务组件
1. **VideoPlayer** - 视频播放器
2. **AssessmentForm** - 评估表单
3. **ProgressTracker** - 进度跟踪器
4. **ResultDisplay** - 结果展示
5. **UserProfile** - 用户资料

### 布局组件
1. **Header** - 页面头部
2. **Sidebar** - 侧边栏
3. **Footer** - 页脚
4. **Layout** - 布局容器
5. **Grid** - 网格布局