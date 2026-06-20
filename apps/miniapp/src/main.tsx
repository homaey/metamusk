// MUST be first: installs Buffer/process globals before @ton/@solana evaluate.
import "./polyfills.js";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { WalletProvider } from "./wallet/store.js";
import { NetworkProvider } from "./context/network.js";
import { ErrorBoundary } from "./components/ErrorBoundary.js";
import { initTelegram } from "./telegram.js";
import "./i18n/index.js";
import "./styles.css";
import "./screens.css";

initTelegram();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <NetworkProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </NetworkProvider>
    </ErrorBoundary>
  </StrictMode>,
);
