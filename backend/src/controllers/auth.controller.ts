import { Request, Response } from 'express';
import { z } from 'zod';
import { loginOrCreateUser } from '../services/auth.service';

// Đồng bộ biến fullName với Frontend
const loginSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email format. Please rewrite your e-mail.'),
});

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({ 
        error: 'Validation Failed', 
        // Đổi từ .errors sang .issues để TypeScript hiểu đúng type
        details: validationResult.error.issues.map(err => err.message)
      });
      return;
    }

    const { email, fullName } = validationResult.data;

    const user = await loginOrCreateUser(email, fullName);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};