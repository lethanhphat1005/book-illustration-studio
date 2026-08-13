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
        const isCompleted = index < activeIndex || (index === activeIndex && status === 'COMPLETED' || status === 'SUCCESS');
        const isCurrent = index === activeIndex && !isCompleted;
        const isFailed = isCurrent && status === 'FAILED';
        const isRunning = isCurrent && status === 'RUNNING';
        const isLast = index === PIPELINE_STEPS.length - 1;
        
        // Đường nối sẽ sáng lên nếu bước hiện tại đã xong
        const isLineActive = isCompleted;

        return (
          <div key={step.key} className={`${isLast ? 'flex-none' : 'flex-1'} flex items-center`}>
            
            <div className="flex items-center gap-3 shrink-0 relative group">
              
              {/* Hiệu ứng tỏa sáng (Glow) chớp tắt liên tục cho bước đang chạy */}
              {isRunning && (
                <div className="absolute inset-0 bg-studio-orange rounded-full blur-md animate-ping opacity-30"></div>
              )}

              {/* Vòng tròn trung tâm */}
              <div className={`relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 shadow-sm z-10
                ${isCompleted 
                  ? 'bg-gradient-to-br from-studio-orange to-studio-rose text-white shadow-[0_4px_15px_rgba(244,63,94,0.3)]' 
                  : isFailed
                  ? 'bg-red-500 text-white ring-4 ring-red-500/20 shadow-[0_4px_15px_rgba(239,68,68,0.4)]'
                  : isRunning 
                  ? 'bg-white text-studio-orange border-2 border-studio-orange ring-4 ring-studio-orange/20 shadow-[0_4px_15px_rgba(255,106,0,0.4)]' 
                  : 'bg-gray-100 text-gray-400 border border-gray-200' 
                }`}>
                
                {isCompleted ? (
                  // Icon Check mượt mà hơn
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : isFailed ? (
                  // Icon X cho trạng thái lỗi
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Nhãn văn bản (Label) */}
              <span className={`text-[14px] font-bold tracking-wide transition-colors duration-300 ${
                isCompleted 
                  ? 'text-gray-900' 
                  : isFailed
                  ? 'text-red-600'
                  : isRunning
                  ? 'text-studio-orange'
                  : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 h-[3px] mx-4 rounded-full overflow-hidden bg-gray-100">
                 <div className={`h-full transition-all duration-1000 ease-in-out ${
                   isLineActive ? 'w-full bg-gradient-to-r from-studio-orange to-studio-rose' : 'w-0'
                 }`}></div>
              </div>
            )}
            
          </div>
        );
      })}
    </div>
  );
};