import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [stage, setStage] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Stage 1: Show Logo (immediate)
    const timer1 = setTimeout(() => setStage(1), 100);
    
    // Stage 2: Show Slogan (800ms)
    const timer2 = setTimeout(() => setStage(2), 800);
    
    // Stage 3: Fade Out (2500ms)
    const timer3 = setTimeout(() => setIsFadingOut(true), 2500);
    
    // Stage 4: Finish (3000ms)
    const timer4 = setTimeout(onFinish, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-green-50 transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center">
        {/* Logo Animation */}
        <div 
          className={`transform transition-all duration-1000 ease-out ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="w-24 h-24 bg-green-600 rounded-2xl shadow-xl flex items-center justify-center mb-6 mx-auto transform transition-transform hover:scale-105">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 tracking-tight mb-2 text-center drop-shadow-sm">
            Deep<span className="text-green-600">Rehab</span>
          </h1>
        </div>
        
        {/* Slogan Animation */}
        <div 
          className={`mt-6 transform transition-all duration-1000 delay-300 ease-out ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="h-px w-16 bg-green-400 mx-auto mb-6 opacity-50"></div>
          <p className="text-xl md:text-2xl text-gray-600 font-light tracking-[0.2em] text-center">
            智能康复 · 重塑新生
          </p>
        </div>
      </div>
      
      {/* Loading Indicator */}
      <div className={`absolute bottom-16 transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
         <div className="flex space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
         </div>
      </div>
      
      <div className="absolute bottom-6 text-gray-400 text-xs tracking-widest opacity-60">
        POWERED BY AI
      </div>
    </div>
  );
};

export default SplashScreen;
