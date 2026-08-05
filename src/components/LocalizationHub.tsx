import React, { useState } from 'react';
import { 
  Globe, 
  Mic, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  Languages, 
  Play, 
  Sliders,
  Check
} from 'lucide-react';
import { MediaItem } from '../types';

interface LocalizationHubProps {
  media: MediaItem;
}

export const LocalizationHub: React.FC<LocalizationHubProps> = ({ media }) => {
  const [selectedLang, setSelectedLang] = useState<string>('es');
  const [isRtl, setIsRtl] = useState<boolean>(false);
  const [isPlayingDub, setIsPlayingDub] = useState<boolean>(false);

  const languages = [
    { code: 'es', name: 'Испанский (Español)', native: 'Español', rtl: false },
    { code: 'de', name: 'Немецкий (Deutsch)', native: 'Deutsch', rtl: false },
    { code: 'ja', name: 'Японский (日本語)', native: '日本語', rtl: false },
    { code: 'ar', name: 'Арабский (العربية)', native: 'العربية', rtl: true },
    { code: 'he', name: 'Иврит (עברית)', native: 'עברית', rtl: true },
    { code: 'fr', name: 'Французский (Français)', native: 'Français', rtl: false },
    { code: 'zh', name: 'Китайский (中文)', native: '中文', rtl: false },
    { code: 'pt', name: 'Португальский (Português)', native: 'Português', rtl: false },
  ];

  const handleSelectLanguage = (code: string) => {
    setSelectedLang(code);
    const lang = languages.find((l) => l.code === code);
    if (lang) {
      setIsRtl(lang.rtl);
    }
  };

  const sampleTranslations: Record<string, { title: string; caption: string }> = {
    es: {
      title: 'Cómo los Sistemas Autónomos de Medios Sustituyen la Publicación Manual',
      caption: 'En este desglose completo, demostramos cómo OmniFlow Media OS automatiza la ingesta de video, la adaptación multiplataforma y la protección contra baneos en sombra.',
    },
    de: {
      title: 'Wie autonome KI-Mediensysteme manuelle Veröffentlichungen im Jahr 2026 ersetzen',
      caption: 'In dieser Anleitung zeigen wir, wie OmniFlow Media OS Video-Uploads und Multi-Plattform-Anpassung automatisch durchführt.',
    },
    ja: {
      title: '2026年にAI自律型メディアシステムが手動投稿を置き換える方法',
      caption: 'OmniFlow Media OSが動画の取り込み、複数プラットフォームへの最適化、シャドウバン対策を自動化する方法を解説します。',
    },
    ar: {
      title: 'كيف تستبدل أنظمة الوسائط المستقلة بالذكاء الاصطناعي النشر اليدوي في عام 2026',
      caption: 'في هذا الدليل الكامل، نعرض كيف يقوم نظام OmniFlow Media OS بأتمتة استيعاب الفيديو والتكييف متعدد المنصات وحماية الحظر الخفي.',
    },
    he: {
      title: 'כיצד מערכות מדיה אוטונומיות מחליפות פרסום ידני בשנת 2026',
      caption: 'במדריך מלא זה, אנו מציגים כיצד OmniFlow Media OS מאוטמטת קליטת וידאו, התאמה לריבוי פלטפורמות והגנה מפני חסימה שקטה.',
    },
  };

  const currentTranslation = sampleTranslations[selectedLang] || sampleTranslations.es;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Центр локализации, клонирования голоса и Lip-Sync</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Перевод роликов на 85+ языков, клонирование тембра автора и покадровый синхрон движений губ.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
          <Languages className="w-4 h-4 text-indigo-400" />
          <span className="text-cyan-400 font-mono font-bold">85 ЯЗЫКОВ АКТИВНО</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Language Selector */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center justify-between">
            <span>Целевой язык</span>
            {isRtl && (
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/30">
                RTL ВKLЮЧЕН
              </span>
            )}
          </h3>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  selectedLang === lang.code
                    ? 'bg-white/10 border-cyan-400 text-white font-bold'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="font-mono">{lang.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{lang.native}</div>
                </div>
                {selectedLang === lang.code && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Middle & Right: Live Translated Output & RTL Preview */}
        <div className="md:col-span-2 space-y-4">
          {/* Translated Post Preview */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Локализованный контент ({languages.find(l => l.code === selectedLang)?.name})</span>
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRtl(!isRtl)}
                  className={`text-xs px-2.5 py-1 rounded font-mono border transition-all uppercase ${
                    isRtl ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  RTL: {isRtl ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>
            </div>

            {/* Translated Headline & Body */}
            <div className={`space-y-3 bg-black/40 p-4 rounded-xl border border-white/10 ${isRtl ? 'text-right dir-rtl' : 'text-left'}`}>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Переведенный заголовок:</span>
                <h4 className="text-sm font-bold text-cyan-300">{currentTranslation.title}</h4>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Переведенный текст поста:</span>
                <p className="text-xs text-slate-300 leading-relaxed">{currentTranslation.caption}</p>
              </div>
            </div>

            {/* AI Voice Cloning & Lip-Sync Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
              {/* Voice Clone Box */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5 uppercase text-[10px]">
                    <Mic className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Модель клонирования голоса</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">СИНХРОНИЗИРОВАНО</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlayingDub(!isPlayingDub)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg text-xs"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingDub ? 'animate-bounce' : ''}`} />
                  </button>
                  <div className="flex-1 bg-black h-6 rounded border border-white/10 overflow-hidden flex items-center px-2 space-x-1">
                    {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 30, 85].map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1 rounded-full ${isPlayingDub ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`}
                        style={{ height: `${h}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lip-Sync Box */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center space-x-1.5 uppercase text-[10px]">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Точность Lip-Sync выравнивания</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold">99.4%</span>
                </div>
                <div className="bg-black/60 p-2 rounded border border-white/5 text-[11px] text-slate-300 flex items-center justify-between">
                  <span>Ключевые точки артикуляции:</span>
                  <span className="text-emerald-400 font-bold">1,420 точек</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
