const MIXBOX_NUMLATENTS = 7 as const;

export type RGB = [number, number, number];

export type Latent = [number, number, number, number, number, number, number];

const coefs: [number, number, number][] = [
  [1.0 * +0.07717053, 1.0 * +0.02826978, 1.0 * +0.24832992],
  [1.0 * +0.95912302, 1.0 * +0.80256528, 1.0 * +0.03561839],
  [1.0 * +0.74683774, 1.0 * +0.04868586, 1.0 * +0.0],
  [1.0 * +0.99518138, 1.0 * +0.99978149, 1.0 * +0.99704802],
  [3.0 * +0.01606382, 3.0 * +0.27787927, 3.0 * +0.10838459],
  [3.0 * -0.2271565, 3.0 * +0.48702601, 3.0 * +0.35660312],
  [3.0 * +0.09019473, 3.0 * -0.0510829, 3.0 * +0.66245019],
  [3.0 * +0.26826063, 3.0 * +0.2236457, 3.0 * +0.061415],
  [3.0 * -0.11677001, 3.0 * +0.45951942, 3.0 * +1.22955],
  [3.0 * +0.35042682, 3.0 * +0.65938413, 3.0 * +0.94329691],
  [3.0 * +1.07202375, 3.0 * +0.27090076, 3.0 * +0.34461513],
  [3.0 * +0.92964458, 3.0 * +0.13855183, 3.0 * -0.01495765],
  [3.0 * +1.00720859, 3.0 * +0.85124701, 3.0 * +0.10922038],
  [3.0 * +0.98374897, 3.0 * +0.93733704, 3.0 * +0.39192814],
  [3.0 * +0.94225681, 3.0 * +0.26644346, 3.0 * +0.60571754],
  [3.0 * +0.99897033, 3.0 * +0.40864351, 3.0 * +0.60217887],
  [6.0 * +0.31232351, 6.0 * +0.34171197, 6.0 * -0.04972666],
  [6.0 * +0.42768261, 6.0 * +1.17238033, 6.0 * +0.10429229],
  [6.0 * +0.68054914, 6.0 * -0.23401393, 6.0 * +0.35832587],
  [6.0 * +1.00013113, 6.0 * +0.42592007, 6.0 * +0.31789917],
];

function clamp(x: number, xmin: number, xmax: number): number {
  return Math.min(Math.max(x, xmin), xmax);
}

function mix(c: number[], rgb: RGB): void {
  const c00 = c[0] * c[0];
  const c11 = c[1] * c[1];
  const c22 = c[2] * c[2];
  const c33 = c[3] * c[3];
  const c01 = c[0] * c[1];
  const c02 = c[0] * c[2];

  const weights: number[] = [
    c[0] * c00,
    c[1] * c11,
    c[2] * c22,
    c[3] * c33,
    c00 * c[1],
    c01 * c[1],
    c00 * c[2],
    c02 * c[2],
    c00 * c[3],
    c[0] * c33,
    c11 * c[2],
    c[1] * c22,
    c11 * c[3],
    c[1] * c33,
    c22 * c[3],
    c[2] * c33,
    c01 * c[2],
    c01 * c[3],
    c02 * c[3],
    c[1] * c[2] * c[3],
  ];

  for (let i = 0; i < 3; i++) {
    rgb[i] = 0.0;
  }

  for (let j = 0; j < 20; j++) {
    for (let i = 0; i < 3; i++) {
      rgb[i] += weights[j] * coefs[j][i];
    }
  }
}

export function mixbox_lerp_srgb8(c_table: Uint8Array, rgb1: RGB, rgb2: RGB, t: number): RGB {
  const latent_A: Latent = mixbox_srgb8_to_latent(c_table, rgb1);
  const latent_B: Latent = mixbox_srgb8_to_latent(c_table, rgb2);
  const latent_C: Latent = [0, 0, 0, 0, 0, 0, 0];
  for (let l = 0; l < MIXBOX_NUMLATENTS; ++l) {
    latent_C[l] = (1.0 - t) * latent_A[l] + t * latent_B[l];
  }
  return mixbox_latent_to_srgb8(latent_C);
}

export function mixbox_srgb8_to_latent(c_table: Uint8Array, [r, g, b]: RGB): Latent {
  const offset = (r + g * 257 + b * 257 * 257) * 3;

  // console.log("offset", offset);

  const c = [0, 0, 0, 0];
  c[0] = c_table[offset + 0] / 255.0;
  c[1] = c_table[offset + 1] / 255.0;
  c[2] = c_table[offset + 2] / 255.0;
  c[3] = 1.0 - (c[0] + c[1] + c[2]);

  // console.log("c_table[offset + 0]", c_table[offset + 0]);
  // console.log("c_table[offset + 0] / 255.0", c_table[offset + 0] / 255.0);

  // console.log("c[0]", c[0]);
  // console.log("c[1]", c[1]);
  // console.log("c[2]", c[2]);
  // console.log("c[3]", c[3]);

  const mixrgb: RGB = [0, 0, 0];
  mix(c, mixrgb);

  // console.log("mixrgb[0]", mixrgb[0]);
  // console.log("mixrgb[1]", mixrgb[1]);
  // console.log("mixrgb[2]", mixrgb[2]);

  return [c[0], c[1], c[2], c[3], r / 255.0 - mixrgb[0], g / 255.0 - mixrgb[1], b / 255.0 - mixrgb[2]];
}

function mixbox_latent_to_srgb8(latent: Latent): RGB {
  return mixbox_latent_to_srgb8_dither(latent, 0, 0, 0);
}

function mixbox_latent_to_srgb8_dither(latent: Latent, dither_r: number, dither_g: number, dither_b: number): RGB {
  const [r, g, b] = mixbox_latent_to_srgb32f(latent);
  return [
    Math.floor(clamp(Math.round(r * 255.0 + dither_r), 0, 255)),
    Math.floor(clamp(Math.round(g * 255.0 + dither_g), 0, 255)),
    Math.floor(clamp(Math.round(b * 255.0 + dither_b), 0, 255)),
  ];
}

function mixbox_latent_to_srgb32f(latent: Latent): RGB {
  const rgb: RGB = [0, 0, 0];
  mix(latent, rgb);
  return [
    clamp(rgb[0] + latent[4], 0.0, 1.0),
    clamp(rgb[1] + latent[5], 0.0, 1.0),
    clamp(rgb[2] + latent[6], 0.0, 1.0),
  ];
}

export async function loadImageData(url: string): Promise<ImageData> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = url;
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const g = canvas.getContext("2d");
      if (!g) {
        throw new Error();
      }
      g.drawImage(image, 0, 0);
      resolve(g.getImageData(0, 0, image.width, image.height));
    });
  });
}

export async function mixbox_init_t(imageData: ImageData): Promise<Uint8Array> {
  const imageDataArray = imageData.data;
  const c_table: Uint8Array = new Uint8Array(257 * 257 * 257 * 3);
  for (let b = 0; b < 256; b++) {
    for (let g = 0; g < 256; g++) {
      for (let r = 0; r < 256; r++) {
        const x = (b % 16) * 256 + r;
        const y = (b / 16) * 256 + g;
        // for (let i = 0; i < 3; i++) {
        //   c_table[(r + g * 256 + b * 256 * 256) * 3 + i] = imageDataArray[(x + y * 256 * 16) * 3 + i];
        // }
        // for (let i = 0; i < 3; i++) {
        //   c_table[(r + g * 257 + b * 257 * 257) * 3 + i] = imageDataArray[(x + y * 256 * 16) * 3 + i];
        // }

        // if (b == 0 && g == 0 && r == 0) {
        //   console.log("imageDataArray[(x + y * 256 * 16) * 4 + 0]", imageDataArray[(x + y * 256 * 16) * 4 + 0]);
        // }

        for (let i = 0; i < 3; i++) {
          c_table[(r + g * 257 + b * 257 * 257) * 3 + i] = imageDataArray[(x + y * 256 * 16) * 4 + i];
        }
      }
    }
  }
  return c_table;
}
