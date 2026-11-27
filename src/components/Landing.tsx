import Image from "next/image";
import Link from "next/link";
import { getClients, getContent, getServices } from "@/lib/data";
import { LANG_PATH, getDict, pick, type Lang } from "@/lib/i18n";
import { ApplicationForm, PickServiceButton } from "./ApplicationForm";
import { ClientsTabs } from "./ClientsTabs";
import { LangSwitcher } from "./LangSwitcher";
import { DesktopNav, NavMenu, type NavItem } from "./NavMenu";

/** "Aniq raqamlar. *Ishonchli* xulosa." → yulduzchalar orasidagi so'z oltin qiya bo'ladi */
function Accent({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <>
      {text.split(/\*([^*]+)\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="font-medium italic text-accent">
            {part}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** "11+" → "11" + oltin "+"; "1 kun" → "1" + oltin "kun" */
function StatValue({ value }: { value: string }) {
  const m = value.match(/^([\d\s.,]+)(.*)$/);
  if (!m || !m[2]) return <>{value}</>;
  return (
    <>
      {m[1]}
      <em className="not-italic text-accent">{m[2]}</em>
    </>
  );
}

/**
 * Savol-javob matni: "1. ..." yoki "- ..." bilan boshlangan qatorlar ro'yxat bo'ladi,
 * qolgan qatorlar oddiy paragraf.
 */
function RichAnswer({ text }: { text: string }) {
  const blocks: ({ kind: "p"; text: string } | { kind: "ol" | "ul"; items: string[] })[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const num = line.match(/^\d+[.)]\s+(.*)$/);
    const dash = line.match(/^[-•]\s+(.*)$/);
    const kind = num ? "ol" : dash ? "ul" : "p";
    const body = num?.[1] ?? dash?.[1] ?? line;
    const last = blocks[blocks.length - 1];
    if (kind !== "p" && last && last.kind === kind) last.items.push(body);
    else blocks.push(kind === "p" ? { kind, text: body } : { kind, items: [body] });
  }
  return (
    <div className="mt-3 max-w-[62ch] space-y-2 leading-7 text-muted">
      {blocks.map((b, i) =>
        b.kind === "p" ? (
          <p key={i}>{b.text}</p>
        ) : (
          (() => {
            const List = b.kind;
            return (
              <List key={i} className={`space-y-1 pl-6 marker:font-semibold marker:text-accent ${b.kind === "ol" ? "list-decimal" : "list-disc"}`}>
                {b.items.map((it, j) => (
                  <li key={j} className="pl-1">
                    {it}
                  </li>
                ))}
              </List>
            );
          })()
        ),
      )}
    </div>
  );
}

function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={className}>
            {p}
          </p>
        ))}
    </>
  );
}

/** "Farhod Mengniyozov" → "FM" */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function telegramHref(v?: string) {
  const s = (v ?? "").trim();
  if (!s) return "";
  if (/^https?:\/\//.test(s)) return s;
  return `https://t.me/${s.replace(/^@/, "").replace(/^t\.me\//, "")}`;
}

function instagramHref(v?: string) {
  const s = (v ?? "").trim();
  if (!s) return "";
  if (/^https?:\/\//.test(s)) return s;
  return `https://instagram.com/${s.replace(/^@/, "").replace(/^(www\.)?instagram\.com\//, "").replace(/\/+$/, "")}`;
}

const socialBtn =
  "inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.07] px-5 py-3 text-[0.95rem] font-semibold transition-colors hover:bg-white/15";
const socialIcon =
  "grid size-10 place-items-center rounded-full border-[1.5px] border-ledger text-ink transition-colors hover:border-accent hover:text-accent";

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13 1.4 11.5c-1-.3-1.1-1 .2-1.5L20.5 2.8c.9-.3 1.7.2 1.4 1.5z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

// Xizmat kartochkalari uchun ikonkalar (tartib bo'yicha aylanadi)
const ICONS = [
  <path key="a" d="M9 12l2 2 4-4M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />,
  <path key="b" d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" />,
  <path key="c" d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 7h8M8 11h8M8 15h5" />,
  <path key="d" d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />,
  <path key="e" d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  <path key="f" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  <path key="g" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />,
];

// Majburiy audit toifalari uchun ikonkalar (ro'yxat tartibida)
const MANDATORY_ICONS = [
  <path key="ajs" d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6M9 11h.01M15 11h.01" />,
  <path key="bank" d="M3 10h18L12 4 3 10zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 21h18" />,
  <path key="ins" d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />,
  <path key="agro" d="M12 21V11M12 11c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5zM7 21h10" />,
  <path key="fund" d="M4 19V5M4 19h16M8 15l3-4 3 2 5-6" />,
  <path key="charity" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  <path key="state" d="M5 21V4M5 4h11l-2 4 2 4H5M3 21h6" />,
  <path key="exch" d="M7 7h12l-3-3M17 17H5l3 3" />,
  <path key="it" d="M8 9l-3 3 3 3M16 9l3 3-3 3M13.5 6l-3 12" />,
];

// Ixtiyoriy audit holatlari uchun ikonkalar (ro'yxat tartibida)
const VOLUNTARY_ICONS = [
  <path key="owner" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />,
  <path key="change" d="M17 3l4 4-4 4M21 7H9M7 21l-4-4 4-4M3 17h12" />,
  <path key="court" d="M12 3v18M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7zM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7zM8 21h8" />,
  <path key="invest" d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  <path key="deal" d="M4 12l4-4 4 3 4-3 4 4M8 8l-4 4 6 6 2-2M16 8l4 4-6 6" />,
  <path key="tax" d="M9 14l6-6M9.5 8.5h.01M14.5 13.5h.01M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z" />,
];

const wrap = "mx-auto max-w-6xl px-5 md:px-8";
const h2 = "font-serif text-[2.1rem] font-bold leading-[1.1] tracking-tight text-ink md:text-5xl";

export async function Landing({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const [c, services, clients] = await Promise.all([
    getContent(lang),
    getServices({ activeOnly: true }),
    getClients({ activeOnly: true }),
  ]);
  // Mijozlar yillar bo'yicha (yangi yil birinchi)
  const clientGroups = [...new Set(clients.map((cl) => cl.year))].map((year) => ({
    year,
    items: clients.filter((cl) => cl.year === year).map((cl) => ({ name: cl.name, activity: cl.activity })),
  }));
  const phoneHref = `tel:${(c.contact_phone ?? "").replace(/[^\d+]/g, "")}`;
  const tgHref = telegramHref(c.contact_telegram);
  const igHref = instagramHref(c.contact_instagram);
  const year = new Date().getFullYear();
  const steps = [1, 2, 3, 4].map((n) => ({ title: c[`step_${n}_title`], text: c[`step_${n}_text`] }));
  const stats = [1, 2, 3, 4]
    .map((n) => ({ value: c[`stat_${n}_value`], label: c[`stat_${n}_label`] }))
    .filter((s) => s.value);
  const faqs = [1, 2, 3, 4]
    .map((n) => ({ q: c[`faq_${n}_q`], a: c[`faq_${n}_a`] }))
    .filter((f) => f.q && f.a);
  const facts = [c.fact_1, c.fact_2, c.fact_3].filter(Boolean);
  const lines = (v?: string) =>
    (v ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  const mandatoryItems = lines(c.mandatory_items);
  const mandatoryCriteria = lines(c.mandatory_criteria);
  // "Majburiy audit" xizmati bo'lsa, taklif tugmasi uni formada tanlab qo'yadi
  const mandatoryService = services.find((s) => /majburiy/i.test(s.name_uz)) ?? services[0];
  // "Sarlavha | izoh" qatorlari
  const pairs = (v?: string) =>
    lines(v).map((l) => {
      const [title, ...rest] = l.split("|");
      return { title: title.trim(), text: rest.join("|").trim() };
    });
  const voluntaryItems = pairs(c.voluntary_items);
  const voluntaryService = services.find((s) => /tashabbusli|ixtiyoriy/i.test(s.name_uz));
  const taxItems = pairs(c.tax_items);
  const taxService = services.find((s) => /soliq/i.test(s.name_uz));
  const accountingItems = pairs(c.accounting_items);
  const accountingService =
    services.find((s) => /buxgalter.*yurit/i.test(s.name_uz)) ?? services.find((s) => /buxgalter/i.test(s.name_uz));
  const team = [1, 2, 3, 4]
    .map((n) => ({
      name: c[`team_${n}_name`],
      role: c[`team_${n}_role`],
      bio: c[`team_${n}_bio`],
      photo: (c[`team_${n}_photo`] ?? "").trim(),
      creds: (c[`team_${n}_creds`] ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }))
    .filter((m) => m.name);
  // Menyu bandlari sahifadagi bo'limlar tartibida; xizmat turlari "Xizmatlar" ostida ochiladi
  const serviceLinks = [
    { href: "#xizmatlar", label: t.nav_all_services, show: true },
    { href: "#majburiy-audit", label: t.nav_mandatory, show: mandatoryItems.length > 0 },
    { href: "#ixtiyoriy-audit", label: t.nav_voluntary, show: voluntaryItems.length > 0 },
    { href: "#soliq-maslahati", label: t.nav_tax, show: taxItems.length > 0 },
    { href: "#buxgalteriya", label: t.nav_accounting, show: accountingItems.length > 0 },
  ]
    .filter((it) => it.show)
    .map(({ href, label }) => ({ href, label }));
  const navItems: NavItem[] = [
    { href: "#haqida", label: t.nav_about, show: true, children: undefined },
    { href: "#jamoa", label: t.nav_team, show: team.length > 0, children: undefined },
    {
      href: "#mijozlar",
      label: t.nav_clients,
      show: clientGroups.length > 0,
      // Har bir yil alohida band: "2026-yil", kelasi yil "2027-yil" o'zi qo'shiladi
      children: clientGroups.map((g) => ({ href: `#mijozlar-${g.year}`, label: t.clients_year.replace("{y}", String(g.year)) })),
    },
    {
      href: "#xizmatlar",
      label: t.nav_services,
      show: true,
      children: serviceLinks.length > 1 ? serviceLinks : undefined,
    },
    { href: "#tartib", label: t.nav_process, show: true },
    { href: "#savollar", label: t.nav_faq, show: faqs.length > 0 },
    { href: "#ariza", label: t.nav_contact, show: true },
  ]
    .filter((it) => it.show)
    .map(({ href, label, children }) => ({ href, label, children }));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-sheet focus:px-4 focus:py-2"
      >
        {t.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-ledger bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-6 px-5 md:px-8">
          <Link href={LANG_PATH[lang]} className="whitespace-nowrap font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Eminent <span className="text-accent">Audit</span>
          </Link>
          <DesktopNav items={navItems} label={t.menu} />
          <div className="ml-auto flex items-center gap-3 sm:gap-4 xl:ml-0">
            <LangSwitcher lang={lang} label={t.lang_label} />
            <NavMenu items={navItems} label={t.menu} menuLabel={t.menu_button} />
            <a href="#ariza" className="btn-gold hidden whitespace-nowrap px-5 py-2.5 text-sm md:inline-flex">
              {t.cta_consult}
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Bosh qism */}
        <section className={`${wrap} pt-16 text-center md:pt-24`}>
          {c.hero_eyebrow && <p className="eyebrow">{c.hero_eyebrow}</p>}
          <h1 className="mx-auto mt-5 max-w-[16ch] font-serif text-[2.6rem] font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-[5.2rem]">
            <Accent text={c.hero_title} />
          </h1>
          <p className="mx-auto mt-7 max-w-[58ch] text-lg leading-8 text-text/85">{c.hero_text}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            <a href="#ariza" className="btn-gold px-8 py-4 text-base">
              {t.cta_consult}
            </a>
            <a
              href="#xizmatlar"
              className="inline-flex items-center rounded-full border-[1.5px] border-ledger px-8 py-4 text-base font-semibold text-ink transition-colors hover:border-ink"
            >
              {t.cta_services}
            </a>
          </div>

          {stats.length > 0 && (
            <dl className="mt-20 grid grid-cols-2 border-t border-ledger md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col-reverse border-ledger px-3 py-8 max-md:[&:nth-child(-n+2)]:border-b max-md:odd:border-r md:py-10 md:[&:not(:last-child)]:border-r"
                >
                  <dt className="mt-2.5 text-[0.92rem] text-muted">{s.label}</dt>
                  <dd className="tnum font-serif text-4xl font-semibold text-ink md:text-5xl">
                    <StatValue value={s.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {/* Biz haqimizda */}
        <section id="haqida" className="bg-sand">
          <div className={`${wrap} grid gap-12 py-20 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-28`}>
            <div>
              <p className="eyebrow">{t.nav_about}</p>
              <h2 className={`${h2} mt-4`}>
                <Accent text={c.about_title} />
              </h2>
            </div>
            <div>
              <Paragraphs text={c.about_text ?? ""} className="mb-4 text-lg leading-8 text-text/85" />
              {facts.length > 0 && (
                <ul className="mt-8 grid gap-3">
                  {facts.map((f, i) => (
                    <li key={i} className="flex items-center gap-4 rounded-2xl border border-ledger bg-sheet px-5 py-4 text-[1.02rem] font-medium text-ink">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent/12 text-accent" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5 9-10" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* Jamoa — birinchi xodim (rahbar) keng to'q kartochkada */}
        {team.length > 0 && (
          <section id="jamoa" className={`${wrap} py-20 md:py-28`}>
            <div className="max-w-2xl">
              <p className="eyebrow">{t.nav_team}</p>
              <h2 className={`${h2} mt-4`}>
                <Accent text={c.team_title} />
              </h2>
              {c.team_text && <p className="mt-4 text-lg leading-8 text-muted">{c.team_text}</p>}
            </div>

            <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {team.map((m, i) => {
                const lead = i === 0;
                // Rahbar kartochkasida rasm bo'lsa: chapda tik portret, o'ngda matn
                const portrait = lead && !!m.photo;
                return (
                  <li
                    key={i}
                    className={`flex flex-col rounded-[1.5rem] border p-7 md:p-8 ${
                      lead
                        ? `border-ink bg-ink text-paper md:col-span-2 lg:col-span-3 lg:p-10 ${
                            portrait
                              ? "md:grid md:grid-cols-[15rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14"
                              : "lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-12"
                          }`
                        : "border-ledger bg-sheet"
                    }`}
                  >
                    {portrait && (
                      <div className="relative mb-7 aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-accent/50 md:mb-0 md:aspect-[4/5] md:self-start">
                        <Image
                          src={m.photo}
                          alt={m.name}
                          fill
                          sizes="(min-width: 1024px) 18rem, (min-width: 768px) 15rem, 100vw"
                          unoptimized={!m.photo.startsWith("/")}
                          className="object-cover object-[50%_22%] md:object-center"
                        />
                      </div>
                    )}
                    <div className={portrait ? "flex flex-col" : "contents"}>
                    <div className="flex items-center gap-5">
                      {!portrait && (
                        m.photo ? (
                          <span className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/40">
                            <Image src={m.photo} alt="" fill sizes="4rem" unoptimized={!m.photo.startsWith("/")} className="object-cover object-top" />
                          </span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className={`grid shrink-0 place-items-center rounded-full font-serif font-semibold italic ${
                              lead ? "size-20 bg-accent text-3xl text-white" : "size-16 bg-ink text-2xl text-accent"
                            }`}
                          >
                            {initials(m.name)}
                          </span>
                        )
                      )}
                      <div className="min-w-0">
                        <h3 className={`font-serif font-bold leading-tight ${lead ? "text-[1.9rem] text-white" : "text-2xl text-ink"}`}>{m.name}</h3>
                        {m.role && <p className="mt-1.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-accent">{m.role}</p>}
                      </div>
                    </div>
                    <div className={`mt-6 flex flex-1 flex-col ${lead && !portrait ? "lg:mt-0" : ""}`}>
                      {m.bio && <p className={`flex-1 leading-7 ${lead ? "text-lg text-paper/80" : "text-text/80"}`}>{m.bio}</p>}
                      {m.creds.length > 0 && (
                        <ul className="mt-6 flex flex-wrap gap-2">
                          {m.creds.map((cr, j) => (
                            <li
                              key={j}
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.8rem] font-semibold ${
                                lead ? "bg-white/10 text-paper" : "bg-accent/10 text-accent-dark"
                              }`}
                            >
                              {j === 0 && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <circle cx="12" cy="9" r="6" />
                                  <path d="M8.5 13.9 7 22l5-3 5 3-1.5-8.1" />
                                </svg>
                              )}
                              {cr}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Mijozlar — yillar bo'yicha (ro'yxat admin paneldan to'ldiriladi; bo'sh bo'lsa bo'lim ko'rinmaydi) */}
        {clientGroups.length > 0 && (
          <section id="mijozlar" className="relative border-t border-ledger">
            {/* Menyudagi "2026-yil" kabi havolalar uchun yil langarlari */}
            {clientGroups.map((g) => (
              <span key={g.year} id={`mijozlar-${g.year}`} className="absolute top-0" aria-hidden="true" />
            ))}
            <div className={`${wrap} py-20 md:py-28`}>
              <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end md:gap-16">
                <div>
                  <p className="eyebrow">{t.nav_clients}</p>
                  <h2 className={`${h2} mt-4`}>
                    <Accent text={c.clients_title} />
                  </h2>
                </div>
                {c.clients_text && <p className="text-lg leading-8 text-text/80">{c.clients_text}</p>}
              </div>
              <ClientsTabs
                groups={clientGroups}
                lang={lang}
                labels={{
                  years: t.clients_years,
                  search: t.clients_search,
                  more: t.clients_more,
                  less: t.clients_less,
                  none: t.clients_none,
                  total: t.clients_total,
                  year: t.clients_year,
                }}
              />
            </div>
          </section>
        )}

        {/* Xizmatlar — to'q yashil bo'lim (narxlar saytda ko'rsatilmaydi) */}
        <section id="xizmatlar" className="bg-ink text-paper">
          <div className={`${wrap} py-20 md:py-28`}>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">{t.nav_services}</p>
              <h2 className={`${h2} mt-4 !text-paper`}>
                <Accent text={c.services_title} />
              </h2>
              {c.services_subtitle && <p className="mt-4 text-lg text-paper/65">{c.services_subtitle}</p>}
            </div>

            <ul className="mt-14 flex flex-wrap justify-center gap-5">
              {services.map((s, i) => {
                const name = pick(s, "name", lang);
                const desc = pick(s, "desc", lang);
                const featured = i === 0;
                return (
                  <li
                    key={s.id}
                    className={`flex w-full flex-col rounded-[1.25rem] border p-7 transition-transform duration-200 hover:-translate-y-1 md:w-[calc(50%-0.625rem)] lg:w-[calc((100%-2.5rem)/3)] ${
                      featured ? "border-accent bg-accent" : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className={`mb-6 grid size-12 place-items-center rounded-xl ${featured ? "bg-white/18 text-white" : "bg-accent/15 text-accent"}`}
                      aria-hidden="true"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {ICONS[i % ICONS.length]}
                      </svg>
                    </span>
                    <h3 className="text-lg font-semibold text-white">{name}</h3>
                    {desc && <p className={`mt-2 flex-1 text-[0.95rem] leading-6 ${featured ? "text-white/85" : "text-paper/62"}`}>{desc}</p>}
                    <div className={`mt-6 border-t pt-5 ${featured ? "border-white/25" : "border-white/12"}`}>
                      <PickServiceButton
                        id={s.id}
                        label={t.choose}
                        className={`text-[0.95rem] font-semibold hover:underline ${featured ? "text-white" : "text-accent"}`}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            {c.services_note && <p className="mx-auto mt-10 max-w-[70ch] text-center text-[0.95rem] text-paper/60">{c.services_note}</p>}
          </div>
        </section>

        {/* Majburiy audit — qonun bo'yicha kimlar o'tishi shart */}
        {mandatoryItems.length > 0 && (
          <section id="majburiy-audit" className="bg-sand">
            <div className={`${wrap} py-20 md:py-28`}>
              <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end md:gap-16">
                <div>
                  <p className="eyebrow">{t.nav_mandatory}</p>
                  <h2 className={`${h2} mt-4`}>
                    <Accent text={c.mandatory_title} />
                  </h2>
                </div>
                {c.mandatory_text && <p className="text-lg leading-8 text-text/80">{c.mandatory_text}</p>}
              </div>

              <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mandatoryItems.map((item, i) => (
                  <li key={i} className="flex items-center gap-4 rounded-2xl border border-ledger bg-sheet p-4 sm:flex-col sm:items-stretch sm:p-6">
                    <div className="flex shrink-0 items-center justify-between">
                      <span className="grid size-11 place-items-center rounded-xl bg-ink text-accent" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          {MANDATORY_ICONS[i % MANDATORY_ICONS.length]}
                        </svg>
                      </span>
                      <span className="tnum hidden font-serif text-2xl font-medium italic text-ledger sm:inline" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="font-semibold leading-snug text-ink">{item}</p>
                  </li>
                ))}
              </ol>

              {mandatoryCriteria.length > 0 && (
                <div className="mt-5 rounded-[1.5rem] bg-ink p-7 text-paper md:p-10">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
                    <span className="grid size-16 shrink-0 place-items-center rounded-full border-[1.5px] border-accent font-serif text-xl font-semibold italic text-accent" aria-hidden="true">
                      2/{mandatoryCriteria.length}
                    </span>
                    <p className="text-lg leading-8 text-paper/85 [&_em]:font-semibold [&_em]:not-italic">
                      <Accent text={c.mandatory_criteria_title} />
                    </p>
                  </div>
                  <ul className="mt-8 grid gap-4 md:grid-cols-3">
                    {mandatoryCriteria.map((cr, i) => (
                      <li key={i} className="flex gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-5 leading-6 text-paper/90">
                        <svg className="mt-0.5 shrink-0 text-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12l5 5 9-10" />
                        </svg>
                        {cr}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(c.mandatory_cta_title || c.mandatory_cta_text) && (
                <div className="mt-5 flex flex-col gap-5 rounded-[1.5rem] border-[1.5px] border-accent/40 bg-sheet p-7 md:flex-row md:items-center md:justify-between md:p-8">
                  <div>
                    {c.mandatory_cta_title && <p className="font-serif text-2xl font-bold text-ink">{c.mandatory_cta_title}</p>}
                    {c.mandatory_cta_text && <p className="mt-1.5 max-w-[60ch] leading-7 text-muted">{c.mandatory_cta_text}</p>}
                  </div>
                  {mandatoryService ? (
                    <PickServiceButton id={mandatoryService.id} label={t.cta_consult} className="btn-gold shrink-0 px-7 py-3.5 text-base" />
                  ) : (
                    <a href="#ariza" className="btn-gold shrink-0 px-7 py-3.5 text-base">
                      {t.cta_consult}
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ixtiyoriy audit — kimlar uchun foydali */}
        {voluntaryItems.length > 0 && (
          <section id="ixtiyoriy-audit" className={`${wrap} py-20 md:py-28`}>
            <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end md:gap-16">
              <div>
                <p className="eyebrow">{t.nav_voluntary}</p>
                <h2 className={`${h2} mt-4`}>
                  <Accent text={c.voluntary_title} />
                </h2>
              </div>
              {c.voluntary_text && <p className="text-lg leading-8 text-text/80">{c.voluntary_text}</p>}
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {voluntaryItems.map((it, i) => (
                <li
                  key={i}
                  className="group rounded-[1.25rem] border border-ledger bg-sheet p-7 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent/50"
                >
                  <span
                    className="grid size-12 place-items-center rounded-full border-[1.5px] border-accent text-accent transition-colors group-hover:bg-accent group-hover:text-white"
                    aria-hidden="true"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {VOLUNTARY_ICONS[i % VOLUNTARY_ICONS.length]}
                    </svg>
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-bold leading-snug text-ink">{it.title}</h3>
                  {it.text && <p className="mt-2 leading-7 text-muted">{it.text}</p>}
                </li>
              ))}
            </ul>

            {(c.voluntary_cta_title || c.voluntary_cta_text) && (
              <div className="mt-5 flex flex-col gap-5 rounded-[1.5rem] bg-ink p-7 text-paper md:flex-row md:items-center md:justify-between md:p-8">
                <div>
                  {c.voluntary_cta_title && <p className="font-serif text-2xl font-bold text-white">{c.voluntary_cta_title}</p>}
                  {c.voluntary_cta_text && <p className="mt-1.5 max-w-[62ch] leading-7 text-paper/75">{c.voluntary_cta_text}</p>}
                </div>
                {voluntaryService ? (
                  <PickServiceButton id={voluntaryService.id} label={t.cta_consult} className="btn-gold shrink-0 px-7 py-3.5 text-base" />
                ) : (
                  <a href="#ariza" className="btn-gold shrink-0 px-7 py-3.5 text-base">
                    {t.cta_consult}
                  </a>
                )}
              </div>
            )}
          </section>
        )}

        {/* Soliq maslahati — chapda sarlavha va taklif, o'ngda raqamlangan ro'yxat */}
        {taxItems.length > 0 && (
          <section id="soliq-maslahati" className="bg-sand">
            <div className={`${wrap} grid gap-12 py-20 md:py-28 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16`}>
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="eyebrow">{t.nav_tax}</p>
                <h2 className={`${h2} mt-4`}>
                  <Accent text={c.tax_title} />
                </h2>
                {c.tax_text && <p className="mt-5 text-lg leading-8 text-text/80">{c.tax_text}</p>}
                {(c.tax_cta_title || c.tax_cta_text) && (
                  <div className="mt-8 rounded-[1.5rem] bg-ink p-7 text-paper">
                    {c.tax_cta_title && <p className="font-serif text-2xl font-bold text-white">{c.tax_cta_title}</p>}
                    {c.tax_cta_text && <p className="mt-2 leading-7 text-paper/75">{c.tax_cta_text}</p>}
                    {taxService ? (
                      <PickServiceButton id={taxService.id} label={t.cta_consult} className="btn-gold mt-6 px-7 py-3.5 text-base" />
                    ) : (
                      <a href="#ariza" className="btn-gold mt-6 px-7 py-3.5 text-base">
                        {t.cta_consult}
                      </a>
                    )}
                  </div>
                )}
              </div>

              <ol className="divide-y divide-ledger rounded-[1.5rem] border border-ledger bg-sheet">
                {taxItems.map((it, i) => (
                  <li key={i} className="flex gap-5 p-6 md:gap-7 md:p-8">
                    <span className="tnum w-10 shrink-0 font-serif text-3xl font-medium italic leading-none text-accent" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold leading-snug text-ink">{it.title}</h3>
                      {it.text && <p className="mt-1.5 leading-7 text-muted">{it.text}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Buxgalteriya xizmatlari — to'q yashil bo'lim, raqamlangan kartochkalar */}
        {accountingItems.length > 0 && (
          <section id="buxgalteriya" className="bg-ink text-paper">
            <div className={`${wrap} py-20 md:py-28`}>
              <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end md:gap-16">
                <div>
                  <p className="eyebrow">{t.nav_accounting}</p>
                  <h2 className={`${h2} mt-4 !text-paper`}>
                    <Accent text={c.accounting_title} />
                  </h2>
                </div>
                {c.accounting_text && <p className="text-lg leading-8 text-paper/75">{c.accounting_text}</p>}
              </div>

              <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {accountingItems.map((it, i) => (
                  <li
                    key={i}
                    className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-7 transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-accent/60"
                  >
                    <span className="tnum font-serif text-3xl font-medium italic leading-none text-accent" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-serif text-xl font-bold leading-snug text-white">{it.title}</h3>
                    {it.text && <p className="mt-2 leading-7 text-paper/65">{it.text}</p>}
                  </li>
                ))}
              </ol>

              {(c.accounting_cta_title || c.accounting_cta_text) && (
                <div className="mt-5 flex flex-col gap-5 rounded-[1.5rem] border-[1.5px] border-accent/50 p-7 md:flex-row md:items-center md:justify-between md:p-8">
                  <div>
                    {c.accounting_cta_title && <p className="font-serif text-2xl font-bold text-white">{c.accounting_cta_title}</p>}
                    {c.accounting_cta_text && <p className="mt-1.5 max-w-[62ch] leading-7 text-paper/75">{c.accounting_cta_text}</p>}
                  </div>
                  {accountingService ? (
                    <PickServiceButton id={accountingService.id} label={t.cta_consult} className="btn-gold shrink-0 px-7 py-3.5 text-base" />
                  ) : (
                    <a href="#ariza" className="btn-gold shrink-0 px-7 py-3.5 text-base">
                      {t.cta_consult}
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Ish tartibi */}
        <section id="tartib" className={`${wrap} py-20 md:py-28`}>
          <p className="eyebrow">{t.nav_process}</p>
          <h2 className={`${h2} mt-4`}>
            <Accent text={c.steps_title} />
          </h2>
          <ol className="steps-line relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => (
              <li key={i} className="relative">
                <span className="relative z-10 grid size-[3.6rem] place-items-center rounded-full border-[1.5px] border-accent bg-paper font-serif text-2xl font-medium italic text-accent">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 leading-7 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Ko'p beriladigan savollar */}
        {faqs.length > 0 && (
          <section id="savollar" className="bg-sand">
            <div className={`${wrap} grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:py-28`}>
              <div>
                <p className="eyebrow">{t.nav_faq}</p>
                <h2 className={`${h2} mt-4`}>
                  <Accent text={c.faq_title} />
                </h2>
                {c.faq_text && <p className="mt-4 max-w-[40ch] text-lg text-muted">{c.faq_text}</p>}
              </div>
              <div className="faq">
                {faqs.map((f, i) => (
                  <details key={i} open={i === 0} className="border-b border-ledger py-6">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[1.08rem] font-semibold text-ink">
                      {f.q}
                    </summary>
                    <RichAnswer text={f.a} />
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Ariza va aloqa */}
        <section id="ariza" className={`${wrap} py-20 md:py-28`}>
          <div className="grid gap-12 rounded-[2rem] bg-ink p-7 text-paper sm:p-10 md:grid-cols-[1fr_1.15fr] md:gap-14 lg:p-16">
            <div id="aloqa">
              <p className="eyebrow">{t.cta_apply}</p>
              <h2 className={`${h2} mt-4 !text-paper`}>
                <Accent text={c.form_title} />
              </h2>
              <p className="mt-4 max-w-[42ch] text-lg leading-8 text-paper/75">{c.form_text}</p>
              <dl className="mt-9 space-y-5">
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-paper/55">{t.phone}</dt>
                  <dd className="mt-1"><a href={phoneHref} className="tnum text-lg font-semibold hover:text-accent">{c.contact_phone}</a></dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-paper/55">{t.email}</dt>
                  <dd className="mt-1"><a href={`mailto:${c.contact_email}`} className="text-lg font-semibold hover:text-accent">{c.contact_email}</a></dd>
                </div>
                {c.contact_address && (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-paper/55">{t.address}</dt>
                    <dd className="mt-1 text-lg font-semibold">{c.contact_address}</dd>
                  </div>
                )}
                {c.contact_hours && (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-paper/55">{t.hours}</dt>
                    <dd className="mt-1 text-lg font-semibold">{c.contact_hours}</dd>
                  </div>
                )}
              </dl>
              {(tgHref || igHref) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {tgHref && (
                    <a href={tgHref} target="_blank" rel="noopener noreferrer" className={socialBtn}>
                      <TelegramIcon />
                      {t.telegram}
                    </a>
                  )}
                  {igHref && (
                    <a href={igHref} target="_blank" rel="noopener noreferrer" className={socialBtn}>
                      <InstagramIcon />
                      {t.instagram}
                    </a>
                  )}
                </div>
              )}
            </div>
            <ApplicationForm
              lang={lang}
              t={t}
              services={services.map((s) => ({ id: s.id, name: pick(s, "name", lang) }))}
            />
          </div>
        </section>
      </main>

      <footer className={`${wrap} pb-12`}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ledger pt-8 text-sm text-muted">
          <span className="font-serif text-xl font-bold text-ink">
            Eminent <span className="text-accent">Audit</span>
          </span>
          {(tgHref || igHref) && (
            <div className="flex items-center gap-2.5">
              {tgHref && (
                <a href={tgHref} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={socialIcon}>
                  <TelegramIcon />
                </a>
              )}
              {igHref && (
                <a href={igHref} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialIcon}>
                  <InstagramIcon />
                </a>
              )}
            </div>
          )}
          <span>© {year} Eminent Audit. {t.rights}</span>
        </div>
      </footer>
    </>
  );
}
