import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';

const loginSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
});

// Infer the TypeScript type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

export const useLoginController = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Logic to execute when validation passes
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Connect to Express Backend via Axios
      const response = await axios.post('http://localhost:3000/api/auth/login', data);
      
      console.log('Authentication successful! Payload:', response.data);

      // Store user identity in localStorage to persist the session
      localStorage.setItem('studio_user', JSON.stringify(response.data.user));

      // --- ADD THIS LINE TO TEST SUCCESS ---
      alert(`Success! Welcome to the Studio, ${response.data.user.fullName || data.fullName}`);

      // TODO: Navigate the user to the Project List page
      // Example (if using react-router-dom): navigate('/projects');

    } catch (error: any) {
      console.error('Backend connection failed:', error);
      
      // Handle HTTP 400/500 errors returned by the Backend
      if (error.response && error.response.data) {
        setError('root', { 
          type: 'server', 
          message: error.response.data.error || 'Server authentication failed. Please try again.' 
        });
      } else {
        // Handle network errors (e.g., server is down or unreachable)
        setError('root', { 
          type: 'network', 
          message: 'Unable to connect to the backend. Please ensure the Express server is running on port 3000.' 
        });
      }
    }
  };

  // 3. Expose only what the View needs
  return {
    register,
    errors,
    isSubmitting,
    submitHandler: handleSubmit(onSubmit),
  };
};