// Admin paneldan tahrirlanadigan sayt matnlari.
// Har bir kalit bazada (content jadvali) uz va ru qiymatlari bilan saqlanadi.
// Yangi kalit qo'shilsa, ilova keyingi ishga tushishda uni avtomatik bazaga yozadi.

export type ContentField = {
  key: string;
  label: string;
  group: string;
  multiline?: boolean;
  /** Ikkala til uchun bir xil qiymat (telefon, email) */
  shared?: boolean;
  uz: string;
  ru: string;
};

export const CONTENT_FIELDS: ContentField[] = [
  // Bosh qism
  {
    key: "hero_title",
    label: "Asosiy sarlavha",
    group: "Bosh qism",
    uz: "Hisobotingizni soliq organidan oldin biz tekshiramiz",
    ru: "Проверим вашу отчётность раньше налоговой",
  },
  {
    key: "hero_text",
    label: "Sarlavha ostidagi matn",
    group: "Bosh qism",
    multiline: true,
    uz: "Majburiy va tashabbusli audit, buxgalteriya hisobini yuritish va tiklash, soliq maslahati va XBXS bo'yicha hisobot. O'zbekiston qonunchiligi va xalqaro standartlar asosida.",
    ru: "Обязательный и инициативный аудит, ведение и восстановление учёта, налоговые консультации и отчётность по МСФО. По законодательству Узбекистана и международным стандартам.",
  },

  // Biz haqimizda
  {
    key: "about_title",
    label: "Bo'lim sarlavhasi",
    group: "Biz haqimizda",
    uz: "Har bir topshiriqni rahbar shaxsan nazorat qiladi",
    ru: "Каждый проект руководитель ведёт лично",
  },
  {
    key: "about_text",
    label: "Matn",
    group: "Biz haqimizda",
    multiline: true,
    uz: "Eminent Audit rahbari — sertifikatlangan auditor va soliq maslahatchisi. Bosh buxgalter sifatida 11 yildan ortiq ishlagan, shuning uchun hisobotni nafaqat tekshiramiz, balki xatolar qayerdan kelib chiqishini ham tushuntirib, tuzatishga yordam beramiz.",
    ru: "Руководитель Eminent Audit — сертифицированный аудитор и налоговый консультант с опытом главного бухгалтера более 11 лет. Поэтому мы не только проверяем отчётность, но и объясняем, откуда берутся ошибки, и помогаем их исправить.",
  },
  {
    key: "fact_1",
    label: "Fakt 1",
    group: "Biz haqimizda",
    uz: "11+ yil bosh buxgalter sifatida",
    ru: "11+ лет главным бухгалтером",
  },
  {
    key: "fact_2",
    label: "Fakt 2",
    group: "Biz haqimizda",
    uz: "8+ yil audit amaliyotida",
    ru: "8+ лет в аудите",
  },
  {
    key: "fact_3",
    label: "Fakt 3",
    group: "Biz haqimizda",
    uz: "XAS, XBXS va soliq qonunchiligi bo'yicha ish",
    ru: "Работа по МСА, МСФО и налоговому законодательству",
  },

  // Xizmatlar
  {
    key: "services_title",
    label: "Bo'lim sarlavhasi",
    group: "Xizmatlar va narxlar",
    uz: "Xizmatlar va narxlar",
    ru: "Услуги и цены",
  },
  {
    key: "services_note",
    label: "Narxlar ostidagi izoh",
    group: "Xizmatlar va narxlar",
    multiline: true,
    uz: "Yakuniy narx korxona hajmi, operatsiyalar soni va hujjatlar holatiga qarab shartnomada belgilanadi.",
    ru: "Итоговая стоимость фиксируется в договоре и зависит от масштаба компании, объёма операций и состояния документов.",
  },

  // Ish tartibi
  {
    key: "steps_title",
    label: "Bo'lim sarlavhasi",
    group: "Ish tartibi",
    uz: "Qanday ishlaymiz",
    ru: "Как мы работаем",
  },
  { key: "step_1_title", label: "1-qadam sarlavhasi", group: "Ish tartibi", uz: "Ariza", ru: "Заявка" },
  {
    key: "step_1_text",
    label: "1-qadam matni",
    group: "Ish tartibi",
    multiline: true,
    uz: "Saytda ariza qoldirasiz yoki qo'ng'iroq qilasiz.",
    ru: "Вы оставляете заявку на сайте или звоните нам.",
  },
  { key: "step_2_title", label: "2-qadam sarlavhasi", group: "Ish tartibi", uz: "Baholash", ru: "Оценка" },
  {
    key: "step_2_text",
    label: "2-qadam matni",
    group: "Ish tartibi",
    multiline: true,
    uz: "Bir ish kuni ichida bog'lanib, hajm va muddatni aniqlaymiz.",
    ru: "В течение рабочего дня связываемся и уточняем объём и сроки.",
  },
  { key: "step_3_title", label: "3-qadam sarlavhasi", group: "Ish tartibi", uz: "Shartnoma", ru: "Договор" },
  {
    key: "step_3_text",
    label: "3-qadam matni",
    group: "Ish tartibi",
    multiline: true,
    uz: "Narx va muddat shartnomada qat'iy belgilanadi.",
    ru: "Стоимость и сроки фиксируются в договоре.",
  },
  { key: "step_4_title", label: "4-qadam sarlavhasi", group: "Ish tartibi", uz: "Xulosa", ru: "Заключение" },
  {
    key: "step_4_text",
    label: "4-qadam matni",
    group: "Ish tartibi",
    multiline: true,
    uz: "Auditorlik xulosasi va rahbariyatga tavsiyalar xatini topshiramiz.",
    ru: "Передаём аудиторское заключение и письмо руководству с рекомендациями.",
  },

  // Ariza
  {
    key: "form_title",
    label: "Forma sarlavhasi",
    group: "Ariza formasi",
    uz: "Ariza qoldiring",
    ru: "Оставьте заявку",
  },
  {
    key: "form_text",
    label: "Forma yonidagi matn",
    group: "Ariza formasi",
    multiline: true,
    uz: "Bir ish kuni ichida qo'ng'iroq qilib, topshiriq hajmi va narxini aniqlashtiramiz. Konsultatsiya bepul.",
    ru: "В течение рабочего дня перезвоним, уточним объём работ и стоимость. Консультация бесплатна.",
  },

  // Aloqa
  {
    key: "contact_phone",
    label: "Telefon",
    group: "Aloqa",
    shared: true,
    uz: "+998 90 000 00 00",
    ru: "+998 90 000 00 00",
  },
  {
    key: "contact_email",
    label: "Email",
    group: "Aloqa",
    shared: true,
    uz: "info@eminentaudit.uz",
    ru: "info@eminentaudit.uz",
  },
  {
    key: "contact_address",
    label: "Manzil",
    group: "Aloqa",
    uz: "Toshkent shahri",
    ru: "г. Ташкент",
  },
  {
    key: "contact_hours",
    label: "Ish vaqti",
    group: "Aloqa",
    uz: "Dushanba–juma, 9:00–18:00",
    ru: "Понедельник–пятница, 9:00–18:00",
  },
];

export type ContentMap = Record<string, string>;
