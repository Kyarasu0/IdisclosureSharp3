// ==========================================
// ページ2: 登録画面 (Registration)
// ==========================================
import { useState } from 'react';
import { ShieldCheck, User, Calendar, WaveTriangle, ArrowRight } from 'phosphor-react';

export const RegistrationScreen = () => {
  const [formData, setFormData] = useState({ userId: '', birthDate: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // 登録処理のモック
    setTimeout(() => {
      setIsLoading(false);
      alert(`Access Granted.\nWelcome, Agent ${formData.userId}.`);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-fade-in-up">
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
        {/* 装飾: 上部のスキャンライン */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-pink-500 animate-gradient-x" />

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
            <ShieldCheck size={24} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">AGENT REGISTRATION</h2>
            <p className="text-xs text-cyan-300/50 font-mono">SECURE CONNECTION ESTABLISHED</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* User ID Input */}
          <div className="space-y-2 group">
            <label className="text-xs font-mono text-cyan-300/70 ml-1 flex items-center gap-2">
              <User size={12} /> IDENTIFICATION CODE
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                placeholder="ENTER AGENT ID"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-mono tracking-wider"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            </div>
          </div>

          {/* Birthday Input */}
          <div className="space-y-2 group">
            <label className="text-xs font-mono text-cyan-300/70 ml-1 flex items-center gap-2">
              <Calendar size={12} /> DATE OF ORIGIN
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-mono tracking-wider appearance-none"
                style={{ colorScheme: 'dark' }} // カレンダーアイコンをダークモード対応
              />
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-2 p-3 bg-pink-900/10 border border-pink-500/20 rounded-lg">
             <WaveTriangle size={14} className="text-pink-500 mt-0.5 shrink-0" />
             <p className="text-[10px] text-pink-200/60 leading-tight">
               WARNING: False identification will result in immediate termination of the session and IP blacklisting.
             </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full group relative overflow-hidden bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] active:scale-[0.98]"
          >
            <span className={`flex items-center justify-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              INITIATE UPLINK <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </button>

        </form>
      </div>
      
      <div className="mt-6 text-center">
         <p className="text-[10px] text-slate-500 font-mono tracking-widest">
           ENCRYPTED VIA SHA-256 // NODE: TOKYO-03
         </p>
      </div>
    </div>
  );
};