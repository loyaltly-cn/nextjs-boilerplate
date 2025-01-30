'use client'

import { useLanguage } from '@/app/language';

export default function LanguageWrapper({
  children,
  className
}: {
  children: React.ReactNode;
  className: string;
}) {
  const { translations } = useLanguage();
  
  return (
    <body className={`${className} ${translations.language === 'EN' ? '' : 'en-text'}`}>
      {children}
    </body>
  );
} 