import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusRail } from "./StatusRail";
import { EMPTY_STATUS } from "./status";

describe("StatusRail", () => {
  it("renders the status labels Doing / Waiting / Did", () => {
    render(<StatusRail snapshot={EMPTY_STATUS} />);
    expect(screen.getByText("Doing")).toBeInTheDocument();
    expect(screen.getByText("Waiting")).toBeInTheDocument();
    expect(screen.getByText("Did")).toBeInTheDocument();
  });
});
