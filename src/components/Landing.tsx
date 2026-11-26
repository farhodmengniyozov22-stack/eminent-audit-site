import Link from "next/link";
import { getContent, getServices } from "@/lib/data";
import { LANG_PATH, LANGS, dict, formatPrice, pick, type Lang } from "@/lib/i18n";
import { ApplicationForm, PickServiceButton } from "./ApplicationForm";

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

function telegramHref(v?: string) {
  const s = (v ?? "").trim();
  if (!s) return "";
  if (/^https?:\/\//.test(s)) return s;
  return `https://t.me/${s.replace(/^@/, "").replace(/^t\.me\//, "")}`;
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

const wrap = "mx-auto max-w-6xl px-5 md:px-8";
const h2 = "font-serif text-[2.1rem] font-bold leading-[1.1] tracking-tight text-ink md:text-5xl";

export async function Landing({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const [c, services] = await Promise.all([getContent(lang), getServices({ activeOnly: true })]);
  const phoneHref = `tel:${(c.contact_phone ?? "").replace(/[^\d+]/g, "")}`;
  const tgHref = telegramHref(c.contact_telegram);
  const year = new Date().getFullYear();
  const steps = [1, 2, 3, 4].map((n) => ({ title: c[`step_${n}_title`], text: c[`step_${n}_text`] }));
  const stats = [1, 2, 3, 4]
    .map((n) => ({ value: c[`stat_${n}_value`], label: c[`stat_${n}_label`] }))
    .filter((s) => s.value);
  const faqs = [1, 2, 3, 4]
    .map((n) => ({ q: c[`faq_${n}_q`], a: c[`faq_${n}_a`] }))
    .filter((f) => f.q && f.a);
  const facts = [c.fact_1, c.fact_2, c.fact_3].filter(Boolean);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-sheet focus:px-4 focus:py-2"
      >
        {t.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-ledger bg-paper/90 backdrop-blur-md">
        <div className={`${wrap} flex h-[4.5rem] items-center gap-6`}>
          <Link href={LANG_PATH[lang]} className="whitespace-nowrap font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Eminent <span className="text-accent">Audit</span>
          </Link>
          <nav
            aria-label={t.menu}
            className="mx-auto hidden items-center gap-7 text-[0.95rem] font-medium lg:flex"
          >
            <a href="#xizmatlar" className="hover:text-accent">{t.nav_services}</a>
            <a href="#haqida" className="hover:text-accent">{t.nav_about}</a>
            <a href="#tartib" className="hover:text-accent">{t.nav_process}</a>
            {faqs.length > 0 && <a href="#savollar" className="hover:text-accent">{t.nav_faq}</a>}
            <a href="#ariza" className="hover:text-accent">{t.nav_contact}</a>
          </nav>
          <div className="ml-auto flex items-center gap-5 lg:ml-0">
            <nav aria-label={t.lang_label} className="flex items-center text-[0.8rem] font-semibold tracking-wide">
              {LANGS.map((l, i) => (
                <span key={l} className="flex items-center">
                  {i > 0 && <span className="px-1.5 text-ledger" aria-hidden="true">·</span>}
                  {l === lang ? (
                    <span aria-current="page" className="text-accent">{l.toUpperCase()}</span>
                  ) : (
                    <Link href={LANG_PATH[l]} hrefLang={l} lang={l} className="text-muted hover:text-ink">
                      {l.toUpperCase()}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
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

        {/* Xizmatlar va narxlar — to'q yashil bo'lim */}
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
                const p = formatPrice(s, lang);
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
                    <div className={`mt-6 flex items-end justify-between gap-3 border-t pt-5 ${featured ? "border-white/25" : "border-white/12"}`}>
                      <p>
                        <span className="tnum block font-serif text-[1.4rem] font-semibold leading-tight text-white">{p.amount}</span>
                        {p.unit && <span className={`text-sm ${featured ? "text-white/80" : "text-paper/60"}`}>/ {p.unit}</span>}
                      </p>
                      <PickServiceButton
                        id={s.id}
                        label={t.choose}
                        className={`shrink-0 text-sm font-semibold hover:underline ${featured ? "text-white" : "text-accent"}`}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
            {c.services_note && <p className="mx-auto mt-10 max-w-[70ch] text-center text-[0.95rem] text-paper/60">{c.services_note}</p>}
          </div>
        </section>

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
                    <p className="mt-3 max-w-[62ch] leading-7 text-muted">{f.a}</p>
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
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-paper/55">{t.address} · {t.hours}</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    {c.contact_address} · {c.contact_hours}
                  </dd>
                </div>
              </dl>
              {tgHref && (
                <a
                  href={tgHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.07] px-5 py-3 text-[0.95rem] font-semibold transition-colors hover:bg-white/15"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13 1.4 11.5c-1-.3-1.1-1 .2-1.5L20.5 2.8c.9-.3 1.7.2 1.4 1.5z" />
                  </svg>
                  {t.telegram}
                </a>
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
          <span>© {year} Eminent Audit. {t.rights}</span>
        </div>
      </footer>
    </>
  );
}
