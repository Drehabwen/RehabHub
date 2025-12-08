import React, { useState, useEffect } from 'react';

import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { colors, typography } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { animations, animationKeyframes } from '../../utils/animations';

// 定义患者类型
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  diagnosis?: string;
  lastVisit?: string;
  totalAssessments?: number;
}

// 模拟患者数据
const mockPatientsData: Patient[] = [
  {
    id: 'P001',
    name: '张三',
    age: 35,
    gender: 'male',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    diagnosis: '膝关节损伤',
    lastVisit: '2024-05-15',
    totalAssessments: 5
  },
  {
    id: 'P002',
    name: '李四',
    age: 42,
    gender: 'female',
    phone: '13800138002',
    email: 'lisi@example.com',
    diagnosis: '肩周炎',
    lastVisit: '2024-05-14',
    totalAssessments: 3
  },
  {
    id: 'P003',
    name: '王五',
    age: 28,
    gender: 'male',
    phone: '13800138003',
    diagnosis: '腰椎间盘突出',
    lastVisit: '2024-05-13',
    totalAssessments: 7
  }
];

const Patients: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [mounted, setMounted] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(mockPatientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: '',
    age: 0,
    gender: 'male',
    phone: '',
    email: '',
    diagnosis: ''
  });
  
  // 组件挂载后设置动画
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 过滤患者
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.diagnosis && patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // 添加新患者
  const handleAddPatient = () => {
    if (newPatient.name && newPatient.phone) {
      const patient: Patient = {
        id: `P${String(patients.length + 1).padStart(3, '0')}`,
        name: newPatient.name,
        age: newPatient.age || 0,
        gender: newPatient.gender as 'male' | 'female',
        phone: newPatient.phone,
        email: newPatient.email,
        diagnosis: newPatient.diagnosis,
        totalAssessments: 0
      };
      
      setPatients([...patients, patient]);
      setNewPatient({
        name: '',
        age: 0,
        gender: 'male',
        phone: '',
        email: '',
        diagnosis: ''
      });
      setShowAddForm(false);
    }
  };
  
  // 删除患者
  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(patient => patient.id !== id));
  };
  
  // 开始评估
  const handleStartAssessment = (patient: Patient) => {
    // 存储患者ID到会话存储
    sessionStorage.setItem('currentPatientId', patient.id);
    navigateTo('movement-selection');
  };
  
  return (
    <>
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
        
        {/* 页面标题和操作 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ 
              color: colors.primary[800], 
              fontWeight: typography.fontWeight.bold
            }}>患者管理</h1>
            <p className="text-base md:text-lg" style={{ color: colors.text.secondary }}>
              管理患者信息，查看评估历史
            </p>
          </div>
          
          <Button
            variant="primary"
            size="medium"
            onClick={() => setShowAddForm(true)}
            className="mt-4 md:mt-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加患者
          </Button>
        </div>
        
        {/* 搜索栏 */}
        <div className="mb-6">
          <Input
            placeholder="搜索患者姓名、ID或诊断..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            style={{ maxWidth: '400px' }}
          />
        </div>
        
        {/* 添加患者表单 */}
        {showAddForm && (
          <Card className="p-6 border shadow-md mb-6" style={{ 
            ...(mounted && animations.fadeInDown('0.3s', '0s'))
          }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.text.primary }}>添加新患者</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                  姓名 *
                </label>
                <Input
                  placeholder="患者姓名"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                  年龄
                </label>
                <Input
                  type="number"
                  placeholder="年龄"
                  value={newPatient.age || ''}
                  onChange={(e) => setNewPatient({...newPatient, age: parseInt(e.target.value) || 0})}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                  性别
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={newPatient.gender === 'male'}
                      onChange={(e) => setNewPatient({...newPatient, gender: e.target.value as 'male' | 'female'})}
                      className="mr-2"
                    />
                    <span style={{ color: colors.text.primary }}>男</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={newPatient.gender === 'female'}
                      onChange={(e) => setNewPatient({...newPatient, gender: e.target.value as 'male' | 'female'})}
                      className="mr-2"
                    />
                    <span style={{ color: colors.text.primary }}>女</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                  电话 *
                </label>
                <Input
                  placeholder="联系电话"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                  邮箱
                </label>
                <Input
                  type="email"
                  placeholder="电子邮箱"
                  value={newPatient.email || ''}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.primary }}>
                  诊断
                </label>
                <Input
                  placeholder="诊断结果"
                  value={newPatient.diagnosis || ''}
                  onChange={(e) => setNewPatient({...newPatient, diagnosis: e.target.value})}
                  fullWidth
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleAddPatient}
              >
                添加患者
              </Button>
            </div>
          </Card>
        )}
        
        {/* 患者列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, index) => (
            <Card 
              key={patient.id}
              className="p-6 border shadow-md hover:shadow-lg transition-all duration-300"
              style={{
                ...(mounted && animations.fadeInUp('0.6s', `${0.1 + index * 0.1}s`))
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: colors.text.primary }}>
                    {patient.name}
                  </h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>
                    ID: {patient.id}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary[100] }}>
                  {patient.gender === 'male' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[600] }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm" style={{ color: colors.text.secondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {patient.age} 岁
                </div>
                
                <div className="flex items-center text-sm" style={{ color: colors.text.secondary }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {patient.phone}
                </div>
                
                {patient.diagnosis && (
                  <div className="text-sm" style={{ color: colors.text.secondary }}>
                    <span className="font-medium">诊断:</span> {patient.diagnosis}
                  </div>
                )}
                
                {patient.totalAssessments !== undefined && (
                  <div className="text-sm" style={{ color: colors.text.secondary }}>
                    <span className="font-medium">评估次数:</span> {patient.totalAssessments}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => handleStartAssessment(patient)}
                  className="flex-1"
                >
                  开始评估
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => navigateTo('history', { patientId: patient.id })}
                  style={{ borderColor: colors.primary[300], color: colors.primary[600] }}
                >
                  历史
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handleDeletePatient(patient.id)}
                  style={{ borderColor: colors.error[100], color: colors.error[500] }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* 空状态 */}
        {filteredPatients.length === 0 && (
          <Card className="p-12 text-center border shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.neutral[400] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
              {searchTerm ? '未找到匹配的患者' : '暂无患者记录'}
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.text.secondary }}>
              {searchTerm ? '尝试调整搜索条件' : '添加第一个患者开始使用系统'}
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                onClick={() => setShowAddForm(true)}
              >
                添加患者
              </Button>
            )}
          </Card>
        )}
      </div>
    </>
  );
};

export default Patients;