import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

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

const App = () => {
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

  return (
    <div style={{ display: "flex" }}>
      <div>
        {c_table
          ? new Array(10).fill(0).map((_, i) => {
              const c1 = hexToRgb(color1);
              const c2 = hexToRgb(color2);
              const mixed = rgbToHex(mixbox_lerp_srgb8(c_table, c1, c2, 0.1 * i));
              return (
                <div
                  key={i}
                  style={{
                    width: "400px",
                    height: "60px",
                    backgroundColor: mixed,
                    textShadow: "0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white",
                    lineHeight: "60px",
                  }}
                >
                  {mixed}
                </div>
              );
            })
          : ""}
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
  );
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
