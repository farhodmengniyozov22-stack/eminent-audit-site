# Eminent Audit — landing sahifa va admin panel

Xizmat sayti (o'zbekcha `/` va ruscha `/ru`), ariza formasi va admin panel (`/admin`).

Admin panelda:
- **Arizalar** — ro'yxat, holat bo'yicha filtr, holatni o'zgartirish (Yangi / Jarayonda / Bajarildi / Rad etildi), ichki qayd, o'chirish
- **Xizmatlar va narxlar** — qo'shish, tahrirlash, yashirish, o'chirish, tartib
- **Sayt matnlari** — barcha sarlavha va matnlarni ikki tilda tahrirlash

## Texnologiyalar
Next.js 16 (App Router), TypeScript, Tailwind CSS 4, PostgreSQL (Neon), `pg`, `jose`, `zod`.
Jadvallar ilova birinchi marta ishga tushganda avtomatik yaratiladi va boshlang'ich ma'lumot bilan to'ldiriladi.

## Muhit o'zgaruvchilari

| Nomi | Tavsif |
| --- | --- |
| `DATABASE_URL` | Postgres manzili (Vercel'da Neon ulanganda avtomatik qo'shiladi) |
| `ADMIN_PASSWORD` | Admin panelga kirish paroli |
| `SESSION_SECRET` | Kamida 32 belgili tasodifiy satr (sessiya cookie imzosi uchun) |

## Lokal ishga tushirish
```bash
npm install
cp .env.example .env.local   # qiymatlarni to'ldiring
npm run dev
```

## Vercel'ga deploy
1. Vercel → Add New → Project → shu repo'ni import qiling
2. Storage → Neon (Postgres) bazasini yarating va loyihaga ulang
3. Settings → Environment Variables: `ADMIN_PASSWORD`, `SESSION_SECRET`
4. Redeploy
