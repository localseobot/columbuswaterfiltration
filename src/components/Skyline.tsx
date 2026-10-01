/**
 * Simplified downtown Columbus skyline seen from the Scioto: LeVeque Tower's
 * stepped spire, Rhodes Tower, the Huntington Center, and the Main Street
 * Bridge arch, over a strip of river. Purely decorative.
 */
export default function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 140"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      {/* low buildings, left */}
      <rect x="40" y="104" width="60" height="36" />
      <rect x="110" y="92" width="44" height="48" />
      <rect x="160" y="98" width="70" height="42" />
      <rect x="240" y="80" width="40" height="60" />
      <rect x="288" y="88" width="56" height="52" />
      {/* Huntington Center */}
      <path d="M360 140 V54 L378 42 L396 54 V140 Z" />
      <rect x="404" y="70" width="44" height="70" />
      {/* LeVeque Tower: stepped setbacks and spire */}
      <path d="M462 140 V52 H470 V40 H476 V30 H480 V14 H484 V30 H488 V40 H494 V52 H502 V140 Z" />
      <rect x="510" y="76" width="36" height="64" />
      {/* Rhodes Tower */}
      <rect x="556" y="24" width="46" height="116" />
      <rect x="610" y="62" width="40" height="78" />
      <path d="M660 140 V46 H690 V36 H700 V140 Z" />
      <rect x="708" y="70" width="52" height="70" />
      <rect x="768" y="84" width="38" height="56" />
      {/* Main Street Bridge inclined arch */}
      <path
        d="M800 132 Q880 66 960 132"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
      <rect x="800" y="128" width="170" height="5" />
      {/* low buildings, right */}
      <rect x="980" y="96" width="48" height="44" />
      <rect x="1036" y="86" width="40" height="54" />
      <rect x="1084" y="102" width="64" height="38" />
      <rect x="1152" y="110" width="48" height="30" />
      <rect x="0" y="134" width="1200" height="6" />
    </svg>
  );
}
