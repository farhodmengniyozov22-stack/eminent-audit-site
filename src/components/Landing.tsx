import Link from "next/link";
import { getContent, getServices } from "@/lib/data";
import { dict, formatPrice, type Lang } from "@/lib/i18n";
import { ApplicationForm, PickServiceButton } from "./ApplicationForm";
import { Stamp } from "./Stamp";

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

export async function Landing({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const [c, services] = await Promise.all([getContent(lang), getServices({ activeOnly: true })]);
  const phoneHref = `tel:${(c.contact_phone ?? "").replace(/[^\d+]/g, "")}`;
  const otherHref = lang === "uz" ? "/ru" : "/";
  const year = new Date().getFullYear();
  const steps = [1, 2, 3, 4].map((n) => ({ title: c[`step_${n}_title`], text: c[`step_${n}_text`] }));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-sheet focus:px-4 focus:py-2"
      >
        {lang === "uz" ? "Asosiy mazmunga o'tish" : "Перейти к содержанию"}
      </a>

      <header className="sticky top-0 z-40 border-b border-ledger bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 md:px-8">
          <Link href={lang === "uz" ? "/" : "/ru"} className="font-serif text-xl font-bold tracking-tight text-ink">
            Eminent Audit
          </Link>
          <nav aria-label={lang === "uz" ? "Asosiy menyu" : "Основное меню"} className="ml-auto hidden items-center gap-7 text-[0.95rem] md:flex">
            <a href="#xizmatlar" className="hover:text-ink">{t.nav_services}</a>
            <a href="#tartib" className="hover:text-ink">{t.nav_process}</a>
            <a href="#aloqa" className="hover:text-ink">{t.nav_contact}</a>
          </nav>
          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <Link href={otherHref} hrefLang={lang === "uz" ? "ru" : "uz"} className="text-sm font-medium text-muted hover:text-ink">
              {t.other_lang}
            </Link>
            <a
              href="#ariza"
              className="hidden rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft sm:inline-block"
            >
              {t.cta_apply}
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Bosh qism: daftar varag'i va muhr */}
        <section className="ledger-bg border-b border-ledger">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-14 md:grid-cols-[1fr_minmax(0,320px)] md:px-8 md:pb-24 md:pt-20">
            <div className="pl-10 md:pl-20">
              <h1 className="max-w-[17ch] font-serif text-[2.4rem] font-semibold leading-[1.08] tracking-tight text-ink md:text-[3.6rem]">
                {c.hero_title}
              </h1>
              <p className="mt-6 max-w-[58ch] text-lg leading-8 text-text/85">{c.hero_text}</p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a href="#ariza" className="rounded-md bg-ink px-6 py-3.5 text-base font-semibold text-white hover:bg-ink-soft">
                  {t.cta_apply}
                </a>
                <a href={phoneHref} className="tnum text-base font-semibold text-ink underline decoration-ledger decoration-2 underline-offset-[6px] hover:decoration-ink">
                  {c.contact_phone}
                </a>
              </div>
            </div>
            <div className="mx-auto w-48 md:w-full md:max-w-[300px]">
              <Stamp word={t.stamp_word} ring={t.stamp_ring} year={year} />
            </div>
          </div>
        </section>

        {/* Biz haqimizda */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="max-w-[24ch] font-serif text-3xl font-semibold leading-tight text-ink md:text-4xl">{c.about_title}</h2>
              <Paragraphs text={c.about_text ?? ""} className="mt-5 max-w-[64ch] text-lg leading-8 text-text/85" />
            </div>
            <ul className="self-end border-l-2 border-ink/15 pl-6">
              {[c.fact_1, c.fact_2, c.fact_3].filter(Boolean).map((f, i) => (
                <li key={i} className="py-3 text-lg leading-snug text-text [&:not(:last-child)]:border-b [&:not(:last-child)]:border-ledger">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Xizmatlar va narxlar — hisob daftari jadvali */}
        <section id="xizmatlar" className="border-y border-ledger bg-sheet">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
            <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">{c.services_title}</h2>
            <div className="mt-10" role="table" aria-label={c.services_title}>
              <div role="row" className="hidden border-b-2 border-ink pb-2 text-sm font-semibold text-muted md:flex">
                <span role="columnheader" className="flex-1">{t.col_service}</span>
                <span role="columnheader" className="w-[22rem] text-right">{t.col_price}</span>
                <span className="w-24" />
              </div>
              {services.map((s) => {
                const p = formatPrice(s, lang);
                const name = lang === "uz" ? s.name_uz : s.name_ru;
                const desc = lang === "uz" ? s.desc_uz : s.desc_ru;
                return (
                  <div role="row" key={s.id} className="border-b border-ledger py-5 md:flex md:items-baseline md:gap-4">
                    <div role="cell" className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-lg font-semibold text-text">{name}</h3>
                        <span className="leader hidden md:block" aria-hidden="true" />
                      </div>
                      {desc && <p className="mt-1 max-w-[62ch] text-[0.95rem] leading-6 text-muted">{desc}</p>}
                    </div>
                    <div role="cell" className="mt-3 md:mt-0 md:w-[22rem] md:text-right">
                      <span className="tnum text-lg font-semibold text-ink">{p.amount}</span>
                      {p.unit && <span className="text-muted"> / {p.unit}</span>}
                    </div>
                    <div role="cell" className="mt-2 md:mt-0 md:w-24 md:text-right">
                      <PickServiceButton id={s.id} label={t.choose} />
                    </div>
                  </div>
                );
              })}
            </div>
            {c.services_note && <p className="mt-6 max-w-[70ch] text-[0.95rem] text-muted">{c.services_note}</p>}
          </div>
        </section>

        {/* Ish tartibi — haqiqiy ketma-ketlik, shuning uchun raqamlangan */}
        <section id="tartib" className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">{c.steps_title}</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={i} className="border-t-2 border-ink pt-4">
                <span className="tnum font-serif text-2xl font-semibold text-stamp">{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 leading-7 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Ariza */}
        <section id="ariza" className="ledger-bg border-t border-ledger">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_1.6fr] md:px-8">
            <div className="pl-10 md:pl-20" id="aloqa">
              <h2 className="font-serif text-3xl font-semibold text-ink md:text-4xl">{c.form_title}</h2>
              <p className="mt-4 max-w-[42ch] text-lg leading-8 text-text/85">{c.form_text}</p>
              <dl className="mt-8 space-y-4 text-[0.95rem]">
                <div>
                  <dt className="text-muted">{t.phone}</dt>
                  <dd><a href={phoneHref} className="tnum font-semibold text-ink hover:underline">{c.contact_phone}</a></dd>
                </div>
                <div>
                  <dt className="text-muted">{t.email}</dt>
                  <dd><a href={`mailto:${c.contact_email}`} className="font-semibold text-ink hover:underline">{c.contact_email}</a></dd>
                </div>
                <div>
                  <dt className="text-muted">{t.address}</dt>
                  <dd className="font-medium">{c.contact_address}</dd>
                </div>
                <div>
                  <dt className="text-muted">{t.hours}</dt>
                  <dd className="font-medium">{c.contact_hours}</dd>
                </div>
              </dl>
            </div>
            <ApplicationForm
              lang={lang}
              t={t}
              services={services.map((s) => ({ id: s.id, name: lang === "uz" ? s.name_uz : s.name_ru }))}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-ledger bg-ink text-white/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm md:px-8">
          <span className="font-serif text-base font-semibold text-white">Eminent Audit</span>
          <span>© {year} Eminent Audit. {t.rights}</span>
        </div>
      </footer>
    </>
  );
}
