import type { PipelineStep, JobStatus } from '../types/pipeline';

const PIPELINE_STEPS: { key: PipelineStep; label: string }[] = [
  { key: 'STYLE', label: 'Style' },
  { key: 'CHARACTERS', label: 'Characters' },
  { key: 'PORTRAITS', label: 'Portraits' },
  { key: 'CHAPTERS', label: 'Chapters' },
  { key: 'ILLUSTRATIONS', label: 'Illustrations' },
];

interface PipelineStepperProps {
  currentStep: PipelineStep;
  status: JobStatus;
  mode?: 'active' | 'preview'; 
}

export const PipelineStepper = ({ currentStep, status, mode = 'active' }: PipelineStepperProps) => {
  let currentStepIndex = PIPELINE_STEPS.findIndex(s => s.key === currentStep);
  if (currentStep === 'INIT') currentStepIndex = -1; 
  
  const activeIndex = mode === 'preview' ? -1 : currentStepIndex + 1;
  return (
    <div className="flex items-center w-full">
      {PIPELINE_STEPS.map((step, index) => {
        const isCompleted = index < activeIndex || (index === activeIndex && status === 'COMPLETED');
        const isCurrent = index === activeIndex && status !== 'COMPLETED';
        const isLast = index === PIPELINE_STEPS.length - 1;
        const isLineOrange = isCompleted;

        return (
          <div key={step.key} className={`${isLast ? 'flex-none' : 'flex-1'} flex items-center`}>
            
            <div className="flex items-center gap-2.5 shrink-0">
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                isCompleted 
                  ? 'bg-[#1a1a1a] text-white' 
                  : isCurrent 
                  ? 'bg-[#ff6a00] text-white' 
                  : 'bg-[#9ca3af] text-white' 
              }`}>
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  index + 1
                )}
              </div>
              
              <span className={`text-[15px] font-semibold tracking-wide ${
                isCompleted || isCurrent ? 'text-[#1a1a1a]' : 'text-[#6b7280]'
              }`}>
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className={`flex-1 h-[2px] mx-4 transition-colors duration-300 ${
                isLineOrange ? 'bg-[#ff6a00]' : 'bg-[#e5e7eb]'
              }`}></div>
            )}
            
          </div>
        );
      })}
    </div>
  );
};