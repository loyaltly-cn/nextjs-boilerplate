'use client'
import { useLanguage } from '@/app/language';

export default function ChangeLanguage() {
    const { language, setLanguage, translations } = useLanguage();

    const toggleLanguage = () => {
      setLanguage(language === 'en' ? 'zn' : 'en');

};
    return (
        <div className="fixed right-0 bottom-0">
            <button onClick={toggleLanguage}>{translations.language}</button>
        </div>
    )


}
