import { useState } from 'react';
import axios from 'axios';
import type { ProjectDetail } from '../../types/pipeline';

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
      const userJson = localStorage.getItem('studio_user');
      if (!userJson) return;
      const user = JSON.parse(userJson);

      const response = await axios.post(`http://localhost:3000/api/projects/${project.id}/chapters`, {
        version: project.version,
      }, {
        headers: { 'x-user-id': user.id }
      });

      onUpdateProject(response.data.project);

    } catch (err: any) {
      console.error('Failed to extract chapters:', err);
      if (err.response?.status === 409) {
        setError('Conflict detected: Project updated elsewhere. Please refresh.');
      } else {
        setError(err.response?.data?.error || 'Failed to extract chapters. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    error,
    handleGenerateChapters,
  };
};