import { TrueForgeUI, defaultSlots, useAuiState } from "@truefoundry/trueforge-ui";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
} from "react";
import { StatusRail } from "./StatusRail";
import { trueForgeServer } from "./server";
import { loopTheme } from "./theme";

const ActiveSessionContext = createContext<(id: string | undefined) => void>(() => {});

type ShellProps = ComponentProps<typeof defaultSlots.ThreadRootShell>;

const ThreadRootWithActiveSession = forwardRef<HTMLDivElement, ShellProps>(
  function ThreadRootWithActiveSession(props, ref) {
    const onSessionId = useContext(ActiveSessionContext);
    const remoteId = useAuiState((state) => state.threadListItem?.remoteId);
    useEffect(() => {
      onSessionId(remoteId);
    }, [onSessionId, remoteId]);
    const Shell = defaultSlots.ThreadRootShell;
    return <Shell {...props} ref={ref} />;
  },
);

const LOOP_UI_OVERRIDES = { ThreadRootShell: ThreadRootWithActiveSession };

export function App() {
  const [sessionId, setSessionId] = useState<string | undefined>();
  return (
    <ActiveSessionContext.Provider value={setSessionId}>
      <div className="loop-shell">
        {/* Rail binds to TrueForgeUI's active session via threadListItem.remoteId; else most-recently-updated LOOP session by updatedAt. */}
        <StatusRail sessionId={sessionId} />
        <div className="loop-chat">
          <TrueForgeUI
            server={trueForgeServer()}
            layout="sidebar"
            agentConfig={{ mode: "SingleAgent", name: "loop" }}
            theme={loopTheme}
            className="h-full min-h-0"
            overrides={LOOP_UI_OVERRIDES}
          />
        </div>
      </div>
    </ActiveSessionContext.Provider>
  );
}
