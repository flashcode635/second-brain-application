import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  X, 
  ArrowLeft, 
  Search, 
  Command 
} from 'lucide-react';

// Insert the URL or local path to your uploaded 3D lifebuoy image here
import objectImage from '@assets/errorPage.png'; 
export const NotFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut listener for Esc and Cmd+K / Cmd+[
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.href = '/';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-[#111111] flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-black selection:text-white">
      
      {/* Top Navigation */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-sm font-medium tracking-tight">
          <Grid className="w-4 h-4 text-gray-500" />
          <span>404</span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200/80 rounded-full shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
          >
            <span>Go Home</span>
            <kbd className="text-[10px] text-gray-400 font-sans bg-gray-100 px-1 py-0.5 rounded">Esc</kbd>
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            aria-label="Close"
            className="p-1.5 text-gray-400 border border-gray-200/80 bg-white rounded-full hover:text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center text-center my-12 max-w-xl mx-auto w-full">
        
        {/* 3D Asset Container */}
        <div className="relative mb-6">
          <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl overflow-hidden shadow-2xl shadow-gray-200/50 bg-white flex items-center justify-center">
            <img 
              src={objectImage} 
              alt="404 Abstract 3D Object" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Badge overlapping bottom of image */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-gray-200/70 px-3 py-0.5 rounded-full shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono font-medium">
              ERR 404
            </span>
          </div>
        </div>

        {/* Heading & Subtext */}
        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-gray-900 tracking-tight mt-4 mb-3">
          Page not found.
        </h1>
        
        <p className="text-sm text-gray-500 max-w-md leading-relaxed mb-8">
          The path you followed does not exist, has been moved, or severed from memory.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-medium rounded-full shadow-sm hover:bg-gray-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Take me home</span>
          </button>

          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200/80 text-xs font-medium rounded-full shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
          >
            <span>Go back</span>
            <div className="flex items-center gap-0.5 text-gray-400 font-sans">
              <Command className="w-3 h-3" />
              <span className="text-[10px]">[</span>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="w-full max-w-md relative">
          <div className="relative flex items-center w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for pages, topics, or resources..."
              className="w-full bg-white border border-gray-200/80 rounded-full py-2.5 pl-10 pr-12 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all shadow-sm"
            />
            <div className="absolute right-3 flex items-center gap-0.5 text-gray-400 pointer-events-none bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200/60 text-[10px]">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

      </main>

      {/* Footer Navigation & Status */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-gray-600 font-medium">All systems operational</span>
        </div>

        <nav className="flex items-center gap-4 text-gray-500">
          <a href="#" className="hover:text-gray-900 transition-colors">Home</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
          <span>•</span>
          <a href="#" className="hover:text-gray-900 transition-colors">Status</a>
        </nav>
      </footer>

    </div>
  );
};

export default NotFoundPage;