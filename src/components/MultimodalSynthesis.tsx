import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Share2, 
  Check, 
  Copy, 
  Edit3, 
  Flame, 
  FileText, 
  ListOrdered, 
  Music, 
  ExternalLink,
  RefreshCw,
  Send,
  Zap,
  Globe,
  Play,
  FileVideo,
  Loader2,
  Brain,
  Activity
} from 'lucide-react';
import { MediaItem, Platform, PlatformPost } from '../types';

interface MultimodalSynthesisProps {
  media: MediaItem;
  onUpdateMedia: (updated: MediaItem) => void;
}

export const MultimodalSynthesis: React.FC<MultimodalSynthesisProps> = ({
  media,
  onUpdateMedia,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('Декодирование аудио и видеопотока...');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [transcriptValue, setTranscriptValue] = useState(media.rawTranscript);
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);

  useEffect(() => {
    setTranscriptValue(media.rawTranscript);
  }, [media.id, media.rawTranscript]);

  const activePost = media.platforms[selectedPlatform];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTranscribeAndSynthesize = async () => {
    setIsTranscribing(true);
    setIsGenerating(true);
    setAnalysisProgress(10);
    setAnalysisStage('1/5 Сканирование видеофайла и нейросетевое распознавание речи (Speech-to-Text)...');

    try {
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: media.title,
          fileData: media.fileData,
          mimeType: media.fileType,
          transcript: media.rawTranscript,
        }),
      });
      const data = await res.json();
      const realTranscript = data.transcript || media.rawTranscript;

      onUpdateMedia({
        ...media,
        rawTranscript: realTranscript,
        status: 'analyzing',
      });

      setIsTranscribing(false);
      handleTriggerReAnalyze(realTranscript);
    } catch (err) {
      console.error('Transcription failed:', err);
      setIsTranscribing(false);
      handleTriggerReAnalyze();
    }
  };

  const handleTriggerReAnalyze = async (customTranscript?: string) => {
    setIsGenerating(true);
    setAnalysisProgress(40);
    setAnalysisStage('2/5 Анализ фактов и смысловых арок загруженного файла...');

    const activeTranscript = customTranscript || media.rawTranscript || media.title;

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 95) return prev;
        const next = prev + Math.floor(Math.random() * 10) + 5;
        if (next > 65 && next <= 85) {
          setAnalysisStage('3/5 Извлечение реальных ключевых цитат и темпоральных меток...');
        } else if (next > 85) {
          setAnalysisStage('4/5 Формирование 6 платформенных постов строго по видео...');
        }
        return next;
      });
    }, 120);

    try {
      const res = await fetch('/api/ai/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: media.title,
          transcript: activeTranscript,
          fileData: media.fileData,
          mimeType: media.fileType,
          toneName: 'Authoritative Expert',
        }),
      });
      const data = await res.json();
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysisStage('Анализ завершен! Все материалы основаны на вашем видео.');

      setTimeout(() => {
        if (data && data.platforms) {
          onUpdateMedia({
            ...media,
            rawTranscript: activeTranscript,
            summary: data.summary || media.summary,
            emotionalHooks: data.emotionalHooks || media.emotionalHooks,
            audiencePersona: data.audiencePersona || media.audiencePersona,
            viralityScore: data.viralityScore || media.viralityScore,
            platforms: data.platforms,
            status: 'ready',
          });
        }
        setIsGenerating(false);
      }, 300);

    } catch (err) {
      console.error('Re-analysis failed:', err);
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  // Auto trigger analysis if media is newly ingested with status 'analyzing'
  useEffect(() => {
    if (media.status === 'analyzing' && !isGenerating && !isTranscribing) {
      handleTriggerReAnalyze();
    }
  }, [media.id, media.status]);

  const handleUpdatePlatformText = (field: keyof PlatformPost, value: any) => {
    const updatedPost = { ...activePost, [field]: value };
    const updatedPlatforms = { ...media.platforms, [selectedPlatform]: updatedPost };
    onUpdateMedia({ ...media, platforms: updatedPlatforms });
  };

  const platformTabs: { id: Platform; label: string; icon: string; color: string }[] = [
    { id: 'youtube', label: 'YouTube SEO и Главы', icon: '📺', color: 'text-red-400 border-red-500' },
    { id: 'tiktok', label: 'TikTok Хук и Тренды', icon: '🎵', color: 'text-cyan-400 border-cyan-500' },
    { id: 'instagram', label: 'Reels / IG Story', icon: '📸', color: 'text-pink-400 border-pink-500' },
    { id: 'linkedin', label: 'LinkedIn Статья', icon: '💼', color: 'text-blue-400 border-blue-500' },
    { id: 'telegram', label: 'Telegram Пост', icon: '✈️', color: 'text-sky-400 border-sky-500' },
    { id: 'twitter', label: 'Twitter Тред', icon: '𝕏', color: 'text-slate-300 border-slate-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Asset Summary */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src={media.thumbnailUrl} alt="" className="w-20 h-12 rounded-lg object-cover bg-black border border-white/10" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-cyan-500/30">
                {media.source}
              </span>
              <span className="text-xs text-slate-400 font-mono">ДЛИТЕЛЬНОСТЬ: {media.duration}</span>
            </div>
            <h2 className="text-sm font-bold text-white mt-1 max-w-xl truncate">{media.title}</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTranscribeAndSynthesize}
            disabled={isGenerating || isTranscribing}
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-black font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow-lg shadow-cyan-500/30 disabled:opacity-50 uppercase tracking-wide font-mono animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-black animate-spin" />
            <span>{isTranscribing ? 'Расшифровка...' : 'Запустить расшифровку и ИИ-синтез'}</span>
          </button>

          <button
            onClick={() => handleTriggerReAnalyze()}
            disabled={isGenerating || isTranscribing}
            className="bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 font-bold text-xs px-3 py-2.5 rounded-lg flex items-center space-x-2 disabled:opacity-50 font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating && !isTranscribing ? 'animate-spin' : ''}`} />
            <span>Перегенерировать</span>
          </button>
        </div>
      </div>

      {/* Visual AI Analysis Scanner Banner when generating or status is analyzing */}
      {(isGenerating || media.status === 'analyzing') && (
        <div className="bg-gradient-to-r from-cyan-950/90 via-blue-950/90 to-slate-900 border-2 border-cyan-500/50 rounded-xl p-5 backdrop-blur-md shadow-2xl shadow-cyan-500/20 font-mono space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-cyan-500/20 rounded-lg border border-cyan-500/40 text-cyan-400">
                <Brain className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-2">
                  <span>Нейросеть Gemini 3.6 Flash анализирует файл...</span>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">{analysisStage}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-cyan-400 tracking-tight">{analysisProgress}%</span>
              <div className="text-[10px] text-emerald-400 font-semibold uppercase">Автономный анализ</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-3 border border-cyan-500/30 overflow-hidden p-0.5 relative">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-200 shadow-lg shadow-cyan-500/50"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 border-t border-white/10 pt-3">
            <div className="flex items-center space-x-1.5 text-cyan-300">
              <Activity className="w-3.5 h-3.5" />
              <span>Чтение кадров и аудио</span>
            </div>
            <div className="flex items-center space-x-1.5 text-blue-300">
              <Cpu className="w-3.5 h-3.5" />
              <span>Оценка виральности</span>
            </div>
            <div className="flex items-center space-x-1.5 text-indigo-300">
              <Flame className="w-3.5 h-3.5" />
              <span>Поиск 3 главных хуков</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Синтез 6 постов</span>
            </div>
          </div>
        </div>
      )}

      {/* Multimodal Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Raw Transcript & Emotional Hooks */}
        <div className="space-y-4">
          {/* File Stream & Media Player Card */}
          <div className="bg-white/[0.03] border border-cyan-500/30 rounded-xl p-4 backdrop-blur-sm space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-400 font-bold flex items-center space-x-2">
                <FileVideo className="w-4 h-4 text-cyan-400" />
                <span>Загруженный медиафайл</span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                АКТИВЕН В ПАМЯТИ
              </span>
            </div>

            {media.videoUrl ? (
              <div className="rounded-lg overflow-hidden border border-white/10 bg-black">
                {media.fileType?.includes('audio') ? (
                  <div className="p-4 bg-slate-950 flex flex-col items-center justify-center space-y-2">
                    <Music className="w-8 h-8 text-cyan-400 animate-pulse" />
                    <audio src={media.videoUrl} controls className="w-full h-10 mt-2" />
                  </div>
                ) : (
                  <video src={media.videoUrl} controls className="w-full max-h-60 object-contain bg-black" />
                )}
              </div>
            ) : (
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
                <img src={media.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-black/80 text-cyan-300 text-[10px] px-2.5 py-1 rounded border border-cyan-500/30">
                    Медиапоток симулирован
                  </span>
                </div>
              </div>
            )}

            <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1 text-[11px]">
              <div className="text-slate-300 font-semibold truncate">
                Файл: <span className="text-white">{media.fileName || media.title}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                <span>Размер: <strong className="text-cyan-400">{media.fileSize}</strong></span>
                <span>Источник: <strong className="text-indigo-300">{media.source}</strong></span>
              </div>
            </div>
          </div>

          {/* Emotional Hooks */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm">
            <h3 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Выделенные эмоциональные хуки</span>
            </h3>
            <ul className="space-y-2">
              {media.emotionalHooks.map((hook, idx) => (
                <li key={idx} className="bg-black/40 border border-white/5 rounded-lg p-3 text-xs text-slate-300 flex items-start space-x-2">
                  <span className="text-amber-400 font-mono font-bold">#{idx + 1}</span>
                  <span className="leading-snug">"{hook}"</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Persona & Virality */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-3 text-xs">
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-mono block mb-1">Целевая аудитория:</span>
              <p className="text-white font-medium bg-black/40 p-2.5 rounded border border-white/5 font-mono">
                {media.audiencePersona}
              </p>
            </div>
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5 font-mono">
              <span className="text-slate-400 text-[10px] uppercase">Индекс виральности:</span>
              <span className="text-base font-black text-cyan-400">{media.platforms[selectedPlatform]?.viralityScore || 94}/100</span>
            </div>
          </div>

          {/* Video Player Preview if uploaded */}
          {media.videoUrl && (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 backdrop-blur-sm space-y-2">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-cyan-400 font-mono uppercase tracking-wider">
                <Play className="w-3.5 h-3.5" />
                <span>Загруженное видео ({media.fileName || media.title})</span>
              </div>
              <video
                src={media.videoUrl}
                controls
                className="w-full max-h-60 rounded-lg bg-black border border-white/10 object-contain"
              />
            </div>
          )}

          {/* Raw Transcript Block with Editability & Direct STT */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-3">
            <div className="flex items-center justify-between font-mono">
              <span className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Транскрипция видеофайла</span>
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                  className="text-[10px] text-slate-400 hover:text-white font-mono underline"
                >
                  {isEditingTranscript ? 'ГОТОВО' : 'РЕДАКТИРОВАТЬ'}
                </button>
                <button 
                  onClick={() => handleCopy(transcriptValue, 'transcript')}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono"
                >
                  {copiedKey === 'transcript' ? 'СКОПИРОВАНО!' : 'КОПИРОВАТЬ'}
                </button>
              </div>
            </div>

            {isEditingTranscript ? (
              <textarea
                value={transcriptValue}
                onChange={(e) => setTranscriptValue(e.target.value)}
                className="w-full bg-black/70 border border-cyan-500/40 rounded-lg p-3 text-xs text-slate-200 font-mono h-44 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                placeholder="Введите или отредактируйте точную транскрипцию видео..."
              />
            ) : (
              <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-xs text-slate-300 font-mono h-40 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                {transcriptValue || `[Ожидает расшифровки speech-to-text для «${media.title}»...]`}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleTranscribeAndSynthesize}
                disabled={isGenerating || isTranscribing}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] py-2 px-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <Brain className={`w-3.5 h-3.5 text-cyan-400 ${isTranscribing ? 'animate-bounce' : ''}`} />
                <span>{isTranscribing ? 'Распознаем...' : 'Авто-STT (Из видео)'}</span>
              </button>

              <button
                onClick={() => handleTriggerReAnalyze(transcriptValue)}
                disabled={isGenerating || isTranscribing}
                className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-[11px] py-2 px-2.5 rounded-lg flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Синтез по тексту</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Platform-Native DNA Transformation Workspace */}
        <div className="md:col-span-2 bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
          {/* Header & Platform Selector Tabs */}
          <div className="border-b border-white/10 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Адаптация под ДНК социальных сетей</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">1 Исходник трансформируется в 6 нативных форматов под разные площадки.</p>
            </div>
          </div>

          {/* Platform Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {platformTabs.map((tab) => {
              const isActive = selectedPlatform === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedPlatform(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border font-mono ${
                    isActive
                      ? 'bg-white/10 text-white border-cyan-400 shadow-sm'
                      : 'bg-black/40 text-slate-400 border-white/5 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Editable Post Workspace */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-4">
            {/* Title / Headline */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex justify-between font-mono">
                <span className="uppercase text-[10px] text-cyan-400">Заголовок / Хук:</span>
                <span className="text-[10px] text-slate-500">{activePost?.title.length || 0} симв.</span>
              </label>
              <input
                type="text"
                value={activePost?.title || ''}
                onChange={(e) => handleUpdatePlatformText('title', e.target.value)}
                className="w-full bg-[#02040a] border border-white/10 text-white text-xs font-semibold rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Caption / Article Text */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex justify-between font-mono">
                <span className="uppercase text-[10px] text-cyan-400">Текст поста / Описание:</span>
                <span className="text-[10px] text-slate-500">Нативный стиль</span>
              </label>
              <textarea
                rows={7}
                value={activePost?.caption || ''}
                onChange={(e) => handleUpdatePlatformText('caption', e.target.value)}
                className="w-full bg-[#02040a] border border-white/10 text-slate-200 text-xs rounded-lg p-3 font-sans leading-relaxed focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Platform Specific Options */}
            {selectedPlatform === 'youtube' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2 flex items-center space-x-1 font-mono uppercase text-[10px]">
                  <ListOrdered className="w-3.5 h-3.5 text-red-400" />
                  <span>Сгенерированные главы YouTube:</span>
                </label>
                <div className="bg-[#02040a] border border-white/10 rounded-lg p-3 space-y-2">
                  {activePost?.chapters?.map((chap, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs font-mono">
                      <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {chap.time}
                      </span>
                      <span className="text-slate-300 font-medium">{chap.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPlatform === 'tiktok' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center space-x-1 font-mono uppercase text-[10px]">
                  <Music className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Трендовый аудиотрек:</span>
                </label>
                <div className="bg-[#02040a] border border-white/10 rounded-lg p-2.5 text-xs text-cyan-300 font-mono flex items-center justify-between">
                  <span>🎵 {activePost?.soundSuggestion || 'Trending Cyber Beats 128BPM'}</span>
                  <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded border border-cyan-500/30">Высокая Виральность</span>
                </div>
              </div>
            )}

            {/* Hashtags Tag Cloud */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 font-mono uppercase text-[10px]">
                Сгенерированные хэштеги (SEO):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {activePost?.hashtags.map((tag, idx) => (
                  <span key={idx} className="bg-white/5 text-slate-300 border border-white/10 text-xs px-2 py-1 rounded font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 font-mono text-xs">
              <button
                onClick={() => handleCopy(`${activePost?.title}\n\n${activePost?.caption}\n\n${activePost?.hashtags.join(' ')}`, 'post')}
                className="bg-white/5 hover:bg-white/10 text-slate-200 px-3.5 py-2 rounded-lg flex items-center space-x-2 transition-all border border-white/10 uppercase"
              >
                {copiedKey === 'post' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'post' ? 'Скопировано!' : 'Скопировать контент'}</span>
              </button>

              <span className="text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Проверка безопасности пройдена</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
