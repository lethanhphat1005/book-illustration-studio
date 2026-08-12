import { useState } from 'react';
import axios from 'axios';
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
      const userJson = localStorage.getItem('studio_user');
      if (!userJson) return;
      const user = JSON.parse(userJson);

      const response = await axios.post(`http://localhost:3000/api/projects/${project.id}/characters`, {
        version: project.version,
      }, {
        headers: { 'x-user-id': user.id }
      });

      onUpdateProject(response.data.project);

    } catch (err: any) {
      console.error('Failed to extract characters:', err);
      if (err.response?.status === 409) {
        setError('Conflict detected: Project updated elsewhere. Please refresh.');
      } else {
        setError(err.response?.data?.error || 'Failed to extract characters. Please try again.');
      }
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