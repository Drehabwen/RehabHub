import React from 'react';
import { colors } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';

const AdamsTest: React.FC = () => {
  const { goBack } = useNavigation();

  return (
    <div className="mx-auto max-w-5xl p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.primary[800] }}>亚当斯前屈测试</h1>
        <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: colors.primary[500] }} onClick={goBack}>返回</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border rounded-xl shadow bg-white">
          <div className="text-lg font-semibold text-gray-800 mb-2">操作要点</div>
          <div className="text-sm text-gray-500">站立位前屈，观察背部脊柱侧弯或肋峰</div>
        </div>
        <div className="p-5 border rounded-xl shadow bg-white">
          <div className="text-lg font-semibold text-gray-800 mb-2">风险提示</div>
          <div className="text-sm text-gray-500">如有明显不对称建议进一步影像学评估</div>
        </div>
      </div>
    </div>
  );
};

export default AdamsTest;
