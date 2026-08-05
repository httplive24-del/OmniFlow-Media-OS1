import React, { useState } from 'react';
import { 
  Zap, 
  Sparkles, 
  Layers, 
  Check, 
  Flame, 
  Play, 
  RefreshCw, 
  Type, 
  Grid, 
  Trophy,
  Scissors,
  Download
} from 'lucide-react';
import { MediaItem, ThumbnailVariant, HighlightClip } from '../types';

interface VideoThumbnailSuiteProps {
  media: MediaItem;
  onUpdateMedia: (updated: MediaItem) => void;
}

export const VideoThumbnailSuite: React.FC<VideoThumbnailSuiteProps> = ({
  media,
  onUpdateMedia,
}) => {
  const [selectedSubStyle, setSelectedSubStyle] = useState<MediaItem['subtitleStyle']>(media.subtitleStyle || 'hormozi');
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false);
  const [activeTab, setActiveTab] = useState<'thumbnails' | 'subtitles' | 'highlights'>('thumbnails');

  const handleSelectSubStyle = (style: MediaItem['subtitleStyle']) => {
    setSelectedSubStyle(style);
    onUpdateMedia({ ...media, subtitleStyle: style });
  };

  const handleGenerateThumbnails = async () => {
    setIsGeneratingThumbnails(true);
    try {
      const res = await fetch('/api/ai/generate-thumbnails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: media.title, summary: media.summary }),
      });
      const data = await res.json();
      if (data && data.thumbnails) {
        onUpdateMedia({
          ...media,
          thumbnails: data.thumbnails,
          status: 'ab_testing',
        });
      }
    } catch (err) {
      console.error('Thumbnail generation failed:', err);
    } finally {
      setIsGeneratingThumbnails(false);
    }
  };

  const handleSelectWinner = (variantId: string) => {
    const updatedThumbnails = media.thumbnails.map((t) => ({
      ...t,
      winner: t.id === variantId,
    }));
    onUpdateMedia({ ...media, thumbnails: updatedThumbnails });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Suite Navigation */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Студия Обложек и Видео ИИ</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Мульти-генератор превью A/B/C, наложение субтитров и автоматическая нарезка вирусных клипов.
          </p>
        </div>

        {/* Inner Tab Selector */}
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab('thumbnails')}
            className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
              activeTab === 'thumbnails' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>A/B/C ОБЛОЖКИ</span>
          </button>
          <button
            onClick={() => setActiveTab('subtitles')}
            className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
              activeTab === 'subtitles' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>СУБТИТРЫ</span>
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
              activeTab === 'highlights' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>НАРЕЗКА КЛИПОВ</span>
          </button>
        </div>
      </div>

      {/* TAB 1: A/B/C Multi-Variation Thumbnail Generator */}
      {activeTab === 'thumbnails' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <div>
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Автономное A/B/C Тестирование Превью</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ИИ находит эмоции в видео, создает 3 стиля обложек и автоматически продвигает лучшую по CTR.
              </p>
            </div>
            <button
              onClick={handleGenerateThumbnails}
              disabled={isGeneratingThumbnails}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 uppercase tracking-wide font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingThumbnails ? 'animate-spin' : ''}`} />
              <span>{isGeneratingThumbnails ? 'Генерация...' : 'Создать 3 варианта ИИ'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {media.thumbnails.map((t) => (
              <div
                key={t.id}
                className={`bg-white/[0.03] border rounded-xl overflow-hidden p-4 transition-all backdrop-blur-sm ${
                  t.winner ? 'border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400' : 'border-white/10'
                }`}
              >
                {/* Variant Thumbnail Preview */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-3 group border border-white/10">
                  <img src={t.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  
                  {/* Overlay AI Headline text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-3">
                    <span className="text-lg font-black uppercase text-amber-300 drop-shadow-md tracking-tight leading-none font-mono">
                      {t.headline}
                    </span>
                  </div>

                  {/* Label badge */}
                  <span className="absolute top-2 left-2 bg-black/80 text-white font-bold text-xs font-mono px-2 py-0.5 rounded border border-white/10">
                    ВАРИАНТ {t.label}
                  </span>

                  {t.winner && (
                    <span className="absolute top-2 right-2 bg-amber-400 text-black font-bold text-[10px] font-mono px-2 py-0.5 rounded shadow flex items-center space-x-1">
                      <Trophy className="w-3 h-3 fill-black" />
                      <span>ЛИДЕР CTR</span>
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-mono">
                    <span className="text-slate-400 text-[10px] uppercase">Стиль:</span>
                    <span className="font-semibold text-slate-200">{t.style}</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded border border-white/5 font-mono">
                    <span className="text-slate-400 text-[10px] uppercase">Прогноз CTR:</span>
                    <span className="font-bold text-emerald-400 text-sm">{t.ctrEstimate}%</span>
                  </div>
                  <button
                    onClick={() => handleSelectWinner(t.id)}
                    className={`w-full py-2 rounded-lg text-xs font-bold transition-all uppercase font-mono tracking-wider ${
                      t.winner
                        ? 'bg-amber-400 text-black cursor-default'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {t.winner ? '✓ Выбранный Лидер' : 'Выбрать Лидером'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Dynamic Burn-in Subtitles Style Customizer */}
      {activeTab === 'subtitles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subtitle Style Presets */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-2">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>Пресеты стилей анимации субтитров</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 'hormozi',
                  title: 'Алекс Гормози (Яркий Акцент)',
                  desc: 'Крупный жирный шрифт, желтая подсветка активного слова, выразительная тень.',
                  previewWord: 'АВТОНОМНОСТЬ',
                  colorClass: 'text-yellow-400 font-black uppercase text-xl drop-shadow-[0_4px_4px_rgba(0,0,0,1)]',
                },
                {
                  id: 'mrbeast',
                  title: 'MrBeast Динамический',
                  desc: 'Анимированный зеленый/белый текст, максимальная динамика для ролика.',
                  previewWord: 'БЕЗ КЛИКОВ',
                  colorClass: 'text-emerald-400 font-extrabold uppercase text-xl tracking-wider',
                },
                {
                  id: 'clean_minimal',
                  title: 'Минималистичный Глянцевый',
                  desc: 'Аккуратный гротеск с полупрозрачной темной подложкой.',
                  previewWord: 'Мультимодальный ИИ',
                  colorClass: 'text-white font-medium text-base bg-black/80 px-3 py-1 rounded-full border border-white/10',
                },
                {
                  id: 'neon_glow',
                  title: 'Киберпанк Неон',
                  desc: 'Ярко-голубой неоновый текст со свечением для IT и техно роликов.',
                  previewWord: 'OMNIFLOW OS',
                  colorClass: 'text-cyan-300 font-mono font-bold text-lg drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]',
                },
              ].map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectSubStyle(preset.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedSubStyle === preset.id
                      ? 'bg-white/10 border-cyan-400 shadow-md'
                      : 'bg-black/40 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-white font-mono">{preset.title}</span>
                    {selectedSubStyle === preset.id && (
                      <span className="bg-cyan-500 text-black text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        АКТИВЕН
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">{preset.desc}</p>
                  <div className="bg-black/60 p-3 rounded-lg border border-white/5 flex justify-center items-center">
                    <span className={preset.colorClass}>{preset.previewWord}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Preview Canvas with Subtitles */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center justify-between">
              <span>Превью субтитров на видео</span>
              <span className="text-[10px] text-emerald-400 font-mono">1080x1920 ВЕРТИКАЛЬНЫЙ</span>
            </h3>

            <div className="relative aspect-[9/16] max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-end p-6">
              <img src={media.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              {/* Simulated Burn-in Subtitles */}
              <div className="relative z-10 text-center space-y-2">
                <span className="inline-block text-[11px] text-slate-300 bg-black/80 px-2 py-0.5 rounded font-mono border border-white/10">
                  [00:04.2 - 00:06.8]
                </span>
                <div className="min-h-[60px] flex items-center justify-center px-2">
                  {selectedSubStyle === 'hormozi' && (
                    <span className="text-yellow-400 font-black text-2xl uppercase tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
                      ИМПОРТ <span className="text-white">БЕЗ КЛИКОВ!</span>
                    </span>
                  )}
                  {selectedSubStyle === 'mrbeast' && (
                    <span className="text-emerald-400 font-extrabold text-2xl uppercase tracking-wider">
                      ЭТО МЕНЯЕТ <span className="text-white">ВСЕ!</span> 🚀
                    </span>
                  )}
                  {selectedSubStyle === 'clean_minimal' && (
                    <span className="text-white font-medium text-sm bg-black/90 px-4 py-1.5 rounded-full border border-white/10">
                      OmniFlow Media OS: Автономный Пайплайн Видео
                    </span>
                  )}
                  {selectedSubStyle === 'neon_glow' && (
                    <span className="text-cyan-300 font-mono font-bold text-xl drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]">
                      &gt; СИСТЕМА_ГОТОВА: 100%_ЧИСТО
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Smart Highlight Virality Clipper */}
      {activeTab === 'highlights' && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-2">
                <Scissors className="w-4 h-4 text-cyan-400" />
                <span>Автоматический сборщик ярких фрагментов</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ИИ автоматически находит моменты с максимальным удержанием внимания и режет их на микро-клипы.
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-mono font-bold bg-cyan-500/20 px-2.5 py-1 rounded border border-cyan-500/30">
              {media.highlights.length} КЛИПОВ ГОТОВО
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {media.highlights.map((hl) => (
              <div key={hl.id} className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    ⏱️ {hl.timestamp}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {hl.viralityScore}% ВИРАЛЬНОСТЬ
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">{hl.title}</h4>
                <p className="text-[11px] text-slate-400 italic bg-black/40 p-2.5 rounded border border-white/5">
                  "{hl.hookText}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                  <span>Тема: {hl.topic}</span>
                  <span>Длительность: {hl.duration}</span>
                </div>

                <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs py-2 rounded flex items-center justify-center space-x-1.5 transition-all uppercase font-mono">
                  <Download className="w-3.5 h-3.5" />
                  <span>Экспорт вертикального клипа</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
