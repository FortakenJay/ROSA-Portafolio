import type { PaletteName, PlateSpec } from "@/lib/content";

type Palette = {
  ground: string;
  ink: string;
  lace: string;
  rose: string;
  blush: string;
};

const palettes: Record<PaletteName, Palette> = {
  night: {
    ground: "#3A2030",
    ink: "#FBF6F8",
    lace: "#E4C9D4",
    rose: "#C45B73",
    blush: "#F3E7EE",
  },
  paper: {
    ground: "#FBF6F8",
    ink: "#24151C",
    lace: "#F3E7EE",
    rose: "#9E3D56",
    blush: "#E4C9D4",
  },
  blush: {
    ground: "#E7C9D4",
    ink: "#24151C",
    lace: "#FBF6F8",
    rose: "#9E3D56",
    blush: "#FBF6F8",
  },
  rose: {
    ground: "#9E3D56",
    ink: "#FBF6F8",
    lace: "#F3E7EE",
    rose: "#E7C9D4",
    blush: "#3A2030",
  },
};

function Bow({ p }: { p: Palette }) {
  return (
    <g>
      <ellipse cx="310" cy="220" rx="108" ry="78" fill={p.blush} stroke={p.ink} strokeWidth="7" transform="rotate(-18 310 220)" />
      <ellipse cx="318" cy="220" rx="62" ry="40" fill={p.ground} stroke={p.ink} strokeWidth="5" transform="rotate(-18 318 220)" />
      <ellipse cx="490" cy="220" rx="108" ry="78" fill={p.blush} stroke={p.ink} strokeWidth="7" transform="rotate(18 490 220)" />
      <ellipse cx="482" cy="220" rx="62" ry="40" fill={p.ground} stroke={p.ink} strokeWidth="5" transform="rotate(18 482 220)" />
      <circle cx="400" cy="228" r="26" fill={p.rose} stroke={p.ink} strokeWidth="7" />
      <path d="M372 248 C330 310 280 340 230 400" fill="none" stroke={p.ink} strokeWidth="10" strokeLinecap="round" />
      <path d="M428 248 C470 310 520 340 570 400" fill="none" stroke={p.ink} strokeWidth="10" strokeLinecap="round" />
      <path d="M352 270 C320 320 290 345 250 378" fill="none" stroke={p.rose} strokeWidth="7" strokeLinecap="round" />
      <path d="M448 270 C480 320 510 345 550 378" fill="none" stroke={p.rose} strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

function Rose({ p }: { p: Palette }) {
  return (
    <g>
      <path d="M400 250 C360 340 330 390 300 450" fill="none" stroke={p.ink} strokeWidth="8" strokeLinecap="round" />
      <path d="M392 320 C340 330 300 360 270 400" fill={p.blush} stroke={p.ink} strokeWidth="6" />
      <path d="M408 350 C460 360 500 390 530 430" fill={p.blush} stroke={p.ink} strokeWidth="6" />
      <circle cx="400" cy="200" r="46" fill={p.rose} stroke={p.ink} strokeWidth="7" />
      <circle cx="348" cy="230" r="38" fill={p.blush} stroke={p.ink} strokeWidth="7" />
      <circle cx="452" cy="230" r="38" fill={p.blush} stroke={p.ink} strokeWidth="7" />
      <circle cx="370" cy="160" r="34" fill={p.lace} stroke={p.ink} strokeWidth="7" />
      <circle cx="430" cy="160" r="34" fill={p.lace} stroke={p.ink} strokeWidth="7" />
      <circle cx="400" cy="188" r="16" fill={p.ground} stroke={p.ink} strokeWidth="5" />
    </g>
  );
}

function Arch({ p }: { p: Palette }) {
  return (
    <g>
      <path d="M230 470 V230 C230 120 570 120 570 230 V470" fill={p.blush} stroke={p.ink} strokeWidth="8" />
      <path d="M280 470 V240 C280 175 520 175 520 240 V470" fill={p.ground} stroke={p.ink} strokeWidth="6" />
      <circle cx="400" cy="250" r="16" fill={p.rose} />
      <path d="M400 266 C388 310 360 330 330 370" fill="none" stroke={p.rose} strokeWidth="6" strokeLinecap="round" />
      <circle cx="250" cy="150" r="10" fill={p.rose} />
      <circle cx="300" cy="110" r="14" fill={p.lace} stroke={p.ink} strokeWidth="4" />
      <circle cx="500" cy="108" r="12" fill={p.rose} />
      <circle cx="555" cy="150" r="9" fill={p.lace} stroke={p.ink} strokeWidth="4" />
    </g>
  );
}

function Candle({ p }: { p: Palette }) {
  return (
    <g>
      <rect x="345" y="150" width="110" height="250" rx="8" fill={p.lace} stroke={p.ink} strokeWidth="7" />
      <path d="M400 150 C390 120 410 100 400 70 C430 110 430 130 400 150" fill={p.rose} stroke={p.ink} strokeWidth="6" />
      <path d="M345 250 C380 270 400 240 455 260 L455 400 L345 400 Z" fill={p.blush} opacity="0.9" />
      <rect x="300" y="390" width="200" height="28" fill={p.ink} />
      <path d="M470 180 C510 200 520 250 500 300" fill="none" stroke={p.rose} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function Parasol({ p }: { p: Palette }) {
  return (
    <g>
      <path d="M160 250 C160 120 640 120 640 250 Z" fill={p.blush} stroke={p.ink} strokeWidth="8" />
      <path d="M160 250 C240 210 320 210 400 250 C480 210 560 210 640 250" fill="none" stroke={p.ink} strokeWidth="5" />
      <path d="M400 250 V430" stroke={p.ink} strokeWidth="8" strokeLinecap="round" />
      <path d="M400 430 C400 450 440 455 450 435" fill="none" stroke={p.ink} strokeWidth="8" strokeLinecap="round" />
      <circle cx="400" cy="188" r="14" fill={p.rose} stroke={p.ink} strokeWidth="5" />
      <path d="M250 250 C250 180 330 160 400 188" fill="none" stroke={p.rose} strokeWidth="5" />
    </g>
  );
}

function WindowMotif({ p }: { p: Palette }) {
  return (
    <g>
      <rect x="210" y="70" width="380" height="360" rx="150" fill={p.blush} stroke={p.ink} strokeWidth="8" />
      <path d="M400 70 V430 M210 250 H590" stroke={p.ink} strokeWidth="6" />
      <circle cx="470" cy="160" r="36" fill={p.lace} stroke={p.ink} strokeWidth="6" />
      <path d="M210 140 C150 180 140 280 190 340" fill={p.rose} stroke={p.ink} strokeWidth="6" />
      <path d="M590 150 C660 190 670 300 610 360" fill={p.rose} stroke={p.ink} strokeWidth="6" />
    </g>
  );
}

const motifs = {
  bow: Bow,
  rose: Rose,
  arch: Arch,
  candle: Candle,
  parasol: Parasol,
  window: WindowMotif,
};

export function Plate({
  spec,
  className,
}: {
  spec: PlateSpec;
  className?: string;
}) {
  const palette = palettes[spec.palette];
  const Motif = motifs[spec.motif];

  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="800" height="500" fill={palette.ground} />
      <g transform={spec.flip ? "translate(800 0) scale(-1 1)" : undefined}>
        <Motif p={palette} />
      </g>
    </svg>
  );
}
