import "jest";
import CANVAS from "canvas";

import { mixbox_lerp_srgb8, mixbox_init_t, RGB, mixbox_srgb8_to_latent } from "./mixbox";

let c_table: Uint8Array;

beforeAll(async () => {
  const image = await CANVAS.loadImage("public/ctable.png");
  console.log(image);
  const canvas = CANVAS.createCanvas(image.width, image.height);
  const g = canvas.getContext("2d");
  g.drawImage(image, 0, 0);
  const imageData = g.getImageData(0, 0, image.width, image.height);
  c_table = await mixbox_init_t(imageData);
});

test("c_table", () => {
  expect(c_table[0]).toBe(125);
  expect(c_table[1]).toBe(67);
  expect(c_table[2]).toBe(63);
  expect(c_table[3]).toBe(125);
  expect(c_table[4]).toBe(67);
  expect(c_table[5]).toBe(63);

  expect(c_table[10000]).toBe(65);
  expect(c_table[20000]).toBe(185);
  expect(c_table[30000]).toBe(1);
  expect(c_table[40000]).toBe(88);
});

test("mixbox_srgb8_to_latent", () => {
  const color: RGB = [252, 211, 0]; // bright yellow
  const latent = mixbox_srgb8_to_latent(c_table, color);
  expect(latent[0]).toBeCloseTo(0.003922);
  expect(latent[1]).toBeCloseTo(0.933333);
  expect(latent[2]).toBeCloseTo(0.003922);
  expect(latent[3]).toBeCloseTo(0.058824);
  expect(latent[4]).toBeCloseTo(0.033234);
  expect(latent[5]).toBeCloseTo(0.024869);
  expect(latent[6]).toBeCloseTo(-0.057551);
});

test("mixbox_lerp_srgb8", () => {
  const color1: RGB = [252, 211, 0]; // bright yellow
  const color2: RGB = [0, 0, 96]; // deep blue
  const t = 0.5;
  const mixed = mixbox_lerp_srgb8(c_table, color1, color2, t);
  expect(mixed[0]).toBe(29);
  expect(mixed[1]).toBe(109);
  expect(mixed[2]).toBe(53);
});
