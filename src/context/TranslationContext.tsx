'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ta' | 'hi';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  // Navbar
  'nav.products': { en: 'Products', ta: 'தயாரிப்புகள்', hi: 'उत्पाद' },
  'nav.about': { en: 'About Us', ta: 'எங்களைப் பற்றி', hi: 'हमारे बारे में' },
  'nav.contact': { en: 'Contact', ta: 'தொடர்பு', hi: 'संपर्क' },
  'nav.login': { en: 'Login', ta: 'உள்நுழை', hi: 'लॉगिन' },
  'nav.search': { en: 'Search for fresh harvest...', ta: 'புதிய அறுவடையைத் தேடுங்கள்...', hi: 'ताज़ा फसल खोजें...' },
  
  // Hero
  'hero.title': { en: 'Freshness Delivered', ta: 'புத்துணர்ச்சி விநியோகிக்கப்பட்டது', hi: 'ताजगी पहुंचाई गई' },
  'hero.subtitle': { en: 'From our farms to your doorstep in 24 hours.', ta: 'எங்கள் பண்ணைகளில் இருந்து உங்கள் வீட்டு வாசலுக்கு 24 மணிநேரத்தில்.', hi: 'हमारे खेतों से आपके घर तक 24 घंटों में।' },
  'hero.cta': { en: 'Shop Now', ta: 'இப்போது வாங்குங்கள்', hi: 'अभी खरीदें' },
  
  // Products
  'products.title': { en: 'Our Harvest', ta: 'எங்கள் அறுவடை', hi: 'हमारी फसल' },
  'products.filter': { en: 'Filter', ta: 'வடிகட்டி', hi: 'फिल्टर' },
  'products.categories': { en: 'Categories', ta: 'வகைகள்', hi: 'श्रेणियाँ' },
  'products.all': { en: 'All', ta: 'அனைத்தும்', hi: 'सब' },
  'products.fruits': { en: 'Fruits', ta: 'பழங்கள்', hi: 'फल' },
  'products.vegetables': { en: 'Vegetables', ta: 'காய்கறிகள்', hi: 'सब्जियाँ' },
  
  // AI Assistant
  'ai.title': { en: 'Farm AI Guru', ta: 'பண்ணை AI குரு', hi: 'फार्म एआई गुरु' },
  'ai.ask': { en: 'Ask me anything...', ta: 'எது வேண்டுமானாலும் கேளுங்கள்...', hi: 'मुझसे कुछ भी पूछें...' },
  'ai.identify': { en: 'Identifying produce...', ta: 'தயாரிப்பை அடையாளம் காண்கிறது...', hi: 'उत्पाद की पहचान कर रहा है...' },
};

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Persist language preference
  useEffect(() => {
    const saved = localStorage.getItem('ff_language') as Language;
    if (saved) setLanguage(saved);
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ff_language', lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within TranslationProvider');
  return context;
};
