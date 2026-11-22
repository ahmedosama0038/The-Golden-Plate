"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type Lang = "en" | "ar";

const dict = {
  en: {
    "nav.home": "Home",
    "nav.menu": "Menu",
    "nav.story": "Story",
    "nav.reservation": "Reservation",
    // جوا en: { ... }
    "menu.tag": "Curated Selections",
    "menu.title": "A Taste of Our Menu",
    "menu.subtitle":
      "Each dish tells a story of tradition, innovation, and uncompromising quality.",
    "menu.loading": "Loading menu...",
    "menu.error": "Could not load menu items.",
    "menu.empty": "No menu items available yet.",
    "menu.viewAll": "View Full Menu",
    "menu.addToOrder": "Add to Order",
    "menu.chooseSize": "Choose Size",
    "menu.from": "from",
    "menu.defaultName": "Delicious Dish",
    "menu.noDescription": "No description available.",
    currency: "EGP",
    // جوا en
    "footer.story": "Our Story",
    "footer.login": "Login",
    "footer.tagline": "Crafted for the discerning palate.",
    "footer.rights": "All rights reserved.",
    // جوا en
    "hero.badge1": "Order Online",
    "hero.badge2": "Reserve a Table",
    "hero.badge3": "Live Order Tracking",
    "hero.title1": "Where",
    "hero.title2": "Flavor",
    "hero.title3": "Meets Elegance",
    "hero.subtitle":
      "An exquisite culinary journey crafted with passion, precision, and the finest ingredients. Taste the artistry in every bite.",
    "hero.cta": "Explore the Menu",
    // جوا en
    "features.tag": "Why Choose Us",
    "features.title": "Everything You Need",
    "features.f1.title": "Order From Anywhere",
    "features.f1.desc":
      "Browse the full menu and place your delivery order in a few taps.",
    "features.f2.title": "Reserve Your Table",
    "features.f2.desc":
      "Book a table in advance by choosing your date, time, and number of guests.",
    "features.f3.title": "Track Your Order",
    "features.f3.desc":
      "Follow your order live, from the moment we receive it until it is on its way.",
    "features.f4.title": "WhatsApp Support",
    "features.f4.desc":
      "Message us on WhatsApp for any question or special request.",
    "reviews.tag": "Guest Stories",
    "reviews.title": "What Our Guests Say",
    "reviews.empty": "No reviews yet. Be the first to review!",
    "reviews.guest": "Guest",
    "reviews.verified": "Verified Guest",
    "reviews.write": "Write a Review",
    "reviews.formTag": "Share Your Experience",
    "reviews.success":
      "Thank you! Your review has been published successfully.",

    "cta.title": "Ready to Taste the Journey?",
    "cta.desc":
      "Step into our world. Reserve a table, explore our seasonal menu, or simply experience the art of dining reimagined.",
    "cta.reserve": "Make a Reservation",
    // جوا en
    "cart.title": "Your Selection",
    "cart.empty": "Your selection is empty.",
    "cart.each": "each",
    "cart.total": "Total",
    "cart.placeOrder": "Place Order",
    "cart.placing": "Placing order...",
    "cart.toast.orderOk": "Order placed successfully",
    "cart.toast.reservationOk": "Reservation placed successfully",
    "cart.toast.failed": "Could not place the order, continuing on WhatsApp",

    "checkout.subtitle": "Your details to confirm the order",
    "checkout.delivery": "Delivery",
    "checkout.reservation": "Table Reservation",
    "checkout.name": "Name",
    "checkout.phone": "Phone number",
    "checkout.address": "Full address",
    "checkout.guests": "Number of guests",
    "checkout.date": "Reservation date",
    "checkout.time": "Reservation time",
    "checkout.notes": "Notes (optional)",
    "checkout.cancel": "Cancel",
    "checkout.confirm": "Confirm Order",
    "checkout.confirming": "Confirming...",
    // جوا en
    "err.name": "Name must be at least 3 characters",
    "err.phone": "Invalid Egyptian phone number",
    "err.address": "Please enter the full address",
    "err.guests": "Guests must be between 1 and 20",
    "err.dateRequired": "Choose the reservation date",
    "err.datePast": "This date has already passed",
    "err.timeRequired": "Choose the reservation time",
    "err.notesLong": "Notes are too long",
    // جوا en
    "menu.extras": "Extras",
    "menu.noResults": "No dishes found.",
    "menu.browseBy": "Browse by",
    "menu.allSelections": "All Selections",
    "menu.loadingShort": "Loading...",
    "menu.searchPlaceholder": "Search by name, ingredient, or description...",
    "menu.resultsFound": "Results found:",
    "menu.addAria": "Add to order:",
    "menu.sizeAria": "Select size for:",
    "size.small": "Small",
    "size.medium": "Medium",
    "size.large": "Large",
    // جوا en
    "menuPage.title1": "Our",
    "menuPage.title2": "Exquisite",
    "menuPage.title3": "Menu",
    "menuPage.subtitle":
      "Discover a symphony of flavors, carefully crafted to elevate your dining experience.",
    // جوا en
    "res.title1": "Reserve a",
    "res.title2": "Table",
    "res.subtitle":
      "Book your table in a few clicks, or message us on WhatsApp for anything else.",
    "res.formTitle": "Make a Reservation",
    "res.name": "Full Name",
    "res.namePh": "Your full name",
    "res.phone": "Phone",
    "res.date": "Date",
    "res.time": "Time",
    "res.selectTime": "Select time",
    "res.guests": "Number of Guests",
    "res.notes": "Special Requests",
    "res.notesPh": "Dietary restrictions, occasion, seating preference...",
    "res.sending": "Sending...",
    "res.confirm": "Confirm Reservation",
    "res.success": "Reservation request received! We'll confirm it shortly.",
    "res.apiError": "Something went wrong. Please try again.",
    "err.nameRequired": "Name is required",

    "info.address": "Our Address",
    "info.phone": "Phone",
    "info.email": "Email",
    "info.whatsapp": "WhatsApp Orders",
    "info.whatsappCta": "Message us to place an order",
    "info.hours": "Opening Hours",
    "info.weekdays": "Weekdays",
    "info.weekend": "Weekend",
    "info.mapTitle": "Restaurant Location",
    // review form
    "rv.phoneLabel": "Phone number you ordered with",
    "rv.search": "Find my orders",
    "rv.searching": "Searching...",
    "rv.noEligible":
      "No completed orders to review yet. Reviews open once your order or reservation is completed.",
    "rv.allReviewed": "You've reviewed all your completed orders, thank you!",
    "rv.changePhone": "Different number",
    "rv.chooseOrder": "Choose the order",
    "rv.rating": "Your rating",
    "rv.comment": "Your review (at least 10 characters)",
    "rv.submit": "Submit Review",
    "rv.submitting": "Sending...",
    "rv.thanks": "Thanks for your review!",
    "rv.delivery": "Delivery",
    "rv.reservation": "Reservation",
    "rv.err.fetch": "Could not load your orders, try again",
    "rv.err.submit": "Could not send your review, try again",
    "rv.err.busy": "The service is busy right now, try again shortly",
    "rv.err.order": "Choose an order",
    "rv.err.rating": "Choose a rating",
    "rv.err.comment": "Review must be at least 10 characters",
    // tracking
    "nav.track": "Track Order",
    "trk.title1": "Track Your",
    "trk.title2": "Order",
    "trk.subtitle":
      "Enter the phone number you ordered with to follow your order live.",
    "trk.search": "Track",
    "trk.searching": "Searching...",
    "trk.none": "No orders found for this number.",
    "trk.auto": "Updates automatically every 30 seconds",
    "trk.cancelled": "This order was cancelled",
    "trk.s.pending": "Received",
    "trk.s.preparing": "Preparing",
    "trk.s.delivered": "Delivered",
    "trk.s.completed": "Completed",
    "trk.order": "Order",
    "trk.guests": "guests",
    "trk.cta": "Track your order",
    "trk.close": "Close",
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.menu": "المنيو",
    "nav.story": "قصتنا",
    "nav.reservation": "احجز طاولة",
    // جوا ar: { ... }
    "menu.tag": "اختياراتنا المميزة",
    "menu.title": "تذوّق من منيو المطعم",
    "menu.subtitle":
      "كل طبق له حكاية من الأصالة والابتكار والجودة اللي ما بنتنازلش عنها.",
    "menu.loading": "جاري تحميل المنيو...",
    "menu.error": "تعذّر تحميل أصناف المنيو.",
    "menu.empty": "مفيش أصناف في المنيو لسه.",
    "menu.viewAll": "شوف المنيو كامل",
    "menu.addToOrder": "أضف للطلب",
    "menu.chooseSize": "اختار الحجم",
    "menu.from": "من",
    "menu.defaultName": "طبق لذيذ",
    "menu.noDescription": "مفيش وصف متاح.",
    currency: "ج.م",
    // جوا ar
    "footer.story": "قصتنا",
    "footer.login": "دخول",
    "footer.tagline": "مصنوع لأصحاب الذوق الرفيع.",
    "footer.rights": "جميع الحقوق محفوظة.",
    // جوا ar
        'hero.badge1': 'اطلب أونلاين',
    'hero.badge2': 'احجز طاولتك',
    'hero.badge3': 'تابع طلبك لحظة بلحظة',
    "hero.title1": "حيث تلتقي",
    "hero.title2": "النكهة",
    "hero.title3": "بالأناقة",
    "hero.subtitle":
      "رحلة طهي راقية صُنعت بشغف ودقة وأجود المكونات. تذوّق الفن في كل لقمة.",
    "hero.cta": "اكتشف المنيو",
    // جوا ar
    "features.tag": "ليه تختارنا",
        'features.title': 'كل اللي محتاجه في مكان واحد',
    'features.f1.title': 'اطلب من مكانك',
    'features.f1.desc': 'تصفّح المنيو كامل واطلب دليفري في كام ضغطة.',
    'features.f2.title': 'احجز طاولتك',
    'features.f2.desc': 'احجز مسبقاً واختار التاريخ والوقت وعدد الأشخاص.',
    'features.f3.title': 'تابع طلبك',
    'features.f3.desc': 'تابع طلبك لحظة بلحظة من أول ما نستلمه لحد ما يوصلك.',
    'features.f4.title': 'واتساب',
    'features.f4.desc': 'ابعتلنا على واتساب لأي استفسار أو طلب خاص.',
    "reviews.tag": "حكايات ضيوفنا",
    "reviews.title": "ضيوفنا بيقولوا إيه",
    "reviews.empty": "مفيش تقييمات لسه. كن أول من يقيّم!",
    "reviews.guest": "ضيف",
    "reviews.verified": "ضيف موثّق",
    "reviews.write": "اكتب تقييم",
    "reviews.formTag": "شاركنا تجربتك",
    "reviews.success": "شكراً! تقييمك اتنشر بنجاح.",

    "cta.title": "جاهز تجرب الرحلة؟",
    "cta.desc":
      "ادخل عالمنا. احجز طاولة، أو استكشف المنيو الموسمي، أو عيش تجربة الأكل بشكل جديد.",
    "cta.reserve": "احجز طاولة",
    // جوا ar
    "cart.title": "طلبك",
    "cart.empty": "السلة فاضية.",
    "cart.each": "للواحد",
    "cart.total": "الإجمالي",
    "cart.placeOrder": "أكّد الطلب",
    "cart.placing": "جاري إرسال الطلب...",
    "cart.toast.orderOk": "تم تسجيل الطلب بنجاح",
    "cart.toast.reservationOk": "تم تسجيل الحجز بنجاح",
    "cart.toast.failed": "تعذر تسجيل الطلب، هنكمل على واتساب",

    "checkout.subtitle": "بياناتك عشان نأكد طلبك",
    "checkout.delivery": "دليفري",
    "checkout.reservation": "حجز طاولة",
    "checkout.name": "الاسم",
    "checkout.phone": "رقم التليفون",
    "checkout.address": "العنوان بالتفصيل",
    "checkout.guests": "عدد الأشخاص",
    "checkout.date": "تاريخ الحجز",
    "checkout.time": "وقت الحجز",
    "checkout.notes": "ملاحظات (اختياري)",
    "checkout.cancel": "إلغاء",
    "checkout.confirm": "تأكيد الطلب",
    "checkout.confirming": "جاري التأكيد...",
    // جوا ar
    "err.name": "الاسم لازم يكون 3 حروف على الأقل",
    "err.phone": "رقم تليفون مصري غير صحيح",
    "err.address": "اكتب العنوان بالتفصيل",
    "err.guests": "عدد الأشخاص من 1 لـ 20",
    "err.dateRequired": "اختار تاريخ الحجز",
    "err.datePast": "التاريخ ده فات",
    "err.timeRequired": "اختار وقت الحجز",
    "err.notesLong": "الملاحظات طويلة",
    // جوا ar
    "menu.extras": "إضافات",
    "menu.noResults": "مفيش أطباق مطابقة.",
    "menu.browseBy": "تصفّح حسب",
    "menu.allSelections": "كل الأصناف",
    "menu.loadingShort": "جاري التحميل...",
    "menu.searchPlaceholder": "ابحث بالاسم أو المكوّن أو الوصف...",
    "menu.resultsFound": "عدد النتائج:",
    "menu.addAria": "أضف للطلب:",
    "menu.sizeAria": "اختر الحجم لـ",
    "size.small": "صغير",
    "size.medium": "وسط",
    "size.large": "كبير",
    // جوا ar
    "menuPage.title1": "قائمتنا",
    "menuPage.title2": "الفاخرة",
    "menuPage.title3": "",
    "menuPage.subtitle":
      "اكتشف سيمفونية من النكهات، معدّة بعناية لترتقي بتجربتك.",
    // جوا ar
    "res.title1": "احجز",
    "res.title2": "طاولتك",
    "res.subtitle":
      "احجز طاولتك في كام ضغطة، أو ابعتلنا على واتساب لأي استفسار تاني.",
    "res.formTitle": "احجز طاولة",
    "res.name": "الاسم بالكامل",
    "res.namePh": "اكتب اسمك بالكامل",
    "res.phone": "رقم التليفون",
    "res.date": "التاريخ",
    "res.time": "الوقت",
    "res.selectTime": "اختار الوقت",
    "res.guests": "عدد الأشخاص",
    "res.notes": "طلبات خاصة",
    "res.notesPh": "حساسية أكل، مناسبة، مكان الجلوس المفضل...",
    "res.sending": "جاري الإرسال...",
    "res.confirm": "تأكيد الحجز",
    "res.success": "وصلنا طلب الحجز! هنأكده معاك في أقرب وقت.",
    "res.apiError": "حصلت مشكلة. جرّب تاني.",
    "err.nameRequired": "الاسم مطلوب",

    "info.address": "عنواننا",
    "info.phone": "التليفون",
    "info.email": "الإيميل",
    "info.whatsapp": "طلبات واتساب",
    "info.whatsappCta": "ابعتلنا رسالة عشان تطلب",
    "info.hours": "مواعيد العمل",
    "info.weekdays": "أيام الأسبوع",
    "info.weekend": "الويك إند",
    "info.mapTitle": "موقع المطعم",
    // review form
    "rv.phoneLabel": "رقم التليفون اللي طلبت بيه",
    "rv.search": "ابحث عن طلباتي",
    "rv.searching": "جاري البحث...",
    "rv.noEligible":
      "مفيش طلبات مكتملة تقدر تقيّمها لسه. التقييم بيفتح لما طلبك أو حجزك يخلص.",
    "rv.allReviewed": "إنت قيّمت كل طلباتك المكتملة، شكراً ليك!",
    "rv.changePhone": "رقم تاني",
    "rv.chooseOrder": "اختار الطلب",
    "rv.rating": "تقييمك",
    "rv.comment": "رأيك (10 حروف على الأقل)",
    "rv.submit": "أرسل التقييم",
    "rv.submitting": "جاري الإرسال...",
    "rv.thanks": "شكراً لتقييمك!",
    "rv.delivery": "دليفري",
    "rv.reservation": "حجز",
    "rv.err.fetch": "تعذر جلب الطلبات، حاول تاني",
    "rv.err.submit": "تعذر إرسال التقييم، حاول تاني",
    "rv.err.busy": "الخدمة مشغولة حالياً، جرّب بعد شوية",
    "rv.err.order": "اختار الطلب",
    "rv.err.rating": "اختار تقييم",
    "rv.err.comment": "التقييم لازم يكون 10 حروف على الأقل",
    // tracking
    "nav.track": "تتبع طلبك",
    "trk.title1": "تتبّع",
    "trk.title2": "طلبك",
    "trk.subtitle": "اكتب رقم التليفون اللي طلبت بيه وتابع طلبك لحظة بلحظة.",
    "trk.search": "تتبّع",
    "trk.searching": "جاري البحث...",
    "trk.none": "مفيش طلبات على الرقم ده.",
    "trk.auto": "بيتحدّث تلقائي كل 30 ثانية",
    "trk.cancelled": "الطلب ده اتلغى",
    "trk.s.pending": "استلمنا طلبك",
    "trk.s.preparing": "بنجهّزه",
    "trk.s.delivered": "اتسلّم",
    "trk.s.completed": "تم",
    "trk.order": "طلب",
    "trk.guests": "أشخاص",
    "trk.cta": "تابع طلبك",
    "trk.close": "إغلاق",
  },
} as const;

export type DictKey = keyof (typeof dict)["en"];

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // قراءة اللغة المحفوظة بعد أول render عشان نتفادى hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "ar" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: DictKey) => dict[lang][key] ?? dict.en[key],
    [lang],
  );

  return (
    <LangContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
