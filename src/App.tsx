import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { RGB, mixbox_init_t, mixbox_lerp_srgb8, loadImageData } from "./mixbox";

function rgbToHex(rgb: RGB): string {
  return "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex: string): RGB {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbMix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.floor(a[0] * (1 - t) + b[0] * t),
    Math.floor(a[1] * (1 - t) + b[1] * t),
    Math.floor(a[2] * (1 - t) + b[2] * t),
  ];
}

function App() {
  const [color1, setColor1] = useState("#000060"); // deep blue
  const [color2, setColor2] = useState("#fcd300"); // bright yellow
  const [c_table, setc_table] = useState<Uint8Array | undefined>(undefined);

  useEffect(() => {
    const go = async () => {
      const imageData = await loadImageData("ctable.png");
      const ctable = await mixbox_init_t(imageData);
      setc_table(ctable);
    };
    go();
  }, []);

  return c_table ? (
    <div>
      <div style={{ display: "flex" }}>
        <div>
          <h2>RGB</h2>
          <div>
            {new Array(10).fill(0).map((_, i) => {
              const c1 = hexToRgb(color1);
              const c2 = hexToRgb(color2);
              const mixed = rgbToHex(rgbMix(c1, c2, 0.1 * i));
              return (
                <div
                  key={i}
                  style={{
                    width: "200px",
                    height: "60px",
                    backgroundColor: mixed,
                    textShadow: "0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white",
                    lineHeight: "60px",
                  }}
                >
                  {mixed}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2>MixBox</h2>
          <div>
            {new Array(10).fill(0).map((_, i) => {
              const c1 = hexToRgb(color1);
              const c2 = hexToRgb(color2);
              const mixed = rgbToHex(mixbox_lerp_srgb8(c_table, c1, c2, 0.1 * i));
              return (
                <div
                  key={i}
                  style={{
                    width: "200px",
                    height: "60px",
                    backgroundColor: mixed,
                    textShadow: "0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white",
                    lineHeight: "60px",
                  }}
                >
                  {mixed}
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            padding: "100px",
            display: "flex",
            gap: "50px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <input id="color1" type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
            {color1}
          </div>
          <div>
            <input id="color2" type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
            {color2}
          </div>
        </div>
      </div>

      <p>
        This is a JavaScript porting of <a href="https://github.com/scrtwpns/pigment-mixing">pigment-mixing</a>.
      </p>
      <p>
        <a href="https://github.com/aratama/pigment-mixing">Source Codes</a>.
      </p>
    </div>
  ) : (
    <p>Loading</p>
  );
}

export default App;
