import { ChapterCard } from "../../components/ChapterCard";
import { CharacterCard } from "../../components/CharacterCard";
import type { ProjectDetail } from "../../types/pipeline";
import { useIllustrationsController } from "./useIllustrationsController";

interface IllustrationsViewProps {
  project: ProjectDetail;
  onUpdateProject: (updatedProject: ProjectDetail) => void;
}

export const IllustrationsView = ({ project, onUpdateProject }: IllustrationsViewProps) => {
  const {
    chapters,
    isProcessing,
    error,
    handleGenerateIllustrations,
  } = useIllustrationsController({ project, onUpdateProject });

  const isProjectDone = project.status === 'COMPLETED';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1">
        <h2 className="text-[1.5rem] font-extrabold text-gray-900 tracking-tight mb-2">
          Step 5: Illustrate Scenes
        </h2>
        <p className="text-[15px] text-gray-500 mb-6 max-w-3xl leading-relaxed">
          This is the final magic trick. The AI will take the scene prompt and combine it with your character portraits to paint a beautiful, consistent final illustration.
        </p>

        {chapters.length > 0 ? (
          <div className="mt-8 max-w-3xl relative">
            {chapters.map((chap) => (
              <div key={chap.id} className="relative mb-8">
                <ChapterCard chapter={chap} />
                
                {/* Generation Overlay */}
                {isProcessing && !chap.illustrationUrl && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[1.25rem] flex flex-col items-center justify-center z-20">
                        <div className="w-10 h-10 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin mb-3"></div>
                        <span className="text-sm font-bold text-gray-800 tracking-wide">Painting the scene...</span>
                    </div>
                )}
              </div>
            ))}
            
            {/* Display Character Portraits below the Chapter Scene */}
            {project.characters && project.characters.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Featured Cast in this Scene</h3>
                <p className="text-sm text-gray-500 mb-6">
                  These portraits were used as reference for the final illustration generation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                  {project.characters.map((char) => (
                    <div key={char.id} className="opacity-100 transition-opacity">
                      <CharacterCard char={char} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] border-2 border-dashed border-gray-200 rounded-[1.25rem] bg-gray-50/50 mt-8 max-w-3xl">
            <p className="text-gray-400 font-medium text-[15px]">No scenes available to illustrate.</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl max-w-2xl">
            {error}
          </div>
        )}
      </div>

      {!isProjectDone ? (
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
          <div className="text-[15px] font-bold text-gray-800">
            Project Complete
          </div>

          <button
            onClick={handleGenerateIllustrations}
            disabled={isProcessing}
            className="px-8 py-3.5 bg-[#1a1a1a] text-white font-semibold text-[15px] rounded-xl hover:bg-black shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2.5 group"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Painting...
              </>
            ) : (
              <>
                Generate Illustration
                <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="bg-green-50 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 w-full justify-center shadow-sm border border-green-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-bold text-[15px]">Project Completed! All illustrations have been successfully generated.</span>
            </div>
        </div>
      )}
    </div>
  );
};