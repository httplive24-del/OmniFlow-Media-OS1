import React, { useState } from 'react';
import { 
  Radio, 
  TrendingUp, 
  Eye, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  RefreshCw,
  Cpu,
  BarChart2,
  PieChart
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FeedbackLoopMetric } from '../types';

interface AnalyticsFeedbackLoopProps {
  analytics: FeedbackLoopMetric[];
}

export const AnalyticsFeedbackLoop: React.FC<AnalyticsFeedbackLoopProps> = ({ analytics }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [learnedPatterns, setLearnedPatterns] = useState<string[]>([
    'Контрастные желтые заголовки на превью увеличили CTR на +38% в TikTok и Shorts.',
    'Первое предложение с проблемой в LinkedIn повысило дочитываемость до 75%.',
    'Таймкоды с понятными эмодзи снизили отток зрителей YouTube в первые 60 секунд.',
    'Исключение агрессивных триггерных слов предотвратило предупреждения о теневом бане в Instagram Reels.',
  ]);

  const handleRunFeedbackLoop = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setLearnedPatterns((prev) => [
        `[Новый паттерн изучен ${new Date().toLocaleTimeString()}]: Ролики с трехчастным структурированием показали +42% удержания.`,
        ...prev,
      ]);
      setIsOptimizing(false);
    }, 1500);
  };

  const latest = analytics[analytics.length - 1] || {
    viewsTotal: 440000,
    avgCtr: 11.8,
    retentionRate: 75,
    aiPromptOptimizationScore: 99,
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Единая аналитика каналов и самообучающаяся петля ИИ</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Данные эффективности со всех платформ автоматически оптимизируют промпты для роста охватов на 30%+.
          </p>
        </div>

        <button
          onClick={handleRunFeedbackLoop}
          disabled={isOptimizing}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 uppercase tracking-wide font-mono"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Обучение...' : 'Запустить петлю обратной связи'}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Всего просмотров</div>
          <div className="text-2xl font-black text-white font-mono mt-1">{(latest.viewsTotal / 1000).toFixed(0)}K</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">+48% К ПРОШЛОЙ НЕДЕЛЕ</div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Средний CTR по всем сетям</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{latest.avgCtr}%</div>
          <div className="text-[10px] text-cyan-400 font-mono mt-1">+3.6% ПОСЛЕ A/B/C ТЕСТА</div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Удержание аудитории</div>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-1">{latest.retentionRate}%</div>
          <div className="text-[10px] text-indigo-400 font-mono mt-1">ТОП 1% В НИШЕ</div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Оценка точности промптов</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{latest.aiPromptOptimizationScore}/100</div>
          <div className="text-[10px] text-amber-400 font-mono mt-1">АВТОНАСТРОЙКА</div>
        </div>
      </div>

      {/* Chart & Feedback Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recharts Analytics Curve */}
        <div className="md:col-span-2 bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-3">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Динамика просмотров и роста CTR</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">ЖИВОЙ ПОТОК</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#02040a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="viewsTotal" stroke="#06b6d4" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Self-Learning Pipeline Log */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-3">
          <h3 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Лог самообучения промптов ИИ</span>
          </h3>

          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
            {learnedPatterns.map((pattern, idx) => (
              <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 text-xs text-slate-300 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{pattern}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
