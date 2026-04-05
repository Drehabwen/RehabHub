import { appApiClient, backendApiClient } from './http';

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

const MOCK_STATS: StatCard[] = [
  {
    title: '今日评估',
    value: '12',
    icon: 'activity',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600',
    trend: { value: 12, isPositive: true },
  },
  {
    title: '总患者数',
    value: '45',
    icon: 'users',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    trend: { value: 5, isPositive: true },
  },
  {
    title: '完成率',
    value: '85%',
    icon: 'check-circle',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  {
    title: '待处理',
    value: '3',
    icon: 'clock',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    trend: { value: 2, isPositive: false },
  },
];

interface BackendSystemStats {
  total_patients: number;
  total_assessments: number;
  average_score: number;
  assessments_by_movement: Record<string, number>;
  recent_activity: Array<{ date: string; count: number }>;
}

function mapBackendStatsToCards(stats: BackendSystemStats): StatCard[] {
  const today = new Date().toISOString().split('T')[0];
  const todayAssessments = stats.recent_activity.find((item) => item.date === today)?.count ?? 0;
  const movementKinds = Object.keys(stats.assessments_by_movement).length;

  return [
    {
      title: '今日评估',
      value: String(todayAssessments),
      icon: 'activity',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: '总患者数',
      value: String(stats.total_patients),
      icon: 'users',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: '平均得分',
      value: String(stats.average_score),
      icon: 'check-circle',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: '动作种类',
      value: String(movementKinds),
      icon: 'clock',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
    },
  ];
}

export async function fetchDashboardStats(): Promise<StatCard[]> {
  try {
    return await appApiClient.get<StatCard[]>('/dashboard/stats');
  } catch {
    try {
      const stats = await backendApiClient.get<BackendSystemStats>('/api/v1/system/stats');
      return mapBackendStatsToCards(stats);
    } catch {
      return MOCK_STATS;
    }
  }
}
