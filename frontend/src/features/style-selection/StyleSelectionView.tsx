import type { ProjectDetail } from "../../types/pipeline";
import { useStyleSelectionController } from "./useStyleSelectionController";

interface StyleSelectionViewProps {
  project: ProjectDetail;
  onUpdateProject: (updatedProject: ProjectDetail) => void;
}

const PRESET_STYLES = [
  'Classic Watercolor',
  'Studio Ghibli Anime',
  'Dark Fantasy Digital Art',
  'Vintage Childrens Book Sketch',
  'Cyberpunk Neon'
];

export const StyleSelectionView = ({ project, onUpdateProject }: StyleSelectionViewProps) => {
  const { 
    register, 
    errors, 
    isProcessing, 
    submitHandler 
  } = useStyleSelectionController({ project, onUpdateProject });

  return (
    <form onSubmit={submitHandler} className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-[#1e293b] mb-2">
          Step 1: Define the Art Style
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Select a base aesthetic or describe your own. This style will be enforced across all portraits and chapter illustrations to maintain consistency.
        </p>

        <div className="space-y-6 max-w-2xl">
          {/* Quick Choose Combo Box */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Base Aesthetic
            </label>
            <div className="relative">
              <select
                {...register('presetStyle')}
                className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:border-[#ff6a00] focus:ring-4 focus:ring-[#ff6a00]/10 transition-all cursor-pointer shadow-sm"
              >
                <option value="None (Use Custom Description Below)">None (Use Custom Description Below)</option>
                {PRESET_STYLES.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.presetStyle && <span className="text-xs text-red-500 mt-1 block">{errors.presetStyle.message}</span>}
          </div>

          {/* Details Text Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Custom Style Description or Modifiers
            </label>
            <textarea
              {...register('customDetails')}
              placeholder="e.g., 'Oil painting, chiaroscuro lighting, highly detailed faces...' or 'Make it slightly darker'"
              className={`w-full h-32 px-4 py-3 bg-gray-50/50 border rounded-xl text-gray-800 text-sm leading-relaxed placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 resize-none ${
                errors.customDetails 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-[#ff6a00] focus:ring-[#ff6a00]/10'
              }`}
            />
            {errors.customDetails && <span className="text-xs text-red-500 mt-1 block">{errors.customDetails.message}</span>}
          </div>
        </div>

        {errors.root && (
          <div className="mt-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl max-w-2xl">
            {errors.root.message}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500">
          Next Phase: <span className="font-bold text-gray-800">Character Extraction</span>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="px-6 py-3 bg-[#1e293b] text-white font-semibold text-sm rounded-xl hover:bg-black disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
        >
          {isProcessing && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          )}
          {isProcessing ? 'Processing...' : 'Save Style & Continue'}
        </button>
      </div>
    </form>
  );
};