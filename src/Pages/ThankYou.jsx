import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../components/I18nProvider";
import TransText from "../components/TransText";

const ThankYouPage = () => {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
  <div className="flex justify-center mb-6" aria-hidden="true">
          <CheckCircle className="w-16 h-16 text-[#6366f1]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-gradient-to-r from-lighttext to-lightmuted">
          <TransText k="thankyou.title" fallback="Terima Kasih!" />
        </h1>
        <p className="dark:text-gray-400 text-lighttext/80 text-lg mb-8">
          <TransText k="thankyou.desc" fallback="Pesan Anda telah diterima. Saya akan membalas secepatnya." />
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3 dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#a855f7] bg-lightaccent text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#6366f1]/20 active:scale-[0.98]"
        >
          <TransText k="thankyou.backHome" fallback="Kembali ke Beranda" />
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;