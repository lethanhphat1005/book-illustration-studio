import { InputField } from '../../components/InputField';

import { useLoginController } from './useLoginController';

export const LoginForm = () => {

  const { register, errors, isSubmitting, submitHandler } = useLoginController();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-mesh-light from-purple-100 via-slate-50 to-orange-50">
      
      <div className="w-full max-w-md relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-purple-500 rounded-[2rem] blur opacity-20"></div>
        
        <div className="relative bg-studio-glass backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 sm:p-10 border border-white/50">
          
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100/50 border border-orange-200/50 text-studio-orange text-xs font-bold tracking-widest uppercase mb-4">
              Creator's Space
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 mb-2">
              Book Illustration
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Where your imagination takes shape.
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-2">
            <InputField
              label="Full Name"
              placeholder="e.g., Jane Doe"
              registration={register('fullName')}
              error={errors.fullName}
            />

            <InputField
              label="Email Address"
              type="email"
              placeholder="hello@example.com"
              registration={register('email')}
              error={errors.email}
            />

            {errors.root && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting} 
              className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-900 shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50 mt-6"
            >
              {isSubmitting ? 'Connecting...' : 'Start Creating'} <span>→</span>
            </button>

            <p className="mt-6 text-xs text-center text-gray-600 leading-relaxed px-4">
              No passwords to remember. Simply enter your email to open a new canvas or seamlessly resume exactly where you left off.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};