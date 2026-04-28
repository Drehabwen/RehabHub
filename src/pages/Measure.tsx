import { Play, Square, RotateCcw, Save, Activity, FileText } from 'lucide-react';
import WebcamView from '@/components/WebcamView';
import JointSelector from '@/components/JointSelector';
import MeasurementChart from '@/components/MeasurementChart';
import { useMeasurementStore } from '@/store/useMeasurementStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Measure() {
  const {
    isMeasuring,
    startMeasurement,
    stopMeasurement,
    resetMeasurement,
    saveMeasurement,
    activeMeasurements,
  } = useMeasurementStore();
  const navigate = useNavigate();

  const hasData = activeMeasurements.some((measurement) => measurement.data.length > 0);

  const handleSave = () => {
    saveMeasurement();
    navigate('/report');
  };

  return (
    <div className="animate-in space-y-4 sm:space-y-8 fade-in slide-in-from-bottom-4 duration-500 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:gap-6 rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">关节活动度测量</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">选择关节与动作方向，开始实时采集并生成可归档的测量结果。</p>
        </div>

        <div className="flex w-full flex-col sm:flex-row gap-3 md:w-auto">
          {!isMeasuring ? (
            <>
              <button
                onClick={startMeasurement}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-transparent bg-blue-600 px-4 sm:px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95 md:flex-none"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                开始测量
              </button>

              {hasData && (
                <button
                  onClick={handleSave}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-transparent bg-green-600 px-4 sm:px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-100 transition-all hover:scale-105 hover:bg-green-700 active:scale-95 md:flex-none"
                >
                  <Save className="mr-2 h-4 w-4" />
                  保存到报告
                </button>
              )}
            </>
          ) : (
            <button
              onClick={stopMeasurement}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-transparent bg-red-600 px-4 sm:px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-100 transition-all animate-pulse hover:bg-red-700 md:flex-none"
            >
              <Square className="mr-2 h-4 w-4 fill-current" />
              停止测量
            </button>
          )}

          <button
            onClick={resetMeasurement}
            disabled={isMeasuring}
            className={cn(
              'inline-flex min-h-[44px] flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 sm:px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 md:flex-none',
              isMeasuring && 'cursor-not-allowed opacity-50',
            )}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            重置
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-12">
        <div className="space-y-4 sm:space-y-8 lg:col-span-8">
          <div className="relative aspect-[3/4] sm:aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[2rem] bg-black shadow-2xl ring-1 ring-white/10">
            <WebcamView />
          </div>
          <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <MeasurementChart />
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 lg:col-span-4">
          <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
            <JointSelector />
          </div>

          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 sm:p-6 text-white shadow-xl">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Activity className="h-16 w-16 sm:h-24 sm:w-24" />
            </div>
            <h4 className="mb-3 sm:mb-4 flex items-center text-base sm:text-lg font-bold">
              <span className="mr-2 sm:mr-3 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-white/20">
                <FileText className="h-4 w-4" />
              </span>
              测量指南
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-blue-50/90">
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">1</span>
                确保全身或目标关节完整进入摄像区域。
              </li>
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">2</span>
                保持光线充足，避免逆光和背景干扰。
              </li>
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">3</span>
                点击“开始测量”后，缓慢完成目标动作，避免突然加速。
              </li>
              <li className="flex items-start">
                <span className="mr-2 sm:mr-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">4</span>
                到达最大活动幅度后保持 1 到 2 秒，有助于记录有效峰值。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
