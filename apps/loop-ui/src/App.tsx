import { TrueForgeUI } from "@truefoundry/trueforge-ui";
import { StatusRail } from "./StatusRail";
import { trueForgeServer } from "./server";
import { loopTheme } from "./theme";

export function App() {
  return (
    <div className="loop-shell">
      <StatusRail />
      <div className="loop-chat">
        <TrueForgeUI
          server={trueForgeServer()}
          layout="sidebar"
          agentConfig={{ mode: "SingleAgent", name: "loop" }}
          theme={loopTheme}
          className="h-full min-h-0"
        />
      </div>
    </div>
  );
}
