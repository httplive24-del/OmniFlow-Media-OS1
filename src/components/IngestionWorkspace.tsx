import React, { useState } from 'react';
import { 
  FolderSync, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Users, 
  ArrowRight,
  HardDrive,
  Cpu,
  Tv,
  Eye,
  Settings
} from 'lucide-react';
import { MediaItem, IngestRule, SocialAccount, Platform } from '../types';

interface IngestionWorkspaceProps {
  mediaItems: MediaItem[];
  ingestRules: IngestRule[];
  accounts: SocialAccount[];
  onSelectMedia: (item: MediaItem) => void;
  onOpenIngestModal: () => void;
  onSimulateWebhook: () => void;
  onUpdateMediaStatus: (mediaId: string, status: MediaItem['status']) => void;
}

export const IngestionWorkspace: React.FC<IngestionWorkspaceProps> = ({
  mediaItems,
  ingestRules,
  accounts,
  onSelectMedia,
  onOpenIngestModal,
  onSimulateWebhook,
  onUpdateMediaStatus,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [userRole, setUserRole] = useState<'Author' | 'Lead Editor' | 'Media Ops Manager' | 'Analytics Director'>('Media Ops Manager');

  // Kanban Columns
  const columns: { status: MediaItem['status']; title: string; color: string }[] = [
    { status: 'raw_ingested', title: 'Загружено без кликов', color: 'border-amber-500/40 text-amber-400' },
    { status: 'analyzing', title: 'ИИ-Анализ Мультимодальный', color: 'border-cyan-500/40 text-cyan-400' },
    { status: 'tailored', title: 'Готово под ДНК соцсетей', color: 'border-indigo-500/40 text-indigo-400' },
    { status: 'ab_testing', title: 'A/B/C Тест Превью', color: 'border-purple-500/40 text-purple-400' },
    { status: 'scheduled', title: 'Запланировано / Опубликовано', color: 'border-emerald-500/40 text-emerald-400' },
  ];

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'youtube': return '📺 YT';
      case 'tiktok': return '🎵 TT';
      case 'instagram': return '📸 IG';
      case 'linkedin': return '💼 IN';
      case 'telegram': return '✈️ TG';
      case 'twitter': return '𝕏 X';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Zero-Click Live Banner */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FolderSync className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="uppercase tracking-wider">Движок импорта в один клик</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                3 МОНИТОРИРУЕМЫХ ХРАНИЛИЩА
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Файлы из облачных папок и экспорта Premiere / CapCut автоматически подгружаются и адаптируются.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Simulate NLE render button */}
          <button
            id="btn-simulate-webhook"
            onClick={onSimulateWebhook}
            className="bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-xs px-3.5 py-2 rounded-lg flex items-center space-x-2 transition-all font-mono"
          >
            <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
            <span>Симулировать экспорт Premiere</span>
          </button>

          {/* Role selector */}
          <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300 font-mono">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-500">РОЛЬ:</span>
            <select
              value={userRole}
              onChange={(e: any) => setUserRole(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="Author" className="bg-slate-900">Автор / Ведущий</option>
              <option value="Lead Editor" className="bg-slate-900">Главный Редактор</option>
              <option value="Media Ops Manager" className="bg-slate-900">Медиа-Менеджер</option>
              <option value="Analytics Director" className="bg-slate-900">Директор по Аналитике</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 text-xs font-mono">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded transition-all ${
                viewMode === 'kanban' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              КАНБАН
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded transition-all ${
                viewMode === 'list' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              СПИСОК
            </button>
          </div>
        </div>
      </div>

      {/* Live Ingestion Watcher Rules Drawer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ingestRules.map((rule) => (
          <div key={rule.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-white/5 text-indigo-400 border border-white/10">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white truncate">{rule.name}</h3>
                <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>LIVE</span>
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{rule.folderPath}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Источник: {rule.sourceType}</span>
                <span>Синхронизировано: {rule.lastSync}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Content Calendar / Kanban Board */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const items = mediaItems.filter((m) => m.status === col.status);
            return (
              <div key={col.status} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col min-h-[480px]">
                {/* Column Header */}
                <div className={`border-b border-white/10 pb-2.5 mb-3 flex items-center justify-between ${col.color}`}>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold">{col.title}</h3>
                  <span className="bg-white/10 text-slate-200 text-xs px-2 py-0.5 rounded font-mono font-bold">
                    {items.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white/[0.04] border border-white/10 hover:border-cyan-500/50 rounded-xl p-3 transition-all shadow-lg group cursor-pointer backdrop-blur-sm"
                      onClick={() => onSelectMedia(item)}
                    >
                      {/* Thumbnail & duration */}
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-black border border-white/10">
                        {item.videoUrl && !item.fileType?.includes('audio') ? (
                          <video src={item.videoUrl} className="w-full h-full object-cover" muted />
                        ) : (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/10">
                          {item.duration}
                        </span>
                        <span className="absolute top-1 left-1 bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center space-x-1">
                          <span>{item.source}</span>
                          {item.fileName && <span className="text-emerald-400 font-bold">• FILE</span>}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-white line-clamp-2 mb-1.5 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h4>

                      {/* Meta badges */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 font-mono">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{item.ingestedAt}</span>
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          Безопасность: {item.compliance.score}%
                        </span>
                      </div>

                      {/* Target Platforms */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
                        <div className="flex items-center space-x-1">
                          {Object.keys(item.platforms).map((p) => (
                            <span key={p} className="bg-white/5 text-slate-300 px-1 py-0.5 rounded text-[9px] border border-white/5">
                              {getPlatformIcon(p as Platform)}
                            </span>
                          ))}
                        </div>
                        <span className="text-indigo-400 font-mono flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                          <span>Открыть</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="border border-dashed border-white/10 rounded-xl p-6 text-center text-xs text-slate-600 flex flex-col items-center justify-center h-40">
                      <FolderSync className="w-6 h-6 mb-2 opacity-30 text-slate-500" />
                      <span>Нет элемента на этом этапе</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/40 text-cyan-400 uppercase font-mono text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5">Медиа-актив</th>
                <th className="p-3.5">Источник и Длительность</th>
                <th className="p-3.5">Статус пайплайна</th>
                <th className="p-3.5">Целевые платформы</th>
                <th className="p-3.5">Безопасность</th>
                <th className="p-3.5 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {mediaItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.04] transition-colors cursor-pointer" onClick={() => onSelectMedia(item)}>
                  <td className="p-3.5 flex items-center space-x-3">
                    <img src={item.thumbnailUrl} alt="" className="w-12 h-8 rounded object-cover bg-black border border-white/10" />
                    <div>
                      <div className="font-semibold text-white max-w-xs truncate">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Загружено: {item.ingestedAt}</div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono text-cyan-400 font-bold">{item.duration}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.source} ({item.fileSize})</div>
                  </td>
                  <td className="p-3.5">
                    <span className="capitalize px-2 py-1 rounded bg-white/5 text-slate-200 border border-white/10 font-mono text-[10px]">
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex space-x-1">
                      {Object.keys(item.platforms).map((p) => (
                        <span key={p} className="bg-white/5 text-slate-300 px-1.5 py-0.5 rounded text-[10px] border border-white/5">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-emerald-400 font-mono font-bold">{item.compliance.score}% Безопасно</span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMedia(item);
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-3 py-1.5 rounded text-xs uppercase font-mono transition-all"
                    >
                      Открыть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Connected Channels & Proxy Matrix Bar */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Подключенные соцсети и матрица прокси-изоляции</span>
          </span>
          <span className="text-[10px] text-cyan-400 font-mono">6 КАНАЛОВ АКТИВНО</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {accounts.map((acc) => (
            <div key={acc.id} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-mono">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white capitalize">{acc.platform}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] text-cyan-400 truncate">{acc.handle}</div>
              <div className="text-[10px] text-slate-500 mt-1 truncate">Proxy: {acc.proxyLocation}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
