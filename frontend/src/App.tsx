import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { ProjectDashboardPage } from './features/dashboard/ProjectDashboardPage';
import { NewProjectPage } from './features/new-project/NewProjectPage';
import { ProjectDetailPage } from './features/pipeline/ProjectDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<ProjectDashboardPage />} />
        <Route path="/projects/new" element={<NewProjectPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;