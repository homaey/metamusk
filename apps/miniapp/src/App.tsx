import { lazy, Suspense, useState } from "react";
import { useWallet } from "./wallet/store.js";
import { Welcome } from "./screens/Welcome.js";
import { Unlock } from "./screens/Unlock.js";
import { Home } from "./screens/Home.js";

const CreateWallet = lazy(() => import("./screens/CreateWallet.js").then((m) => ({ default: m.CreateWallet })));
const ImportWallet = lazy(() => import("./screens/ImportWallet.js").then((m) => ({ default: m.ImportWallet })));
const RestoreBackup = lazy(() => import("./screens/RestoreBackup.js").then((m) => ({ default: m.RestoreBackup })));

type OnboardingRoute = "welcome" | "create" | "import" | "restore";

function ScreenLoader() {
  return (
    <div className="app center">
      <div className="brand big"><img src="/logo.svg" className="mark" alt="" /><h1>MetaMusk</h1></div>
      <div className="skeleton" style={{ width: 160, height: 14 }} />
    </div>
  );
}

export default function App() {
  const { status } = useWallet();
  const [route, setRoute] = useState<OnboardingRoute>("welcome");

  if (status === "loading") return <ScreenLoader />;
  if (status === "unlocked") return <Home />;
  if (status === "locked") return <Unlock />;

  // status === "no-wallet" → onboarding
  return (
    <Suspense fallback={<ScreenLoader />}>
      {route === "create" && <CreateWallet onDone={() => setRoute("welcome")} onBack={() => setRoute("welcome")} />}
      {route === "import" && <ImportWallet onDone={() => setRoute("welcome")} onBack={() => setRoute("welcome")} />}
      {route === "restore" && <RestoreBackup onDone={() => setRoute("welcome")} onBack={() => setRoute("welcome")} />}
      {route === "welcome" && (
        <Welcome
          onCreate={() => setRoute("create")}
          onImport={() => setRoute("import")}
          onRestore={() => setRoute("restore")}
        />
      )}
    </Suspense>
  );
}
