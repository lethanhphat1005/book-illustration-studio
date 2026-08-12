import { useState } from 'react';
import axios from 'axios';
import type { ProjectDetail } from '../../types/pipeline';

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
      const userJson = localStorage.getItem('studio_user');
      if (!userJson) return;
      const user = JSON.parse(userJson);

      const response = await axios.post(`http://localhost:3000/api/projects/${project.id}/portraits`, {
        version: project.version, 
      }, {
        headers: { 'x-user-id': user.id }
      });

      onUpdateProject(response.data.project);

    } catch (err: any) {
      console.error('Failed to generate portraits:', err);
      if (err.response?.status === 409) {
        setError('Conflict detected: Project updated elsewhere. Please refresh.');
      } else {
        setError(err.response?.data?.error || 'Failed to generate portraits. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    characters: project.characters || [],
    isProcessing,
    error,
    handleGeneratePortraits, 
  };
};