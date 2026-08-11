import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Project } from '../../components/ProjectCard';
import { useNavigate } from 'react-router-dom';

export const useProjectsController = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userJson = localStorage.getItem('studio_user');
        if (!userJson) {
          navigate('/login'); 
          return;
        }

        const user = JSON.parse(userJson);

        const response = await axios.get('http://localhost:3000/api/projects', {
          headers: {
            'x-user-id': user.id,
          },
        });

        setProjects(response.data.projects || []);
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);
        
        if (err.response?.status === 401) {
          localStorage.removeItem('studio_user');
          navigate('/login');
          return;
        }

        setError(err.response?.data?.error || 'Unable to fetch projects from server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleCreateProject = () => {
    navigate('/projects/new');
  };

  return {
    projects,
    isLoading,
    error,
    handleCreateProject,
  };
};