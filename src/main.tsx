import { createRoot } from "react-dom/client";
import AppNew from "./AppNew";
import "./index.css";
import { initializeDemoUser } from "./utils/initDemo";

// Initialize demo user for testing
initializeDemoUser();

createRoot(document.getElementById("root")!).render(<AppNew />);
