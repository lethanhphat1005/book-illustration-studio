export type PipelineStep = 'INIT' | 'STYLE' | 'CHARACTERS' | 'PORTRAITS' | 'CHAPTERS' | 'ILLUSTRATIONS';
export type JobStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface ProjectDetail {
  id: string;
  title: string;
  currentStep: PipelineStep;
  status: JobStatus;
  stylePrompt?: string | null;
  characters: Character[];
  chapters: Chapter[];
}

export interface Character {
  id: string;
  name: string;
  description: string;
  isAdult: boolean;
  portraitUrl?: string | null;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  contentSummary?: string | null;
  illustrationUrl?: string | null;
}