import React from 'react';
import { colors } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';

const AssessmentHub: React.FC = () => {
  const { navigateTo } = useNavigation();

  const fmsMovements: Array<{ id: string; name: string }> = [
    { id: 'deep-squat', name: '深蹲' },
    { id: 'hurdle-step', name: '跨栏步' },
    { id: 'inline-lunge', name: '直线弓步' },
    { id: 'shoulder-mobility', name: '肩部灵活性' },
    { id: 'active-straight-leg-raise', name: '主动直腿抬高' },
    { id: 'trunk-stability-pushup', name: '躯干稳定俯卧撑' },
    { id: 'rotary-stability', name: '旋转稳定性' }
  ];

  const startMovement = (m: { id: string; name: string }) => {
    navigateTo('video-analysis', { movement: m });
  };

  return (
    <div className="mx-auto max-w-6xl p-4 w-full">
      <div className="grid grid-cols-2 gap-4 h-auto md:h-[520px]">
        {/* 大便当：FMS七个具体动作 */}
        <div
          className="col-span-2 md:col-span-1 md:row-span-2 relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`
          }}
        >
          <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-4xl">🧘</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">FMS 功能性动作评估</h2>
              <p className="text-blue-100 text-lg">基于关键点与角度的标准化评估</p>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
                {fmsMovements.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => startMovement(m)}
                    className="px-3 py-2 rounded-lg text-sm bg-white/15 hover:bg-white/25 transition-colors text-white"
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center font-semibold group-hover:translate-x-2 transition-transform">
              进入评估
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* 量表评估 */}
        <div
          className="col-span-1 relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl bg-white"
          onClick={() => navigateTo('scales')}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">量表评估</h3>
            <p className="text-sm text-gray-500 mb-4">疼痛、功能障碍、风险筛查</p>
            <div className="mt-auto flex justify-end">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 问诊 */}
        <div
          className="col-span-1 relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl bg-white"
          onClick={() => navigateTo('questionnaire')}
        >
          <div className="p-6 h-full flex flex-col">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
              <span className="text-2xl">🗣️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">问诊</h3>
            <p className="text-sm text-gray-500 mb-4">病史采集与主诉记录</p>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2 text-center text-xs text-gray-600">基础信息</div>
              <div className="bg-gray-50 rounded-lg p-2 text-center text-xs text-gray-600">症状时间轴</div>
            </div>
          </div>
        </div>

        {/* 其他动作评估 */}
        <div
          className="col-span-2 md:col-span-2 relative overflow-hidden rounded-3xl shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl bg-white"
          onClick={() => navigateTo('tests')}
        >
          <div className="p-6 h-full flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                <span className="text-2xl">🧍‍♂️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">其他动作评估</h3>
                <p className="text-sm text-gray-500">更多专项评估与实验功能</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: colors.primary[500] }}>
                开始测试
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHub;
