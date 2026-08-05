export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'telegram' | 'twitter';

export type MediaStatus = 'raw_ingested' | 'analyzing' | 'tailored' | 'compliance_passed' | 'ab_testing' | 'scheduled' | 'published';

export interface PlatformPost {
  platform: Platform;
  title: string;
  caption: string;
  hashtags: string[];
  chapters?: { time: string; title: string }[];
  soundSuggestion?: string;
  viralityScore: number;
  status: 'draft' | 'ready' | 'published';
}

export interface ThumbnailVariant {
  id: string;
  label: 'A' | 'B' | 'C';
  headline: string;
  style: string;
  imageUrl: string;
  ctrEstimate: number;
  winner?: boolean;
}

export interface HighlightClip {
  id: string;
  timestamp: string;
  title: string;
  duration: string;
  viralityScore: number;
  hookText: string;
  topic: string;
}

export interface MediaItem {
  id: string;
  title: string;
  duration: string;
  fileSize: string;
  fileName?: string;
  fileType?: string;
  fileData?: string;
  source: 'Google Drive' | 'CapCut API' | 'Premiere Webhook' | 'Telegram Bot' | 'Manual Upload';
  ingestedAt: string;
  videoUrl?: string;
  thumbnailUrl: string;
  status: MediaStatus;
  rawTranscript: string;
  summary: string;
  emotionalHooks: string[];
  audiencePersona: string;
  toneOfVoiceId: string;
  platforms: Record<Platform, PlatformPost>;
  thumbnails: ThumbnailVariant[];
  highlights: HighlightClip[];
  subtitleStyle: 'hormozi' | 'mrbeast' | 'clean_minimal' | 'neon_glow';
  compliance: {
    score: number; // 0-100
    status: 'safe' | 'warning' | 'flagged';
    copyrightStatus: 'cleared' | 'matching_music' | 'flagged';
    shadowbanRisk: 'low' | 'medium' | 'high';
    flaggedKeywords: string[];
    formattingClean: boolean;
  };
  abTesting: {
    active: boolean;
    leaderVariant?: 'A' | 'B' | 'C';
    ctrA: number;
    ctrB: number;
    ctrC: number;
  };
  assignedProxyIp: string;
  targetPublishDate: string;
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  handle: string;
  accountName: string;
  followers: string;
  status: 'active' | 'synced' | 'proxy_isolated';
  proxyIp: string;
  proxyLocation: string;
  shadowbanStatus: 'clean' | 'monitoring' | 'risk';
}

export interface ToneOfVoiceProfile {
  id: string;
  name: string;
  description: string;
  toneKeywords: string[];
  sampleText: string;
  active: boolean;
}

export interface IngestRule {
  id: string;
  name: string;
  sourceType: 'Google Drive' | 'Dropbox' | 'Premiere NLE' | 'CapCut Cloud' | 'S3 Bucket' | 'Telegram Bot';
  folderPath: string;
  autoProcess: boolean;
  targetToneId: string;
  status: 'watching' | 'idle';
  lastSync: string;
}

export interface FeedbackLoopMetric {
  date: string;
  avgCtr: number;
  retentionRate: number;
  shadowbanIncidents: number;
  aiPromptOptimizationScore: number;
  viewsTotal: number;
}
