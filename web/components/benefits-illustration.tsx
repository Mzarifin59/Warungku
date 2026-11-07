export function BenefitsIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 260 180"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* leaves */}
      <path d="M20 180C8 140 18 100 48 80c14 38 8 70-8 100z" fill="#3fae6a" />
      <path d="M44 180c-2-34 10-62 36-80 6 34-4 62-22 80z" fill="#1f8a52" />
      <path d="M236 180c12-40 2-80-28-100-14 38-8 70 8 100z" fill="#3fae6a" />
      <path d="M212 180c2-34-10-62-36-80-6 34 4 62 22 80z" fill="#1f8a52" />
      <circle cx="30" cy="48" r="4" fill="#227bf3" opacity=".5" />
      <path d="M244 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#227bf3" />
      {/* phone */}
      <rect x="88" y="6" width="84" height="190" rx="14" fill="#1f2d4d" />
      <rect x="93" y="11" width="74" height="180" rx="10" fill="#fff" />
      <rect x="118" y="15" width="24" height="5" rx="2.5" fill="#1f2d4d" />
      <rect x="93" y="26" width="74" height="40" fill="#edf6ff" />
      <rect x="107" y="32" width="46" height="9" rx="4.5" fill="#227bf3" />
      <rect x="112" y="48" width="36" height="4" rx="2" fill="#9fc4f5" />
      {/* storefront */}
      <path d="M100 82h60l4 18H96z" fill="#227bf3" />
      <path d="M108 82l-4 18M124 82l-2 18M136 82l2 18M152 82l4 18" stroke="#fff" strokeWidth="3" />
      <rect x="102" y="100" width="56" height="48" fill="#dbedff" />
      <rect x="108" y="108" width="20" height="20" rx="2" fill="#fff" />
      <rect x="134" y="108" width="18" height="40" rx="2" fill="#f4b740" />
      <rect x="98" y="148" width="64" height="5" rx="2" fill="#227bf3" />
    </svg>
  );
}
