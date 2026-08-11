import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define the exact shape and validation rules
const loginSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
});

// Infer the TypeScript type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

export const useLoginController = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 2. The logic to run when validation passes
  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log('Validation passed! Payload:', data);
      // TODO: Connect to Express Backend via Axios here
      // Example: await axios.post('/api/auth/login', data);
    } catch (error) {
      console.error('Submission failed', error);
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