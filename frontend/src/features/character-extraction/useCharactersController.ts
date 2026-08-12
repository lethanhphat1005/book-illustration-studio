import { useState } from 'react';
import type { ProjectDetail, Character } from '../../types/pipeline';

interface UseCharactersControllerProps {
  project: ProjectDetail;
  onUpdateProject: (updatedProject: ProjectDetail) => void;
}

export const useCharactersController = ({ project, onUpdateProject }: UseCharactersControllerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCharacters = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockCharacters: Character[] = [
        {
          id: 'char-1',
          name: 'Mr. Toad',
          description: 'A wealthy, jovial, and reckless toad who loves fast cars, tweed suits, and grand adventures. He is impulsive but fiercely loyal to his friends.',
          isAdult: true,
          portraitUrl: null,
        },
        {
          id: 'char-2',
          name: 'Ratty (The Water Rat)',
          description: 'A sensible, polite, and deeply poetic water rat. He spends his days sculling on the river and organizing picnics, always wearing a neat nautical outfit.',
          isAdult: true,
          portraitUrl: null,
        }
      ];

      // Update both characters and the currentStep in one go
      const updatedProject: ProjectDetail = {
        ...project,
        characters: mockCharacters,
        currentStep: 'CHARACTERS', 
      };

      onUpdateProject(updatedProject);

    } catch (err: any) {
      setError('Failed to extract characters. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const characters: Character[] = project.characters || [];

  return {
    characters,
    isProcessing,
    error,
    handleGenerateCharacters,
  };
};