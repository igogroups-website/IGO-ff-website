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
  'nav.tagline': { en: 'Purely Organic', ta: 'முற்றிலும் இயற்கை', hi: 'शुद्ध जैविक' },
  'nav.profile': { en: 'My Profile', ta: 'என் சுயவிவரம்', hi: 'मेरी प्रोफाइल' },
  'nav.orders': { en: 'My Orders', ta: 'என் ஆர்டர்கள்', hi: 'मेरे आदेश' },
  'nav.addresses': { en: 'Saved Addresses', ta: 'சேமித்த முகவரிகள்', hi: 'सहेजे गए पते' },
  'nav.wallet': { en: 'FF Wallet', ta: 'எஃப்.எஃப் வாலட்', hi: 'एफएफ वॉलेट' },
  'nav.admin': { en: 'Admin Dashboard', ta: 'நிர்வாக டாஷ்போர்டு', hi: 'एडमिन डैशबोर्ड' },
  'nav.settings': { en: 'Settings', ta: 'அமைப்புகள்', hi: 'सेटिंग्स' },
  'nav.signout': { en: 'Sign Out', ta: 'வெளியேறு', hi: 'साइन आउट' },

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
  'products.hero.badge': { en: 'Premium Harvest Catalog', ta: 'பிரீமியம் அறுவடை பட்டியல்', hi: 'प्रीमियम फसल सूची' },
  'products.hero.title1': { en: 'Purely', ta: 'முற்றிலும்', hi: 'शुद्ध' },
  'products.hero.title2': { en: 'Organic', ta: 'இயற்கை', hi: 'जैविक' },
  'products.hero.title3': { en: 'Harvest', ta: 'அறுவடை', hi: 'फसल' },
  'products.hero.desc': { en: 'Experience the true taste of nature with our live products, harvested directly from our farms to your door.', ta: 'எங்கள் பண்ணைகளில் இருந்து நேரடியாக உங்கள் வீட்டு வாசலுக்கு அறுவடை செய்யப்பட்ட புதிய தயாரிப்புகளுடன் இயற்கையின் உண்மையான சுவையை அனுபவிக்கவும்.', hi: 'हमारे खेतों से सीधे आपके दरवाजे तक पहुंचाई गई ताजी फसलों के साथ प्रकृति के असली स्वाद का अनुभव करें।' },
  'products.certified.title': { en: 'Certified Quality', ta: 'சான்றளிக்கப்பட்ட தரம்', hi: 'प्रमाणित गुणवत्ता' },
  'products.certified.sub': { en: '100% Pesticide Free', ta: '100% பூச்சிக்கொல்லி இல்லாதது', hi: '100% कीटनाशक मुक्त' },
  'products.eco.title': { en: 'Eco Friendly', ta: 'சுற்றுச்சூழல் நட்பு', hi: 'पर्यावरण के अनुकूल' },
  'products.eco.sub': { en: 'Zero Waste Packaging', ta: 'பூஜ்ஜிய கழிவு பேக்கேஜிங்', hi: 'शून्य अपशिष्ट पैकेजिंग' },
  'products.sidebar.price': { en: 'Price Range', ta: 'விலை வரம்பு', hi: 'मूल्य सीमा' },
  'products.search.placeholder': { en: 'Search fresh products...', ta: 'புதிய தயாரிப்புகளைத் தேடுங்கள்...', hi: 'ताजे उत्पादों की खोज करें...' },
  'products.categories.seasonal': { en: 'Seasonal', ta: 'பருவகால', hi: 'मौसमी' },
  'products.categories.valluvam': { en: 'Valluvam Products', ta: 'வள்ளுவம் பொருட்கள்', hi: 'वल्लुवम उत्पाद' },
  
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
