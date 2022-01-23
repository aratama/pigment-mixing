import { useEffect, useState } from "react";
import "./App.css";

import { mixbox_init_t, loadImageData } from "./mixbox";
import MixBoxCanvas from "./components/MixBoxCanvas";
import ColorStairs from "./components/ColorStairs";

function App() {
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
      <ColorStairs c_table={c_table}></ColorStairs>

      <MixBoxCanvas c_table={c_table}></MixBoxCanvas>

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
