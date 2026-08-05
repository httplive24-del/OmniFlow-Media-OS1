import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { IngestionWorkspace } from './components/IngestionWorkspace';
import { MultimodalSynthesis } from './components/MultimodalSynthesis';
import { VideoThumbnailSuite } from './components/VideoThumbnailSuite';
import { LocalizationHub } from './components/LocalizationHub';
import { SecurityCompliance } from './components/SecurityCompliance';
import { AnalyticsFeedbackLoop } from './components/AnalyticsFeedbackLoop';
import { IngestModal } from './components/IngestModal';
import { 
  INITIAL_MEDIA_ITEMS, 
  INITIAL_ACCOUNTS, 
  INITIAL_TONES, 
  INITIAL_INGEST_RULES, 
  INITIAL_ANALYTICS 
} from './data/mockData';
import { MediaItem } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('workspace');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [selectedMediaId, setSelectedMediaId] = useState<string>(INITIAL_MEDIA_ITEMS[0]?.id || 'media-101');
  const [selectedToneId, setSelectedToneId] = useState<string>('tone-1');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeMedia = mediaItems.find((m) => m.id === selectedMediaId) || mediaItems[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateMedia = (updated: MediaItem) => {
    setMediaItems((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast(`Обновлен статус пайплайна для "${updated.title.slice(0, 30)}..."`);
  };

  const handleIngestNewMedia = (title: string, source: string, transcript: string, file?: File | null, fileBase64?: string) => {
    const objectUrl = file ? URL.createObjectURL(file) : undefined;
    const computedFileSize = file ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : '340 MB';

    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      title,
      duration: '06:15',
      fileSize: computedFileSize,
      fileName: file?.name,
      fileType: file?.type,
      fileData: fileBase64,
      videoUrl: objectUrl,
      source: source as any,
      ingestedAt: 'Только что (Zero-Click)',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      status: 'analyzing',
      rawTranscript: transcript,
      summary: `Анализ видеоматериала «${title}». Идет обработка нейросетью...`,
      emotionalHooks: [
        `Ключевой аспект из видео «${title.slice(0, 30)}»`,
        `Главный вывод по теме «${title.slice(0, 30)}»`,
        `Практический инсайт материала «${title.slice(0, 30)}»`,
      ],
      audiencePersona: `Зрители и специалисты по теме «${title}»`,
      toneOfVoiceId: selectedToneId,
      platforms: {
        youtube: {
          platform: 'youtube',
          title: `${title} - Full AI Breakdown`,
          caption: `Complete guide on ${title}.\n\nChapters:\n00:00 - Introduction\n02:00 - Zero-Click Ingestion\n04:30 - Autonomous Feedback Loop`,
          hashtags: ['#OmniFlow', '#AIAutomation', '#MediaOS'],
          chapters: [
            { time: '00:00', title: 'Introduction & Hook' },
            { time: '02:00', title: 'Zero-Click Ingestion' },
            { time: '04:30', title: 'Autonomous Feedback Loop' },
          ],
          viralityScore: 92,
          status: 'ready',
        },
        tiktok: {
          platform: 'tiktok',
          title: `Wait until you see how ${title.slice(0, 20)} works! 🚀`,
          caption: `Zero-click media pipeline is live! 🤯 #ai #automation #tech`,
          hashtags: ['#ai', '#automation', '#tech'],
          soundSuggestion: 'Trending Cyber Beat 128BPM',
          viralityScore: 96,
          status: 'ready',
        },
        instagram: {
          platform: 'instagram',
          title: `Zero-Click Ingest: ${title.slice(0, 25)}`,
          caption: `Automated from Premiere directly to 6 platforms with full shadowban protection.`,
          hashtags: ['#creators', '#videomarketing'],
          viralityScore: 89,
          status: 'ready',
        },
        linkedin: {
          platform: 'linkedin',
          title: `Strategic Transformation: ${title}`,
          caption: `Why manual social posting is obsolete in 2026. Here is how modern Media OS handles ingestion, compliance, and self-learning analytics.`,
          hashtags: ['#MediaOS', '#Technology'],
          viralityScore: 88,
          status: 'ready',
        },
        telegram: {
          platform: 'telegram',
          title: `⚡️ Разбор: ${title}`,
          caption: `Новое видео уже обработано и подготовлено под все платформы.`,
          hashtags: ['#автоматизация'],
          viralityScore: 91,
          status: 'ready',
        },
        twitter: {
          platform: 'twitter',
          title: `Automating ${title.slice(0, 25)} 🧵`,
          caption: `1/3 Ingested via webhook\n2/3 Tailored for 6 networks\n3/3 Proxy protected`,
          hashtags: ['#AI', '#BuildInPublic'],
          viralityScore: 90,
          status: 'ready',
        },
      },
      thumbnails: [
        {
          id: `tb-${Date.now()}-1`,
          label: 'A',
          headline: 'ZERO-CLICK INGEST',
          style: 'High Contrast Bold Yellow',
          imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
          ctrEstimate: 9.1,
          winner: false,
        },
        {
          id: `tb-${Date.now()}-2`,
          label: 'B',
          headline: 'THE AI MEDIA OS',
          style: 'Dark Cyberpunk Minimalist',
          imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
          ctrEstimate: 11.5,
          winner: true,
        },
        {
          id: `tb-${Date.now()}-3`,
          label: 'C',
          headline: '100% AUTOMATED',
          style: 'Neon Holographic UI',
          imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=600&auto=format&fit=crop&q=80',
          ctrEstimate: 8.9,
          winner: false,
        },
      ],
      highlights: [
        {
          id: `hl-${Date.now()}-1`,
          timestamp: '00:30 - 01:15',
          title: 'Zero-Click Ingest Hook',
          duration: '00:45',
          viralityScore: 95,
          hookText: 'Drop a file into Premiere export, and watch it hit 6 platforms.',
          topic: 'Automation',
        },
      ],
      subtitleStyle: 'hormozi',
      compliance: {
        score: 99,
        status: 'safe',
        copyrightStatus: 'cleared',
        shadowbanRisk: 'low',
        flaggedKeywords: [],
        formattingClean: true,
      },
      abTesting: {
        active: true,
        leaderVariant: 'B',
        ctrA: 9.1,
        ctrB: 11.5,
        ctrC: 8.9,
      },
      assignedProxyIp: '198.51.100.42 (Dedicated)',
      targetPublishDate: 'Tomorrow, 12:00',
    };

    setMediaItems((prev) => [newItem, ...prev]);
    setSelectedMediaId(newItem.id);
    setActiveTab('synthesis');
    confetti({ particleCount: 50, spread: 60 });
    showToast(`⚡ Бесшовный импорт запущен для "${title}"!`);
  };

  const handleSimulateWebhookDrop = () => {
    const randomTitles = [
      'Podcast Ep #44: Autonomous Content Operations & Gemini AI',
      'Behind the Scenes: How We Built an AI Media OS in 48 Hours',
      'Shorts Viral Blueprint: 10M Views with Zero Manual Uploads',
    ];
    const title = randomTitles[Math.floor(Math.random() * randomTitles.length)];
    handleIngestNewMedia(title, 'Premiere Webhook', `Automatic audio render capture from Adobe Premiere Pro export directory.`);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-300 font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden flex flex-col justify-between pb-10">
      {/* Atmospheric Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex-1">
        {/* App Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenIngestModal={() => setIsIngestModalOpen(true)}
          tones={INITIAL_TONES}
          selectedToneId={selectedToneId}
          setSelectedToneId={setSelectedToneId}
          mediaCount={mediaItems.length}
        />

        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-12 right-6 z-50 bg-[#02040a] border border-cyan-500/40 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl text-xs font-mono flex items-center space-x-2 animate-in fade-in slide-in-from-bottom duration-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Body Canvas */}
        <main className="max-w-7xl mx-auto px-6 py-6">
          {activeTab === 'workspace' && (
            <IngestionWorkspace
              mediaItems={mediaItems}
              ingestRules={INITIAL_INGEST_RULES}
              accounts={INITIAL_ACCOUNTS}
              onSelectMedia={(item) => {
                setSelectedMediaId(item.id);
                setActiveTab('synthesis');
              }}
              onOpenIngestModal={() => setIsIngestModalOpen(true)}
              onSimulateWebhook={handleSimulateWebhookDrop}
              onUpdateMediaStatus={(id, status) => {
                const item = mediaItems.find((m) => m.id === id);
                if (item) handleUpdateMedia({ ...item, status });
              }}
            />
          )}

          {activeTab === 'synthesis' && (
            <MultimodalSynthesis
              media={activeMedia}
              onUpdateMedia={handleUpdateMedia}
            />
          )}

          {activeTab === 'suite' && (
            <VideoThumbnailSuite
              media={activeMedia}
              onUpdateMedia={handleUpdateMedia}
            />
          )}

          {activeTab === 'localization' && (
            <LocalizationHub media={activeMedia} />
          )}

          {activeTab === 'compliance' && (
            <SecurityCompliance
              media={activeMedia}
              accounts={INITIAL_ACCOUNTS}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsFeedbackLoop analytics={INITIAL_ANALYTICS} />
          )}
        </main>
      </div>

      {/* System HUD Footer */}
      <footer className="w-full h-8 px-8 bg-black/80 border-t border-white/5 flex items-center justify-between text-[9px] font-mono tracking-wider text-white/40 fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md">
        <div className="flex gap-6">
          <span>DISK_IO: 4.2GB/s</span>
          <span className="hidden sm:inline">NETWORK: 1.2Gbps</span>
          <span>LATENCY: 14ms</span>
        </div>
        <div className="flex gap-4">
          <span className="text-cyan-400 font-bold">AUTO_PILOT: ENGAGED</span>
          <span className="hidden sm:inline">SYSTEM TIME: {new Date().toISOString().slice(11, 19)} GMT</span>
        </div>
      </footer>

      {/* Quick Ingest Modal */}
      <IngestModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onIngest={handleIngestNewMedia}
        tones={INITIAL_TONES}
      />
    </div>
  );
}
