import type { Character } from "../types/pipeline";

interface CharacterCardProps {
  char: Character;
}

export const CharacterCard = ({ char }: CharacterCardProps) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-[1.25rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow overflow-hidden h-[420px] group">
      
      <div className="flex-1 bg-[#fafafa] flex items-center justify-center relative overflow-hidden group-hover:bg-gray-50 transition-colors">
        {char.portraitUrl ? (
          <img 
            src={char.portraitUrl} 
            alt={char.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">
            Not Generated
          </span>
        )}
      </div>
      
      <div className="p-6 border-t border-gray-100 bg-white h-[150px] flex flex-col justify-start">
        <h3 className="text-[17px] font-extrabold text-gray-900 mb-2 line-clamp-1">
          {char.name}
        </h3>
        <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-3">
          {char.description}
        </p>
      </div>
      
    </div>
  );
};