import { Header } from '../../components/Header';
import { PipelineStepper } from '../../components/PipelineStepper';
import { StyleSelectionView } from '../style-selection/StyleSelectionView'; 
import type { PipelineStep } from '../../types/pipeline';
import { useProjectDetailController } from './useProjectDetailController';
import { CharactersView } from '../character-extraction/CharactersView';
import { PortraitsView } from '../potraits/PortraitsView';
import { ChaptersView } from '../chapters/ChaptersView';
import { IllustrationsView } from '../illustrations/IllustrationsView';

const PIPELINE_LABELS: Record<PipelineStep, string> = {
  INIT: 'Art Style',
  STYLE: 'Characters',
  CHARACTERS: 'Portraits',
  PORTRAITS: 'Chapters',
  CHAPTERS: 'Illustrations',
  ILLUSTRATIONS: 'Completed',
};

export const ProjectDetailPage = () => {
  const { project, setProject, isLoading, error, navigate } = useProjectDetailController();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
        <Header />
        <div className="p-8 text-center text-red-600 mt-10">{error || 'Project not found.'}</div>
      </div>
    );
  }

  const isRunning = project.status === 'RUNNING';

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
        
        {/* Header Section */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 group w-fit"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> 
            Back to projects
          </button>
          
          <h1 className="text-[2.25rem] font-extrabold text-gray-900 tracking-tight mb-2">
            {project.title}
          </h1>
          <p className="text-sm text-gray-400">
            Created on {new Date().toLocaleDateString('en-US')}
          </p>
        </div>

        {/* Pipeline Stepper */}
        <div className="mb-14">
          <PipelineStepper currentStep={project.currentStep} status={project.status} mode="active" />
        </div>

        {/* Dynamic Content Area */}
        <div className="flex gap-8 items-start">
          
          {/* Main Action Box */}
          <div className="flex-1 bg-white rounded-[1.25rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
            
            {isRunning ? (
              <div className="animate-in fade-in duration-500">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-gray-700 font-medium">Ready for the next step:</h3>
                  <span className="text-gray-900 font-bold">{PIPELINE_LABELS[project.currentStep as PipelineStep]}</span>
                  <div className="flex space-x-1 ml-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
                
                <p className="text-[15px] text-gray-400 mb-8">
                  Reopening this page mid-step won't fire a second request — it just shows the same in-flight state until it lands.
                </p>

                <button
                  disabled
                  className="px-6 py-3.5 bg-[#ff6a00] text-white font-semibold text-[15px] rounded-xl opacity-80 cursor-wait flex items-center gap-2.5 shadow-md"
                >
                  <svg className="animate-spin -ml-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing {PIPELINE_LABELS[project.currentStep as PipelineStep]}...
                </button>
              </div>
          ) : (
            <>
              {project.currentStep === 'INIT' && (
                <StyleSelectionView 
                  project={project} 
                  onUpdateProject={(updated) => setProject(updated)} 
                />
              )}
              
              {project.currentStep === 'STYLE' && (
                <CharactersView 
                  project={project} 
                  onUpdateProject={(updated) => setProject(updated)} 
                />
              )}
              
              {project.currentStep === 'CHARACTERS' && (
                <PortraitsView 
                  project={project} 
                  onUpdateProject={(updated) => setProject(updated)} 
                />
              )}

              {project.currentStep === 'PORTRAITS' && (
                <ChaptersView 
                  project={project} 
                  onUpdateProject={(updated) => setProject(updated)} 
                />
              )}
          
              {(project.currentStep === 'CHAPTERS' || project.currentStep === 'ILLUSTRATIONS') && (
                <IllustrationsView 
                  project={project} 
                  onUpdateProject={(updated) => setProject(updated)} 
                />
              )}
            </>
          )}
          </div>

          <div className="hidden lg:block w-80">
            {project.stylePrompt && (
              <div className="bg-[#f6f5f1] p-6 rounded-2xl">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Style</h4>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {project.stylePrompt} <span className="text-gray-500">— Gemini will keep this in mind for every prompt below.</span>
                </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};