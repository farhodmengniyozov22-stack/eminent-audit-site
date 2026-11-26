// Admin paneldan tahrirlanadigan sayt matnlari.
// Har bir kalit bazada (content jadvali) uz, ru va en qiymatlari bilan saqlanadi.
// Yangi kalit qo'shilsa, ilova keyingi ishga tushishda uni avtomatik bazaga yozadi.
// Sarlavhalarda *so'z* deb yozilgan qism saytda oltin rangli qiya harf bilan chiqadi.

export type ContentField = {
  key: string;
  label: string;
  group: string;
  multiline?: boolean;
  /** Ikkala til uchun bir xil qiymat (telefon, email) */
  shared?: boolean;
  uz: string;
  ru: string;
  en: string;
};

const ACCENT_HINT = " (*so'z* — oltin qiya)";

export const CONTENT_FIELDS: ContentField[] = [
  // Bosh qism
  {
    key: "hero_eyebrow",
    label: "Sarlavha ustidagi kichik yozuv",
    group: "Bosh qism",
    uz: "Eminent Audit — auditorlik tashkiloti",
    ru: "Eminent Audit — аудиторская организация",
    en: "Eminent Audit — audit firm",
  },
  {
    key: "hero_title",
    label: "Asosiy sarlavha" + ACCENT_HINT,
    group: "Bosh qism",
    uz: "Aniq raqamlar. *Ishonchli* xulosa.",
    ru: "Точные цифры. *Надёжное* заключение.",
    en: "Accurate numbers. *Reliable* opinion.",
  },
  {
    key: "hero_text",
    label: "Sarlavha ostidagi matn",
    group: "Bosh qism",
    multiline: true,
    uz: "Majburiy va tashabbusli audit, buxgalteriya hisobini yuritish va tiklash, soliq maslahati va XBXS bo'yicha hisobot. O'zbekiston qonunchiligi va xalqaro standartlar asosida.",
    ru: "Обязательный и инициативный аудит, ведение и восстановление учёта, налоговые консультации и отчётность по МСФО. По законодательству Узбекистана и международным стандартам.",
    en: "Statutory and voluntary audits, bookkeeping and restoration of accounting records, tax consulting and IFRS reporting. In line with Uzbek legislation and international standards.",
  },

  // Raqamlar (bosh qism ostidagi qator)
  { key: "stat_1_value", label: "1-raqam", group: "Raqamlar", shared: true, uz: "11+", ru: "11+", en: "11+" },
  { key: "stat_1_label", label: "1-raqam izohi", group: "Raqamlar", uz: "yil bosh buxgalter sifatida", ru: "лет главным бухгалтером", en: "years as chief accountant" },
  { key: "stat_2_value", label: "2-raqam", group: "Raqamlar", shared: true, uz: "8+", ru: "8+", en: "8+" },
  { key: "stat_2_label", label: "2-raqam izohi", group: "Raqamlar", uz: "yil audit amaliyotida", ru: "лет в аудите", en: "years in audit practice" },
  { key: "stat_3_value", label: "3-raqam", group: "Raqamlar", shared: true, uz: "7", ru: "7", en: "7" },
  { key: "stat_3_label", label: "3-raqam izohi", group: "Raqamlar", uz: "yo'nalishdagi xizmatlar", ru: "направлений услуг", en: "service areas" },
  { key: "stat_4_value", label: "4-raqam", group: "Raqamlar", uz: "1 kun", ru: "1 день", en: "1 day" },
  { key: "stat_4_label", label: "4-raqam izohi", group: "Raqamlar", uz: "ichida javob beramiz", ru: "на ответ по заявке", en: "to respond to your request" },

  // Biz haqimizda
  {
    key: "about_title",
    label: "Bo'lim sarlavhasi" + ACCENT_HINT,
    group: "Biz haqimizda",
    uz: "Har bir topshiriqni rahbar *shaxsan* nazorat qiladi",
    ru: "Каждый проект руководитель ведёт *лично*",
    en: "The director *personally* oversees every engagement",
  },
  {
    key: "about_text",
    label: "Matn",
    group: "Biz haqimizda",
    multiline: true,
    uz: "Eminent Audit rahbari — sertifikatlangan auditor va soliq maslahatchisi. Bosh buxgalter sifatida 11 yildan ortiq ishlagan, shuning uchun hisobotni nafaqat tekshiramiz, balki xatolar qayerdan kelib chiqishini ham tushuntirib, tuzatishga yordam beramiz.",
    ru: "Руководитель Eminent Audit — сертифицированный аудитор и налоговый консультант с опытом главного бухгалтера более 11 лет. Поэтому мы не только проверяем отчётность, но и объясняем, откуда берутся ошибки, и помогаем их исправить.",
    en: "The director of Eminent Audit is a certified auditor and tax consultant with more than 11 years of experience as a chief accountant. That is why we don't just check your statements — we explain where errors come from and help you fix them.",
  },
  {
    key: "fact_1",
    label: "Fakt 1",
    group: "Biz haqimizda",
    uz: "11+ yil bosh buxgalter sifatida",
    ru: "11+ лет главным бухгалтером",
    en: "11+ years as chief accountant",
  },
  {
    key: "fact_2",
    label: "Fakt 2",
    group: "Biz haqimizda",
    uz: "8+ yil audit amaliyotida",
    ru: "8+ лет в аудите",
    en: "8+ years in audit",
  },
  {
    key: "fact_3",
    label: "Fakt 3",
    group: "Biz haqimizda",
    uz: "XAS, XBXS va soliq qonunchiligi bo'yicha ish",
    ru: "Работа по МСА, МСФО и налоговому законодательству",
    en: "Work under ISA, IFRS and tax legislation",
  },

  // Xizmatlar
  {
    key: "services_title",
    label: "Bo'lim sarlavhasi" + ACCENT_HINT,
    group: "Xizmatlar va narxlar",
    uz: "Xizmatlar va narxlar",
    ru: "Услуги и цены",
    en: "Services and prices",
  },
  {
    key: "services_subtitle",
    label: "Sarlavha ostidagi matn",
    group: "Xizmatlar va narxlar",
    multiline: true,
    uz: "Narxlar ochiq — yakuniy summa shartnomada qat'iy belgilanadi.",
    ru: "Цены открыты — итоговая сумма фиксируется в договоре.",
    en: "Transparent pricing — the final amount is fixed in the contract.",
  },
  {
    key: "services_note",
    label: "Narxlar ostidagi izoh",
    group: "Xizmatlar va narxlar",
    multiline: true,
    uz: "Yakuniy narx korxona hajmi, operatsiyalar soni va hujjatlar holatiga qarab shartnomada belgilanadi.",
    ru: "Итоговая стоимость фиксируется в договоре и зависит от масштаба компании, объёма операций и состояния документов.",
    en: "The final price is set in the contract and depends on the size of the company, the volume of transactions and the state of the records.",
  },

  // Ish tartibi
  {
    key: "steps_title",
    label: "Bo'lim sarlavhasi" + ACCENT_HINT,
    group: "Ish tartibi",
    uz: "Qanday ishlaymiz",
    ru: "Как мы работаем",
    en: "How we work",
  },
  { key: "step_1_title", label: "1-qadam sarlavhasi", group: "Ish tartibi", uz: "Ariza", ru: "Заявка", en: "Request" },
  {
    key: "step_1_text",
    label: "1-qadam matni",
    group: "Ish tartibi",
    multiline: true,
    uz: "Saytda ariza qoldirasiz yoki qo'ng'iroq qilasiz.",
    ru: "Вы оставляете заявку на сайте или звоните нам.",
    en: "Leave a request on the website or give us a call.",
  },
  { key: "step_2_title", label: "2-qadam sarlavhasi", group: "Ish tartibi", uz: "Baholash", ru: "Оценка", en: "Assessment" },
  {
    key: "step_2_text",
    label: "2-qadam matni",
    group: "Ish tartibi",
    multiline: true,
    uz: "Bir ish kuni ichida bog'lanib, hajm va muddatni aniqlaymiz.",
    ru: "В течение рабочего дня связываемся и уточняем объём и сроки.",
    en: "Within one business day we contact you to agree on scope and timing.",
  },
  { key: "step_3_title", label: "3-qadam sarlavhasi", group: "Ish tartibi", uz: "Shartnoma", ru: "Договор", en: "Contract" },
  {
    key: "step_3_text",
    label: "3-qadam matni",
    group: "Ish tartibi",
    multiline: true,
    uz: "Narx va muddat shartnomada qat'iy belgilanadi.",
    ru: "Стоимость и сроки фиксируются в договоре.",
    en: "Price and deadlines are fixed in the contract.",
  },
  { key: "step_4_title", label: "4-qadam sarlavhasi", group: "Ish tartibi", uz: "Xulosa", ru: "Заключение", en: "Report" },
  {
    key: "step_4_text",
    label: "4-qadam matni",
    group: "Ish tartibi",
    multiline: true,
    uz: "Auditorlik xulosasi va rahbariyatga tavsiyalar xatini topshiramiz.",
    ru: "Передаём аудиторское заключение и письмо руководству с рекомендациями.",
    en: "We deliver the auditor's report and a management letter with recommendations.",
  },

  // Ko'p beriladigan savollar
  {
    key: "faq_title",
    label: "Bo'lim sarlavhasi" + ACCENT_HINT,
    group: "Savollar (FAQ)",
    uz: "Savolingiz *bormi?*",
    ru: "Остались *вопросы?*",
    en: "Have *questions?*",
  },
  {
    key: "faq_text",
    label: "Sarlavha ostidagi matn",
    group: "Savollar (FAQ)",
    multiline: true,
    uz: "Javob topmasangiz — qo'ng'iroq qiling, konsultatsiya bepul.",
    ru: "Не нашли ответ — позвоните, консультация бесплатна.",
    en: "Didn't find an answer? Give us a call — the consultation is free.",
  },
  { key: "faq_1_q", label: "1-savol", group: "Savollar (FAQ)", uz: "Korxonam majburiy auditdan o'tishi shartmi?", ru: "Обязана ли моя компания проходить аудит?", en: "Is my company required to have an audit?" },
  {
    key: "faq_1_a",
    label: "1-javob",
    group: "Savollar (FAQ)",
    multiline: true,
    uz: "Aksiyadorlik jamiyatlari, banklar, sug'urta tashkilotlari va qonunda belgilangan boshqa korxonalar uchun majburiy. Aniq holatingizni bepul baholab beramiz.",
    ru: "Аудит обязателен для акционерных обществ, банков, страховых компаний и других организаций, указанных в законе. Бесплатно оценим вашу ситуацию.",
    en: "An audit is mandatory for joint-stock companies, banks, insurers and other entities specified by law. We will assess your situation free of charge.",
  },
  { key: "faq_2_q", label: "2-savol", group: "Savollar (FAQ)", uz: "Audit qancha vaqt oladi?", ru: "Сколько длится аудит?", en: "How long does an audit take?" },
  {
    key: "faq_2_a",
    label: "2-javob",
    group: "Savollar (FAQ)",
    multiline: true,
    uz: "Korxona hajmiga qarab odatda 2–4 hafta. Muddat shartnomada qat'iy belgilanadi.",
    ru: "Обычно 2–4 недели в зависимости от масштаба компании. Срок фиксируется в договоре.",
    en: "Usually 2–4 weeks, depending on the size of the company. The timeline is fixed in the contract.",
  },
  { key: "faq_3_q", label: "3-savol", group: "Savollar (FAQ)", uz: "Qanday hujjatlar kerak bo'ladi?", ru: "Какие документы понадобятся?", en: "What documents will you need?" },
  {
    key: "faq_3_a",
    label: "3-javob",
    group: "Savollar (FAQ)",
    multiline: true,
    uz: "Moliyaviy hisobotlar, bosh kitob, asosiy shartnomalar va birlamchi hujjatlar. Aniq ro'yxatni birinchi suhbatdan keyin yuboramiz.",
    ru: "Финансовая отчётность, главная книга, основные договоры и первичные документы. Точный список пришлём после первой беседы.",
    en: "Financial statements, the general ledger, key contracts and source documents. We will send you the exact list after our first conversation.",
  },
  { key: "faq_4_q", label: "4-savol", group: "Savollar (FAQ)", uz: "Ma'lumotlarim maxfiy saqlanadimi?", ru: "Сохраняется ли конфиденциальность?", en: "Is my information kept confidential?" },
  {
    key: "faq_4_a",
    label: "4-javob",
    group: "Savollar (FAQ)",
    multiline: true,
    uz: "Ha. Auditorlik siri qonun bilan himoyalangan va shartnomada alohida belgilanadi.",
    ru: "Да. Аудиторская тайна защищена законом и отдельно закрепляется в договоре.",
    en: "Yes. Audit confidentiality is protected by law and is also set out in the contract.",
  },

  // Ariza
  {
    key: "form_title",
    label: "Forma sarlavhasi" + ACCENT_HINT,
    group: "Ariza formasi",
    uz: "Birinchi suhbat — *bepul*",
    ru: "Первая консультация — *бесплатно*",
    en: "First consultation — *free*",
  },
  {
    key: "form_text",
    label: "Forma yonidagi matn",
    group: "Ariza formasi",
    multiline: true,
    uz: "Bir ish kuni ichida qo'ng'iroq qilib, topshiriq hajmi va narxini aniqlashtiramiz. Konsultatsiya bepul.",
    ru: "В течение рабочего дня перезвоним, уточним объём работ и стоимость. Консультация бесплатна.",
    en: "We will call you back within one business day to clarify the scope of work and the price. The consultation is free.",
  },

  // Aloqa
  {
    key: "contact_phone",
    label: "Telefon",
    group: "Aloqa",
    shared: true,
    uz: "+998 90 000 00 00",
    ru: "+998 90 000 00 00",
    en: "+998 90 000 00 00",
  },
  {
    key: "contact_email",
    label: "Email",
    group: "Aloqa",
    shared: true,
    uz: "info@eminentaudit.uz",
    ru: "info@eminentaudit.uz",
    en: "info@eminentaudit.uz",
  },
  {
    key: "contact_telegram",
    label: "Telegram (masalan @eminentaudit — bo'sh qolsa tugma ko'rinmaydi)",
    group: "Aloqa",
    shared: true,
    uz: "",
    ru: "",
    en: "",
  },
  {
    key: "contact_address",
    label: "Manzil",
    group: "Aloqa",
    uz: "Toshkent shahri",
    ru: "г. Ташкент",
    en: "Tashkent",
  },
  {
    key: "contact_hours",
    label: "Ish vaqti",
    group: "Aloqa",
    uz: "Dushanba–juma, 9:00–18:00",
    ru: "Понедельник–пятница, 9:00–18:00",
    en: "Monday–Friday, 9:00–18:00",
  },
];

export type ContentMap = Record<string, string>;
