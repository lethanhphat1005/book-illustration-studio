import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ProjectDetail } from '../../types/pipeline';

export const useProjectDetailController = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userJson = localStorage.getItem('studio_user');
        if (!userJson) {
          navigate('/login');
          return;
        }
        
        // --- WARNING ---
        // Change Backend into API GET /api/projects/:id when have API from Backend
        setTimeout(() => {
          setProject({
            id: projectId || 'mock-123',
            title: 'The Wind in the Willows',
            currentStep: 'INIT', 
            status: 'IDLE',
            version: 0,
            stylePrompt: null,
            characters: [],
            chapters: [],
          });
          setIsLoading(false);
        }, 800);

      } catch (err: any) {
        setError('Failed to load project details.');
        setIsLoading(false);
      }
    };

    if (projectId) fetchProjectDetail();
  }, [projectId, navigate]);
  
  return {
    project,
    setProject, 
    isLoading,
    error,
    navigate,
  };
};