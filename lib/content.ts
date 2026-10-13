export type Motif = "bow" | "rose" | "arch" | "candle" | "parasol" | "window";

export type PaletteName = "night" | "paper" | "blush" | "rose";

export type PlateSpec = {
  motif: Motif;
  palette: PaletteName;
  flip?: boolean;
};

export type Picture = PlateSpec & {
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  logline: string;
  frames: Picture[];
};

export type GalleryPiece = {
  title: string;
  pictures: Picture[];
};

export const projects: Project[] = [
  {
    slug: "night-orchard",
    title: "Night Orchard",
    logline: "A walk home under trees that keep their fruit in the dark.",
    frames: [
      {
        motif: "arch",
        palette: "night",
        caption: "A ribbon left on the latch.",
      },
      {
        motif: "rose",
        palette: "night",
        caption: "Pale fruit, still on the branch.",
      },
      {
        motif: "window",
        palette: "night",
        caption: "The path narrows and the lights thin out.",
      },
    ],
  },
  {
    slug: "glass-saint",
    title: "Glass Saint",
    logline: "A parade costume built from borrowed windows.",
    frames: [
      {
        motif: "parasol",
        palette: "blush",
        caption: "The shade is cut like a chapel window.",
      },
      {
        motif: "window",
        palette: "paper",
        caption: "She waits one floor above the street.",
      },
      {
        motif: "bow",
        palette: "blush",
        caption: "White gloves with a rose stitched at the wrist.",
      },
    ],
  },
  {
    slug: "ribbon-room",
    title: "Ribbon Room",
    logline: "A bedroom where every drawer is tied shut.",
    frames: [
      {
        motif: "window",
        palette: "rose",
        caption: "Night pressed against the lace.",
      },
      {
        motif: "candle",
        palette: "paper",
        caption: "One flame, and the ribbon stays tied.",
      },
      {
        motif: "arch",
        palette: "paper",
        flip: true,
        caption: "The key is worn on a chain, not kept in a drawer.",
      },
    ],
  },
];

export const gallery: GalleryPiece[] = [
  {
    title: "Parasol studies",
    pictures: [
      {
        motif: "parasol",
        palette: "blush",
        caption: "Morning shade, cut wide enough for two.",
      },
      {
        motif: "parasol",
        palette: "night",
        flip: true,
        caption: "The same parasol after the streetlights come on.",
      },
    ],
  },
  {
    title: "The gate",
    pictures: [
      {
        motif: "arch",
        palette: "paper",
        caption: "Open, with the ribbon still on the latch.",
      },
      {
        motif: "arch",
        palette: "night",
        caption: "Shut, once the fruit trees go dark.",
      },
      {
        motif: "rose",
        palette: "paper",
        caption: "What was tied there in the afternoon.",
      },
    ],
  },
  {
    title: "Candle hour",
    pictures: [
      {
        motif: "candle",
        palette: "paper",
        caption: "First light, before the room is dressed.",
      },
      {
        motif: "candle",
        palette: "rose",
        caption: "The same candle once the curtains are drawn.",
      },
    ],
  },
  {
    title: "Night window",
    pictures: [
      {
        motif: "window",
        palette: "night",
        caption: "Lace pulled to one side.",
      },
      {
        motif: "window",
        palette: "blush",
        flip: true,
        caption: "The moon sits in the upper pane.",
      },
    ],
  },
  {
    title: "Rose pins",
    pictures: [
      {
        motif: "rose",
        palette: "blush",
        caption: "A pin for the collar.",
      },
      {
        motif: "rose",
        palette: "rose",
        caption: "A pin for the hair, after dark.",
      },
    ],
  },
  {
    title: "Bows",
    pictures: [
      {
        motif: "bow",
        palette: "paper",
        caption: "Tied at the throat.",
      },
      {
        motif: "bow",
        palette: "night",
        caption: "Tied again, lower, at the waist.",
      },
      {
        motif: "bow",
        palette: "rose",
        flip: true,
        caption: "The tails left long on purpose.",
      },
    ],
  },
];

export const aboutPortrait: PlateSpec = {
  motif: "rose",
  palette: "paper",
};

export const contact = {
  email: "hello@rosa.studio",
  socials: [
    { name: "Instagram", href: "https://instagram.com" },
    { name: "Pinterest", href: "https://www.pinterest.com" },
    { name: "YouTube", href: "https://www.youtube.com" },
  ],
};
