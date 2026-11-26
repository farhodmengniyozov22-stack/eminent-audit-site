// Lotin yozuviga asoslangan o'zbek alifbosining yangi shakli
// (qonun 2026-yil 21-oktabrda imzolangan, 2027-yil 22-apreldan kuchga kiradi):
//   Sh → Ş, Ch → Ç, O' → Ö, G' → Ğ; tutuq belgisi (ma'lumot) saqlanadi; "ng" o'zgarmaydi.
// Saytning o'zbekcha matnlari ko'rsatishdan oldin shu funksiya orqali o'tadi.
// Bazadagi matnlar o'zgartirilmaydi — eski yozuvga qaytish uchun quyidagini false qiling.

export const UZ_NEW_ALPHABET = true;

// O' va G' dagi belgining barcha uchraydigan ko'rinishlari: ' ‘ ’ ʻ ` ´
const MARK = "['‘’ʻ`´]";

export function toNewUz(text: string): string {
  if (!text) return text;
  return text
    .replace(new RegExp(`O${MARK}`, "g"), "Ö")
    .replace(new RegExp(`o${MARK}`, "g"), "ö")
    .replace(new RegExp(`G${MARK}`, "g"), "Ğ")
    .replace(new RegExp(`g${MARK}`, "g"), "ğ")
    .replace(/S[Hh]/g, "Ş")
    .replace(/sh/g, "ş")
    .replace(/C[Hh]/g, "Ç")
    .replace(/ch/g, "ç");
}

/** O'zbekcha matnni (yangi alifbo yoqilgan bo'lsa) o'giradi, boshqa tillarni o'zgartirmaydi */
export function uzText(text: string, lang: string): string {
  return lang === "uz" && UZ_NEW_ALPHABET ? toNewUz(text) : text;
}
