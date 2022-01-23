import { RGB } from "./mixbox";

export function rgbToHex(rgb: RGB): string {
  return "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

export function rgbMix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.floor(a[0] * (1 - t) + b[0] * t),
    Math.floor(a[1] * (1 - t) + b[1] * t),
    Math.floor(a[2] * (1 - t) + b[2] * t),
  ];
}
