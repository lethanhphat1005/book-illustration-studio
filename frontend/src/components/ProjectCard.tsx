import { useNavigate } from 'react-router-dom';

export type PipelineStep = 'INIT' | 'STYLE' | 'CHARACTERS' | 'PORTRAITS' | 'CHAPTERS' | 'ILLUSTRATIONS';
export type JobStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface Project {
  id: string;
  title: string;
  currentStep: PipelineStep;
  status: JobStatus;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
}

const PIPELINE_STEPS = [
  { key: 'STYLE', label: 'Style' },
  { key: 'CHARACTERS', label: 'Characters' },
  { key: 'PORTRAITS', label: 'Portraits' },
  { key: 'CHAPTERS', label: 'Chapters' },
  { key: 'ILLUSTRATIONS', label: 'Illustrations' },
];

const STEP_ORDER: Record<PipelineStep, number> = {
  INIT: 0,
  STYLE: 1,
  CHARACTERS: 2,
  PORTRAITS: 3,
  CHAPTERS: 4,
  ILLUSTRATIONS: 5,
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const currentStepIndex = STEP_ORDER[project.currentStep];

  // Helper for Status Badge styling
  const getStatusBadge = () => {
    switch (project.status) {
      case 'RUNNING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 animate-pulse">In Progress</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Done</span>;
      case 'FAILED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Failed</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">Draft</span>;
    }
  };

  return (
    <div 
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-orange-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Created on {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* 5-Step Visual Progress Stepper */}
      <div className="mt-6 pt-4 border-t border-gray-50">
        <div className="flex items-center justify-between relative">
          {PIPELINE_STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= currentStepIndex;
            const isCurrent = stepNumber === currentStepIndex + 1 && project.status === 'RUNNING';

            return (
              <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-sm' 
                      : isCurrent 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${isCompleted || isCurrent ? 'text-gray-800' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};