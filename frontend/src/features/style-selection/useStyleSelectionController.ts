import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import type { ProjectDetail } from '../../types/pipeline';

// Zod schema enforcing either a preset or a valid custom description
const styleSchema = z.object({
  presetStyle: z.string().min(1, 'Please select a base style.'),
  customDetails: z.string().optional(),
}).refine(
  (data) => data.presetStyle !== 'Custom' || (data.customDetails && data.customDetails.length >= 5),
  {
    message: 'Please provide at least 5 characters for your custom style.',
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
    watch,
    formState: { errors },
    setError,
  } = useForm<StyleFormValues>({
    resolver: zodResolver(styleSchema),
    defaultValues: {
      presetStyle: 'Classic Watercolor',
      customDetails: '',
    },
  });

  const selectedPreset = watch('presetStyle');
  const isCustomMode = selectedPreset === 'Custom';

  const onSubmit = async (data: StyleFormValues) => {
    setIsProcessing(true);
    
    // Combine preset and custom details into a single prompt for Gemini
    const finalStylePrompt = isCustomMode 
      ? data.customDetails! 
      : `${data.presetStyle}. ${data.customDetails || ''}`.trim();

    try {
      // POST to backend to save style and trigger Gemini
      const response = await axios.post(`http://localhost:3000/api/projects/${project.id}/advance`, {
        currentStep: project.currentStep,
        version: project.version, 
        payload: {
          stylePrompt: finalStylePrompt
        }
      });

      // Update parent component with the new project state (now in CHARACTERS step)
      onUpdateProject(response.data.project);

    } catch (error: any) {
      console.error('Failed to save style and advance pipeline:', error);
      
      // STRICT CONCURRENCY RULE: Handle OCC Conflicts
      if (error.response?.status === 409) {
        setError('root', { 
          type: 'server', 
          message: 'Conflict: The pipeline was modified in another tab. Please refresh the page.' 
        });
      } else {
        setError('root', { 
          type: 'server', 
          message: error.response?.data?.error || 'Failed to communicate with the Gemini API. Please try again.' 
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    register,
    errors,
    isProcessing,
    isCustomMode,
    submitHandler: handleSubmit(onSubmit),
  };
};