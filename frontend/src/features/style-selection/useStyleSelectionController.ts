import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedProject: ProjectDetail = {
        ...project,
        stylePrompt: finalStylePrompt, 
        currentStep: 'STYLE',
      };

      onUpdateProject(updatedProject);

    } catch (error: any) {
      setError('root', { type: 'server', message: 'Something went wrong.' });
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