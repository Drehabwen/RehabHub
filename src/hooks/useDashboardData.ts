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
        
        // 模拟API调用获取数据
        const data = await fetchDashboardStats();
        setStatsCards(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据失败');
        // 提供默认数据
        setStatsCards([
          {
            title: '今日评估次数',
            value: '0',
            icon: '📊',
            bgColor: '#E1F5FE',
            textColor: '#0288D1'
          },
          {
            title: '活跃患者',
            value: '0',
            icon: '👥',
            bgColor: '#E8F5E8',
            textColor: '#388E3C'
          },
          {
            title: '评估完成率',
            value: '0%',
            icon: '✅',
            bgColor: '#FFF3E0',
            textColor: '#F57C00'
          },
          {
            title: '治疗师满意度',
            value: '0%',
            icon: '⭐',
            bgColor: '#F3E5F5',
            textColor: '#7B1FA2'
          }
        ]);
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