import React, { useState, useRef } from 'react';
import { X, Upload, HardDrive, Link as LinkIcon, Sparkles, Check, FileVideo, Loader2 } from 'lucide-react';
import { ToneOfVoiceProfile } from '../types';

interface IngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngest: (title: string, source: string, transcript: string, file?: File | null, fileBase64?: string) => void;
  tones: ToneOfVoiceProfile[];
}

export const IngestModal: React.FC<IngestModalProps> = ({
  isOpen,
  onClose,
  onIngest,
  tones,
}) => {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState<'Google Drive' | 'CapCut API' | 'Premiere Webhook' | 'Telegram Bot' | 'Manual Upload'>('Manual Upload');
  const [transcript, setTranscript] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Upload progress animation states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('Подготовка файла...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    if (!title || title.trim() === '') {
      setTitle(cleanName);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.size > 25 * 1024 * 1024) {
        resolve('');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStage('Загрузка видеофайла и подготовка медиапотока...');

    let fileBase64 = '';
    if (selectedFile) {
      setUploadStage('Чтение байтов видеофайла в память...');
      fileBase64 = await convertFileToBase64(selectedFile);
    }

    let current = 20;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 10;
      if (current >= 100) {
        current = 100;
        setUploadProgress(100);
        setUploadStage('Загрузка завершена! Запуск нейросетевого анализа...');
        clearInterval(interval);

        setTimeout(() => {
          const autoTranscript = (transcript && transcript.trim().length > 0)
            ? transcript.trim()
            : `[Ожидает нейросетевой расшифровки речи (Speech-to-Text) для «${title}»...]`;

          onIngest(
            title,
            source,
            autoTranscript,
            selectedFile,
            fileBase64
          );
          setIsUploading(false);
          setUploadProgress(0);
          setTitle('');
          setTranscript('');
          setSelectedFile(null);
          onClose();
        }, 300);
      } else {
        setUploadProgress(current);
        if (current > 40 && current < 70) {
          setUploadStage('Подготовка медиаструктуры и кодека...');
        } else if (current >= 70 && current < 95) {
          setUploadStage('Формирование объекта для Gemini 3.6 Flash...');
        }
      }
    }, 60);
  };

  const totalSizeMb = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) : '35.0';
  const currentUploadedMb = selectedFile
    ? ((selectedFile.size * uploadProgress) / 100 / (1024 * 1024)).toFixed(1)
    : ((35 * uploadProgress) / 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#02040a] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => {
            if (!isUploading) onClose();
          }}
          disabled={isUploading}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Загрузить медиафайл или вебхук</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            OmniFlow автоматически запустит мультимодальный анализ, адаптацию под ДНК сетей и проверку безопасности.
          </p>
        </div>

        {isUploading ? (
          /* Upload Progress Bar Screen */
          <div className="space-y-5 py-4 font-mono">
            <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-bold flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>{uploadStage}</span>
                </span>
                <span className="text-emerald-400 font-bold text-sm font-mono">{uploadProgress}%</span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-slate-900 rounded-full h-3 border border-white/10 overflow-hidden p-0.5 relative">
                <div
                  className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-150 ease-out shadow-lg shadow-cyan-500/50"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Загружено: {currentUploadedMb} MB из {totalSizeMb} MB</span>
                <span className="text-cyan-400 font-semibold">Скорость: 34.2 МБ/с</span>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center space-x-2 text-xs text-slate-300 bg-white/5 p-3 rounded-lg border border-white/10">
                <FileVideo className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{selectedFile.name}</span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,audio/*,.mp4,.mov,.mkv,.webm"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* File Drag and Drop & Click Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const files = e.dataTransfer.files;
                if (files && files[0]) {
                  handleFileChange(files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center space-y-2 transition-all cursor-pointer ${
                selectedFile
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : dragActive
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-white/10 bg-black/40 hover:border-cyan-500/50 hover:bg-white/[0.02]'
              }`}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="text-emerald-300 font-bold text-xs truncate max-w-xs mx-auto flex items-center justify-center space-x-1.5">
                    <FileVideo className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{selectedFile.name}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Нажмите, чтобы выбрать другой файл
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
                  <div className="text-slate-200 font-bold uppercase text-[11px]">
                    Нажмите для выбора файла или перетащите его сюда (.mp4, .mov, .mkv)
                  </div>
                  <div className="text-cyan-400 text-[10px] font-semibold uppercase tracking-wider">
                    Открыть проводник / Выбрать файл с устройства
                  </div>
                </>
              )}
            </div>

            {/* Title input */}
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Название / Идентификатор видео:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Автоматизация контента 2026"
                className="w-full bg-black/60 border border-white/10 text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Source Selector */}
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Канал получения исходника:</label>
              <select
                value={source}
                onChange={(e: any) => setSource(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-cyan-500"
              >
                <option value="Manual Upload">Ручная загрузка файла (.mp4)</option>
                <option value="Premiere Webhook">Adobe Premiere Pro Direct Render Webhook</option>
                <option value="CapCut API">CapCut Cloud Auto-Sync API</option>
                <option value="Google Drive">Google Drive Shared Render Vault</option>
                <option value="Telegram Bot">Telegram Бот (@OmniFlowIngest_Bot)</option>
              </select>
            </div>

            {/* Optional Transcript */}
            <div>
              <label className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Транскрипция (Опционально):</label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Оставьте пустым для авто-распознавания Gemini..."
                className="w-full bg-black/60 border border-white/10 text-slate-200 rounded-lg p-2.5 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs py-3 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 uppercase tracking-wide font-mono hover:brightness-110 active:scale-[0.99] transition-all"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Запустить автономный пайплайн</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
