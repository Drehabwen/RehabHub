import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../services/api';

// 定义统计数据接口
export interface StatCard {
  title: string;
  value: string;
  icon: string;
  bgColor: string;
  textColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// 自定义Hook：获取仪表盘数据
export const useDashboardData = () => {
  const [statsCards, setStatsCards] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 调用API获取数据
        const data = await fetchDashboardStats();
        setStatsCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
        console.error('获取仪表盘数据失败:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const refetch = () => {
    // 重新加载数据
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDashboardStats();
        setStatsCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  };

  return {
    statsCards,
    isLoading,
    error,
    refetch
  };
};

export default useDashboardData;