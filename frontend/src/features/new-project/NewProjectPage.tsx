import { Header } from '../../components/Header';
import { InputField } from '../../components/InputField';
import { PipelineStepper } from '../../components/PipelineStepper';
import { useNewProjectController } from './useNewProjectController';

export const NewProjectPage = () => {
  const { 
    register, 
    errors, 
    fileError, 
    isSubmitting, 
    handleFileUpload, 
    submitHandler,
    navigate 
  } = useNewProjectController();

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col">
        
        {/* Header */}
        <div className="mb-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6 group w-fit"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span> 
            Back to dashboard
          </button>
          
          <h1 className="text-[2.25rem] font-extrabold text-gray-900 tracking-tight mb-3">
            Create New Project
          </h1>
          <p className="text-base text-gray-500 max-w-3xl">
            Upload your book's text to initialize the illustration pipeline. The AI will process your story through the phases below.
          </p>
        </div>

        {/* Pipeline Stepper */}
        <div className="mb-14">
          <PipelineStepper currentStep="INIT" status="IDLE" mode="preview" />
        </div>

        {/* Form */}
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-[1.25rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <form onSubmit={submitHandler} className="p-8 sm:p-10">
              
              <div className="mb-10">
                <InputField
                  label="Project Title"
                  placeholder="e.g., Harry Potter"
                  required={true}
                  registration={register('title')}
                  error={errors.title}
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-900">
                    Source Material <span className="text-[#ff6a00]">*</span>
                  </label>
                  <span className="text-xs text-gray-400 font-medium">Max 10MB .txt file</span>
                </div>
                
                {/* Upload Box */}
                <div className="mb-2">
                  <label 
                    htmlFor="file-upload"
                    className="group flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-orange-50/50 hover:border-[#ff6a00]/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100 group-hover:border-orange-200 transition-colors">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#ff6a00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[15px] text-gray-700 font-semibold group-hover:text-[#ff6a00] transition-colors">
                          Click to upload .txt file
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">Or drag and drop it here</p>
                      </div>
                    </div>
                    <input 
                      id="file-upload"
                      type="file" 
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {fileError && <span className="text-xs text-red-500 mt-2 flex items-center gap-1 font-medium">⚠ {fileError}</span>}
                </div>

                {/* Text Area */}
                <div className="relative mt-2">
                  <textarea
                    {...register('bookText')}
                    placeholder="Or paste the book text here directly..."
                    className={`w-full h-[320px] px-6 py-5 bg-gray-50/40 border rounded-xl text-gray-700 text-[15px] leading-relaxed placeholder-gray-400 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 resize-none ${
                      errors.bookText 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-[#ff6a00] focus:ring-[#ff6a00]/20'
                    }`}
                  />
                  {errors.bookText && (
                    <span className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium">
                      {errors.bookText.message}
                    </span>
                  )}
                </div>
              </div>

              {errors.root && (
                <div className="mt-8 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                  {errors.root.message}
                </div>
              )}

              {/* Action Button */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#1a1a1a] text-white font-semibold text-[15px] rounded-xl hover:bg-black shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2.5 group"
                >
                  {isSubmitting ? (
                    'Initializing...'
                  ) : (
                    <>
                      Start Pipeline 
                      <svg className="w-4 h-4 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </button>
              </div>
              
            </form>
          </div>
        </div>

      </main>
    </div>
  );
};