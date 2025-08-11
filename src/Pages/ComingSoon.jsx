import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function ComingSoon() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] dark:bg-[#030014] dark:text-gray-100 transition-colors duration-500 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 ring-2 ring-gray-200 dark:ring-gray-700">
            <div className="text-6xl">⏳</div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">Segera Hadir</h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
            Halaman ini sedang disiapkan. Konten lengkap akan menyusul.
          </p>
        </div>

        {/* Action Buttons (same as 404) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home size={20} />
            Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
