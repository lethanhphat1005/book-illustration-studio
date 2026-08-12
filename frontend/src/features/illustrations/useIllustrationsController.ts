import { useState } from 'react';
import type { ProjectDetail, Chapter } from '../../types/pipeline';

interface UseIllustrationsControllerProps {
  project: ProjectDetail;
  onUpdateProject: (updatedProject: ProjectDetail) => void;
}

export const useIllustrationsController = ({ project, onUpdateProject }: UseIllustrationsControllerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateIllustrations = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const updatedChapters: Chapter[] = project.chapters.map((chap) => {
          return {
              ...chap,
              illustrationUrl: `https://picsum.photos/seed/illustration-${chap.id}/1600/1000` 
          };
      });

      const updatedProject: ProjectDetail = {
        ...project,
        chapters: updatedChapters,
        currentStep: 'ILLUSTRATIONS', 
        status: 'COMPLETED',          
      };

      onUpdateProject(updatedProject);

    } catch (err: any) {
      setError('Failed to generate illustrations. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const chapters: Chapter[] = project.chapters || [];

  return {
    chapters,
    isProcessing,
    error,
    handleGenerateIllustrations,
  };
};