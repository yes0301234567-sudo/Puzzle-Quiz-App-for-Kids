import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Fun animated background pattern
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 text-9xl text-white animate-float" style={{ animationDelay: '0s' }}>+</div>
        <div className="absolute bottom-20 right-20 text-9xl text-white animate-float" style={{ animationDelay: '1s' }}>×</div>
        <div className="absolute top-1/2 left-20 text-8xl text-white animate-float" style={{ animationDelay: '2s' }}>÷</div>
        <div className="absolute top-20 right-1/3 text-8xl text-white animate-float" style={{ animationDelay: '1.5s' }}>-</div>
      </div>
      
      {/* Main Container - mimics a mobile screen max width */}
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default Layout;
