import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StatusRail } from "./StatusRail";
import { EMPTY_STATUS, statusLoadError, type LoopStatus } from "./status";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("StatusRail", () => {
  it("renders the status labels Doing / Waiting / Did", () => {
    render(<StatusRail snapshot={EMPTY_STATUS} />);
    expect(screen.getByText("Doing")).toBeInTheDocument();
    expect(screen.getByText("Waiting")).toBeInTheDocument();
    expect(screen.getByText("Did")).toBeInTheDocument();
    expect(screen.getByText(/Warehouse and GitHub are fixtures/)).toBeInTheDocument();
  });

  it("shows an error label instead of idle copy", () => {
    render(<StatusRail snapshot={statusLoadError("Cannot reach TrueForge: Failed to fetch")} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Cannot reach TrueForge: Failed to fetch");
    expect(screen.queryByText("No tool calls yet")).not.toBeInTheDocument();
  });

  it("does not apply an older poll after a newer one", async () => {
    vi.useFakeTimers();
    const waiting: LoopStatus = {
      phase: "waiting",
      doing: EMPTY_STATUS.doing,
      waiting: "Approve the write before it runs",
      did: EMPTY_STATUS.did,
      error: EMPTY_STATUS.error,
    };
    let resolveOlder: (status: LoopStatus) => void = () => {};
    let resolveNewer: (status: LoopStatus) => void = () => {};
    let call = 0;
    const loadStatus = vi.fn(() => {
      call += 1;
      if (call === 1) {
        return new Promise<LoopStatus>((resolve) => {
          resolveOlder = resolve;
        });
      }
      return new Promise<LoopStatus>((resolve) => {
        resolveNewer = resolve;
      });
    });

    render(<StatusRail loadStatus={loadStatus} />);
    expect(loadStatus).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(loadStatus).toHaveBeenCalledTimes(2);

    await act(async () => {
      resolveNewer(waiting);
    });
    expect(screen.getByText("Waiting").closest("li")).toHaveAttribute("data-active", "true");

    await act(async () => {
      resolveOlder(EMPTY_STATUS);
    });
    expect(screen.getByText("Waiting").closest("li")).toHaveAttribute("data-active", "true");
    expect(screen.getByText("Approve the write before it runs")).toBeInTheDocument();
    expect(screen.queryByText("No write pause yet")).not.toBeInTheDocument();
  });
});
