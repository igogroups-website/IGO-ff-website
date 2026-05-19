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

  // Hero Slider
  'hero.guaranteed': { en: 'Premium Quality Guaranteed', ta: 'பிரீமியம் தரம் உத்திரவாதம்', hi: 'प्रीमियम गुणवत्ता की गारंटी' },
  'hero.permanent.title': { en: 'Farmers Factory', ta: 'ஃபார்மர்ஸ் ஃபேக்டரி', hi: 'फार्मर्स फैक्ट्री' },
  'hero.permanent.subtitle': { en: 'Direct from the fields to your home. Harvesting purity, delivering health within 24 hours.', ta: 'வயல்களில் இருந்து நேரடியாக உங்கள் வீட்டிற்கு. தூய்மையை அறுவடை செய்து, 24 மணி நேரத்திற்குள் ஆரோக்கியத்தை வழங்குதல்.', hi: 'खेतों से सीधे आपके घर तक। शुद्धता की कटाई, 24 घंटे के भीतर स्वास्थ्य पहुँचाना।' },
  'hero.permanent.cta': { en: 'Shop Fresh Harvest', ta: 'புதிய அறுவடையை வாங்குங்கள்', hi: 'ताज़ा फसल खरीदें' },
  'hero.fruits.title': { en: 'Pure Organic Fruits', ta: 'தூய இயற்கை பழங்கள்', hi: 'शुद्ध जैविक फल' },
  'hero.fruits.subtitle': { en: 'Taste the sweetness of nature with our hand-picked 3D organic fruits, delivered fresh within 24 hours.', ta: '24 மணி நேரத்திற்குள் புதியதாக விநியோகிக்கப்படும் எங்களின் கையால் தேர்ந்தெடுக்கப்பட்ட 3D இயற்கை பழங்களுடன் இயற்கையின் இனிமையை சுவையுங்கள்.', hi: '24 घंटे के भीतर ताजा वितरित किए गए हमारे चुनिंदा 3D जैविक फलों के साथ प्रकृति की मिठास का स्वाद लें।' },
  'hero.fruits.cta': { en: 'Shop Fruits', ta: 'பழங்கள் வாங்குங்கள்', hi: 'फल खरीदें' },
  'hero.valluvam.title': { en: 'Traditional Valluvam', ta: 'பாரம்பரிய வள்ளுவம்', hi: 'पारंपरिक वल्लुवम' },
  'hero.valluvam.subtitle': { en: 'Experience the purity of ancient traditions with our curated Valluvam collection.', ta: 'எங்களின் தேர்ந்தெடுக்கப்பட்ட வள்ளுவம் சேகரிப்புடன் பண்டைய மரபுகளின் தூய்மையை அனுபவிக்கவும்.', hi: 'हमारे क्यूरेटेड वल्लुवम संग्रह के साथ प्राचीन परंपराओं की शुद्धता का अनुभव करें।' },
  'hero.valluvam.cta': { en: 'Explore Valluvam', ta: 'வள்ளுவத்தை ஆராயுங்கள்', hi: 'वल्लुवम का पता लगाएं' },

  // Delivery Strip
  'strip.free_delivery': { en: 'Free Delivery on orders above ₹499', ta: '₹499க்கு மேல் ஆர்டர் செய்தால் இலவச டெலிவரி', hi: '₹499 से अधिक के ऑर्डर पर मुफ्त डिलीवरी' },
  'strip.farm_to_table': { en: 'Delivered from Farm to Table in 24h', ta: 'பண்ணையிலிருந்து நேரடியாக 24 மணிநேரத்தில்', hi: '24 घंटे में खेत से सीधे मेज तक' },
  'strip.no_chemical': { en: 'No Chemical Ripening • Pure Organic', ta: 'ரசாயன பழுக்க வைப்பு இல்லை • முற்றிலும் இயற்கை', hi: 'कोई रासायनिक पकाना नहीं • शुद्ध जैविक' },
  'strip.zero_waste': { en: 'Zero Waste Packaging', ta: 'பூஜ்ஜிய கழிவு பேக்கேஜிங்', hi: 'शून्य अपशिष्ट पैकेजिंग' },

  // Featured Categories
  'categories.curated': { en: 'Curated Collections', ta: 'பிரத்தியேக தொகுப்புகள்', hi: 'विशेष संग्रह' },
  'categories.best_of': { en: "The Best of Nature's Harvest", ta: 'சிறந்த இயற்கையின் அறுவடை', hi: 'सर्वश्रेष्ठ प्रकृति की फसल' },
  'categories.desc': { en: 'Sustainably grown, hand-picked, and delivered with love from our farms to your doorstep within 24 hours.', ta: 'நிலையான முறையில் வளர்க்கப்பட்டு, கையால் தேர்ந்தெடுக்கப்பட்டு, எங்களின் பண்ணைகளிலிருந்து உங்கள் வீட்டு வாசலுக்கு 24 மணி நேரத்திற்குள் அன்புடன் விநியோகிக்கப்படுகிறது.', hi: 'टिकाऊ रूप से उगाया गया, हाथ से चुना गया, और हमारे खेतों से 24 घंटे के भीतर आपके दरवाजे तक प्यार से पहुँचाया गया।' },
  'categories.veg_count': { en: '20+ Varieties', ta: '20+ வகைகள்', hi: '20+ किस्में' },
  'categories.fruit_count': { en: '15+ Varieties', ta: '15+ வகைகள்', hi: '15+ किस्में' },
  'categories.val_count': { en: '10+ Essentials', ta: '10+ அத்தியாவசியங்கள்', hi: '10+ आवश्यक वस्तुएं' },

  // Featured Products
  'products.today_selection': { en: "Today's Selection", ta: 'இன்றைய தேர்வு', hi: 'आज का चयन' },
  'products.freshly_harvested': { en: 'Freshly Harvested', ta: 'புதிய அறுவடை', hi: 'ताज़ा कटी फसल' },
  'products.view_catalog': { en: 'View Full Catalog', ta: 'முழு பட்டியலையும் காண்க', hi: 'पूरा कैटलॉग देखें' },
  'products.loading': { en: "Gathering today's harvest...", ta: 'இன்றைய அறுவடையை சேகரிக்கிறது...', hi: 'आज की फसल इकट्ठी की जा रही है...' },

  // Why Choose Us
  'why.badge': { en: 'The Farmers Factory Difference', ta: 'ஃபார்மர்ஸ் ஃபேக்டரி வேறுபாடு', hi: 'फार्मर्स फैक्ट्री का अंतर' },
  'why.title': { en: 'Why We Are Better', ta: 'ஏன் நாங்கள் சிறந்தவர்கள்', hi: 'हम क्यों बेहतर हैं' },
  'why.desc': { en: 'We are not just a marketplace; we are a direct bridge between the soil and your soul.', ta: 'நாங்கள் வெறும் சந்தை அல்ல; மண்ணுக்கும் உங்கள் மனதுக்கும் இடையே ஒரு நேரடிப் பாலம்.', hi: 'हम केवल एक बाज़ार नहीं हैं; हम मिट्टी और आपकी आत्मा के बीच एक सीधा सेतु हैं।' },
  'why.organic.title': { en: '100% Organic', ta: '100% இயற்கை', hi: '100% जैविक' },
  'why.organic.desc': { en: 'Grown using traditional Vedic methods without any synthetic pesticides or fertilizers.', ta: 'செயற்கை பூச்சிக்கொல்லிகள் அல்லது உரங்கள் இல்லாமல் பாரம்பரிய வேத முறைகளைப் பயன்படுத்தி வளர்க்கப்படுகிறது.', hi: 'बिना किसी सिंथेटिक कीटनाशकों या उर्वरकों के पारंपरिक वैदिक तरीकों से उगाया गया।' },
  'why.delivery.title': { en: '24h Farm-to-Home', ta: '24 மணிநேர பண்ணை-வீடு', hi: '24 घंटे में खेत से घर' },
  'why.delivery.desc': { en: 'Harvested at dawn and delivered to your kitchen by dusk for maximum nutrient retention.', ta: 'அதிகபட்ச ஊட்டச்சத்து தக்கவைப்புக்காக அதிகாலையில் அறுவடை செய்யப்பட்டு அந்தி வேளையில் உங்கள் சமையலறைக்கு வழங்கப்படுகிறது.', hi: 'अधिकतम पोषक तत्वों के संरक्षण के लिए सुबह तड़के काटा गया और शाम तक आपकी रसोई तक पहुँचाया गया।' },
  'why.trace.title': { en: 'Traceable Origin', ta: 'கண்டுபிடிக்கக்கூடிய தோற்றம்', hi: 'पता लगाने योग्य मूल' },
  'why.trace.desc': { en: 'Scan any product to see exactly which farm it came from and when it was harvested.', ta: 'எந்தவொரு தயாரிப்பையும் ஸ்கேன் செய்து அது எந்தப் பண்ணையிலிருந்து வந்தது, எப்போது அறுவடை செய்யப்பட்டது என்பதைத் துல்லியமாகப் பார்க்கவும்.', hi: 'यह देखने के लिए किसी भी उत्पाद को स्कैन करें कि यह किस खेत से आया है और इसे कब काटा गया था।' },
  'why.farmer.title': { en: 'Farmer First', ta: 'விவசாயிக்கு முதலிடம்', hi: 'किसान पहले' },
  'why.farmer.desc': { en: 'Direct-to-consumer model ensuring fair pricing for our farmers and better value for you.', ta: 'எங்கள் விவசாயிகளுக்கு நியாயமான விலையையும் உங்களுக்கு சிறந்த மதிப்பையும் உறுதி செய்யும் நேரடி நுகர்வோர் மாதிரி.', hi: 'सीधे उपभोक्ता तक पहुँचने वाला मॉडल जिससे हमारे किसानों को उचित मूल्य और आपको बेहतर मूल्य मिले।' },

  // Farm Stories
  'stories.badge': { en: 'Live from the farm', ta: 'பண்ணையிலிருந்து நேரடி', hi: 'खेत से लाइव' },
  'stories.title': { en: 'Farm Stories', ta: 'பண்ணை கதைகள்', hi: 'खेत की कहानियाँ' },
  'stories.desc': { en: "Watch authentic moments directly from our farmers' fields.", ta: 'எங்கள் விவசாயிகளின் வயல்களில் இருந்து நேரடியாக உண்மையான தருணங்களைப் பாருங்கள்.', hi: 'हमारे किसानों के खेतों से सीधे वास्तविक पलों को देखें।' },

  // Live Streams
  'streams.badge': { en: '24/7 Live Transparency', ta: '24/7 நேரடி வெளிப்படைத்தன்மை', hi: '24/7 लाइव पारदर्शिता' },
  'streams.title': { en: 'WATCH YOUR HARVEST GROW', ta: 'உங்கள் அறுவடை வளர்வதைப் பாருங்கள்', hi: 'अपनी फसल को बढ़ते हुए देखें' },
  'streams.desc': { en: 'Real-time high-definition streams from our organic plots. Total transparency from soil to basket.', ta: 'எங்கள் இயற்கை திட்டுகளிலிருந்து நிகழ்நேர உயர் வரையறை நீரோடைகள். மண்ணிலிருந்து கூடை வரை முழு வெளிப்படைத்தன்மை.', hi: 'हमारे जैविक भूखंडों से वास्तविक समय की हाई-डेफिनिशन स्ट्रीम। मिट्टी से टोकरी तक पूर्ण पारदर्शिता।' },
  'streams.watching': { en: 'WATCHING', ta: 'பார்க்கிறார்கள்', hi: 'देख रहे हैं' },
  'streams.temp': { en: 'TEMP', ta: 'வெப்பநிலை', hi: 'तापमान' },
  'streams.humidity': { en: 'HUMIDITY', ta: 'ஈரப்பதம்', hi: 'आर्द्रता' },
  'streams.wind': { en: 'WIND', ta: 'காற்று', hi: 'हवा' },
  'streams.irrigation': { en: 'AUTO-IRRIGATION: ACTIVE', ta: 'தானியங்கி பாசனம்: செயலில்', hi: 'ऑटो-सिंचाई: सक्रिय' },

  // Footer
  'footer.basket_title_single': { en: 'You have 1 item ready for harvest', ta: 'உங்களிடம் 1 பொருள் அறுவடைக்கு தயாராக உள்ளது', hi: 'आपके पास कटाई के लिए 1 वस्तु तैयार है' },
  'footer.basket_title_plural': { en: 'You have {count} items ready for harvest', ta: 'உங்களிடம் {count} பொருட்கள் அறுவடைக்கு தயாராக உள்ளன', hi: 'आपके पास कटाई के लिए {count} वस्तुएं तैयार हैं' },
  'footer.basket_value': { en: 'Total Basket Value:', ta: 'மொத்த கூடை மதிப்பு:', hi: 'कुल टोकरी मूल्य:' },
  'footer.checkout': { en: 'Buy Now / Checkout', ta: 'இப்போது வாங்குங்கள் / செக்அவுட்', hi: 'अभी खरीदें / चेकआउट' },
  'footer.desc': { en: 'Bringing the goodness of nature directly to your doorstep. Organic, fresh, and sustainable harvest for your family.', ta: 'இயற்கையின் நன்மைகளை நேரடியாக உங்கள் வீட்டு வாசலுக்குக் கொண்டு சேர்ப்பது. உங்கள் குடும்பத்திற்கு கரிம, புதிய மற்றும் நிலையான அறுவடை.', hi: 'प्रकृति की अच्छाइयों को सीधे आपके दरवाजे तक पहुँचाना। आपके परिवार के लिए जैविक, ताजी और टिकाऊ फसल।' },
  'footer.copyright': { en: 'CULTIVATING HEALTH, HARVESTING HAPPINESS.', ta: 'ஆரோக்கியத்தை பயிரிட்டு, மகிழ்ச்சியை அறுவடை செய்கிறோம்.', hi: 'स्वास्थ्य की खेती, खुशी की कटाई।' },
  'footer.items_in_basket': { en: 'Items in your basket', ta: 'உங்கள் கூடையில் உள்ள பொருட்கள்', hi: 'आपकी टोकरी में वस्तुएं' }
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
