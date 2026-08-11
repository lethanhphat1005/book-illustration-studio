import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './features/auth/LoginForm';
import { ProjectDashboardPage } from './features/dashboard/ProjectDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginForm />} />
      
        <Route path="/dashboard" element={<ProjectDashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;