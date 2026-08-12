import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const newProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required.'),
  bookText: z.string().min(50, 'Please provide a sufficient amount of text (at least 50 characters) to generate a pipeline.'),
});

type NewProjectValues = z.infer<typeof newProjectSchema>;

export const useNewProjectController = () => {
  const navigate = useNavigate();
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<NewProjectValues>({
    resolver: zodResolver(newProjectSchema),
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.type !== 'text/plain') {
      setFileError('Only .txt files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setValue('bookText', text, { shouldValidate: true });
    };
    reader.onerror = () => setFileError('Failed to read the file.');
    reader.readAsText(file);
  };

  const onSubmit = async (data: NewProjectValues) => {
    try {
      const userJson = localStorage.getItem('studio_user');
      if (!userJson) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(userJson);

      const response = await axios.post('http://localhost:3000/api/projects', {
        title: data.title,
        bookText: data.bookText,
      }, {
        headers: {
          'x-user-id': user.id 
        }
      });

      const createdProject = response.data.project;
      navigate(`/projects/${createdProject.id}`);

    } catch (error: any) {
      console.error('Failed to create project:', error);
      setError('root', { 
        type: 'server', 
        message: error.response?.data?.error || 'Failed to create project. Check if backend is running.' 
      });
    }
  };

  return {
    register,
    errors,
    fileError,
    isSubmitting,
    handleFileUpload,
    submitHandler: handleSubmit(onSubmit),
    navigate,
  };
};