import { useEffect, useState } from "react";
import "./App.css";

import { mixbox_init_t, loadImageData } from "./mixbox";
import MixBoxCanvas from "./components/MixBoxCanvas";
import ColorStairs from "./components/ColorStairs";

function App() {
  const [c_table, setc_table] = useState<Uint8Array | undefined>(undefined);

  const [color, setColor] = useState("#000060"); // deep blue

  useEffect(() => {
    const go = async () => {
      const imageData = await loadImageData("ctable.png");
      const ctable = await mixbox_init_t(imageData);
      setc_table(ctable);
    };
    go();
  }, []);

  return c_table ? (
    <div
      style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "lightgrey" }}
    >
      <div style={{ flexGrow: "1", flexShrink: "0", display: "flex" }}>
        <div style={{ flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MixBoxCanvas c_table={c_table} penColor={color} setPenColor={setColor}></MixBoxCanvas>
        </div>

        <ColorStairs c_table={c_table} color1={color} setColor1={setColor}></ColorStairs>
      </div>

      <footer style={{ flexGrow: "0", flexShrink: "1", padding: "20px" }}>
        <p>
          This is a JavaScript porting of <a href="https://github.com/scrtwpns/pigment-mixing">pigment-mixing</a>.
        </p>
        <p>
          <a href="https://github.com/aratama/pigment-mixing">Source Codes</a>.
        </p>
      </footer>
    </div>
  ) : (
    <p>Loading</p>
  );
}

export default App;
