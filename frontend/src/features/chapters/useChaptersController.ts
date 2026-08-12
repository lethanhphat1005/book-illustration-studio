import { useState } from 'react';
import type { ProjectDetail, Chapter } from '../../types/pipeline';

interface UseChaptersControllerProps {
  project: ProjectDetail;
  onUpdateProject: (updatedProject: ProjectDetail) => void;
}

export const useChaptersController = ({ project, onUpdateProject }: UseChaptersControllerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateChapters = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Fake API Call to Gemini Text Model
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockChapters: Chapter[] = [
        {
          id: 'chap-1',
          chapterNumber: 1,
          contentSummary: 'A beautiful, wide shot of Ratty and Mr. Toad sitting on the grassy riverbank. Ratty is packing a wicker picnic basket while Toad looks enthusiastically at a map. Warm afternoon sunlight filtering through the willow trees.',
          illustrationUrl: null, 
        }
      ];

      const updatedProject: ProjectDetail = {
        ...project,
        chapters: mockChapters,
        currentStep: 'PORTRAITS',
      };

      onUpdateProject(updatedProject);

    } catch (err: any) {
      setError('Failed to generate chapter prompts. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProceed = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      
      const updatedProject: ProjectDetail = {
        ...project,
        currentStep: 'CHAPTERS',
      };
      
      onUpdateProject(updatedProject);
    } finally {
      setIsProcessing(false);
    }
  };

  const chapters: Chapter[] = project.chapters || [];
  const hasChapters = chapters.length > 0;

  return {
    chapters,
    hasChapters,
    isProcessing,
    error,
    handleGenerateChapters,
    handleProceed,
  };
};