import { useState } from 'react';
import type { ProjectDetail, Character } from '../../types/pipeline';

interface UsePortraitsControllerProps {
  project: ProjectDetail;
  onUpdateProject: (updatedProject: ProjectDetail) => void;
}

export const usePortraitsController = ({ project, onUpdateProject }: UsePortraitsControllerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePortraits = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Fake Calling API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const updatedCharacters: Character[] = project.characters.map((char) => {
         
          return {
              ...char,
              portraitUrl: `https://picsum.photos/seed/${char.id}/400/600`
          };
      });

      const updatedProject: ProjectDetail = {
        ...project,
        characters: updatedCharacters,
      };

      onUpdateProject(updatedProject);

    } catch (err: any) {
      setError('Failed to generate portraits. Please try again.');
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
        currentStep: 'PORTRAITS', // Đẩy sang bước tiếp theo (Chapters)
      };
      
      onUpdateProject(updatedProject);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    characters: project.characters || [],
    isProcessing,
    error,
    handleGeneratePortraits,
    handleProceed,
  };
};