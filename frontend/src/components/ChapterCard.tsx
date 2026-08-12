import type { Chapter } from "../types/pipeline";

interface ChapterCardProps {
  chapter: Chapter;
}

export const ChapterCard = ({ chapter }: ChapterCardProps) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-[1.25rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-hidden group">
      
      <div className="w-full aspect-[16/10] bg-[#fafafa] flex items-center justify-center relative overflow-hidden group-hover:bg-gray-50 transition-colors border-b border-gray-100">
        {chapter.illustrationUrl ? (
          <img 
            src={chapter.illustrationUrl} 
            alt={`Illustration for Chapter ${chapter.chapterNumber}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase bg-white/60 px-3 py-1 rounded-full">
            Scene Illustration Not Generated
          </span>
        )}
      </div>
      
      {/* Chapter Information & Prompt */}
      <div className="p-6 bg-white flex flex-col justify-start">
        <h3 className="text-[17px] font-extrabold text-gray-900 mb-2">
          Chapter {chapter.chapterNumber}
        </h3>
        <p className="text-[14px] text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">Scene Prompt:</span> {chapter.contentSummary}
        </p>
      </div>
      
    </div>
  );
};