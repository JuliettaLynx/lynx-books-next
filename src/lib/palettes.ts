export const PALETTES = [
  [
    // Классика
    "#ff0008",
    "#ff8300",
    "#ffff00",
    "#36d900",
    "#00e5ff",
    "#0048d9",
    "#c824d4",
    "#ffffff",
  ],
  [
    // Пастель
    "#ff7b91",
    "#ffb97b",
    "#ffed9f",
    "#b7ff9f",
    "#9ffff8",
    "#9fa9ff",
    "#f29fff",
    "#ffffff",
  ],
  [
    // Тёмная
    "#940011",
    "#be4f00",
    "#d9b110",
    "#20a000",
    "#24a9a7",
    "#2434a9",
    "#84009f",
    "#5a5a5a",
  ],
  [
    // Сепия
    "#feefd1",
    "#f1d5a3",
    "#d4b587",
    "#b1966b",
    "#a3865e",
    "#775d42",
    "#51422d",
    "#382c20",
  ],
];

export const PALETTE_NAMES = ["Классика", "Пастель", "Тёмная", "Сепия"];

export const getPaletteColors = (index: number) =>
  PALETTES[index] || PALETTES[0];
export const getPaletteColor = (paletteIndex: number, colorIndex: number) =>
  PALETTES[paletteIndex]?.[colorIndex] || PALETTES[0][0];
