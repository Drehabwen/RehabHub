import React, { useEffect, useState } from 'react';
import { colors } from '../../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [stage, setStage] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    const introDelay = 0;
    const sloganDelay = isMobile ? 500 : 700;
    const fadeAt = isMobile ? 1700 : 2400;
    const finishAt = fadeAt + 600;

    const t1 = setTimeout(() => setStage(1), introDelay);
    const t2 = setTimeout(() => setStage(2), sloganDelay);
    const t3 = setTimeout(() => setIsFadingOut(true), fadeAt);
    const t4 = setTimeout(onFinish, finishAt);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{
        background: `linear-gradient(to bottom right, ${colors.neutral[50]}, ${colors.primary[50]})`
      }}
    >
      <div className="flex flex-col items-center">
        <div 
          className={`transform transition-all duration-1000 ease-out ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="relative mb-6 mx-auto">
            <div 
              className="w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center transform transition-transform hover:scale-105"
              style={{ backgroundColor: colors.primary[600] }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-2xl animate-ping" style={{ backgroundColor: colors.primary[200], opacity: 0.6 }}></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-1 text-center drop-shadow-sm" style={{ color: colors.primary[700] }}>
            Rehabhub — 下一代智能康复平台
          </h1>
          <p className="text-base md:text-lg text-center mb-2" style={{ color: colors.primary[600] }}>
            康复：让生命再一次伟大
          </p>
        </div>
        
        <div 
          className={`mt-3 transform transition-all duration-800 delay-300 ease-out ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <div className="h-px w-24 mx-auto opacity-50" style={{ backgroundColor: colors.primary[400] }}></div>
        </div>

        <div className={`mt-3 transform transition-all duration-800 delay-500 ease-out ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="flex items-center justify-center gap-2">
            <div className="px-2 py-1 rounded-full border text-xs md:text-sm" style={{ backgroundColor: colors.primary[50], borderColor: colors.primary[200], color: colors.primary[700] }}>问诊</div>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[500] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="px-2 py-1 rounded-full border text-xs md:text-sm" style={{ backgroundColor: colors.primary[50], borderColor: colors.primary[200], color: colors.primary[700] }}>量表评估</div>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[500] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="px-2 py-1 rounded-full border text-xs md:text-sm" style={{ backgroundColor: colors.primary[50], borderColor: colors.primary[200], color: colors.primary[700] }}>动作评估</div>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.primary[500] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="px-2 py-1 rounded-full border text-xs md:text-sm" style={{ backgroundColor: colors.primary[50], borderColor: colors.primary[200], color: colors.primary[700] }}>评估报告</div>
          </div>
        </div>
      </div>
      
      <div className={`absolute bottom-16 transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
         <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0s', backgroundColor: colors.primary[400] }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0.2s', backgroundColor: colors.primary[400] }}></div>
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0.4s', backgroundColor: colors.primary[400] }}></div>
         </div>
      </div>
      
      <div className="absolute bottom-6 text-gray-400 text-xs tracking-widest opacity-60">
        POWERED BY AI
      </div>
    </div>
  );
};

export default SplashScreen;
