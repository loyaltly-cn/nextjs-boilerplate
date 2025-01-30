'use client'
import { useLanguage } from '@/app/language';

export default function Settings() {
  const { language, setLanguage, translations } = useLanguage();
  const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'zn' : 'en');
};
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#E6E1E5] mb-4 text-center">Settings</h1>
      <div onClick={toggleLanguage}>change{translations.language}</div>
    </div>
  )
} 