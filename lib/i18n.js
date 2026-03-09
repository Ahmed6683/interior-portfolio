// lib/i18n.js
export const translations = {
  en: {
    dir: "ltr", lang: "en",
    nav: { home: "Home", about: "About", portfolio: "Portfolio", contact: "Contact", admin: "Admin" },
    hero: {
      greeting:    "Welcome to my world of",
      cta:         "View Portfolio",
      cta2:        "Get in Touch",
    },
    about: {
      sectionLabel: "About Me",
      title:        "Crafting Spaces That Tell Your Story",
      defaultBio1:  "With over a decade of experience in luxury interior design, I specialize in creating environments that seamlessly blend aesthetics with functionality.",
      defaultBio2:  "My philosophy is rooted in the belief that a well-designed space has the power to transform not just a room, but an entire way of life.",
      stats: { projects: "Projects Completed", years: "Years of Experience", awards: "Design Awards", clients: "Happy Clients" },
    },
    portfolio: {
      sectionLabel: "Portfolio",
      title:        "Selected Works",
      subtitle:     "A curated collection of spaces designed to inspire",
      all:          "All",
      residential:  "Residential",
      commercial:   "Commercial",
      hospitality:  "Hospitality",
    },
    beforeAfter: {
      sectionLabel: "Transformation",
      title:        "Vision to Reality",
      subtitle:     "Drag the slider to compare the 3D concept render with the final executed space",
      before:       "Concept",
      after:        "Reality",
    },
    contact: { whatsapp: "Chat on WhatsApp" },
    admin: {
      login:    { title: "Admin Login", subtitle: "Sign in to manage your portfolio", email: "Email Address", password: "Password", button: "Sign In", error: "Invalid credentials. Please try again." },
      dashboard:{ title: "Dashboard", gallery: "Gallery", content: "Edit Content", settings: "Settings", logout: "Sign Out" },
      gallery:  { title: "Gallery Manager", upload: "Upload Image", delete: "Delete", category: "Category", titleEn: "Title (EN)", titleAr: "Title (AR)", saving: "Saving…", save: "Save", uploadHint: "Drag & drop images or browse", uploadSub: "JPG · PNG · WEBP · Max 10 MB" },
      content:  { title: "Edit Site Content", heroSection: "Hero Section", aboutSection: "About Section", heroNameEn: "Designer Name (EN)", heroNameAr: "Designer Name (AR)", heroHeadlineEn: "Headline (EN)", heroHeadlineAr: "Headline (AR)", heroDescEn: "Subheadline (EN)", heroDescAr: "Subheadline (AR)", bio1En: "Bio Paragraph 1 (EN)", bio1Ar: "Bio Paragraph 1 (AR)", bio2En: "Bio Paragraph 2 (EN)", bio2Ar: "Bio Paragraph 2 (AR)", save: "Save Changes", saved: "Saved!" },
      settings: { title: "Settings", whatsapp: "WhatsApp Number", showBtn: "Show WhatsApp Button", save: "Save Settings", saved: "Settings Saved!", hint: "Include country code, no spaces or dashes" },
    },
  },
  ar: {
    dir: "rtl", lang: "ar",
    nav: { home: "الرئيسية", about: "عني", portfolio: "أعمالي", contact: "تواصل", admin: "الإدارة" },
    hero: {
      greeting:    "مرحباً بك في عالم",
      cta:         "استعرض الأعمال",
      cta2:        "تواصل معي",
    },
    about: {
      sectionLabel: "نبذة عني",
      title:        "أصنع فضاءات تروي قصتك",
      defaultBio1:  "بخبرة تمتد لأكثر من عقد في التصميم الداخلي الفاخر، أتخصص في خلق بيئات تمزج بسلاسة بين الجماليات والوظيفة.",
      defaultBio2:  "فلسفتي متجذرة في الإيمان بأن المساحة المصممة جيدًا لها القدرة على تحويل أسلوب حياة كامل.",
      stats: { projects: "مشروع مكتمل", years: "سنوات من الخبرة", awards: "جوائز تصميمية", clients: "عميل سعيد" },
    },
    portfolio: {
      sectionLabel: "الأعمال",
      title:        "أعمال مختارة",
      subtitle:     "مجموعة منتقاة من الفضاءات المصممة لتُلهم",
      all:          "الكل",
      residential:  "سكني",
      commercial:   "تجاري",
      hospitality:  "ضيافة",
    },
    beforeAfter: {
      sectionLabel: "التحول",
      title:        "من الرؤية إلى الواقع",
      subtitle:     "اسحب المتزلج لمقارنة التصميم ثلاثي الأبعاد مع الفضاء المنفذ فعلياً",
      before:       "التصور",
      after:        "الواقع",
    },
    contact: { whatsapp: "تحدث عبر واتساب" },
    admin: {
      login:    { title: "تسجيل الدخول", subtitle: "سجّل دخولك لإدارة ملفك الشخصي", email: "البريد الإلكتروني", password: "كلمة المرور", button: "دخول", error: "بيانات غير صحيحة. حاول مرة أخرى." },
      dashboard:{ title: "لوحة التحكم", gallery: "المعرض", content: "تعديل المحتوى", settings: "الإعدادات", logout: "تسجيل الخروج" },
      gallery:  { title: "إدارة المعرض", upload: "رفع صورة", delete: "حذف", category: "الفئة", titleEn: "العنوان (إنجليزي)", titleAr: "العنوان (عربي)", saving: "جارٍ الحفظ…", save: "حفظ", uploadHint: "اسحب وأفلت الصور أو تصفح", uploadSub: "JPG · PNG · WEBP · الحد الأقصى 10 ميجا" },
      content:  { title: "تعديل محتوى الموقع", heroSection: "قسم الصفحة الرئيسية", aboutSection: "قسم نبذة عني", heroNameEn: "اسم المصممة (إنجليزي)", heroNameAr: "اسم المصممة (عربي)", heroHeadlineEn: "العنوان الرئيسي (إنجليزي)", heroHeadlineAr: "العنوان الرئيسي (عربي)", heroDescEn: "العنوان الفرعي (إنجليزي)", heroDescAr: "العنوان الفرعي (عربي)", bio1En: "الفقرة الأولى (إنجليزي)", bio1Ar: "الفقرة الأولى (عربي)", bio2En: "الفقرة الثانية (إنجليزي)", bio2Ar: "الفقرة الثانية (عربي)", save: "حفظ التغييرات", saved: "تم الحفظ!" },
      settings: { title: "الإعدادات", whatsapp: "رقم واتساب", showBtn: "إظهار زر واتساب", save: "حفظ الإعدادات", saved: "تم الحفظ!", hint: "أدخل رمز الدولة بدون مسافات أو شرطات" },
    },
  },
};

export const getT = (lang) => translations[lang] || translations.en;
