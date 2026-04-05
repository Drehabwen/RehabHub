export interface ButtonProps {
  /** 按钮文本内容 */
  children: React.ReactNode;
  /** 按钮类型变体 */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  /** 按钮尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 是否禁用按钮 */
  disabled?: boolean;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 点击事件处理函数 */
  onClick?: () => void;
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset';
  /** 自定义CSS类名 */
  className?: string;
  /** 按钮图标 */
  icon?: React.ReactNode;
  /** 图标位置 */
  iconPosition?: 'left' | 'right';
}