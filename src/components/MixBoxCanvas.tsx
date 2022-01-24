import { useEffect, useRef, useState, MouseEvent, useCallback } from "react";
import { hexToRgb } from "../color";

import { RGB, mixbox_init_t, mixbox_lerp_srgb8, loadImageData } from "../mixbox";

export function MixBoxCanvas(props: {
  c_table: Uint8Array;
  penColor: string;
  setPenColor: (color: string) => unknown;
}) {
  const { c_table, penColor, setPenColor } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [g, setG] = useState<CanvasRenderingContext2D | undefined>(undefined);

  const [opacity, setOpacity] = useState(0.03);
  const [penSize, setPenSize] = useState(25);
  const [mouseDown, setMouseDown] = useState(false);

  const [px, setPx] = useState<number>(0);
  const [py, setPy] = useState<number>(0);

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

  function drawCircle(g: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
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

  function drawStroke(g: CanvasRenderingContext2D, px: number, py: number, cx: number, cy: number) {
    const d = Math.sqrt(Math.pow(cx - px, 2) + Math.pow(cy - py, 2));

    const vx = (cx - px) / d;
    const vy = (cy - py) / d;

    for (let i = 0; i < d; i += 3) {
      drawCircle(g, cx - vx * i, cy - vy * i, penSize);
    }
  }

  function draw(e: MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (canvas && g) {
      var rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.x;
      const cy = e.clientY - rect.y;
      drawStroke(g, px, py, cx, cy);
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

    const canvas = canvasRef.current;
    if (canvas) {
      var rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.x;
      const cy = e.clientY - rect.y;
      setPx(cx);
      setPy(cy);
    }
  }

  return (
    <div style={{ position: "relative" }}>
      <canvas
        width="800"
        height="600"
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      ></canvas>
      <div
        style={{
          border: "solid 1px black",
          width: (penSize * 2).toFixed(2) + "px",
          height: (penSize * 2).toFixed(2) + "10px",
          top: (py - penSize).toFixed(2) + "px",
          left: (px - penSize).toFixed(2) + "px",
          position: "absolute",
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: "0.5",
        }}
      ></div>
    </div>
  );
}

export default MixBoxCanvas;
