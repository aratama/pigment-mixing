import { useEffect, useRef, useState, MouseEvent, useCallback } from "react";
import { hexToRgb } from "../color";

import { RGB, mixbox_init_t, mixbox_lerp_srgb8, loadImageData } from "../mixbox";

export function MixBoxCanvas(props: { c_table: Uint8Array }) {
  const { c_table } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [g, setG] = useState<CanvasRenderingContext2D | undefined>(undefined);

  const [penColor, setPenColor] = useState("#000060"); // deep blue
  const [opacity, setOpacity] = useState(0.02);
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const go = async () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const g_ = canvas.getContext("2d");
        if (g_) {
          g_.fillStyle = "white";
          g_.fillRect(0, 0, canvas.width, canvas.height);
          setG(g_);
        }
      }
    };
    go();
  }, []);

  function draw(e: MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (canvas && g) {
      const s = 25;
      var rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.x;
      const cy = e.clientY - rect.y;
      const imageData = g.getImageData(cx - s, cy - s, s * 2, s * 2);
      for (let y = 0; y < s * 2; y++) {
        for (let x = 0; x < s * 2; x++) {
          const dx = Math.abs(s - x) / s;
          const dy = Math.abs(s - y) / s;
          const r = Math.sqrt(dx * dx + dy * dy);

          if (r < 1) {
            const i = (y * s * 2 + x) * 4;

            const current: RGB = [imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]];
            const dest: RGB = hexToRgb(penColor);
            const mixed = mixbox_lerp_srgb8(c_table, current, dest, opacity);

            imageData.data[i + 0] = mixed[0];
            imageData.data[i + 1] = mixed[1];
            imageData.data[i + 2] = mixed[2];
            imageData.data[i + 3] = 255;
          }
        }
      }
      g.putImageData(imageData, cx - s, cy - s);
    }
  }

  function onMouseDown(e: MouseEvent<HTMLCanvasElement>) {
    setMouseDown(true);
    draw(e);
  }

  function onMouseUp(e: MouseEvent<HTMLCanvasElement>) {
    setMouseDown(false);
  }

  async function onMouseMove(e: MouseEvent<HTMLCanvasElement>) {
    if (mouseDown) {
      draw(e);
    }
  }

  return (
    <div>
      <input type="color" onInput={(e) => setPenColor(e.currentTarget.value)} value={penColor}></input>
      <canvas
        width="400"
        height="300"
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      ></canvas>
    </div>
  );
}

export default MixBoxCanvas;
