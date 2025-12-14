import React, { useEffect, useState } from 'react';
import { colors } from '../../theme';
import { useNavigation } from '../../contexts/NavigationContext';
import { getResults, deleteResult } from '../../services/api';

const ResultsHistory: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResults(1, 50);
      setItems(data.items || []);
    } catch (e: any) {
      console.warn('Backend fetch failed, trying local storage:', e);
      // Fallback to local storage
      try {
        const localHistory = localStorage.getItem('analysis_history');
        if (localHistory) {
          const parsed = JSON.parse(localHistory);
          // Adapt local format to display format if needed
          // Local format from VideoAnalysis.tsx is AnalysisResponse[]
          // Display expects { id, movementName, timestamp, scoreSummary: { overall } }
          const adapted = parsed.map((item: any) => ({
            id: item.id,
            movementName: item.movementName || item.movementType,
            movementType: item.movementType,
            timestamp: item.timestamp,
            scoreSummary: {
              overall: item.overallScore?.value || item.score // Handle both formats
            }
          }));
          setItems(adapted);
          setError(null); // Clear error if local load succeeds
        } else {
          setError(e?.message || '加载失败，且无本地记录');
        }
      } catch (localErr) {
        setError(e?.message || '加载失败');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openDetail = (id: string) => {
    navigateTo('results-detail', { id });
  };

  const remove = async (id: string) => {
    try { await deleteResult(id); load(); } catch {}
  };

  return (
    <div className="mx-auto max-w-6xl p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.primary[800] }}>评估历史</h1>
        <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: colors.primary[500] }} onClick={load}>刷新</button>
      </div>

      {loading && <div className="p-6 text-center text-gray-500">加载中...</div>}
      {error && <div className="p-6 text-center text-red-600">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="p-6 text-center text-gray-500">暂无数据</div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((it) => (
          <div key={it.id} className="p-5 border rounded-xl shadow bg-white flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-800">{it.movementName || it.movementType}</div>
              <div className="text-sm text-gray-500">{new Date(it.timestamp).toLocaleString()}</div>
              <div className="text-sm mt-1" style={{ color: colors.primary[700] }}>
                总分：{it.scoreSummary?.overall || '-'}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg text-white" style={{ backgroundColor: colors.primary[500] }} onClick={() => openDetail(it.id)}>查看</button>
              <button className="px-3 py-2 rounded-lg text-white" style={{ backgroundColor: '#c0392b' }} onClick={() => remove(it.id)}>删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsHistory;
