import React, { useEffect, useState } from 'react';
import { colors } from '../../theme';
import { useNavigation, useNavigationParams } from '../../contexts/NavigationContext';
import { getResultDetail } from '../../services/api';

const ResultDetail: React.FC = () => {
  const { goBack } = useNavigation();
  const { getParams } = useNavigationParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = getParams();
    if (!p?.id) { setError('缺少评估ID'); return; }
    getResultDetail(p.id).then(setData).catch((e) => setError(e?.message || '加载失败'));
  }, [getParams]);

  return (
    <div className="mx-auto max-w-6xl p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.primary[800] }}>评估详情</h1>
        <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: colors.primary[500] }} onClick={goBack}>返回</button>
      </div>
      {error && <div className="p-6 text-center text-red-600">{error}</div>}
      {!error && !data && <div className="p-6 text-center text-gray-500">加载中...</div>}
      {data && (
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary[50] }}>
              <div className="text-sm" style={{ color: colors.text.secondary }}>总分</div>
              <div className="text-2xl font-bold" style={{ color: colors.primary[700] }}>{data.overallScore?.value}/{data.overallScore?.maxValue}</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary[50] }}>
              <div className="text-sm" style={{ color: colors.text.secondary }}>灵活性</div>
              <div className="text-2xl font-bold" style={{ color: colors.primary[700] }}>{data.mobilityScore?.value}/{data.mobilityScore?.maxValue}</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primary[50] }}>
              <div className="text-sm" style={{ color: colors.text.secondary }}>稳定性</div>
              <div className="text-2xl font-bold" style={{ color: colors.primary[700] }}>{data.stabilityScore?.value}/{data.stabilityScore?.maxValue}</div>
            </div>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="text-lg font-semibold mb-2" style={{ color: colors.primary[800] }}>角度</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(data.angles || {}).map(([k, v]: any) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-600">{k}</span>
                  <span className="font-semibold" style={{ color: colors.primary[700] }}>{Math.round(v)}°</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="text-lg font-semibold mb-2" style={{ color: colors.primary[800] }}>建议</div>
            <ul className="list-disc list-inside" style={{ color: colors.text.secondary }}>
              {(data.recommendations || ['继续保持当前训练计划']).map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDetail;
