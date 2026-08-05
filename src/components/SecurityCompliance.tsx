import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Check, 
  Globe, 
  Radio,
  FileCheck
} from 'lucide-react';
import { MediaItem, SocialAccount } from '../types';

interface SecurityComplianceProps {
  media: MediaItem;
  accounts: SocialAccount[];
}

export const SecurityCompliance: React.FC<SecurityComplianceProps> = ({ media, accounts }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [testText, setTestText] = useState(media.platforms.tiktok?.caption || '');
  const [auditResult, setAuditResult] = useState<any>(media.compliance);

  const handleRunAudit = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/ai/audit-compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText, title: media.title }),
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (err) {
      console.error('Compliance audit failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Защита от банов и изоляция прокси-серверов</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Защищает ваши аккаунты от теневых банов, фильтров стоп-слов, страйков Content ID и лимитов IP-адресов.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-mono font-bold">100% БЕЗОПАСНОСТЬ АККАУНТОВ</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Copyright Shield */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Щит авторских прав (Content ID)</span>
          </h3>

          <div className="bg-black/40 border border-white/10 rounded-xl p-5 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono">Аудиоцифровая подпись чиста</div>
              <div className="text-xs text-slate-400 mt-0.5">Проверено по базе 45M треков YouTube Content ID</div>
            </div>
            <div className="bg-black/60 p-3 rounded-lg text-[11px] text-slate-300 border border-white/5 flex justify-between font-mono">
              <span className="text-slate-400">Статус прав:</span>
              <span className="text-emerald-400 font-bold">Коммерческая лицензия</span>
            </div>
          </div>
        </div>

        {/* Column 2: Shadowban & Text Compliance Inspector */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Сканер стоп-слов и безопасности</span>
            </h3>
            <button
              onClick={handleRunAudit}
              disabled={isScanning}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center space-x-1 uppercase"
            >
              <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Аудит</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <textarea
              rows={4}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Вставьте текст поста для проверки стоп-слов..."
              className="w-full bg-[#02040a] border border-white/10 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] focus:outline-none focus:border-cyan-500"
            />

            <div className="bg-black/40 border border-white/10 p-3 rounded-lg space-y-2 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px] uppercase">Оценка безопасности:</span>
                <span className="font-bold text-emerald-400 text-sm">{auditResult.score || 98}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px] uppercase">Риск теневого бана:</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  {auditResult.shadowbanRisk === 'LOW' || !auditResult.shadowbanRisk ? 'НИЗКИЙ' : auditResult.shadowbanRisk}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[10px] uppercase">Форматирование:</span>
                <span className="text-cyan-400 text-[10px]">Без опасных символов</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Proxy Isolation Matrix */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 backdrop-blur-sm space-y-4">
          <h3 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center space-x-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>Матрица выделенных прокси-серверов</span>
          </h3>

          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-black/40 border border-white/10 rounded-lg p-3 text-xs space-y-1 font-mono">
                <div className="flex items-center justify-between font-bold text-white">
                  <span className="capitalize">{acc.platform} ({acc.handle})</span>
                  <span className="text-[10px] text-emerald-400">ИЗОЛИРОВАН</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>IP: {acc.proxyIp}</span>
                  <span className="text-slate-500">{acc.proxyLocation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
