import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Plus, 
  Sparkles,
  Layers,
  Radio,
  Activity
} from 'lucide-react';
import { ToneOfVoiceProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenIngestModal: () => void;
  tones: ToneOfVoiceProfile[];
  selectedToneId: string;
  setSelectedToneId: (id: string) => void;
  mediaCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenIngestModal,
  tones,
  selectedToneId,
  setSelectedToneId,
  mediaCount,
}) => {
  return (
    <header id="omniflow-header" className="bg-black/50 border-b border-white/10 text-white sticky top-0 z-40 backdrop-blur-md">
      {/* Top Banner Telemetry Bar */}
      <div className="bg-[#02040a]/90 px-6 py-1.5 text-xs text-slate-400 border-b border-white/5 flex flex-wrap justify-between items-center gap-2 font-mono">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-2 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <Activity className="w-3.5 h-3.5" />
            <span>ДВИГАТЕЛЬ_ИИ: АКТИВЕН</span>
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="hidden sm:flex items-center space-x-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>ПРОКСИ_МАТРИЦА: 100% ИЗОЛЯЦИЯ</span>
          </span>
          <span className="hidden md:inline text-white/10">|</span>
          <span className="hidden md:flex items-center space-x-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>СИНТЕЗ_ИИ: GEMINI 3.6 MULTIMODAL</span>
          </span>
        </div>

        {/* Right side Tone & Workspace Selector */}
        <div className="flex items-center space-x-3 text-[11px]">
          <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-widest text-slate-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Тон ИИ:</span>
            <select 
              value={selectedToneId}
              onChange={(e) => setSelectedToneId(e.target.value)}
              className="bg-transparent text-white text-[10px] font-mono focus:outline-none cursor-pointer"
            >
              {tones.map((t) => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name}</option>
              ))}
            </select>
          </div>

          <div className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-widest text-cyan-400">
            ПРОСТРАНСТВО: АЛЬФА
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white uppercase">
                OmniFlow <span className="text-cyan-400 font-mono font-normal">Media OS</span>
              </h1>
              <span className="bg-white/5 text-slate-300 text-[9px] uppercase font-mono px-2 py-0.5 rounded border border-white/10 tracking-widest">
                v2.4 Автономная
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-sans">
              Автономный пайплайн контента и самообучающийся движок аналитики
            </p>
          </div>
        </div>

        {/* Quick Ingest Button */}
        <div className="flex items-center space-x-3">
          <button
            id="btn-quick-ingest"
            onClick={onOpenIngestModal}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all active:scale-95 uppercase tracking-wide"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Загрузить видео</span>
            <span className="bg-black/20 text-black text-[10px] px-1.5 py-0.2 rounded font-mono ml-1 font-extrabold">{mediaCount}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto scrollbar-none">
        <nav className="flex space-x-1 border-t border-white/5 pt-1">
          {[
            { id: 'workspace', label: 'Очередь импорта', icon: Layers, badge: `${mediaCount}` },
            { id: 'synthesis', label: 'Мультимодальный синтез', icon: Sparkles, badge: 'ДНК площадок' },
            { id: 'suite', label: 'Видео и Обложки', icon: Zap, badge: 'A/B/C' },
            { id: 'localization', label: 'Дубляж и RTL', icon: Globe, badge: '85+ языков' },
            { id: 'compliance', label: 'Безопасность', icon: ShieldCheck, badge: '100% Защита' },
            { id: 'analytics', label: 'Обучение ИИ', icon: Radio, badge: '+30% Охватов' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-t-md transition-all whitespace-nowrap border-b-2 uppercase tracking-wider ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-white/5 shadow-sm'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-slate-400 border border-white/5'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

