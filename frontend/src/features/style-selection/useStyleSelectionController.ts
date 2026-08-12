import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios'; 
import type { ProjectDetail } from '../../types/pipeline';

const styleSchema = z.object({
  presetStyle: z.string(),
  customDetails: z.string().optional(),
}).refine(
  (data) => {
    if (data.presetStyle === 'None (Use Custom Description Below)') {
      return data.customDetails && data.customDetails.length >= 5;
    }
    return true; 
  },
  {
    message: 'Please provide at least 5 characters for your custom style if no base aesthetic is selected.',
    path: ['customDetails'],
  }
);

type StyleFormValues = z.infer<typeof styleSchema>;

interface UseStyleSelectionProps {
  project: ProjectDetail;
  onUpdateProject: (updatedProject: ProjectDetail) => void;
}

export const useStyleSelectionController = ({ project, onUpdateProject }: UseStyleSelectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<StyleFormValues>({
    resolver: zodResolver(styleSchema),
    defaultValues: {
      presetStyle: 'Classic Watercolor',
      customDetails: '',
    },
  });

  const onSubmit = async (data: StyleFormValues) => {
    setIsProcessing(true);
    
    const baseStyle = data.presetStyle === 'None (Use Custom Description Below)' ? '' : `${data.presetStyle}. `;
    const finalStylePrompt = `${baseStyle}${data.customDetails || ''}`.trim();

    try {
      const userJson = localStorage.getItem('studio_user');
      if (!userJson) return;
      const user = JSON.parse(userJson);

      const response = await axios.post(`http://localhost:3000/api/projects/${project.id}/advance`, {
        currentStep: project.currentStep,
        version: project.version, 
        payload: {
          stylePrompt: finalStylePrompt
        }
      }, {
        headers: { 'x-user-id': user.id }
      });

      onUpdateProject(response.data.project);

    } catch (error: any) {
      console.error('Failed to save style:', error);
      if (error.response?.status === 409) {
        setError('root', { type: 'server', message: 'Conflict: The pipeline was modified in another session. Please refresh.' });
      } else {
        setError('root', { type: 'server', message: error.response?.data?.error || 'Failed to save style.' });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    register,
    errors,
    isProcessing,
    submitHandler: handleSubmit(onSubmit),
  };
};