import "server-only";

// Yangi ariza haqida Telegram'ga xabar yuboradi.
// TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID sozlanmagan bo'lsa, hech narsa qilmaydi.
// Xabar yuborilmasa ham ariza bazada saqlanib qoladi.

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function notifyNewApplication(a: {
  id: number;
  name: string;
  phone: string;
  company: string;
  serviceName: string;
  message: string;
  lang: string;
  adminUrl?: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!token || chatIds.length === 0) return;

  const lines = [
    `<b>🆕 Yangi ariza №${a.id}</b>`,
    "",
    `<b>Ism:</b> ${esc(a.name)}`,
    `<b>Telefon:</b> ${esc(a.phone)}`,
  ];
  if (a.company) lines.push(`<b>Korxona:</b> ${esc(a.company)}`);
  lines.push(`<b>Xizmat:</b> ${esc(a.serviceName || "Tanlanmagan")}`);
  if (a.message) lines.push(`<b>Izoh:</b> ${esc(a.message)}`);
  lines.push(`<b>Til:</b> ${a.lang === "ru" ? "ruscha" : "o'zbekcha"}`);
  if (a.adminUrl) lines.push("", `<a href="${esc(a.adminUrl)}">Admin panelda ochish</a>`);

  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: lines.join("\n"),
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) console.error("Telegram xabari yuborilmadi", res.status, await res.text());
      } catch (e) {
        console.error("Telegram xabari yuborilmadi", e);
      }
    }),
  );
}
