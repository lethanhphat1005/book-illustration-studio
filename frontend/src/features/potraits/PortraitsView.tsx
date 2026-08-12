import { CharacterCard } from "../../components/CharacterCard";
import type { ProjectDetail } from "../../types/pipeline";
import { usePortraitsController } from "./usePortraitsController";

interface PortraitsViewProps {
  project: ProjectDetail;
  onUpdateProject: (updatedProject: ProjectDetail) => void;
}

export const PortraitsView = ({ project, onUpdateProject }: PortraitsViewProps) => {
  const { 
    characters,
    isProcessing, 
    error, 
    handleGeneratePortraits 
  } = usePortraitsController({ project, onUpdateProject });

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1">
        <h2 className="text-[1.5rem] font-extrabold text-gray-900 tracking-tight mb-2">
          Step 3: Generate Portraits
        </h2>
        <p className="text-[15px] text-gray-500 mb-6 max-w-3xl leading-relaxed">
          The AI will now bring your cast to life visually. It uses the descriptions extracted in the previous step and applies your chosen art style to create unique portraits.
        </p>
        
        {/* List of characters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {characters.map((char) => (
                <div key={char.id} className="relative">
                    <CharacterCard char={char} />
                    {isProcessing && !char.portraitUrl && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[1.25rem] flex flex-col items-center justify-center z-20">
                            <div className="w-10 h-10 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin mb-3"></div>
                            <span className="text-sm font-bold text-gray-800 tracking-wide">Painting...</span>
                        </div>
                    )}
                </div>
            ))}
        </div>

        {error && (
          <div className="mt-8 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl max-w-2xl">
            {error}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
        <div className="text-[15px] font-medium text-gray-500">
          Next Phase: <span className="font-bold text-[#1a1a1a]">Generate Chapters</span>
        </div>
        
        <button
          onClick={handleGeneratePortraits}
          disabled={isProcessing}
          className="px-8 py-3.5 bg-[#1a1a1a] text-white font-semibold text-[15px] rounded-xl hover:bg-black shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2.5 group"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Art...
            </>
          ) : (
            <>
              Generate Portraits
              <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};