import { afterEach, describe, expect, it, vi } from "vitest";
import { checkEndpoint, checkEndpoints } from "../src/index.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("checkEndpoint", () => {
  it("reports a successful HTTP response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response("ok", { status: 200 })
    ));

    const result = await checkEndpoint("https://example.com");

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });

  it("reports non-2xx responses as down", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response("missing", { status: 404 })
    ));

    const result = await checkEndpoint("https://example.com/missing");

    expect(result.ok).toBe(false);
    expect(result.status).toBe(404);
  });

  it("rejects unsupported URL protocols", async () => {
    const result = await checkEndpoint("file:///etc/passwd");

    expect(result.ok).toBe(false);
    expect(result.status).toBeNull();
    expect(result.error).toContain("Only http and https");
  });

  it("captures network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await checkEndpoint("https://example.com");

    expect(result.ok).toBe(false);
    expect(result.error).toBe("offline");
  });
});

describe("checkEndpoints", () => {
  it("returns a summary for all endpoints", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(new Response("ok", { status: 200 }))
      .mockResolvedValueOnce(new Response("bad", { status: 503 }))
    );

    const report = await checkEndpoints([
      "https://one.example",
      "https://two.example"
    ]);

    expect(report.summary).toEqual({ total: 2, up: 1, down: 1 });
    expect(report.results).toHaveLength(2);
    expect(Number.isNaN(Date.parse(report.checkedAt))).toBe(false);
  });
});
