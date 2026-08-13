import type { Chapter } from "../types/pipeline";

interface ChapterCardProps {
  chapter: Chapter;
}

export const ChapterCard = ({ chapter }: ChapterCardProps) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-[1.25rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-hidden h-[440px] group">
      
      <div className="flex-1 bg-[#fafafa] flex items-center justify-center relative overflow-hidden group-hover:bg-gray-50 transition-colors border-b border-gray-100">
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
      
      <div className="p-5 border-t border-gray-100 bg-white h-[140px] flex flex-col justify-start shrink-0">
        <h3 className="text-[16px] font-extrabold text-gray-900 mb-1.5 line-clamp-1">
          Chapter {chapter.chapterNumber}
        </h3>
        
        <p 
          title={chapter.contentSummary ?? undefined} 
          className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 cursor-help transition-colors hover:text-gray-800"
        >
          <span className="font-semibold text-gray-700">Scene Prompt:</span> {chapter.contentSummary}
        </p>
      </div>
      
    </div>
  );
};