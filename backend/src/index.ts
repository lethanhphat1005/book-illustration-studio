import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; 
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev')); 
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.get('/', (req, res) => {
  res.send('Book Illustration Studio API is running smoothly!');
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running flawlessly on http://localhost:${PORT}`);
  console.log(`📡 Listening for incoming API requests...\n`);
});