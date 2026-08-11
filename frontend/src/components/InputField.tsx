import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean; // Thêm cờ required
}

export const InputField = ({ label, type = 'text', placeholder, registration, error, required }: InputFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="text-sm font-semibold text-gray-800">
        {label} {required && <span className="text-[#ff6a00]">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`px-4 py-2.5 border rounded-lg text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 ${
          error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
            : 'border-gray-200 focus:border-[#ff6a00] focus:ring-[#ff6a00]/20'
        }`}
      />
      {error && <span className="text-xs text-red-500 mt-1 font-medium">{error.message}</span>}
    </div>
  );
};