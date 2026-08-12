import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { ProjectDetail } from '../../types/pipeline';

export const useProjectDetailController = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const safeProjectId = Array.isArray(projectId) ? projectId[0] : projectId;
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
        const user = JSON.parse(userJson);

        const response = await axios.get(`http://localhost:3000/api/projects/${safeProjectId}`, {
          headers: { 'x-user-id': user.id }
        });

        setProject(response.data.project);
      } catch (err: any) {
        console.error('Failed to load project details:', err);
        setError('Failed to load project details from server.');
      } finally {
        setIsLoading(false);
      }
    };

    if (safeProjectId) fetchProjectDetail();
  }, [safeProjectId, navigate]);
  
  return {
    project,
    setProject, 
    isLoading,
    error,
    navigate,
  };
};