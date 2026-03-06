// Fix "process is not defined" error in the browser
if (typeof window !== "undefined") {
    window.process = { env: {} } as any;
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
