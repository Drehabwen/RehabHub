import React from 'react';
import { colors } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';

const Scales: React.FC = () => {
  const { goBack } = useNavigation();
  const items = ['VAS 疼痛', 'Oswestry 功能障碍', 'SF-36 健康调查', 'TUG 行走测试'];

  return (
    <div className="mx-auto max-w-5xl p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.primary[800] }}>量表评估</h1>
        <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: colors.primary[500] }} onClick={goBack}>返回</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((name) => (
          <div key={name} className="p-5 border rounded-xl shadow bg-white flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-800">{name}</div>
              <div className="text-sm text-gray-500">点击开始填写</div>
            </div>
            <button className="px-3 py-2 rounded-lg text-white" style={{ backgroundColor: colors.primary[500] }}>开始</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scales;
