import { Header } from '../../components/Header';
import { ProjectCard } from '../../components/ProjectCard';
import { useProjectsController } from './useProjectsController';

export const ProjectDashboardPage = () => {
  const { projects, isLoading, error, handleCreateProject } = useProjectsController();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title Bar & Action CTA */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              My Illustration Projects
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select an existing canvas or create a new illustration pipeline.
            </p>
          </div>

          <button
            onClick={handleCreateProject}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 text-white font-semibold text-sm rounded-xl shadow-md hover:opacity-95 transition-all flex items-center gap-2"
          >
            <span>+ New Project</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200/60 rounded-2xl"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <div className="w-16 h-16 bg-orange-100/60 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ✦
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Projects Yet
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              You haven't created any illustration projects. Upload a book text to begin the 5-step artwork pipeline.
            </p>
            <button
              onClick={handleCreateProject}
              className="px-4 py-2 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        )}

        {/* Project Grid */}
        {!isLoading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};