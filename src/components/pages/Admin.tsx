import React, { useState, useEffect } from 'react';
import { Layout } from '../layout/Layout';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';

// 定义用户类型
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'therapist' | 'viewer';
  avatar?: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

// 模拟用户数据
const mockUsersData: User[] = [
  {
    id: 'U001',
    name: '管理员',
    email: 'admin@rehabhub.com',
    role: 'admin',
    lastLogin: '2024-05-20',
    status: 'active'
  },
  {
    id: 'U002',
    name: '治疗师1',
    email: 'therapist1@rehabhub.com',
    role: 'therapist',
    lastLogin: '2024-05-19',
    status: 'active'
  },
  {
    id: 'U003',
    name: '访客1',
    email: 'viewer1@rehabhub.com',
    role: 'viewer',
    lastLogin: '2024-05-15',
    status: 'inactive'
  }
];

// 定义系统统计类型
interface SystemStats {
  totalPatients: number;
  totalAssessments: number;
  totalReports: number;
  activeUsers: number;
  systemUptime: string;
  storageUsed: string;
  storageTotal: string;
}

// 模拟系统统计数据
const mockSystemStats: SystemStats = {
  totalPatients: 156,
  totalAssessments: 1243,
  totalReports: 892,
  activeUsers: 12,
  systemUptime: '15天 8小时 32分钟',
  storageUsed: '2.3 GB',
  storageTotal: '10 GB'
};

const Admin: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsersData);
  const [systemStats, setSystemStats] = useState<SystemStats>(mockSystemStats);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'settings'>('dashboard');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'viewer',
    status: 'active'
  });
  
  // 组件挂载后设置动画
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 添加用户
  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: `U${String(users.length + 1).padStart(3, '0')}`,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as 'admin' | 'therapist' | 'viewer',
        status: newUser.status as 'active' | 'inactive'
      };
      
      setUsers([...users, user]);
      setNewUser({
        name: '',
        email: '',
        role: 'viewer',
        status: 'active'
      });
      setShowAddUserForm(false);
    }
  };
  
  // 删除用户
  const handleDeleteUser = (id: string) => {
    if (confirm('确定要删除此用户吗？')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };
  
  // 切换用户状态
  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };
  
  // 获取角色颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return colors.error[600];
      case 'therapist':
        return colors.primary[600];
      case 'viewer':
        return colors.neutral[600];
      default:
        return colors.neutral[600];
    }
  };
  
  // 获取角色文本
  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'therapist':
        return '治疗师';
      case 'viewer':
        return '访客';
      default:
        return '未知';
    }
  };
  
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success[600];
      case 'inactive':
        return colors.neutral[600];
      default:
        return colors.neutral[600];
    }
  };
  
  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'inactive':
        return '非活跃';
      default:
        return '未知';
    }
  };
  
  return (
    <Layout title="系统管理">
      <style>{animationKeyframes}</style>
      <div className="mx-auto max-w-6xl p-4 w-full">
        {/* 返回按钮 */}
        <div className="mb-6 flex justify-start">
          <Button
            variant="secondary"
            size="medium"
            onClick={() => navigateTo('dashboard')}
            className="transition-colors duration-300"
            style={{ backgroundColor: colors.primary[100], color: colors.primary[700] }}
            aria-label="返回仪表盘"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回仪表盘
          </Button>
        </div>
        
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
            color: colors.primary[800], 
            fontWeight: typography.fontWeight.bold
          }}>系统管理</h1>
          <p className="text-base md:text-lg" style={{ color: colors.text.secondary }}>
            管理用户、系统设置和查看统计数据
          </p>
        </div>
        
        {/* 标签页 */}
        <div className="flex flex-wrap gap-2 mb-8 border-b" style={{ borderColor: colors.neutral[200] }}>
          {(['dashboard', 'users', 'settings'] as const).map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium transition-colors duration-200 border-b-2 ${
                activeTab === tab ? 'border-current' : 'border-transparent'
              }`}
              style={{
                color: activeTab === tab ? colors.primary[600] : colors.text.secondary,
                ...(activeTab === tab ? { fontWeight: typography.fontWeight.semibold } : {})
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'dashboard' && '系统概览'}
              {tab === 'users' && '用户管理'}
              {tab === 'settings' && '系统设置'}
            </button>
          ))}
        </div>
        
        {/* 系统概览 */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card 
                className="p-6 border shadow-md"
                style={{
                  ...(mounted && animations.fadeInUp('0.6s', '0.1s'))
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                      患者总数
                    </p>
                    <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                      {systemStats.totalPatients}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary[100] }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </Card>
              
              <Card 
                className="p-6 border shadow-md"
                style={{
                  ...(mounted && animations.fadeInUp('0.6s', '0.2s'))
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                      评估总数
                    </p>
                    <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                      {systemStats.totalAssessments}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.success[100] }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.success[600] }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>
              
              <Card 
                className="p-6 border shadow-md"
                style={{
                  ...(mounted && animations.fadeInUp('0.6s', '0.3s'))
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                      报告总数
                    </p>
                    <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                      {systemStats.totalReports}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.warning[100] }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.warning[600] }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </Card>
              
              <Card 
                className="p-6 border shadow-md"
                style={{
                  ...(mounted && animations.fadeInUp('0.6s', '0.4s'))
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: colors.text.secondary }}>
                      活跃用户
                    </p>
                    <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                      {systemStats.activeUsers}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.info[100] }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.info[600] }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* 系统信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="p-6 border shadow-md"
                style={{
                  ...(mounted && animations.fadeInUp('0.6s', '0.5s'))
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                  系统状态
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: colors.text.secondary }}>系统运行时间</span>
                    <span className="text-sm font-medium" style={{ color: colors.text.primary }}>{systemStats.systemUptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: colors.text.secondary }}>存储使用情况</span>
                    <span className="text-sm font-medium" style={{ color: colors.text.primary }}>{systemStats.storageUsed} / {systemStats.storageTotal}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.neutral[200] }}>
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(parseInt(systemStats.storageUsed) / parseInt(systemStats.storageTotal)) * 100}%`,
                        backgroundColor: colors.primary[500]
                      }}
                    ></div>
                  </div>
                </div>
              </Card>
              
              <Card 
                className="p-6 border shadow-md"
                style={{
                  ...(mounted && animations.fadeInUp('0.6s', '0.6s'))
                }}
              >
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                  快速操作
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigateTo('patients')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    患者管理
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigateTo('reports')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    报告管理
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setActiveTab('users')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    用户管理
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => setActiveTab('settings')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    系统设置
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {/* 用户管理 */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
                用户管理
              </h2>
              <Button
                variant="primary"
                size="medium"
                onClick={() => setShowAddUserForm(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加用户
              </Button>
            </div>
            
            {/* 添加用户表单 */}
            {showAddUserForm && (
              <Card className="p-6 border shadow-md" style={{ 
                ...(mounted && animations.fadeInDown('0.3s', '0s'))
              }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>添加新用户</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      姓名
                    </label>
                    <input
                      type="text"
                      placeholder="用户姓名"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      邮箱
                    </label>
                    <input
                      type="email"
                      placeholder="用户邮箱"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      角色
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                    >
                      <option value="viewer">访客</option>
                      <option value="therapist">治疗师</option>
                      <option value="admin">管理员</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                      状态
                    </label>
                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      style={{ borderColor: colors.neutral[300] }}
                      value={newUser.status}
                      onChange={(e) => setNewUser({...newUser, status: e.target.value as any})}
                    >
                      <option value="active">活跃</option>
                      <option value="inactive">非活跃</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddUserForm(false)}
                  >
                    取消
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAddUser}
                  >
                    添加用户
                  </Button>
                </div>
              </Card>
            )}
            
            {/* 用户列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user, index) => (
                <Card 
                  key={user.id}
                  className="p-6 border shadow-md hover:shadow-lg transition-all duration-300"
                  style={{
                    ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text.primary }}>
                        {user.name}
                      </h3>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>
                        {user.email}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.neutral[100] }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.neutral[600] }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2" style={{ color: colors.text.secondary }}>角色:</span>
                      <span className="text-sm px-2 py-1 rounded-full" style={{
                        backgroundColor: `${getRoleColor(user.role)}20`,
                        color: getRoleColor(user.role)
                      }}>
                        {getRoleText(user.role)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2" style={{ color: colors.text.secondary }}>状态:</span>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2`} style={{ backgroundColor: getStatusColor(user.status) }}></div>
                        <span className="text-sm" style={{ color: getStatusColor(user.status) }}>
                          {getStatusText(user.status)}
                        </span>
                      </div>
                    </div>
                    
                    {user.lastLogin && (
                      <div className="text-sm" style={{ color: colors.text.secondary }}>
                        <span className="font-medium">最后登录:</span> {user.lastLogin}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleToggleUserStatus(user.id)}
                      style={{ 
                        borderColor: user.status === 'active' ? colors.warning[300] : colors.success[300],
                        color: user.status === 'active' ? colors.warning[600] : colors.success[600]
                      }}
                    >
                      {user.status === 'active' ? '禁用' : '启用'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ borderColor: colors.error[300], color: colors.error[600] }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* 系统设置 */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>
              系统设置
            </h2>
            
            <Card className="p-6 border shadow-md">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                数据备份与恢复
              </h3>
              <div className="space-y-4">
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  定期备份数据可以确保系统数据安全。建议每周至少备份一次。
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={() => alert('备份功能将在后台执行')}
                  >
                    立即备份
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alert('恢复功能需要上传备份文件')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    恢复数据
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border shadow-md">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                系统维护
              </h3>
              <div className="space-y-4">
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  定期维护可以保持系统性能和稳定性。
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => alert('清理缓存功能将在后台执行')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    清理缓存
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alert('优化数据库功能将在后台执行')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    优化数据库
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alert('检查更新功能将连接到服务器')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    检查更新
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 border shadow-md">
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
                日志管理
              </h3>
              <div className="space-y-4">
                <p className="text-sm" style={{ color: colors.text.secondary }}>
                  查看和管理系统日志，帮助诊断问题。
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => alert('查看日志功能将打开日志页面')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    查看日志
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alert('导出日志功能将生成日志文件')}
                    style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                  >
                    导出日志
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => alert('清空日志功能将删除所有日志记录')}
                    style={{ borderColor: colors.error[300], color: colors.error[600] }}
                  >
                    清空日志
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;