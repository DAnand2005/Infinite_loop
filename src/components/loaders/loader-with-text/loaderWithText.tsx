import { useEffect, useState } from "react";

function LoaderWithText() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="relative">
        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-indigo-200 rounded-full animate-ping opacity-20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-indigo-300 rounded-full animate-pulse" />
        </div>
        
        {/* Center content */}
        <div className="relative flex flex-col items-center justify-center w-36 h-36">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="mt-4 text-lg font-semibold text-slate-700 min-w-[100px] text-center">
            Loading{dots}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoaderWithText;
