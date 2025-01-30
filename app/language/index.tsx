'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import en from './en';
import zn from './zn';

// 使用索引签名来定义不确定的翻译字段
interface Translations {
  [key: string]: any; // 允许任意键，值可以是任何类型
}

type Language = 'en' | 'zn';

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const translations: Translations = language === 'en' ? en : zn;

  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};