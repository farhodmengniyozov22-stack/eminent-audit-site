export const LANGS = ["uz", "ru", "en"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

/** Har bir tilning sahifa manzili */
export const LANG_PATH: Record<Lang, string> = { uz: "/", ru: "/ru", en: "/en" };

// Interfeysdagi doimiy yozuvlar (tugmalar, forma maydonlari).
// Sayt mazmuni (sarlavhalar, matnlar, narxlar) bazada saqlanadi va admin paneldan o'zgaradi.
export const dict = {
  uz: {
    nav_services: "Xizmatlar",
    nav_about: "Biz haqimizda",
    nav_process: "Ish tartibi",
    nav_faq: "Savollar",
    nav_contact: "Aloqa",
    cta_apply: "Ariza qoldirish",
    cta_call: "Qo'ng'iroq qilish",
    cta_consult: "Bepul konsultatsiya",
    cta_services: "Xizmatlar va narxlar",
    telegram: "Telegram orqali yozish",
    col_service: "Xizmat",
    col_price: "Narx",
    choose: "Tanlash →",
    currency: "so'm",
    from_suffix: "dan",
    from_prefix: "",
    price_on_request: "Kelishilgan holda",
    f_name: "Ismingiz",
    f_phone: "Telefon raqam",
    f_company: "Korxona nomi",
    f_optional: "ixtiyoriy",
    f_service: "Xizmat",
    f_service_any: "Hali aniq emas",
    f_message: "Qisqacha izoh",
    f_message_ph: "Masalan: 2025-yil uchun majburiy audit, MChJ, yillik aylanma ~5 mlrd so'm",
    f_submit: "Arizani yuborish",
    f_sending: "Yuborilmoqda…",
    f_success_title: "Ariza qabul qilindi",
    f_success_text: "Bir ish kuni ichida siz bilan bog'lanamiz.",
    f_again: "Yana ariza yuborish",
    e_name: "Ismingizni kiriting.",
    e_phone: "Telefon raqamni to'liq kiriting, masalan +998 90 123 45 67.",
    e_generic: "Arizani saqlab bo'lmadi. Birozdan keyin qayta urinib ko'ring yoki telefon orqali bog'laning.",
    e_too_fast: "Bu raqamdan ariza yaqinda yuborilgan. Bir necha daqiqadan keyin qayta urinib ko'ring.",
    phone: "Telefon",
    email: "Email",
    address: "Manzil",
    hours: "Ish vaqti",
    rights: "Barcha huquqlar himoyalangan.",
    skip: "Asosiy mazmunga o'tish",
    menu: "Asosiy menyu",
    lang_label: "Til",
  },
  ru: {
    nav_services: "Услуги",
    nav_about: "О нас",
    nav_process: "Этапы",
    nav_faq: "Вопросы",
    nav_contact: "Контакты",
    cta_apply: "Оставить заявку",
    cta_call: "Позвонить",
    cta_consult: "Бесплатная консультация",
    cta_services: "Услуги и цены",
    telegram: "Написать в Telegram",
    col_service: "Услуга",
    col_price: "Цена",
    choose: "Выбрать →",
    currency: "сум",
    from_suffix: "",
    from_prefix: "от",
    price_on_request: "По договорённости",
    f_name: "Ваше имя",
    f_phone: "Телефон",
    f_company: "Название компании",
    f_optional: "необязательно",
    f_service: "Услуга",
    f_service_any: "Пока не определились",
    f_message: "Коротко о задаче",
    f_message_ph: "Например: обязательный аудит за 2025 год, ООО, оборот ~5 млрд сум",
    f_submit: "Отправить заявку",
    f_sending: "Отправляем…",
    f_success_title: "Заявка принята",
    f_success_text: "Свяжемся с вами в течение рабочего дня.",
    f_again: "Отправить ещё одну",
    e_name: "Укажите имя.",
    e_phone: "Укажите номер полностью, например +998 90 123 45 67.",
    e_generic: "Не удалось сохранить заявку. Попробуйте чуть позже или позвоните нам.",
    e_too_fast: "С этого номера заявка уже отправлена недавно. Повторите через несколько минут.",
    phone: "Телефон",
    email: "Email",
    address: "Адрес",
    hours: "Часы работы",
    rights: "Все права защищены.",
    skip: "Перейти к содержанию",
    menu: "Основное меню",
    lang_label: "Язык",
  },
  en: {
    nav_services: "Services",
    nav_about: "About",
    nav_process: "Process",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    cta_apply: "Leave a request",
    cta_call: "Call us",
    cta_consult: "Free consultation",
    cta_services: "Services and prices",
    telegram: "Message us on Telegram",
    col_service: "Service",
    col_price: "Price",
    choose: "Select →",
    currency: "UZS",
    from_suffix: "",
    from_prefix: "from",
    price_on_request: "By agreement",
    f_name: "Your name",
    f_phone: "Phone",
    f_company: "Company name",
    f_optional: "optional",
    f_service: "Service",
    f_service_any: "Not sure yet",
    f_message: "Brief description",
    f_message_ph: "E.g.: statutory audit for 2025, LLC, annual turnover ~5 bn UZS",
    f_submit: "Send request",
    f_sending: "Sending…",
    f_success_title: "Request received",
    f_success_text: "We'll contact you within one business day.",
    f_again: "Send another request",
    e_name: "Please enter your name.",
    e_phone: "Please enter the full number, e.g. +998 90 123 45 67.",
    e_generic: "We couldn't save your request. Please try again later or give us a call.",
    e_too_fast: "A request from this number was sent recently. Please try again in a few minutes.",
    phone: "Phone",
    email: "Email",
    address: "Address",
    hours: "Working hours",
    rights: "All rights reserved.",
    skip: "Skip to content",
    menu: "Main menu",
    lang_label: "Language",
  },
} as const;

export type Dict = (typeof dict)[Lang];

/** Bazadagi uch tilli yozuvdan kerakli tildagisini oladi; inglizchasi bo'sh bo'lsa o'zbekchasi */
export function pick<K extends string>(row: Record<`${K}_${Lang}`, string>, field: K, lang: Lang): string {
  return row[`${field}_${lang}`] || row[`${field}_uz`];
}

export function formatSum(value: string | number) {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("ru-RU").format(n).replace(/ | /g, " ");
}

export function formatPrice(
  s: { price: string | number; price_from: boolean; unit_uz: string; unit_ru: string; unit_en: string },
  lang: Lang,
) {
  const t = dict[lang];
  if (Number(s.price) <= 0) return { amount: t.price_on_request, unit: "" };
  const sum = `${formatSum(s.price)} ${t.currency}`;
  const amount = s.price_from ? (t.from_suffix ? `${sum}${t.from_suffix}` : `${t.from_prefix} ${sum}`) : sum;
  const unit = s[`unit_${lang}`];
  return { amount, unit };
}
