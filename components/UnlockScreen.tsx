
import React, { useState } from 'react';
import { Icons, ACCESS_PASSWORD } from '../constants';

interface Props {
  onUnlock: () => void;
}

const UnlockScreen: React.FC<Props> = ({ onUnlock }) => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ACCESS_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPass('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://picsum.photos/1920/1080?grayscale" 
          className="w-full h-full object-cover" 
          alt="Wallpaper" 
        />
      </div>
      
      <div className={`relative z-10 w-full max-w-sm p-8 text-center transition-transform ${error ? 'animate-shake' : ''}`}>
        <div className="mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-white/30 shadow-2xl">
            <Icons.Lock />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NeuralPrompt</h1>
          <p className="text-white/60 text-sm">iOS 26.2 Architecture</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="password" 
            autoFocus
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="输入访问密码" 
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 px-6 text-white text-center text-lg placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-lg"
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-2xl transition-all shadow-xl active:scale-95"
          >
            解锁进入
          </button>
        </form>
        
        <p className="mt-8 text-white/30 text-xs">Protected by End-to-End Neural Encryption</p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default UnlockScreen;
