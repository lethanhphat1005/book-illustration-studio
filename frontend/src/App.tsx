import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { ProjectDashboardPage } from './features/dashboard/ProjectDashboardPage';
import { NewProjectPage } from './features/new-project/NewProjectPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginForm />} />
      
        <Route path="/dashboard" element={<ProjectDashboardPage />} />
        
        <Route path="/projects/new" element={<NewProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;