import { useNavigate } from 'react-router-dom';

interface UserSession {
  id: string;
  fullName: string;
  email: string;
}

export const Header = () => {
  const navigate = useNavigate();

  const userJson = localStorage.getItem('studio_user');
  const user: UserSession | null = userJson ? JSON.parse(userJson) : null;
  const userInitial = user?.fullName ? user.fullName.trim().charAt(0).toUpperCase() : 'U';

  const handleSignOut = () => {
    localStorage.removeItem('studio_user');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          <div 
            onClick={() => navigate('/dashboard')} 
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="font-extrabold text-lg text-gray-900 tracking-tight">
              Book Studio
            </span>
          </div>

          <nav>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              Dashboard
            </button>
          </nav>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200/60 pl-2 pr-4 py-1.5 rounded-full">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-studio-orange via-studio-rose to-studio-purple text-white font-bold text-sm flex items-center justify-center shadow-sm">
                {userInitial}
              </div>
              <span className="text-sm font-semibold text-gray-800 hidden sm:inline">
                {user.fullName}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-studio-orange hover:underline"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};