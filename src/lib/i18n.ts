export type Lang = "uz" | "ru";

// Interfeysdagi doimiy yozuvlar (tugmalar, forma maydonlari).
// Sayt mazmuni (sarlavhalar, matnlar, narxlar) bazada saqlanadi va admin paneldan o'zgaradi.
export const dict = {
  uz: {
    nav_services: "Xizmatlar",
    nav_process: "Ish tartibi",
    nav_contact: "Aloqa",
    cta_apply: "Ariza qoldirish",
    cta_call: "Qo'ng'iroq qilish",
    stamp_word: "TEKSHIRILDI",
    stamp_ring: "EMINENT AUDIT • AUDITORLIK TASHKILOTI •",
    col_service: "Xizmat",
    col_price: "Narx",
    choose: "Tanlash",
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
    other_lang: "Русский",
  },
  ru: {
    nav_services: "Услуги",
    nav_process: "Этапы",
    nav_contact: "Контакты",
    cta_apply: "Оставить заявку",
    cta_call: "Позвонить",
    stamp_word: "ПРОВЕРЕНО",
    stamp_ring: "EMINENT AUDIT • АУДИТОРСКАЯ ОРГАНИЗАЦИЯ •",
    col_service: "Услуга",
    col_price: "Цена",
    choose: "Выбрать",
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
    other_lang: "O'zbekcha",
  },
} as const;

export type Dict = (typeof dict)[Lang];

export function formatSum(value: string | number) {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("ru-RU").format(n).replace(/ | /g, " ");
}

export function formatPrice(
  s: { price: string | number; price_from: boolean; unit_uz: string; unit_ru: string },
  lang: Lang,
) {
  const t = dict[lang];
  if (Number(s.price) <= 0) return { amount: t.price_on_request, unit: "" };
  const sum = `${formatSum(s.price)} ${t.currency}`;
  const amount = s.price_from
    ? lang === "uz"
      ? `${sum}${t.from_suffix}`
      : `${t.from_prefix} ${sum}`
    : sum;
  const unit = lang === "uz" ? s.unit_uz : s.unit_ru;
  return { amount, unit };
}
