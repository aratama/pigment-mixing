import { useEffect, useRef, useState, MouseEvent } from "react";
import { hexToRgb, rgbMix, rgbToHex } from "../color";

import { RGB, mixbox_init_t, mixbox_lerp_srgb8, loadImageData } from "../mixbox";

export function ColorStairs(props: { c_table: Uint8Array; color1: string; setColor1: (color1: string) => unknown }) {
  const { c_table, color1, setColor1 } = props;

  const [color2, setColor2] = useState("#fcd300"); // bright yellow

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const go = async () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const g = canvas.getContext("2d");
        if (g) {
          g.fillStyle = "white";
          g.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
    go();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex" }}>
        {/* <div>
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
                    width: "100px",
                    height: "20px",
                    backgroundColor: mixed,
                    textShadow: "0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white",
                    lineHeight: "20px",
                  }}
                >
                  {mixed}
                </div>
              );
            })}
          </div>
        </div> */}
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
                    width: "160px",
                    height: "20px",
                    backgroundColor: mixed,
                    textShadow: "0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white, 0px 0px 5px white",
                    lineHeight: "20px",
                  }}
                >
                  {mixed}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "0px",
          display: "flex",
          gap: "8px",
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
}

export default ColorStairs;
