// Auditorlik muhri — sahifaning yagona "jasur" elementi.
export function Stamp({ word, ring, year }: { word: string; ring: string; year: number }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className="stamp h-auto w-full text-stamp"
      role="img"
      aria-label={`${word} — Eminent Audit`}
    >
      <defs>
        <path id="stamp-ring" d="M120,120 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
        <filter id="stamp-ink" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6"
            result="mask"
          />
          <feComposite in="SourceGraphic" in2="mask" operator="in" />
        </filter>
      </defs>
      <g filter="url(#stamp-ink)" fill="none" stroke="currentColor">
        <circle cx="120" cy="120" r="112" strokeWidth="5" />
        <circle cx="120" cy="120" r="104" strokeWidth="1.5" />
        <circle cx="120" cy="120" r="70" strokeWidth="1.5" />
        <text fill="currentColor" stroke="none" fontFamily="var(--font-sans)" fontWeight="700" fontSize="13">
          <textPath href="#stamp-ring" startOffset="0" textLength={548} lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
        <rect x="18" y="100" width="204" height="40" fill="var(--color-paper)" strokeWidth="3" />
        <text
          x="120"
          y="128"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontFamily="var(--font-sans)"
          fontWeight="800"
          fontSize={word.length > 10 ? 22 : 24}
          letterSpacing="2"
        >
          {word}
        </text>
        <text x="120" y="88" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-serif)" fontWeight="700" fontSize="15">
          ★ ★ ★
        </text>
        <text x="120" y="166" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="var(--font-sans)" fontWeight="700" fontSize="16" letterSpacing="3">
          {year}
        </text>
      </g>
    </svg>
  );
}
