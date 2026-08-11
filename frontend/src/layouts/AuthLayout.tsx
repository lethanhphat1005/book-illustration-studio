import React from 'react';

export const AuthLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};