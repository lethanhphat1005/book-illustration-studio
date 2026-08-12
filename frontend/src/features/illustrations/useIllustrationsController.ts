import { useState } from 'react';
import axios from 'axios';
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
      const userJson = localStorage.getItem('studio_user');
      if (!userJson) return;
      const user = JSON.parse(userJson);

      const response = await axios.post(`http://localhost:3000/api/projects/${project.id}/illustrations`, {
        version: project.version,
      }, {
        headers: { 'x-user-id': user.id }
      });

      onUpdateProject(response.data.project);

    } catch (err: any) {
      console.error('Failed to generate illustrations:', err);
      if (err.response?.status === 409) {
        setError('Conflict detected: Project updated elsewhere. Please refresh.');
      } else {
        setError(err.response?.data?.error || 'Failed to generate illustrations. Please try again.');
      }
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